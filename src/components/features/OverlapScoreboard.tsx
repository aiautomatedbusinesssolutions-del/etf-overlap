"use client";

import { AlertTriangle, Layers } from "lucide-react";
import { OverlapResult } from "@/lib/utils/financeMath";

interface OverlapScoreboardProps {
  result: OverlapResult;
  tickerA: string;
  tickerB: string;
}

function getOverlapColor(pct: number) {
  if (pct >= 40) return "text-rose-400";
  if (pct >= 20) return "text-amber-400";
  return "text-emerald-400";
}

function getOverlapLabel(pct: number) {
  if (pct >= 40) return "High Overlap";
  if (pct >= 20) return "Moderate Overlap";
  return "Low Overlap";
}

function getOverlapGlow(pct: number) {
  if (pct >= 40) return "shadow-rose-500/20";
  if (pct >= 20) return "shadow-amber-500/20";
  return "shadow-emerald-500/20";
}

function getOverlapBorder(pct: number) {
  if (pct >= 40) return "border-rose-500/30";
  if (pct >= 20) return "border-amber-500/30";
  return "border-emerald-500/30";
}

function getSectorWarning(result: OverlapResult): string | null {
  const totalShared = result.sharedHoldings.reduce((s, h) => s + h.sharedWeight, 0);
  if (totalShared === 0) return null;

  const sectorTotals: Record<string, number> = {};
  for (const h of result.sharedHoldings) {
    sectorTotals[h.sector] = (sectorTotals[h.sector] || 0) + h.sharedWeight;
  }

  for (const [sector, weight] of Object.entries(sectorTotals)) {
    if (weight / totalShared > 0.5) {
      return sector;
    }
  }
  return null;
}

export default function OverlapScoreboard({ result, tickerA, tickerB }: OverlapScoreboardProps) {
  const pct = result.overlapPercentage;
  const warningSector = getSectorWarning(result);

  return (
    <div className="space-y-4">
      {/* Overlap Hero */}
      <div
        className={`rounded-xl border bg-slate-900 p-6 text-center shadow-lg ${getOverlapGlow(pct)} ${getOverlapBorder(pct)}`}
      >
        <div className="mb-2 flex items-center justify-center gap-2">
          <Layers className="h-5 w-5 text-sky-400" />
          <span className="text-sm font-medium text-slate-400">
            {tickerA} + {tickerB} Overlap
          </span>
        </div>
        <p className={`text-5xl font-bold ${getOverlapColor(pct)}`}>
          {pct.toFixed(1)}%
        </p>
        <p className={`mt-1 text-sm font-medium ${getOverlapColor(pct)}`}>
          {getOverlapLabel(pct)}
        </p>
        <p className="mt-2 text-xs text-slate-500">
          {result.sharedHoldings.length} shared holding{result.sharedHoldings.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Sector Warning */}
      {warningSector && (
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <p className="text-sm font-semibold text-amber-400">
              High Sector Concentration
            </p>
            <p className="mt-1 text-xs text-slate-400">
              These funds are heavily overlapping in {warningSector}. If that
              sector drops, both funds will likely move together.
            </p>
          </div>
        </div>
      )}

      {/* Shared DNA Table */}
      {result.sharedHoldings.length > 0 && (
        <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-800">
            <h3 className="text-sm font-semibold text-slate-100">Shared DNA</h3>
            <p className="text-xs text-slate-500">Stocks held in both funds, sorted by overlap</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-xs text-slate-400">
                  <th className="px-4 py-2.5 text-left font-medium">Stock</th>
                  <th className="px-4 py-2.5 text-right font-medium">% in {tickerA}</th>
                  <th className="px-4 py-2.5 text-right font-medium">% in {tickerB}</th>
                  <th className="px-4 py-2.5 text-right font-medium">Shared</th>
                </tr>
              </thead>
              <tbody>
                {result.sharedHoldings.map((h, i) => (
                  <tr
                    key={h.ticker}
                    className={`border-b border-slate-800/50 ${i % 2 === 0 ? "bg-slate-900" : "bg-slate-900/50"}`}
                  >
                    <td className="px-4 py-2.5">
                      <span className="font-medium text-sky-400">{h.ticker}</span>
                      <span className="ml-2 text-slate-400 hidden sm:inline">{h.name}</span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-300">{h.weightA}%</td>
                    <td className="px-4 py-2.5 text-right text-slate-300">{h.weightB}%</td>
                    <td className="px-4 py-2.5 text-right font-semibold text-amber-400">
                      {h.sharedWeight}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
