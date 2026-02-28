"use client";

import { useState } from "react";
import { DollarSign, TrendingDown } from "lucide-react";
import { ETF } from "@/lib/data/mockEtfs";
import { calculateFees } from "@/lib/utils/financeMath";

interface FeeBattleProps {
  etfA: ETF;
  etfB: ETF;
}

export default function FeeBattle({ etfA, etfB }: FeeBattleProps) {
  const [years, setYears] = useState(10);
  const principal = 10000;

  const feesA = calculateFees(principal, etfA.expenseRatio, years);
  const feesB = calculateFees(principal, etfB.expenseRatio, years);
  const maxFee = Math.max(feesA, feesB, 1);
  const savings = Math.round(Math.abs(feesA - feesB) * 100) / 100;

  const cheaper = feesA <= feesB ? etfA : etfB;
  const expensive = feesA <= feesB ? etfB : etfA;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900 p-5">
        <div className="mb-4 flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-sky-400" />
          <h2 className="text-lg font-bold text-slate-100">$10,000 Fee Battle</h2>
        </div>

        {/* Slider */}
        <div className="mb-6">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-sm text-slate-400">Investment Horizon</span>
            <span className="text-2xl font-bold text-sky-400">
              {years} <span className="text-sm font-normal text-slate-400">year{years !== 1 ? "s" : ""}</span>
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={30}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className="fee-slider w-full cursor-pointer"
          />
          <div className="mt-1 flex justify-between text-xs text-slate-600">
            <span>1 yr</span>
            <span>15 yrs</span>
            <span>30 yrs</span>
          </div>
        </div>

        {/* Fee Cards */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <FeeCard
            ticker={etfA.ticker}
            name={etfA.name}
            expenseRatio={etfA.expenseRatio}
            fees={feesA}
            barPct={(feesA / maxFee) * 100}
            isWinner={feesA <= feesB}
          />
          <FeeCard
            ticker={etfB.ticker}
            name={etfB.name}
            expenseRatio={etfB.expenseRatio}
            fees={feesB}
            barPct={(feesB / maxFee) * 100}
            isWinner={feesB <= feesA}
          />
        </div>
      </div>

      {/* Pro Tip */}
      {savings > 0 && (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
          <TrendingDown className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          <div>
            <p className="text-sm font-semibold text-emerald-400">Pro Tip</p>
            <p className="mt-1 text-sm text-slate-300">
              By choosing{" "}
              <span className="font-semibold text-emerald-400">{cheaper.ticker}</span>{" "}
              over{" "}
              <span className="font-semibold text-rose-400">{expensive.ticker}</span>,
              you could potentially save{" "}
              <span className="font-semibold text-emerald-400">
                ${savings.toLocaleString()}
              </span>{" "}
              in management fees over {years} year{years !== 1 ? "s" : ""}.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function FeeCard({
  ticker,
  name,
  expenseRatio,
  fees,
  barPct,
  isWinner,
}: {
  ticker: string;
  name: string;
  expenseRatio: number;
  fees: number;
  barPct: number;
  isWinner: boolean;
}) {
  return (
    <div
      className={`rounded-lg border p-4 ${
        isWinner
          ? "border-emerald-500/30 bg-emerald-500/5"
          : "border-slate-700 bg-slate-800/50"
      }`}
    >
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-sm font-bold text-sky-400">{ticker}</span>
        <span className="text-xs text-slate-500">{expenseRatio}% ER</span>
      </div>
      <p className="mb-3 truncate text-xs text-slate-500">{name}</p>

      <p className={`text-2xl font-bold ${isWinner ? "text-emerald-400" : "text-rose-400"}`}>
        ${fees.toLocaleString()}
      </p>
      <p className="mb-2 text-xs text-slate-500">total fees paid</p>

      {/* Fee Bar */}
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-700">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isWinner ? "bg-emerald-500" : "bg-rose-500"
          }`}
          style={{ width: `${barPct}%` }}
        />
      </div>
    </div>
  );
}
