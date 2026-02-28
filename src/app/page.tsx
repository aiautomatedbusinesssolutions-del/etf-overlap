"use client";

import { useState } from "react";
import { BarChart3 } from "lucide-react";
import { MOCK_ETFS } from "@/lib/data/mockEtfs";
import { getConcentrationData, calculateOverlap } from "@/lib/utils/financeMath";
import EducationCard from "@/components/features/EducationCard";
import DualSearchBar from "@/components/features/DualSearchBar";
import WhaleChart from "@/components/features/WhaleChart";
import OverlapScoreboard from "@/components/features/OverlapScoreboard";
import FeeBattle from "@/components/features/FeeBattle";

export default function Home() {
  const [tickerA, setTickerA] = useState("SPY");
  const [tickerB, setTickerB] = useState("QQQ");

  const etfA = MOCK_ETFS[tickerA];
  const etfB = MOCK_ETFS[tickerB];

  const concentrationA = etfA ? getConcentrationData(etfA.holdings) : null;
  const concentrationB = etfB ? getConcentrationData(etfB.holdings) : null;
  const overlapResult = etfA && etfB ? calculateOverlap(etfA, etfB) : null;

  function handleSelect(side: "A" | "B", ticker: string) {
    if (side === "A") setTickerA(ticker);
    else setTickerB(ticker);
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Hero */}
        <div className="text-center">
          <div className="mb-3 flex items-center justify-center gap-3">
            <BarChart3 className="h-8 w-8 text-sky-400" />
            <h1 className="text-3xl font-bold text-slate-100">ETF Overlap</h1>
          </div>
          <p className="text-slate-400">
            Compare funds. Find overlap. Invest smarter.
          </p>
        </div>

        {/* Education Card */}
        <EducationCard />

        {/* Dual Search Bar */}
        <DualSearchBar
          onSelect={handleSelect}
          selectedA={tickerA}
          selectedB={tickerB}
        />

        {/* Concentration Donuts */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {concentrationA ? (
            <WhaleChart data={concentrationA} ticker={etfA.ticker} name={etfA.name} />
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-500">
              Select a valid ticker for Fund A
            </div>
          )}
          {concentrationB ? (
            <WhaleChart data={concentrationB} ticker={etfB.ticker} name={etfB.name} />
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 text-center text-slate-500">
              Select a valid ticker for Fund B
            </div>
          )}
        </div>

        {/* Overlap Scoreboard */}
        {overlapResult && (
          <OverlapScoreboard
            result={overlapResult}
            tickerA={tickerA}
            tickerB={tickerB}
          />
        )}

        {/* Fee Battle */}
        {etfA && etfB && <FeeBattle etfA={etfA} etfB={etfB} />}
      </div>
    </main>
  );
}
