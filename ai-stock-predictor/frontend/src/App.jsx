import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, TrendingUp, TrendingDown, Activity, AlertCircle, Save, Database, LogOut, User } from 'lucide-react';
import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const App = () => {
  //  AUTH STATE 
  const [activeUser, setActiveUser] = useState(null); 
  const [isRegistering, setIsRegistering] = useState(false);
  const [authForm, setAuthForm] = useState({ username: '', password: '' });
  const [authError, setAuthError] = useState('');

  //  APP STATE 
  const [ticker, setTicker] = useState('');
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedHistory, setSavedHistory] = useState([]);
  const [saveMessage, setSaveMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // --- AUTHENTICATION FUNCTIONS ---
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');
    // Fixed the double slash issue here
    const endpoint = isRegistering ? '/api/register' : '/api/login';
    
    try {
      const response = await axios.post(`${BASE_URL}${endpoint}`, authForm);
      setActiveUser(response.data.username);
    } catch (err) {
      setAuthError(err.response?.data?.detail || "Authentication failed. Try again.");
    }
  };

  const handleLogout = () => {
    setActiveUser(null);
    setStockData(null);
    setSavedHistory([]);
  };

  // --- APP FUNCTIONS ---
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!ticker) return;
    setLoading(true); setError(''); setStockData(null); setSaveMessage('');

    try {
      const response = await axios.get(`${BASE_URL}/predict/${ticker}`);
      if (response.data.error) setError(`Error: ${response.data.error}`);
      else setStockData(response.data);
    } catch (err) {
      setError('Failed to connect to Python Backend.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveToDatabase = async () => {
    if (!stockData || !activeUser) return;
    setIsSaving(true); setSaveMessage('');

    const payload = {
      user_id: activeUser,
      ticker_symbol: stockData.symbol,
      current_price: stockData.currentPrice,
      lstm_predicted_price: stockData.prediction,
      finbert_sentiment: stockData.sentiment,
      finbert_sentiment_score: stockData.sentimentScore,
      ai_summary: stockData.ai_summary,
      chart_data: stockData.chartData,
      headlines_analyzed: stockData.headlinesAnalyzed || []
    };

    try {
      await axios.post(`${BASE_URL}/api/stocks/save`, payload);
      setSaveMessage("Saved to portfolio!");
      fetchUserHistory();
    } catch (error) {
      setSaveMessage("Failed to save data.");
    } finally {
      setIsSaving(false);
    }
  };

  const fetchUserHistory = async () => {
    if (!activeUser) return;
    try {
      const response = await axios.get(`${BASE_URL}/api/stocks/${activeUser}`);
      if (Array.isArray(response.data)) setSavedHistory(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    if (activeUser) {
      fetchUserHistory();
    }
  }, [activeUser]);

  // ==========================================
  // RENDER 1: LOGIN/REGISTER SCREEN
  // ==========================================
  if (!activeUser) {
    return (
      <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white p-4">
        <div className="flex items-center gap-2 mb-8">
          <Activity className="text-blue-500 h-10 w-10" />
          <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            NeuroTrade
          </span>
        </div>
        
        <div className="bg-gray-800/50 border border-gray-700 p-8 rounded-2xl shadow-2xl w-full max-w-md backdrop-blur-sm">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isRegistering ? 'Create an Account' : 'Sign in to NeuroTrade'}
          </h2>
          
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Username</label>
              <input 
                type="text" required
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={authForm.username}
                onChange={(e) => setAuthForm({...authForm, username: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input 
                type="password" required
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={authForm.password}
                onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
              />
            </div>
            
            {authError && <p className="text-red-400 text-sm">{authError}</p>}
            
            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors mt-2">
              {isRegistering ? 'Sign Up' : 'Login'}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-400">
            {isRegistering ? 'Already have an account?' : "Don't have an account?"}
            <button 
              onClick={() => { setIsRegistering(!isRegistering); setAuthError(''); }}
              className="ml-2 text-blue-400 hover:text-blue-300 underline font-medium"
            >
              {isRegistering ? 'Log in here' : 'Sign up here'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER 2: THE MAIN DASHBOARD
  // ==========================================
  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans selection:bg-blue-500 selection:text-white">
      
      {/* NAVBAR */}
      <nav className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="text-blue-500 h-6 w-6" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              NeuroTrade
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-300 bg-gray-800 px-3 py-1.5 rounded-full border border-gray-700">
              <User className="h-4 w-4 text-purple-400" />
              <span>{activeUser}</span>
            </div>
            <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1 text-sm">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* MAIN CONTENT */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Search Section */}
        <div className="flex flex-col items-center justify-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Predict the Market with <span className="text-blue-500">AI Precision</span>
          </h1>
          
          <form onSubmit={handleSearch} className="relative w-full max-w-md mt-6">
            <input
              type="text"
              placeholder="Enter Stock Ticker (e.g., AAPL, TSLA)"
              className="w-full bg-gray-800 border border-gray-700 text-white px-5 py-4 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 pl-12 shadow-lg"
              value={ticker}
              onChange={(e) => setTicker(e.target.value.toUpperCase())}
            />
            <Search className="absolute left-4 top-4 text-gray-500 h-5 w-5" />
            <button 
              type="submit" 
              className="absolute right-2 top-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
              disabled={loading}
            >
              {loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </form>
          {error && <p className="text-red-400 mt-4 flex items-center gap-2"><AlertCircle className="h-4 w-4"/> {error}</p>}
        </div>

        {/* Results Section */}
        {stockData && !loading && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            
            {/* Chart Column */}
            <div className="lg:col-span-2 bg-gray-800/50 border border-gray-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-white">{stockData.symbol} Price Trend</h2>
                  <p className="text-gray-400 text-sm">Live Yahoo Finance Data (7 Days)</p>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-white">${stockData.currentPrice.toFixed(2)}</p>
                  
                  <button 
                    onClick={handleSaveToDatabase}
                    disabled={isSaving}
                    className="mt-3 flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm ml-auto"
                  >
                    <Save className="h-4 w-4" />
                    {isSaving ? 'Saving...' : 'Save to Portfolio'}
                  </button>
                  {saveMessage && <p className="text-emerald-400 text-xs mt-2">{saveMessage}</p>}

                </div>
              </div>
              
              <div className="h-[300px] w-full mt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={stockData.chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
                    <XAxis dataKey="day" stroke="#9CA3AF" tickLine={false} axisLine={false} />
                    <YAxis stroke="#9CA3AF" tickLine={false} axisLine={false} domain={['auto', 'auto']} />
                    <Tooltip contentStyle={{ backgroundColor: '#1F2937', border: 'none', borderRadius: '8px' }} />
                    <Line type="monotone" dataKey="price" stroke="#3B82F6" strokeWidth={3} dot={{ r: 4, fill: '#3B82F6' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* AI Insights Column */}
            <div className="flex flex-col gap-6">
              
              {/* Sentiment Card */}
              <div className="bg-gray-800/50 border border-gray-700 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-1 h-full ${stockData.sentiment === 'Positive' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <h3 className="text-gray-400 text-sm uppercase tracking-wider font-semibold mb-2">FinBERT Sentiment</h3>
                <div className="flex items-center gap-4 mb-4">
                  {stockData.sentiment === 'Positive' ? (
                    <div className="bg-green-500/20 p-3 rounded-full text-green-400"><TrendingUp className="h-8 w-8" /></div>
                  ) : (
                    <div className="bg-red-500/20 p-3 rounded-full text-red-400"><TrendingDown className="h-8 w-8" /></div>
                  )}
                  <div>
                    <p className={`text-3xl font-bold ${stockData.sentiment === 'Positive' ? 'text-green-400' : 'text-red-400'}`}>
                      {stockData.sentiment}
                    </p>
                    <p className="text-gray-500 text-xs">Confidence Score: {(stockData.sentimentScore * 100).toFixed(1)}%</p>
                  </div>
                </div>
              </div>

              {/* LLM Executive Summary Card */}
              {stockData.ai_summary && (
                <div className="bg-gray-800/80 border border-purple-500/30 rounded-2xl p-6 shadow-xl">
                  <h3 className="text-purple-300 text-sm uppercase tracking-wider font-semibold mb-3 flex items-center gap-2">
                    <Activity className="h-4 w-4" /> Executive AI Summary
                  </h3>
                  <p className="text-gray-300 text-sm leading-relaxed italic">
                    "{stockData.ai_summary}"
                  </p>
                </div>
              )}

              {/* Prediction Card */}
              <div className="bg-gradient-to-br from-blue-900/40 to-purple-900/40 border border-blue-500/30 rounded-2xl p-6 shadow-xl">
                <h3 className="text-blue-200 text-sm uppercase tracking-wider font-semibold mb-2">AI Price Forecast</h3>
                <div className="flex justify-between items-end mb-2">
                  <p className="text-4xl font-bold text-white">${stockData.prediction}</p>
                </div>
                <p className="text-gray-400 text-sm">
                  Based on current sentiment and technicals, the model anticipates this trend over the next 24 hours.
                </p>
              </div>

            </div>
          </div>
        )}

        {/* --- MONGODB HISTORY SECTION --- */}
        <div className="mt-16 pt-8 border-t border-gray-800">
          <div className="flex items-center gap-3 mb-6">
            <Database className="text-purple-500 h-6 w-6" />
            <h2 className="text-2xl font-bold text-white">{activeUser}'s Portfolio History</h2>
          </div>

          {savedHistory.length === 0 ? (
            <div className="bg-gray-800/30 border border-gray-700 rounded-2xl p-8 text-center text-gray-500">
              <p>No predictions saved yet. Search for a stock and click "Save to Portfolio" to build your database.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedHistory.map((record) => (
                <div key={record._id} className="bg-gray-800/40 border border-gray-700 rounded-xl p-5 hover:border-gray-500 transition-colors">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xl font-bold text-white">{record.ticker_symbol}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(record.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Predicted Price:</span>
                      <span className="font-mono text-blue-400">${record.lstm_predicted_price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sentiment:</span>
                      <span className={record.finbert_sentiment === 'Positive' ? 'text-green-400' : 'text-red-400'}>
                        {record.finbert_sentiment}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
      
      {/* FOOTER */}
      <footer className="border-t border-gray-800 bg-gray-900/50 backdrop-blur-md mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
          <p className="text-gray-400 text-sm">
            NOTICE: Not Financial Advice.<br></br> Do not Trade based on these Predictions & Sentiments.<br></br>This tool is Group Project(Educational Purpose).
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;