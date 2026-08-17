import React from "react";
import { useAuth } from "./AuthContext.jsx";
import { TICKER_ITEMS } from "./tickerData";

const AppNav = ({ view, setView }) => {
  const { user, logout } = useAuth();
  const initial = (user?.displayName || user?.email || "?").charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-paper">
      <div className="w-full bg-ink overflow-hidden whitespace-nowrap">
        <div className="inline-flex animate-ticker">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <span key={i} className="font-mono text-xs tracking-wide px-6 py-2 text-gray-200">
              {item.symbol}{" "}
              <span className={item.dir === "up" ? "text-green-300" : "text-red-300"}>
                {item.price} {item.change}
              </span>
            </span>
          ))}
        </div>
      </div>
      <div className="stripe-bar" />
      <nav className="flex justify-between items-center px-6 md:px-12 py-4 border-b-[3px] border-ink">
        <div className="font-display font-extrabold text-2xl uppercase">
          Neuro<span className="text-cobalt">Trade</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setView("dashboard")}
            className={`text-sm font-bold uppercase tracking-wide px-4 py-2 border-2 ${
              view === "dashboard" ? "bg-gold border-ink" : "border-transparent hover:border-ink"
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setView("profile")}
            className={`text-sm font-bold uppercase tracking-wide px-4 py-2 border-2 ${
              view === "profile" ? "bg-gold border-ink" : "border-transparent hover:border-ink"
            }`}
          >
            Profile
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setView("profile")}
            className="w-9 h-9 rounded-full bg-cobalt border-2 border-ink flex items-center justify-center text-white font-display font-bold text-sm"
            title={user?.email}
          >
            {initial}
          </button>
          <button
            onClick={logout}
            className="text-sm font-semibold uppercase tracking-wide px-3 py-2 border-2 border-ink hover:bg-crimson hover:text-white transition-colors"
          >
            Sign Out
          </button>
        </div>
      </nav>
    </header>
  );
};

export default AppNav;
