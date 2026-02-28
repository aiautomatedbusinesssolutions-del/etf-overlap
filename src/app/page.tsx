"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { BarChart3, AlertCircle, X } from "lucide-react";
import { MOCK_ETFS, ETF } from "@/lib/data/mockEtfs";
import { getConcentrationData, calculateOverlap, getTopSector } from "@/lib/utils/financeMath";
import { getEtfHoldings } from "@/lib/services/fmpApi";
import EducationCard from "@/components/features/EducationCard";
import DualSearchBar from "@/components/features/DualSearchBar";
import WhaleChart from "@/components/features/WhaleChart";
import OverlapScoreboard from "@/components/features/OverlapScoreboard";
import FeeBattle from "@/components/features/FeeBattle";

export default function Home() {
  const [tickerA, setTickerA] = useState("SPY");
  const [tickerB, setTickerB] = useState("QQQ");
  const [etfA, setEtfA] = useState<ETF>(MOCK_ETFS["SPY"]);
  const [etfB, setEtfB] = useState<ETF>(MOCK_ETFS["QQQ"]);
  const [loadingA, setLoadingA] = useState(false);
  const [loadingB, setLoadingB] = useState(false);
  const [isLiveA, setIsLiveA] = useState(false);
  const [isLiveB, setIsLiveB] = useState(false);
  const [cachedA, setCachedA] = useState(false);
  const [cachedB, setCachedB] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // 1. Read URL params on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const a = params.get("a")?.toUpperCase();
    const b = params.get("b")?.toUpperCase();
    if (a && a !== tickerA) setTickerA(a);
    if (b && b !== tickerB) setTickerB(b);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Sync tickers to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (tickerA) params.set("a", tickerA);
    if (tickerB) params.set("b", tickerB);
    const url = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", url);
  }, [tickerA, tickerB]);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 5000);
  }, []);

  const resolveEtf = useCallback(async (
    ticker: string,
    fallbackTicker: string
  ): Promise<{ etf: ETF; message: string | null; isLive: boolean; cached: boolean }> => {
    // Check mock data first
    if (MOCK_ETFS[ticker]) {
      return { etf: MOCK_ETFS[ticker], message: null, isLive: false, cached: false };
    }

    // Try live API
    const result = await getEtfHoldings(ticker);

    if (result.data) {
      return { etf: result.data.etf, message: null, isLive: true, cached: result.data.cached };
    }

    // Error fallback
    const fallback = MOCK_ETFS[fallbackTicker];
    if (result.error === "rate_limited") {
      return {
        etf: fallback,
        message: `Alpha Vantage is busy. Falling back to ${fallbackTicker} mock data for now.`,
        isLive: false,
        cached: false,
      };
    }

    return {
      etf: fallback,
      message: `"${ticker}" not found — using ${fallbackTicker} mock data`,
      isLive: false,
      cached: false,
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoadingA(true);

    resolveEtf(tickerA, "SPY")
      .then(({ etf, message, isLive, cached }) => {
        if (cancelled) return;
        setEtfA(etf);
        setIsLiveA(isLive);
        setCachedA(cached);
        if (message) showToast(message);
      })
      .finally(() => {
        if (!cancelled) setLoadingA(false);
      });

    return () => { cancelled = true; };
  }, [tickerA, resolveEtf, showToast]);

  useEffect(() => {
    let cancelled = false;
    setLoadingB(true);

    resolveEtf(tickerB, "QQQ")
      .then(({ etf, message, isLive, cached }) => {
        if (cancelled) return;
        setEtfB(etf);
        setIsLiveB(isLive);
        setCachedB(cached);
        if (message) showToast(message);
      })
      .finally(() => {
        if (!cancelled) setLoadingB(false);
      });

    return () => { cancelled = true; };
  }, [tickerB, resolveEtf, showToast]);

  const concentrationA = useMemo(() => getConcentrationData(etfA.holdings, etfA.ticker, etfA.totalHoldingsCount), [etfA]);
  const concentrationB = useMemo(() => getConcentrationData(etfB.holdings, etfB.ticker, etfB.totalHoldingsCount), [etfB]);
  const topSectorA = useMemo(() => getTopSector(etfA.holdings), [etfA]);
  const topSectorB = useMemo(() => getTopSector(etfB.holdings), [etfB]);
  const overlapResult = useMemo(() => calculateOverlap(etfA, etfB), [etfA, etfB]);

  function handleSelect(side: "A" | "B", ticker: string) {
    const value = ticker.trim().toUpperCase();
    if (side === "A") setTickerA(value);
    else setTickerB(value);
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
          loadingA={loadingA}
          loadingB={loadingB}
        />

        {/* Concentration Donuts */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <div className="relative">
            {loadingA && <ChartSkeleton />}
            {!tickerA ? (
              <EmptyChartState />
            ) : (
              <WhaleChart
                data={concentrationA}
                ticker={etfA.ticker}
                name={etfA.name}
                topSector={topSectorA.sector}
                topSectorWeight={topSectorA.weight}
                etfSectors={etfA.sectors}
                isLive={isLiveA}
                cached={cachedA}
              />
            )}
          </div>
          <div className="relative">
            {loadingB && <ChartSkeleton />}
            {!tickerB ? (
              <EmptyChartState />
            ) : (
              <WhaleChart
                data={concentrationB}
                ticker={etfB.ticker}
                name={etfB.name}
                topSector={topSectorB.sector}
                topSectorWeight={topSectorB.weight}
                etfSectors={etfB.sectors}
                isLive={isLiveB}
                cached={cachedB}
              />
            )}
          </div>
        </div>
        <p className="text-center text-xs italic text-slate-600">
          Hover or tap the &quot;Others&quot; slice to see the hidden sector breakdown.
        </p>

        {/* Overlap Scoreboard */}
        <OverlapScoreboard
          result={overlapResult}
          tickerA={tickerA}
          tickerB={tickerB}
        />

        {/* Fee Battle */}
        <FeeBattle etfA={etfA} etfB={etfB} />
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
          <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-slate-900 px-4 py-2.5 shadow-xl">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
            <p className="text-sm text-slate-300">{toast}</p>
            <button onClick={() => setToast(null)} className="ml-1 text-slate-500 hover:text-slate-300">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}

function ChartSkeleton() {
  return (
    <div className="absolute inset-0 z-10 rounded-xl border border-slate-800 bg-slate-900 p-4">
      {/* Header skeleton */}
      <div className="mb-2 flex flex-col items-center gap-1.5">
        <div className="h-5 w-12 animate-pulse rounded bg-slate-800" />
        <div className="h-3 w-32 animate-pulse rounded bg-slate-800" />
        <div className="h-3 w-24 animate-pulse rounded bg-slate-800" />
      </div>
      {/* Donut skeleton */}
      <div className="flex justify-center py-4">
        <div className="h-[170px] w-[170px] animate-pulse rounded-full border-[30px] border-slate-800 bg-slate-900" />
      </div>
      {/* Legend skeleton */}
      <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1.5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 animate-pulse rounded-sm bg-slate-800" />
            <div className="h-3 w-20 animate-pulse rounded bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyChartState() {
  return (
    <div className="flex items-center justify-center rounded-xl border border-dashed border-slate-700 bg-slate-900/50 p-4 py-20">
      <div className="text-center">
        <BarChart3 className="mx-auto mb-2 h-8 w-8 text-slate-700" />
        <p className="text-sm text-slate-500">Search for an ETF to see the Whales</p>
      </div>
    </div>
  );
}
