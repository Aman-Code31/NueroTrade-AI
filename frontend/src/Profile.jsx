import React, { useEffect, useState } from "react";
import { useAuth } from "./AuthContext.jsx";
import { fetchHistory } from "./api.js";

const Profile = () => {
  const { user, getIdToken } = useAuth();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await fetchHistory(getIdToken);
        setHistory(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        setError("Couldn't load your portfolio history — check the backend connection.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const initial = (user?.displayName || user?.email || "?").charAt(0).toUpperCase();
  const memberSince = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString("en-US", { month: "long", year: "numeric" })
    : "—";

  return (
    <div className="min-h-screen bg-paper text-ink font-body px-6 md:px-12 py-10">
      <div className="max-w-[1000px] mx-auto">
        {/* PROFILE CARD */}
        <div className="bg-panel border-[3px] border-ink shadow-hard mb-10 p-7 flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-20 h-20 rounded-full bg-cobalt border-[3px] border-ink flex items-center justify-center text-white font-display font-extrabold text-3xl flex-shrink-0">
            {initial}
          </div>
          <div className="flex-1">
            <h1 className="font-display font-extrabold uppercase text-2xl mb-1">
              {user?.displayName || "Trader"}
            </h1>
            <p className="text-sm text-inksoft font-mono">{user?.email}</p>
            <p className="text-xs text-inksoft mt-1 uppercase tracking-wide font-semibold">
              On the floor since {memberSince}
            </p>
          </div>
          <div className="flex items-center gap-3.5 bg-gold border-2 border-dashed border-ink px-4 py-3 shadow-hard-sm rotate-2 w-fit">
            <div className="font-display font-extrabold text-3xl">{history.length}</div>
            <div className="text-[10.5px] uppercase tracking-wide font-semibold leading-tight">Trades<br />Logged</div>
          </div>
        </div>

        {/* HISTORY */}
        <div className="mb-6">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-wide text-cobalt mb-2">// The floor</div>
          <h2 className="font-display font-bold uppercase text-2xl">Every ticker you've called.</h2>
        </div>

        {loading && (
          <div className="border-[3px] border-ink bg-panel p-10 text-center font-mono text-sm text-inksoft">
            Pulling your ledger…
          </div>
        )}

        {error && (
          <div className="border-[3px] border-crimson bg-[#FDEAE8] px-5 py-4 mb-6">
            <p className="text-sm font-semibold text-crimson">{error}</p>
          </div>
        )}

        {!loading && !error && history.length === 0 && (
          <div className="border-[3px] border-dashed border-ink/40 p-14 text-center">
            <p className="font-mono text-sm text-inksoft">Nothing logged yet — call a trade on the Dashboard first.</p>
          </div>
        )}

        {!loading && history.length > 0 && (
          <div className="border-[3px] border-ink overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-5 bg-ink text-paper text-[10.5px] uppercase tracking-wide font-semibold px-4 py-3">
                <span>Ticker</span><span>Price</span><span>7D Forecast</span><span>Sentiment</span><span>Logged</span>
              </div>
              {history.map((row, i) => {
                const isPos = row.lstm_predicted_price >= row.current_price;
                const sentPos = row.finbert_sentiment === "Positive";
                return (
                  <div
                    key={row._id || i}
                    className={`grid grid-cols-5 px-4 py-3.5 items-center text-sm border-t-2 border-ink ${i % 2 === 1 ? "bg-[#FAFAF5]" : ""}`}
                  >
                    <span className="font-display font-bold text-base">{row.ticker_symbol}</span>
                    <span className="font-mono">${row.current_price}</span>
                    <span className={`font-mono font-semibold ${isPos ? "text-kelly" : "text-crimson"}`}>
                      ${row.lstm_predicted_price} {isPos ? "▲" : "▼"}
                    </span>
                    <span className={`font-mono font-semibold ${sentPos ? "text-kelly" : "text-crimson"}`}>
                      {row.finbert_sentiment}
                    </span>
                    <span className="font-mono text-xs text-inksoft">
                      {row.created_at ? new Date(row.created_at).toLocaleDateString() : "—"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
