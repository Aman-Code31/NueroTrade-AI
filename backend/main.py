from fastapi import FastAPI, HTTPException, status, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel, Field
from typing import List, Optional
import yfinance as yf
from transformers import pipeline
import requests
import numpy as np
import tensorflow as tf
import joblib
import os
from dotenv import load_dotenv
from datetime import datetime
from motor.motor_asyncio import AsyncIOMotorClient
from beanie import Document, init_beanie
import certifi
import firebase_admin
from firebase_admin import credentials, auth as firebase_auth
import google.generativeai as genai # NEW: Google Gemini API

os.environ['SSL_CERT_FILE'] = certifi.where()

load_dotenv()
MONGODB_URI = os.getenv("MONGODB_URI")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

# --- FIREBASE ADMIN SETUP ---
# Place the service account JSON you downloaded from Firebase console
# in the backend folder and point this path at it. Never commit this file.
FIREBASE_CREDENTIALS_PATH = os.getenv("FIREBASE_CREDENTIALS_PATH", "firebase-service-account.json")
if not firebase_admin._apps:
    cred = credentials.Certificate(FIREBASE_CREDENTIALS_PATH)
    firebase_admin.initialize_app(cred)

bearer_scheme = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme)) -> str:
    """
    Verifies the Firebase ID token sent in the Authorization header.
    Returns the verified Firebase UID. This UID is the ONLY user identifier
    the backend trusts — it is never taken from the request body.
    """
    token = credentials.credentials
    try:
        decoded_token = firebase_auth.verify_id_token(token)
        return decoded_token["uid"]
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired authentication token.")

# --- NEW: CONFIGURE GEMINI LLM ---
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    llm_model = genai.GenerativeModel('gemini-2.5-flash')
else:
    print("⚠️ WARNING: GEMINI_API_KEY not found in .env file!")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading FinBERT Model...")
sentiment_pipeline = pipeline("sentiment-analysis", model="ProsusAI/finbert")

print("Loading LSTM Model and Scaler...")
try:
    lstm_model = tf.keras.models.load_model('lstm_model.h5')
    scaler = joblib.load('scaler.gz')
    print("✅ AI Models Loaded Successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")

class ChartPoint(BaseModel):
    day: str
    price: float

class StockPredictionRecord(Document):
    user_id: str
    ticker_symbol: str
    current_price: float
    lstm_predicted_price: float 
    finbert_sentiment: str
    finbert_sentiment_score: float 
    ai_summary: Optional[str] = "No summary available"  # NEW: Added summary to database schema
    chart_data: List[ChartPoint]
    headlines_analyzed: List[str]
    created_at: datetime = Field(default_factory=datetime.now)

    class Settings:
        name = "saved_predictions" 

# What the client is allowed to send when saving — note there is no user_id
# field here. The UID always comes from the verified token, never the body.
class SavePredictionRequest(BaseModel):
    ticker_symbol: str
    current_price: float
    lstm_predicted_price: float
    finbert_sentiment: str
    finbert_sentiment_score: float
    ai_summary: Optional[str] = "No summary available"
    chart_data: List[ChartPoint]
    headlines_analyzed: List[str]

# --- 4. STARTUP DB CONNECTION ---
@app.on_event("startup")
async def startup_db_client():
    if MONGODB_URI:
        client = AsyncIOMotorClient(MONGODB_URI, tlsCAFile=certifi.where())
        await init_beanie(database=client.FarmStockApp, document_models=[StockPredictionRecord])
        print("✅ Successfully connected to MongoDB Atlas!")

@app.get("/predict/{ticker}")
async def predict_stock(ticker: str):
    try:
        stock = yf.Ticker(ticker)
        hist = stock.history(period="7d")
        prices = hist['Close'].tolist()
        dates = hist.index.strftime('%a').tolist()
        chart_data = [{"day": d, "price": round(p, 2)} for d, p in zip(dates, prices)]
        current_price = chart_data[-1]["price"] if chart_data else 0

        url = f"https://newsapi.org/v2/everything?q={ticker} stock&language=en&sortBy=publishedAt&pageSize=5&apiKey={NEWS_API_KEY}"
        news_response = requests.get(url).json()
        
        live_headlines = []
        if news_response.get("status") == "ok":
            articles = news_response.get("articles", [])
            live_headlines = [article["title"] for article in articles if article["title"]]
        if not live_headlines:
            live_headlines = [f"{ticker} trading volume remains steady."] 

        sentiments = sentiment_pipeline(live_headlines)
        pos_score = sum([s['score'] for s in sentiments if s['label'] == 'positive'])
        neg_score = sum([s['score'] for s in sentiments if s['label'] == 'negative'])
        final_sentiment = "Positive" if pos_score >= neg_score else "Negative"
        confidence = max(pos_score, neg_score) / len(live_headlines) if live_headlines else 0.5

        hist_60 = stock.history(period="60d")
        last_60_days = hist_60['Close'].values.reshape(-1, 1)
        last_60_days_scaled = scaler.transform(last_60_days)
        X_test = np.array([last_60_days_scaled])
        X_test = np.reshape(X_test, (X_test.shape[0], X_test.shape[1], 1))
        predicted_scaled_price = lstm_model.predict(X_test)
        predicted_price = scaler.inverse_transform(predicted_scaled_price)
        final_prediction = float(predicted_price[0][0])

        # --- NEW: GENERATE LLM SUMMARY ---
        ai_summary_text = "AI Summary not available."
        if GEMINI_API_KEY and live_headlines:
            prompt = f"You are an expert financial analyst. Based on these 5 recent news headlines for {ticker}: {live_headlines}. Write a concise, 2-sentence executive summary explaining the current market sentiment and why it might be moving. Be professional."
            try:
                response = llm_model.generate_content(prompt)
                ai_summary_text = response.text.replace('\n', ' ').strip()
            except Exception as e:
                print("LLM Error:", e)

        return {
            "symbol": ticker.upper(),
            "currentPrice": round(current_price, 2),
            "prediction": round(final_prediction, 2),
            "sentiment": final_sentiment,
            "sentimentScore": round(confidence, 2),
            "chartData": chart_data,
            "headlinesAnalyzed": live_headlines,
            "ai_summary": ai_summary_text # Sending the summary to React!
        }
    except Exception as e:
        return {"error": str(e)}

@app.post("/api/stocks/save")
async def save_prediction(payload: SavePredictionRequest, uid: str = Depends(get_current_user)):
    try:
        record = StockPredictionRecord(user_id=uid, **payload.dict())
        await record.insert()
        return {"message": "Saved to database successfully!", "id": str(record.id)}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@app.get("/api/stocks/me")
async def get_user_history(uid: str = Depends(get_current_user)):
    try:
        history = await StockPredictionRecord.find(StockPredictionRecord.user_id == uid).sort("-created_at").to_list()
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")
    
    ''' To start backend server: cd backend then, source venv/bin/activate
    and then python3 -m uvicorn main:app --reload '''