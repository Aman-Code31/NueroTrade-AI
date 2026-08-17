import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Search, AlertCircle, Save } from "lucide-react";
import { useAuth } from "./AuthContext.jsx";
import { predictTicker, savePrediction } from "./api.js";

const Dashboard = () => {
  const { getIdToken } = useAuth();
  const [ticker, setTicker] = useState("");
  const [stockData, setStockData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!ticker.trim()) return;
    setLoading(true);
    setError("");
    setStockData(null);
    setSaveMessage("");
    try {
      const res = await predictTicker(ticker.trim().toUpperCase());
      if (res.data.error) {
        setError(res.data.error);
      } else {
        setStockData(res.data);
      }
    } catch (err) {
      setError("Couldn't reach the backend. Is it running on the configured API URL?");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!stockData) return;
    setIsSaving(true);
    setSaveMessage("");
    const payload = {
      ticker_symbol: stockData.symbol,
      current_price: stockData.currentPrice,
      lstm_predicted_price: stockData.prediction,
      finbert_sentiment: stockData.sentiment,
      finbert_sentiment_score: stockData.sentimentScore,
      ai_summary: stockData.ai_summary,
      chart_data: stockData.chartData,
      headlines_analyzed: stockData.headlinesAnalyzed || [],
    };
    try {
      await savePrediction(payload, getIdToken);
      setSaveMessage("Logged to your portfolio.");
    } catch (err) {
      setSaveMessage("Save failed — check the backend connection.");
    } finally {
      setIsSaving(false);
    }
  };

  const isPositive = stockData && stockData.prediction >= stockData.currentPrice;
  const sentimentPositive = stockData?.sentiment === "Positive";

  return (
    <div className="min-h-screen bg-paper text-ink font-body px-6 md:px-12 py-10">
      <div className="max-w-[1000px] mx-auto">
        <div className="mb-8">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-wide text-cobalt mb-2">// Trading floor</div>
          <h1 className="font-display font-extrabold uppercase text-3xl md:text-4xl">Call a trade.</h1>
        </div>

        <form onSubmit={handleSearch} className="flex gap-3 mb-10">
          <input
            type="text"
            value={ticker}
            onChange={(e) => setTicker(e.target.value)}
            placeholder="ENTER TICKER — E.G. AAPL"
            className="flex-1 border-[3px] border-ink px-5 py-3.5 font-mono uppercase tracking-wide focus:outline-none focus:bg-[#FFF6DE]"
          />
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 font-bold text-sm uppercase tracking-wide bg-cobalt text-white border-[3px] border-ink shadow-hard-sm px-6 transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-50"
          >
            <Search className="h-4 w-4" />
            {loading ? "Reading…" : "Search"}
          </button>
        </form>

        {error && (
          <div className="flex items-center gap-3 border-[3px] border-crimson bg-[#FDEAE8] px-5 py-4 mb-8">
            <AlertCircle className="h-5 w-5 text-crimson flex-shrink-0" />
            <p className="text-sm font-semibold text-crimson">{error}</p>
          </div>
        )}

        {loading && (
          <div className="border-[3px] border-ink bg-panel p-10 text-center font-mono text-sm text-inksoft">
            Reading the chart and the room…
          </div>
        )}

        {stockData && !loading && (
          <div className="grid md:grid-cols-[1.1fr,0.9fr] gap-8">
            <div className="bg-panel border-[3px] border-ink shadow-hard-cobalt">
              <div className="flex justify-between items-center px-6 py-4 bg-ink text-paper">
                <span className="font-display font-bold text-2xl">{stockData.symbol}</span>
                <span className="font-mono text-[11px] text-gray-400">LIVE READ</span>
              </div>
              <div className="p-6">
                <div className="flex items-baseline gap-3 mb-1">
                  <span className="font-display font-extrabold text-5xl">${stockData.currentPrice}</span>
                </div>
                <div className="text-xs text-inksoft mb-6 font-mono">CURRENT PRICE — LAST 7 DAYS BELOW</div>

                <div className="h-40 mb-6 -ml-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={stockData.chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#12131A" strokeOpacity={0.15} />
                      <XAxis dataKey="day" tick={{ fontSize: 11, fontFamily: "IBM Plex Mono" }} stroke="#12131A" />
                      <YAxis tick={{ fontSize: 11, fontFamily: "IBM Plex Mono" }} stroke="#12131A" domain={["auto", "auto"]} />
                      <Tooltip contentStyle={{ border: "2px solid #12131A", fontFamily: "IBM Plex Mono", fontSize: 12 }} />
                      <Line type="monotone" dataKey="price" stroke="#1D4FEB" strokeWidth={3} dot={{ fill: "#1D4FEB", r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-2 border-2 border-ink mb-6">
                  <div className="p-4 border-r-2 border-b-2 border-ink">
                    <div className="text-[10px] text-inksoft uppercase tracking-wide mb-1">7D Forecast</div>
                    <div className={`font-mono text-base font-semibold ${isPositive ? "text-kelly" : "text-crimson"}`}>
                      ${stockData.prediction} {isPositive ? "▲" : "▼"}
                    </div>
                  </div>
                  <div className="p-4 border-b-2 border-ink">
                    <div className="text-[10px] text-inksoft uppercase tracking-wide mb-1">Sentiment</div>
                    <div className={`font-mono text-base font-semibold ${sentimentPositive ? "text-kelly" : "text-crimson"}`}>
                      {stockData.sentiment}
                    </div>
                  </div>
                  <div className="p-4 border-r-2 border-ink">
                    <div className="text-[10px] text-inksoft uppercase tracking-wide mb-1">Headlines</div>
                    <div className="font-mono text-base font-semibold">{stockData.headlinesAnalyzed?.length || 0} scanned</div>
                  </div>
                  <div className="p-4">
                    <div className="text-[10px] text-inksoft uppercase tracking-wide mb-1">Alignment</div>
                    <div className="font-mono text-base font-semibold">
                      {isPositive === sentimentPositive ? "Agree" : "Diverge"}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3.5 bg-gold border-2 border-dashed border-ink px-4 py-3 shadow-hard-sm -rotate-1 w-fit mb-6">
                  <div className="font-display font-extrabold text-3xl">{Math.round(stockData.sentimentScore * 100)}%</div>
                  <div className="text-[10.5px] uppercase tracking-wide font-semibold leading-tight">Confidence<br />Signal</div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 font-bold text-sm uppercase tracking-wide bg-kelly text-white border-[3px] border-ink shadow-hard-sm py-3.5 transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  {isSaving ? "Logging…" : "Log to Portfolio"}
                </button>
                {saveMessage && <p className="text-center text-sm font-semibold mt-3">{saveMessage}</p>}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="bg-[#EAF1FF] border-[3px] border-ink p-6">
                <div className="font-mono text-[11px] font-semibold uppercase tracking-wide text-cobalt mb-3">// Analyst read</div>
                <p className="text-sm leading-relaxed">{stockData.ai_summary}</p>
              </div>

              <div className="bg-panel border-[3px] border-ink p-6">
                <div className="font-mono text-[11px] font-semibold uppercase tracking-wide text-cobalt mb-3">// Headlines scanned</div>
                <ul className="space-y-2.5">
                  {(stockData.headlinesAnalyzed || []).map((h, i) => (
                    <li key={i} className="text-sm leading-snug border-b border-ink/15 pb-2.5 last:border-b-0 last:pb-0">
                      {h}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {!stockData && !loading && !error && (
          <div className="border-[3px] border-dashed border-ink/40 p-14 text-center">
            <p className="font-mono text-sm text-inksoft">Enter a ticker above to call your first trade.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
