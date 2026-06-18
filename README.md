# 📈 AI-Driven Stock Market Sentiment & Prediction System: NeuroTrade AI

![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)
![Python](https://img.shields.io/badge/Python-3.9+-blue.svg)
![React](https://img.shields.io/badge/React-18.x-61DAFB.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688.svg)

> **A unified financial dashboard that merges Quantitative Price Forecasting with Qualitative News Sentiment Analysis using Deep Learning and NLP.**

---

## 📖 About The Project

For retail investors and students , analyzing the stock market is overwhelming. You have to look at complex candlestick charts on one platform (Technical Analysis) and read news articles on another platform (Fundamental/Sentiment Analysis). 

This project solves that problem by building a **"Hybrid AI Brain"**.
It automatically fetches historical data and real-time news, runs them through two separate AI models simultaneously, and presents a simplified **Prediction & Sentiment Score** on a clean and interactive dashboard.

**Why this project matters:**
* **Democratizing Institutional Tools:** Wall Street has used quantitative models and sentiment algorithms for years. This system levels the playing field by putting powerful, enterprise-grade AI analysis directly into the hands of everyday retail investors.
* **Actionable Clarity over Raw Data:** Instead of forcing users to interpret raw numbers or generic data flags, the system leverages an LLM (Google Gemini) to translate complex technical and sentiment metrics into clear, human-readable, actionable summaries.
* **Holistic Market Synthesis (Technical + Fundamental):** Most retail trading apps force users to look at price charts in one tab and read news in another. NeuroTrade merges both disciplines. It mathematically evaluates historical price action via the LSTM model (Technical Analysis) while simultaneously reading and scoring live global news via FinBERT (Fundamental Analysis), mimicking the multi-layered strategy of a real quantitative analyst.

### ✨ Key Features
* **🧠 Tri-AI Analysis:** * **The Quant Engine (LSTM):** A Long Short-Term Memory neural network that looks at the last 10 years of price history to predict the trend for the next day.
  * **The Sentiment Engine (FinBERT):** A domain-specific NLP transformer model that reads today's financial headlines and scores the market mood (Positive, Negative, or Neutral).
* **⚡ Blazing Fast API:** Built with FastAPI, the backend processes heavy AI inference tasks asynchronously, delivering results in under 8 seconds.
* **📊 Interactive Dashboard:** A React.js frontend featuring beautiful Recharts (Candlestick and Line graphs) and a dynamic Sentiment Gauge.
* **🗄️ Smart Caching:** Uses MongoDB to cache recent searches, preventing API rate limits and instantly loading popular stock queries.
* **⚖️ Holistic Market View:** By cross-referencing technical price action with qualitative news sentiment, the system effectively filters out market noise and reduces false trading signals.
* **🤖 Smart LLM Summaries:** Uses the Gemini LLM to synthesize the complex data from both engines into a clear, human-readable summary for retail investors.
* **🛠️ Developer-Ready:** Includes built-in, auto-generated Swagger UI documentation for seamless API testing and third-party integration.
* **📱 Responsive UI/UX:** A mobile-friendly design that democratizes complex algorithmic trading data, making it intuitive for non-technical users on any device.
* **📉 Cost & Resource Efficient:** Dramatically reduces redundant calls to external data providers (like `yfinance` and NewsAPI), saving bandwidth and ensuring high availability.

## 🧠 Architecture & Tech Stack
This project leverages a modern, decoupled architecture:
* **Data Ingestion:** `yfinance`, web scraping for financial news.
* **Time-Series Forecasting:** LSTM (Long Short-Term Memory) neural networks.
* **Sentiment Analysis:** FinBERT (pre-trained NLP model for the financial domain).
* **Backend / API:** FastAPI for serving predictions and reports.
* **Frontend:** React (for visualizing charts and AI summaries).
* **LLM:** Gemini model (for Summarizing News Sentiements and Headlines).

---

## 🏗️ System Architecture

GitHub natively renders the flowchart below. It shows exactly how data flows from the user to the AI models and back.

<img width="826" height="385" alt="Screenshot 2026-04-13 at 1 23 21 PM" src="https://github.com/user-attachments/assets/ce183bcb-af72-44a1-9b88-53af1cffaa78" />


### 📊 System Architecture & Data Flow

This flowchart illustrates the complete lifecycle of a single user request, demonstrating how our hybrid architecture processes concurrent API calls and Machine Learning tasks:

* **1. User Trigger:** The cycle begins when a user enters a stock ticker (e.g., `AAPL`) into the React.js dashboard.
* **2. Concurrent Data Ingestion:** The FastAPI orchestrator simultaneously fetches numerical historical data (via `yfinance`) and qualitative live news headlines (via `NewsAPI`).
* **3. Triple AI Processing:**
  * *Text Data* is routed to the **FinBERT** transformer model to calculate a market sentiment score.
  * *Numerical Data* is routed to the custom **LSTM** neural network to forecast the 61st-day price.
  * *Text Data* *Numerical Data* is routed to the **LLM** a gemini model is integrated and summarize the prediction.
* **4. Unified Aggregation:** The backend combines the outputs from both AI models into a single, clean JSON payload.
* **5. UI Visualization:** The React frontend receives the JSON and dynamically updates the Recharts graphs and sentiment cards in real-time.

```mermaid
graph TD
    User[User Searches Stock] --> Frontend[React.js Dashboard]
    Frontend -->|HTTP GET Request| Backend[FastAPI Server]
    
    Backend -->|Thread 1| YF[yfinance API: Fetch Prices]
    Backend -->|Thread 2| News[NewsAPI: Fetch Headlines]
    
    YF --> LSTM[LSTM Deep Learning Model]
    News --> FinBERT[FinBERT NLP Model]
    
    LSTM -->|Price Forecast| Backend
    FinBERT -->|Sentiment Score| Backend
    
    Backend -->|Caches Data| DB[(MongoDB)]
    Backend -->|Returns JSON| Frontend
    Frontend -->|Updates Charts| User
```
## 🏗️ Tech Stack

| Component | Technology |
| :--- | :--- |
| **Data Ingestion** | `yfinance`, web scraping for financial news |
| **Time-Series Forecasting** | LSTM (TensorFlow/Keras) |
| **Sentiment Analysis** | FinBERT (transformer-based NLP) |
| **Backend/API** | FastAPI + Uvicorn |
| **Frontend** | React 18.x + Vite |
| **Database** | MongoDB (caching) |
| **Language** | Python 3.9+, JavaScript/Node.js |

## 🔑 Environment Variables

To run this project securely, you will need to set up your environment variables. We use these to keep API keys and database passwords hidden from the public code.

Create a new file named `.env` inside the `backend` directory and add the following lines:
```env
# NewsAPI (Required for FinBERT Sentiment Analysis)
# Get a free key from: https://newsapi.org/
NEWS_API_KEY=your_api_key_here

# MongoDB (Optional: Only needed if you are using cloud caching)
MONGO_URI=your_mongodb_connection_string
GEMINI_API_KEY = your google gemini api key
Prerequisites
-------------
- Python 3.9+ (3.10 recommended)
- Node.js 18+ and npm/yarn (for frontend)
- Optional: GPU (CUDA) for faster transformer/TensorFlow inference/training
- Git LFS if you plan to track the trained model file(s) in the repository

Recommended Python packages (also available as `requirements.txt`):
- fastapi
- uvicorn[standard]
- transformers
- torch (or torch-cpu)
- tensorflow (2.10+ recommended)
- yfinance
- requests
- numpy
- pandas
- scikit-learn
- joblib
- python-dotenv
- pymongo (if you enable caching/database)
- aiohttp (optional: async news fetches)


Quickstart — Backend
--------------------
1. Create a virtual environment and install dependencies:
   - python -m venv venv
   - source venv/bin/activate   (Windows: venv\Scripts\activate)
   - pip install -r requirements.txt

2. Create a `.env` file in AI Stock/backend/ (see `.env.example`) with:
   - NEWS_API_KEY=your_newsapi_key
   - HF_TOKEN=your_huggingface_token (optional)
   - MONGODB_URI=your_mongo_uri (optional)

3. (Optional) Train the LSTM model or place pretrained files:
   - python train_lstm.py
   - This will create `lstm_model.h5` and `scaler.gz` in the backend folder.

4. Run the backend:
   - uvicorn "main:app" --reload --host 0.0.0.0 --port 8000

Quickstart — Frontend
---------------------
1. Go to AI Stock/ai-stock-predictor/frontend
2. Install:
   - npm install
   - npm install axios recharts lucide-react
3. Set the backend URL in frontend environment file (e.g., `.env.local`):
   - VITE_API_BASE_URL=http://localhost:8000
4. Run dev server:
   - npm run dev


Training the LSTM model (train_lstm.py)
--------------------------------------
- The script trains a 2-layer LSTM on historical AAPL close prices from 2014-01-01 to 2024-01-01.
- It saves:
  - `scaler.gz` — MinMaxScaler used for scaling close prices
  - `lstm_model.h5` — trained Keras model

## 🎨 Frontend Setup
```1. Go to AI Stock/ai-stock-predictor/frontend
   2. Install:
   - npm install
   - npm install axios recharts lucide-react
   - npm run dev
```
### Frontend Status Badges
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)
![npm](https://img.shields.io/badge/npm-9%2B-blue.svg)
![Vite](https://img.shields.io/badge/Vite-Latest-purple.svg)
![React](https://img.shields.io/badge/React-18.x-61DAFB.svg)
```
```

### Frontend Flowchart

```mermaid
graph TD
    A[User Opens Dashboard] --> B[Enter Stock Ticker e.g., AAPL]
    B --> C[Trigger Search]
    
    C --> D[Show Loading State UI]
    C --> E[Axios GET: /predict/AAPL]
    
    E --> F{Wait for Backend Response}
    
    F -- Success --> G[Parse JSON Data]
    F -- Error --> H[Display Error Message]
    
    subgraph "Dynamic UI Rendering"
    G --> I[Update Recharts: Candlestick/Line Graph]
    G --> J[Update Sentiment Gauge: Pos/Neg/Neu]
    G --> K[Render Gemini LLM Summary Card]
    end
    
    I --> L[Dashboard Fully Loaded]
    J --> L
    K --> L
```

### Backened Status Badges 
![Python](https://img.shields.io/badge/Python-000000?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-000000?style=for-the-badge&logo=fastapi&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-000000?style=for-the-badge&logo=mongodb&logoColor=white)
![Uvicorn](https://img.shields.io/badge/Uvicorn-000000?style=for-the-badge&logo=uvicorn&logoColor=white)

### Backend Flowchart

```mermaid
graph TD
    A[User Request: /predict/ticker] --> B{Check MongoDB Cache}
    
    B -- Cache Found --> C[Return Cached JSON]
    B -- Cache Miss --> D[Parallel Data Fetching]
    
    subgraph "Data Acquisition"
    D --> E[yfinance: Historical Prices]
    D --> F[NewsAPI: Financial Headlines]
    end
    
    subgraph "AI Processing"
    E --> G[Quant Engine: LSTM Model]
    F --> H[Sentiment Engine: FinBERT]
    G --> I[7-Day Price Prediction]
    H --> J[Sentiment Score: Pos/Neg/Neu]
    end
    
    I --> K[Gemini LLM Synthesis]
    J --> K
    
    K --> L[Generate Human-Readable Summary]
    L --> M[Store Result in MongoDB]
    M --> N[Return Final JSON Response]
    C --> N
    N --> O[Update React Dashboard]
```
### LLM Status Badges
![Google Gemini](https://img.shields.io/badge/Google%20Gemini-8E75B2?style=for-the-badge&logo=googlegemini&logoColor=white)
![Hugging Face](https://img.shields.io/badge/%F0%9F%A4%97%20Hugging%20Face-FFD21E?style=for-the-badge&logo=huggingface&logoColor=black)
![PyTorch](https://img.shields.io/badge/PyTorch-EE4C2C?style=for-the-badge&logo=pytorch&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white)
![Natural Language Processing](https://img.shields.io/badge/NLP-Blue?style=for-the-badge)


### LLM Flowchart (Google Gemini)

```mermaid

graph TD
    %% Node Definitions
    A[NewsAPI: Financial Headlines]
    B[FinBERT Transformer Model]
    C[Sentiment Score: Pos/Neg/Neu]
    D[Construct Gemini Prompt]
    E[Gemini-1.5-Flash Processing]
    F[Generate 2-Sentence Analyst Summary]
    G[Update React Dashboard Summary Card]

    %% Data Flow
    subgraph "Data Acquisition"
        A
    end

    subgraph "AI Sentiment Engine"
        A --> B
        B --> C
    end

    subgraph "LLM Narrative Synthesis"
        A --> D
        C --> D
        D --> E
        E --> F
    end

    subgraph "Final Output"
        F --> G
    end

    %% Black Theme Styling
    classDef blackBox fill:#000000,stroke:#333,stroke-width:2px,color:#ffffff;
    class A,B,C,D,E,F,G blackBox;
   
```

### Step-by-Step Setup

1. Open terminal.
2. Install Python if not already installed.
3. Create a virtual environment:
 ```shell
   python3 -m venv venv
   ```
4. Activate the environment:
   ```shell
   source venv/bin/activate
   ```
5. Install required packages:
   ```shell
   pip install -r requirements.txt
   ```
6. Run the application:
   ```shell
   python app.py
   ```
</details>
<details>
<summary><strong>Windows</strong></summary>
1. Open Command Prompt.
2. Install Python if not already installed.
3. Create a virtual environment:
   ```shell
   python -m venv venv
   ```
4. Activate the environment:
   ```shell
   venv\Scripts\activate
   ```
5. Install required packages:
   ```shell
   pip install -r requirements.txt
   ```
   6. Run the application:
   ```shell
   python app.py
   ```
</details>

### Quick Links
- 🐍 [Python Installation Guide](https://www.python.org/downloads/)
- 📦 [Required Packages](https://example.com/packages)
- 🚀 [Run the App](#run)

### Environment Variables
- Set the following environment variables:
   - `DATABASE_URL`: your database connection string
   - `SECRET_KEY`: your application secret key.
 
## Backend Setup(FastAPI + ML)
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use `venv\Scripts\activate`
pip install -r requirements.txt

# Start the server
python -m uvicorn main:app --reload
```
 
API will be live at `http://localhost:8000`.  
Interactive docs: `http://localhost:8000/docs`

```

##
## Integrated LLM Documentation

### FinBERT

FinBERT is a pre-trained transformer model specifically designed for financial sentiment analysis. In our project, FinBERT is utilized to process and analyze news articles, financial reports, and social media content to extract sentiment related to specific stocks and the overall market. 

#### Use Cases:
- **Market Sentiment Analysis:** Analyze tweets and news articles to gauge public sentiment towards stocks.
- **Financial Report Evaluation:** Assess sentiment in quarterly earnings reports to provide insights into company performance.

#### Architecture:
FinBERT's architecture is based on the BERT model, fine-tuned on a financial corpus. Key components include:
- **Input Encoding:** Custom tokenizers that preprocess financial text data.
- **Multi-class Classification:** Enables the prediction of positive, negative, and neutral sentiments.

#### Integration:
In this project, FinBERT is integrated via the Hugging Face Transformers library, allowing seamless model loading and sentiment extraction within our data processing pipeline.

### Google Gemini

Google Gemini is an advanced language model that supports a wide range of tasks, including text generation, translation, and summarization. In our application, it plays a critical role in generating context-sensitive insights from financial news and reports.

#### Use Cases:
- **Automated Insights Generation:** Automatically generate summaries of financial news articles.
- **Contextual Analysis:** Provide detailed analysis based on previous trends and current news events to aid trading strategies.

#### Architecture:
Google Gemini utilizes a multi-modal architecture that processes various data sources, enabling it to leverage visual as well as textual information. This results in enhanced understanding and prediction capabilities in financial contexts.

#### Integration:
Integration of Google Gemini is achieved through API calls that allow real-time data processing, enhancing responsiveness and accuracy in sentiment-based predictions.

### Next Steps
With the integration of FinBERT and Google Gemini, our next goal is to further enhance the accuracy of sentiment predictions by:
- Exploring additional financial data sources for diverse input.
- Implementing continuous learning mechanisms to adapt models to evolving market trends.
- Regularly updating the LLMs with new financial information to maintain relevance and accuracy in predictions.

This structured LLM documentation will ensure a comprehensive understanding of how these models are leveraged for improved sentiment analysis in stock market predictions.
```

## Integrated LLM — Google Gemini
```
What it is
The system uses Google Gemini (google-generativeai Python SDK) as its large language model to generate a human-readable, two-sentence executive summary of the current market sentiment for any requested ticker.
Why Gemini
FeatureDetailModelgemini-pro (or gemini-1.5-flash for faster responses)SDKgoogle-generativeai Python packageAuthAPI key via GEMINI_API_KEY environment variableInput5 live news headlines fetched from NewsAPI for the tickerOutputConcise 2-sentence analyst-style narrative
```
End-to-End Prediction Flow
```
GET /predict/AAPL
      │
      ├─ 1. yfinance → fetch 7-day price history (chart) + 60-day history (LSTM input)
      │
      ├─ 2. NewsAPI  → fetch 5 latest headlines for "AAPL stock"
      │
      ├─ 3. FinBERT  → score each headline → aggregate → Positive / Negative + confidence
      │
      ├─ 4. LSTM     → scale 60-day closes → predict next price → inverse-scale
      │
      ├─ 5. LLM      → craft prompt from headlines → generate 2-sentence analyst summary
      │
      └─ 6. Return unified JSON → React renders chart, sentiment badge, AI summary card

```


## 🚀 Deployment

This project follows a hybrid deployment architecture to efficiently handle frontend performance and heavy backend ML processing.

## 🌐 Live Application
	•	Frontend (Vercel): ai-driven-stock-market-sentiment-pr.vercel.app
	•	Backend API: Exposed via ngrok (temporary public URL changes everytime)

⸻

## 🧠 Deployment Architecture
	•	The frontend is deployed on Vercel for fast and scalable UI delivery.
	•	The backend, which includes heavy TensorFlow-based ML models, runs locally due to high computational requirements.
	•	ngrok is used to expose the local backend server to the internet.

⸻

### 🔄 How It Works
	1.	User interacts with the frontend hosted on Vercel
	2.	Frontend sends API requests to the ngrok public URL
	3.	ngrok tunnels the request to the local backend server
	4.	Backend processes ML logic and returns the response

### ⚠️ Important Notes
	•	ngrok URLs are temporary and change every time the tunnel restarts
	•	This setup is ideal for development and demonstration purposes
	•	For production, consider deploying backend on GPU-supported platforms like:
	•	AWS EC2 (with GPU)
	•	Google Cloud (Vertex AI / Compute Engine)
	•	Azure ML

⸻

## ☁️ Tech Stack
	•	Frontend: React.js (Vercel)
	•	Backend: FastAPI (Python)
	•	ML: TensorFlow
	•	Database & Auth: Firebase
	•	Tunneling: ngrok
	•	Version Control: GitHub

⸻
	
## ⚠️ Legal Disclaimer 

	## Overview 
	This document outlines the terms, limitations, and disclaimers associated with the **AI-Driven Stock Market Sentiment & Prediction System** ("System"). By 
	using this System, you acknowledge and accept all terms and conditions outlined below.

⸻

## Summary 
| Aspect | Statement | \
| **Financial Advice** \
| ❌ Not provided; consult a licensed advisor | \
| **Accuracy Guarantee** \
| ❌ No guarantee; probabilistic estimates only | \
| **Liability** \
| ❌ Developers not liable for losses | 

| **Best Practices** | \
✅ Use as supplementary tool only, verify independently |



