import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Search, TrendingUp, TrendingDown, Activity, AlertCircle, Save, Database, LogOut, User } from 'lucide-react';
import axios from 'axios';
import { useAuth } from './AuthContext.jsx';

const BASE_URL = 'http://localhost:8000';

const App = () => {
  //  AUTH STATE (from Firebase, via context) 
  const { user, authLoading, signUpWithEmail, signInWithEmail, signInWithGoogle, logout, getIdToken } = useAuth();
  const [isRegistering, setIsRegistering] = useState(false);
  const [authForm, setAuthForm] = useState({ email: '', password: '' });
  const [authError, setAuthError] = useState('');
  const [authSubmitting, setAuthSubmitting] = useState(false);

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
    setAuthSubmitting(true);
    try {
      if (isRegistering) {
        await signUpWithEmail(authForm.email, authForm.password);
      } else {
        await signInWithEmail(authForm.email, authForm.password);
      }
      // onAuthStateChanged in AuthContext picks up the new session automatically —
      // no need to manually set any user state here.
    } catch (err) {
      setAuthError(firebaseErrorToMessage(err));
    } finally {
      setAuthSubmitting(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setAuthError('');
    setAuthSubmitting(true);
    try {
      await signInWithGoogle();
    } catch (err) {
      setAuthError(firebaseErrorToMessage(err));
    } finally {
      setAuthSubmitting(false);
    }
  };

  // Firebase error codes are ugly (e.g. "Firebase: Error (auth/wrong-password).")
  // Translate the common ones into something a user can act on.
  const firebaseErrorToMessage = (err) => {
    const code = err?.code || '';
    if (code.includes('email-already-in-use')) return 'An account with this email already exists. Try logging in instead.';
    if (code.includes('wrong-password') || code.includes('invalid-credential')) return 'Incorrect email or password.';
    if (code.includes('user-not-found')) return 'No account found with this email.';
    if (code.includes('weak-password')) return 'Password should be at least 6 characters.';
    if (code.includes('popup-closed-by-user')) return 'Google sign-in was cancelled.';
    return 'Authentication failed. Please try again.';
  };

  const handleLogout = async () => {
    await logout();
    setStockData(null);
    setSavedHistory([]);
  };

  // Attaches the current Firebase ID token to a request config's headers.
  const withAuthHeader = async () => {
    const token = await getIdToken();
    return { headers: { Authorization: `Bearer ${token}` } };
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
    if (!stockData || !user) return;
    setIsSaving(true); setSaveMessage('');

    // No user_id field here on purpose — the backend derives the owner
    // from the verified token, it never trusts a client-supplied id.
    const payload = {
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
      const config = await withAuthHeader();
      await axios.post(`${BASE_URL}/api/stocks/save`, payload, config);
      setSaveMessage("Saved to portfolio!");
      fetchUserHistory();
    } catch (error) {
      setSaveMessage("Failed to save data.");
    } finally {
      setIsSaving(false);
    }
  };

  const fetchUserHistory = async () => {
    if (!user) return;
    try {
      const config = await withAuthHeader();
      const response = await axios.get(`${BASE_URL}/api/stocks/me`, config);
      if (Array.isArray(response.data)) setSavedHistory(response.data);
    } catch (error) {
      console.error("Error fetching history:", error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserHistory();
    }
  }, [user]);

  // ==========================================
  // RENDER 0: AUTH STATE STILL LOADING
  // ==========================================
  // Firebase checks browser storage for an existing session asynchronously.
  // Render nothing (or a spinner) until it resolves — otherwise the login
  // screen flashes for a moment even for already-logged-in users on refresh.
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-gray-400">
        Loading...
      </div>
    );
  }

  // ==========================================
  // RENDER 1: LOGIN/REGISTER SCREEN
  // ==========================================
  if (!user) {
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

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={authSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-100 text-gray-800 font-medium py-3 rounded-lg transition-colors mb-4 disabled:opacity-60"
          >
            <svg className="h-5 w-5" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.9 32.9 29.4 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.4 6.1 29.5 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.6 15.9 18.9 13 24 13c3.1 0 5.9 1.2 8 3.1l5.7-5.7C34.4 6.1 29.5 4 24 4c-7.5 0-14 4.1-17.7 10.7z"/>
              <path fill="#4CAF50" d="M24 44c5.3 0 10.1-2 13.7-5.4l-6.3-5.3C29.4 35.3 26.8 36 24 36c-5.3 0-9.8-3.4-11.4-8.1l-6.6 5.1C9.9 39.6 16.4 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-1 2.9-3.1 5.3-5.9 6.9l6.3 5.3C39.5 37 44 31 44 24c0-1.3-.1-2.7-.4-3.5z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="h-px bg-gray-700 flex-1" />
            <span className="text-xs text-gray-500">OR</span>
            <div className="h-px bg-gray-700 flex-1" />
          </div>
          
          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <input 
                type="email" required
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={authForm.email}
                onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Password</label>
              <input 
                type="password" required minLength={6}
                className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500 outline-none"
                value={authForm.password}
                onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
              />
            </div>
            
            {authError && <p className="text-red-400 text-sm">{authError}</p>}
            
            <button type="submit" disabled={authSubmitting} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors mt-2 disabled:opacity-60">
              {authSubmitting ? 'Please wait...' : (isRegistering ? 'Sign Up' : 'Login')}
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
              <span>{user.displayName || user.email}</span>
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
            <h2 className="text-2xl font-bold text-white">{(user.displayName || user.email)}'s Portfolio History</h2>
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