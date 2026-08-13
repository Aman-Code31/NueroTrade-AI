import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM
import joblib
import os

# 1. Load the Kaggle Dataset
file_path = 'Google_stock_data.csv'

print(f"1. Loading dataset from {file_path}...")
try:
    df = pd.read_csv(file_path)
except FileNotFoundError:
    print(f"❌ Error: Could not find {file_path}. Please place your Kaggle CSV in the backend folder and name it 'stock_data.csv'.")
    exit()

print("2. Cleaning and Preprocessing Data...")
# --- DATA CLEANING START ---

# A. Drop rows with missing values (NaN). If a day is missing price data, we throw it out.
df = df.dropna()

# B. Check if the Kaggle dataset uses 'Close' or 'Close/Last' as the column name
if 'Close' in df.columns:
    target_column = 'Close'
elif 'Close/Last' in df.columns:
    target_column = 'Close/Last'
else:
    print("❌ Error: Could not find a 'Close' price column. Check your CSV file headers.")
    exit()

# C. Sometimes Kaggle CSVs have dollar signs (e.g., "$150.00"). We must remove them and convert to pure floats (decimals).
if df[target_column].dtype == object:
    df[target_column] = df[target_column].astype(str).str.replace('$', '').str.replace(',', '').astype(float)

# DATA CLEANING END 

# Extract the cleaned prices and convert to a numpy array
dataset = df[target_column].values.reshape(-1, 1)
print(f"   -> Successfully cleaned {len(dataset)} valid trading days of data.")

print("3. Scaling data between 0 and 1...")
scaler = MinMaxScaler(feature_range=(0, 1))
scaled_data = scaler.fit_transform(dataset)

# Save the scaler so FastAPI can use it later to decode the predictions
joblib.dump(scaler, 'scaler.gz')

print("4. Creating the 60-day Time Steps (Sliding Window)...")
x_train, y_train = [], []
for i in range(60, len(scaled_data)):
    x_train.append(scaled_data[i-60:i, 0])
    y_train.append(scaled_data[i, 0])

x_train, y_train = np.array(x_train), np.array(y_train)
# Reshape for LSTM: [Samples, Time Steps, Features]
x_train = np.reshape(x_train, (x_train.shape[0], x_train.shape[1], 1))

print("5. Building the LSTM Neural Network...")
model = Sequential()
model.add(LSTM(50, return_sequences=True, input_shape=(x_train.shape[1], 1)))
model.add(LSTM(50, return_sequences=False))
model.add(Dense(25))
model.add(Dense(1))

model.compile(optimizer='adam', loss='mean_squared_error')

print("6. Training the Model! (This will take a few minutes...)")
# Epochs = 10 means the AI will review the 20-year history 10 times to find patterns.
model.fit(x_train, y_train, batch_size=32, epochs=10)

print("7. Saving the AI Brain...")
model.save('lstm_model.h5')
print("✅ Training Complete! 'lstm_model.h5' and 'scaler.gz' have been created.")