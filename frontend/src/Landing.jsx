import React from "react";
import { TICKER_ITEMS } from "./tickerData";

const Landing = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-paper text-ink font-body">
      {/* HEADER */}
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
        <nav className="flex justify-between items-center px-6 md:px-12 py-5 border-b-[3px] border-ink">
          <div className="font-display font-extrabold text-2xl uppercase">
            Neuro<span className="text-cobalt">Trade</span>
          </div>
          <div className="hidden md:flex gap-2">
            <a href="#rules" className="text-sm font-semibold uppercase tracking-wide px-4 py-2 border-2 border-transparent hover:border-ink">
              How It's Read
            </a>
            <a href="#notice" className="text-sm font-semibold uppercase tracking-wide px-4 py-2 border-2 border-transparent hover:border-ink">
              Notice
            </a>
          </div>
          <button
            onClick={onEnter}
            className="font-bold text-sm uppercase tracking-wide bg-ink text-paper border-2 border-ink px-5 py-2.5 hover:bg-cobalt hover:border-cobalt transition-colors"
          >
            Sign In
          </button>
        </nav>
      </header>

      {/* HERO */}
      <section className="relative max-w-[1220px] mx-auto px-6 md:px-12 pt-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="absolute top-9 left-[44%] hidden md:block pointer-events-none">
          <svg width="50" height="18" viewBox="0 0 50 18">
            <polyline points="0,16 12,2 24,16 36,2 48,16" fill="none" stroke="#1D4FEB" strokeWidth="4" />
          </svg>
        </div>
        <div className="absolute bottom-20 left-[2%] w-8 h-8 rounded-full border-[6px] border-kelly hidden md:block pointer-events-none" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 bg-gold border-2 border-ink px-3.5 py-1.5 font-mono text-xs font-semibold shadow-hard-sm -rotate-2 mb-6">
            ● LIVE — PIT OPEN 9:30–4:00 EST
          </div>
          <h1 className="font-display font-extrabold uppercase leading-[0.98] text-[40px] md:text-[60px] mb-6">
            Read the <span className="text-cobalt">chart.</span><br />
            Read the <span className="text-crimson">room.</span><br />
            Call the trade.
          </h1>
          <p className="text-base md:text-lg leading-relaxed text-inksoft max-w-[460px] mb-8">
            NeuroTrade weighs ten years of price action against this morning's headlines
            and calls it straight — the way a floor trader reads the pit, not the way
            a dashboard hides behind jargon.
          </p>
          <div className="flex flex-wrap gap-4 mb-10">
            <button
              onClick={onEnter}
              className="font-bold text-sm uppercase tracking-wide bg-cobalt text-white border-[3px] border-ink shadow-hard px-7 py-4 transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-hard-sm"
            >
              Enter the Floor →
            </button>
            <a
              href="#rules"
              className="font-bold text-sm uppercase tracking-wide bg-paper text-ink border-[3px] border-ink px-6 py-4 hover:bg-gold transition-colors"
            >
              How It's Read
            </a>
          </div>
          <div className="flex border-t-[3px] border-ink">
            <div className="flex-1 pt-4 pr-4">
              <div className="font-display font-bold text-2xl">10Y</div>
              <div className="text-[11px] text-inksoft uppercase tracking-wide">Price history</div>
            </div>
            <div className="flex-1 pt-4 pr-4">
              <div className="font-display font-bold text-2xl">FinBERT</div>
              <div className="text-[11px] text-inksoft uppercase tracking-wide">Reads the room</div>
            </div>
            <div className="flex-1 pt-4">
              <div className="font-display font-bold text-2xl">&lt;8s</div>
              <div className="text-[11px] text-inksoft uppercase tracking-wide">Call time</div>
            </div>
          </div>
        </div>

        <div className="relative z-10 bg-panel border-[3px] border-ink shadow-hard-cobalt">
          <div className="absolute -top-3.5 -right-3.5 w-16 h-16 rounded-full bg-crimson border-2 border-ink flex items-center justify-center rotate-12 z-20">
            <span className="text-white font-display font-extrabold text-[10px] text-center leading-tight uppercase">Live<br />Read</span>
          </div>
          <div className="flex justify-between items-center px-5 py-4 bg-ink text-paper">
            <span className="font-display font-bold text-xl">AAPL</span>
            <span className="font-mono text-[10px] text-gray-400">NASDAQ · APPLE INC.</span>
          </div>
          <div className="p-5">
            <div className="flex items-baseline gap-3">
              <span className="font-display font-extrabold text-4xl">$247.18</span>
              <span className="font-mono text-sm text-kelly font-semibold">▲ 1.9% TODAY</span>
            </div>
            <div className="text-[11px] text-inksoft mb-5">AS OF 9:41 AM — LIVE</div>
            <div className="grid grid-cols-2 border-2 border-ink mb-5">
              <div className="p-3 border-r-2 border-b-2 border-ink">
                <div className="text-[10px] text-inksoft uppercase tracking-wide mb-1">7D Forecast</div>
                <div className="font-mono text-sm font-semibold text-kelly">$253.40 ▲</div>
              </div>
              <div className="p-3 border-b-2 border-ink">
                <div className="text-[10px] text-inksoft uppercase tracking-wide mb-1">Sentiment</div>
                <div className="font-mono text-sm font-semibold text-kelly">Positive</div>
              </div>
              <div className="p-3 border-r-2 border-ink">
                <div className="text-[10px] text-inksoft uppercase tracking-wide mb-1">Headlines</div>
                <div className="font-mono text-sm font-semibold">5 scanned</div>
              </div>
              <div className="p-3">
                <div className="text-[10px] text-inksoft uppercase tracking-wide mb-1">Alignment</div>
                <div className="font-mono text-sm font-semibold">Agree</div>
              </div>
            </div>
            <div className="flex items-center gap-3.5 bg-gold border-2 border-dashed border-ink px-4 py-3 shadow-hard-sm -rotate-3 w-fit">
              <div className="font-display font-extrabold text-3xl">91%</div>
              <div className="text-[10.5px] uppercase tracking-wide font-semibold leading-tight">Confidence<br />Signal</div>
            </div>
          </div>
        </div>
      </section>

      {/* HOUSE RULES */}
      <section id="rules" className="max-w-[1220px] mx-auto px-6 md:px-12 py-24 border-t-[3px] border-ink mt-20">
        <div className="max-w-xl mx-auto mb-12 text-center md:text-left">
          <div className="font-mono text-[11px] font-semibold uppercase tracking-wide text-cobalt mb-3">// House rules</div>
          <h2 className="font-display font-bold uppercase text-3xl md:text-4xl">Three calls, every single trade.</h2>
        </div>
        <div className="grid md:grid-cols-3 border-[3px] border-ink">
          {[
            { n: "01", bg: "bg-[#EAF1FF]", title: "The Ingest", body: "Ten years of price history and today's live headlines, pulled at the same time — no waiting on one to finish the other." },
            { n: "02", bg: "bg-[#FFF6DE]", title: "The Read", body: "The LSTM reads the chart like a technician. FinBERT reads the headlines like a desk analyst — tone, not just keywords." },
            { n: "03", bg: "bg-[#E9F7EE]", title: "The Call", body: "Both reads land on one card. If they agree, it says so. If they don't, that's the signal — never buried." },
          ].map((r, i) => (
            <div key={i} className={`${r.bg} p-7 ${i < 2 ? "md:border-r-[3px] border-ink border-b-[3px] md:border-b-0" : ""}`}>
              <div className="font-display font-extrabold text-4xl -rotate-6 inline-block mb-3">{r.n}</div>
              <h3 className="font-display font-bold uppercase text-lg mb-2">{r.title}</h3>
              <p className="text-sm leading-relaxed text-inksoft">{r.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* NOTICE */}
      <section id="notice" className="max-w-[800px] mx-auto px-6 md:px-12 pb-24">
        <div className="border-[3px] border-ink bg-[#FFF6DE] p-5 flex gap-4">
          <span className="font-display font-extrabold text-xs bg-gold border-2 border-ink px-2.5 py-1 h-fit uppercase whitespace-nowrap">Notice</span>
          <p className="text-[13px] leading-relaxed text-inksoft">
            <strong className="text-ink">Forecasts are probabilistic, not guaranteed.</strong> Estimates are drawn
            from historical pattern and current sentiment — this is not financial advice.
            Every model is wrong sometimes; NeuroTrade's job is to show its reasoning, not
            hide its uncertainty. Verify independently before you act.
          </p>
        </div>
      </section>

      <footer className="flex flex-col md:flex-row justify-between items-center gap-4 px-6 md:px-12 py-6 border-t-[3px] border-ink">
        <div className="font-display font-extrabold text-lg uppercase">Neuro<span className="text-cobalt">Trade</span></div>
        <div className="flex gap-6 text-sm font-semibold">
          <a href="#rules" className="hover:text-cobalt">How It's Read</a>
          <a href="#notice" className="hover:text-cobalt">Notice</a>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
