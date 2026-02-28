"use client";

import { useState } from "react";
import { PieChart, Pie, Cell, Tooltip } from "recharts";
import { ConcentrationItem } from "@/lib/utils/financeMath";

const COLORS = [
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
  "#475569", // slate-600 (Others)
];

interface WhaleChartProps {
  data: ConcentrationItem[];
  ticker: string;
  name: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload }: { active?: boolean; payload?: any[] }) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 shadow-xl">
      <p className="text-sm font-medium text-slate-100">{item.name}</p>
      <p className="text-xs text-slate-400">{item.value.toFixed(1)}%</p>
    </div>
  );
}

export default function WhaleChart({ data, ticker, name }: WhaleChartProps) {
  const [hovered, setHovered] = useState<ConcentrationItem | null>(null);
  const [showOthers, setShowOthers] = useState(false);

  const othersEntry = data.find((d) => d.name === "Others");

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <div className="mb-2 text-center">
        <span className="text-lg font-bold text-sky-400">{ticker}</span>
        <p className="text-xs text-slate-400 truncate">{name}</p>
      </div>

      <div className="relative flex justify-center h-56">
        <PieChart width={220} height={220}>
          <Pie
            data={data}
            cx={110}
            cy={110}
            innerRadius={55}
            outerRadius={85}
            dataKey="weight"
            onMouseLeave={() => {
              setHovered(null);
              setShowOthers(false);
            }}
          >
            {data.map((entry, i) => (
              <Cell
                key={i}
                fill={COLORS[i % COLORS.length]}
                stroke="transparent"
                className="cursor-pointer transition-opacity"
                opacity={hovered && hovered.name !== entry.name ? 0.4 : 1}
                onMouseEnter={() => {
                  setHovered(entry);
                  setShowOthers(entry.name === "Others");
                }}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>

        {/* Center label */}
        {hovered && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-sm font-semibold text-slate-100">
                {hovered.name.length > 16 ? hovered.name.slice(0, 14) + "..." : hovered.name}
              </p>
              <p className="text-xs text-slate-400">{hovered.weight.toFixed(1)}%</p>
            </div>
          </div>
        )}

        {/* Others tooltip */}
        {showOthers && othersEntry && (
          <div className="absolute right-0 top-0 z-10 w-44 rounded-lg border border-slate-700 bg-slate-800 p-3 shadow-xl">
            <p className="mb-2 text-xs font-semibold text-slate-300">
              Others ({othersEntry.weight.toFixed(1)}%)
            </p>
            <div className="max-h-32 space-y-1 overflow-y-auto text-xs text-slate-400">
              <p>Remaining ~490 holdings each under 1.5% weight</p>
            </div>
          </div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-2 grid grid-cols-2 gap-x-2 gap-y-1">
        {data.slice(0, 5).map((item, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
            <span
              className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
              style={{ backgroundColor: COLORS[i] }}
            />
            <span className="truncate">{item.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
