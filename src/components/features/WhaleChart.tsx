"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { X } from "lucide-react";
import { ConcentrationItem, SectorBreakdown } from "@/lib/utils/financeMath";
import { ETF_HOLDINGS_COUNT, BOND_ETFS } from "@/lib/constants/etfReference";

const SLICE_COLORS = [
  "#38bdf8", // sky-400
  "#818cf8", // indigo-400
  "#a78bfa", // violet-400
  "#c084fc", // purple-400
  "#e879f9", // fuchsia-400
  "#f472b6", // pink-400
  "#fb7185", // rose-400
  "#fb923c", // orange-400
  "#fbbf24", // amber-400
  "#34d399", // emerald-400
];
const OTHERS_COLOR = "#475569"; // slate-600

/** Deterministic color for a holding name — same name always gets same color across charts. */
function getColorForName(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
  }
  return SLICE_COLORS[Math.abs(hash) % SLICE_COLORS.length];
}

function getSliceColor(name: string): string {
  if (name === "Others") return OTHERS_COLOR;
  return getColorForName(name);
}

interface WhaleChartProps {
  data: ConcentrationItem[];
  ticker: string;
  name: string;
  topSector: string;
  topSectorWeight: number;
  etfSectors?: { sector: string; weight: number }[];
  isLive?: boolean;
  cached?: boolean;
}

function getConcentrationNote(weight: number): { text: string; color: string } | null {
  if (weight > 50) {
    return {
      text: "This fund is highly diversified; most assets are outside the Top 10.",
      color: "text-emerald-400",
    };
  }
  if (weight < 20) {
    return {
      text: "This fund is top-heavy; highly concentrated in the Whales.",
      color: "text-amber-400",
    };
  }
  return null;
}

function hasUsableSectorData(sectorMix?: SectorBreakdown[]): boolean {
  if (!sectorMix || sectorMix.length === 0) return false;
  return sectorMix.some(
    (s) => s.sector !== "Uncategorized" && s.sector !== "Other Sectors"
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  if (item.name === "Others") return null;
  return (
    <div className="rounded-lg border border-slate-700/80 bg-slate-800/90 px-3 py-2 shadow-xl backdrop-blur-sm">
      <p className="text-sm font-medium text-slate-100">{item.name}</p>
      <p className="text-xs text-slate-400">{item.value.toFixed(1)}%</p>
    </div>
  );
}

export default function WhaleChart({ data, ticker, name, topSector, topSectorWeight, etfSectors, isLive, cached }: WhaleChartProps) {
  const [selected, setSelected] = useState<ConcentrationItem | null>(null);
  const [showOthers, setShowOthers] = useState(false);
  const [tapped, setTapped] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const othersEntry = data.find((d) => d.name === "Others");

  const clearSelection = useCallback(() => {
    setSelected(null);
    setShowOthers(false);
    setTapped(false);
  }, []);

  // Click-away listener
  useEffect(() => {
    if (!tapped) return;

    function handleClickOutside(e: MouseEvent | TouchEvent) {
      if (chartRef.current && !chartRef.current.contains(e.target as Node)) {
        clearSelection();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [tapped, clearSelection]);

  const handleSliceTap = useCallback((entry: ConcentrationItem) => {
    setSelected((prev) => {
      if (prev?.name === entry.name) {
        setShowOthers(false);
        setTapped(false);
        return null;
      }
      setShowOthers(entry.name === "Others");
      setTapped(true);
      return entry;
    });
  }, []);

  // Determine which sector data to display in the Others tooltip
  const holdingSectors = othersEntry?.othersSectorMix;
  const useHoldingSectors = hasUsableSectorData(holdingSectors);
  const useEtfSectors = !useHoldingSectors && etfSectors && etfSectors.length > 0;
  const displaySectors = useHoldingSectors
    ? holdingSectors!
    : useEtfSectors
      ? etfSectors!
      : null;

  // Refine sector label based on data source
  let sectorLabel: string | null = null;
  if (useHoldingSectors) {
    sectorLabel = "Sector Mix";
  } else if (useEtfSectors) {
    sectorLabel = isLive ? "Top 10 Sector Concentration" : "Fund-Level Sectors";
  }

  const concentrationNote = othersEntry ? getConcentrationNote(othersEntry.weight) : null;
  const totalHoldings = othersEntry ? (othersEntry.othersCount ?? 0) + 10 : 0;

  // Bond ETF: 0 real holdings in the data array (only an "Others" bucket at 100%)
  const isBondEtf = BOND_ETFS.has(ticker.toUpperCase());
  const hasNoHoldings = data.length <= 1 && data[0]?.name === "Others";
  const refCount = ETF_HOLDINGS_COUNT[ticker.toUpperCase()];

  const cacheBadge = cached && (
    <span className="ml-1.5 inline-block rounded bg-emerald-500/15 px-1 py-0.5 text-[9px] font-medium leading-none text-emerald-400">
      Cached
    </span>
  );

  if (hasNoHoldings) {
    return (
      <div ref={chartRef} className="rounded-xl border border-slate-800 bg-slate-900 p-4 transition-colors hover:border-slate-700">
        <div className="mb-2 text-center">
          <span className="text-lg font-bold text-sky-400">{ticker}</span>
          {cacheBadge}
          <p className="text-xs text-slate-400 truncate">{name}</p>
        </div>
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <p className="text-sm text-slate-300">
            {isBondEtf
              ? "Bond ETF detected. Deep holding analysis is limited for fixed-income assets."
              : "No individual holdings data available for this fund."}
          </p>
          {refCount && (
            <p className="mt-2 text-xs text-slate-500">
              Total Holdings: <span className="font-medium text-slate-400">{refCount.toLocaleString()}</span>
            </p>
          )}
          {etfSectors && etfSectors.length > 0 && (
            <div className="mt-4 w-full max-w-[200px] space-y-1.5">
              <p className="text-xs font-medium text-slate-400">Fund-Level Sectors</p>
              {etfSectors.slice(0, 5).map((s) => (
                <div key={s.sector} className="flex items-center justify-between text-xs">
                  <span className="text-slate-300 truncate mr-2">{s.sector}</span>
                  <span className="shrink-0 text-sky-400 font-medium">{s.weight.toFixed(1)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div ref={chartRef} className="rounded-xl border border-slate-800 bg-slate-900 p-4 transition-colors hover:border-slate-700">
      {/* Header with Top Sector */}
      <div className="mb-2 text-center">
        <span className="text-lg font-bold text-sky-400">{ticker}</span>
        {cacheBadge}
        <p className="text-xs text-slate-400 truncate">{name}</p>
        <p className="mt-1 text-xs">
          <span className="text-slate-500">Primary Sector: </span>
          <span className="font-medium text-indigo-400">
            {topSector} ({topSectorWeight}%)
          </span>
        </p>
      </div>

      <div className="relative flex justify-center h-56">
        <PieChart width={220} height={220}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            dataKey="weight"
            onMouseLeave={() => {
              if (!tapped) clearSelection();
            }}
          >
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={getSliceColor(entry.name)}
                stroke={selected?.name === entry.name ? "#f1f5f9" : "transparent"}
                strokeWidth={selected?.name === entry.name ? 2 : 0}
                className="cursor-pointer"
                style={{
                  opacity: selected && selected.name !== entry.name ? 0.4 : 1,
                  transition: "opacity 0.2s ease, stroke-width 0.2s ease",
                }}
                onMouseEnter={() => {
                  if (!tapped) {
                    setSelected(entry);
                    setShowOthers(entry.name === "Others");
                  }
                }}
                onClick={() => handleSliceTap(entry)}
              />
            ))}
          </Pie>
          <Tooltip
            content={<CustomTooltip />}
            allowEscapeViewBox={{ x: true, y: true }}
          />
        </PieChart>

        {/* Center label */}
        {selected && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-100">
                {selected.name.length > 16 ? selected.name.slice(0, 14) + "..." : selected.name}
              </p>
              <p className="text-xs text-slate-400">{selected.weight.toFixed(1)}%</p>
            </div>
          </div>
        )}

        {/* Others tooltip */}
        {showOthers && othersEntry && (
          <div className="absolute left-1/2 -translate-x-1/2 top-0 z-10 w-52 rounded-lg border border-slate-700/80 bg-slate-800/90 p-3 shadow-xl backdrop-blur-sm">
            <div className="mb-1 flex items-center justify-between">
              <p className="text-xs font-semibold text-slate-200">
                Remaining Fund Composition
              </p>
              <button
                onClick={clearSelection}
                className="rounded p-0.5 text-slate-500 hover:text-slate-300 transition-colors"
                aria-label="Close"
              >
                <X className="h-3 w-3" />
              </button>
            </div>

            {/* Stats */}
            <div className="mb-2 space-y-0.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Total Weight</span>
                <span className="font-medium text-slate-300">{othersEntry.weight.toFixed(1)}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Total Holdings</span>
                <span className="font-medium text-slate-300">
                  {totalHoldings.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Concentration note */}
            {concentrationNote && (
              <p className={`mb-2 text-xs italic ${concentrationNote.color}`}>
                {concentrationNote.text}
              </p>
            )}

            {/* Sector breakdown */}
            {displaySectors && sectorLabel ? (
              <div className="space-y-1.5 border-t border-slate-700 pt-2">
                <p className="text-xs font-medium text-slate-400">{sectorLabel}</p>
                {displaySectors.slice(0, 5).map((s) => (
                  <div key={s.sector} className="flex items-center justify-between text-xs">
                    <span className="text-slate-300 truncate mr-2">{s.sector}</span>
                    <span className="shrink-0 text-sky-400 font-medium">{s.weight.toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="border-t border-slate-700 pt-2">
                <p className="text-xs text-slate-500 italic">
                  Deep Sector Analysis requires Full Holdings Data
                </p>
              </div>
            )}

            <p className="mt-2 text-center text-xs italic text-slate-600 sm:hidden">
              Tap background to close
            </p>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
        {data.slice(0, 5).map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: getSliceColor(item.name) }}
            />
            <span className="truncate">{item.name}</span>
          </div>
        ))}
      </div>

      {/* Free-tier disclaimer */}
      {isLive && (
        <p className="mt-2 text-center text-[10px] leading-tight text-amber-500/70">
          Showing Top 10 &quot;Whale&quot; holdings (Free API Tier). Full{" "}
          {totalHoldings > 100 ? totalHoldings.toLocaleString() + "+" : ""} overlap analysis
          requires CSV upload.
        </p>
      )}
    </div>
  );
}
