"use client";

import { useState, useRef, useEffect } from "react";
import { Search } from "lucide-react";
import { MOCK_ETFS } from "@/lib/data/mockEtfs";

const etfKeys = Object.keys(MOCK_ETFS);

interface DualSearchBarProps {
  onSelect: (side: "A" | "B", ticker: string) => void;
  selectedA: string;
  selectedB: string;
}

function TickerInput({
  label,
  value,
  selected,
  onSelect,
}: {
  label: string;
  value: string;
  selected: string;
  onSelect: (ticker: string) => void;
}) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const filtered = etfKeys.filter((t) =>
    t.toLowerCase().startsWith(query.toLowerCase())
  );

  useEffect(() => {
    setQuery(selected);
  }, [selected]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <div ref={ref} className="relative flex-1">
      <label className="mb-1 block text-xs font-medium text-slate-400">
        {label}
      </label>
      <div className="flex items-center rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 focus-within:border-sky-500 transition-colors">
        <Search className="mr-2 h-4 w-4 text-slate-500" />
        <input
          type="text"
          placeholder="e.g. SPY"
          className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value.toUpperCase());
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
        />
      </div>
      {open && filtered.length > 0 && (
        <div className="absolute z-20 mt-1 w-full rounded-lg border border-slate-700 bg-slate-800 py-1 shadow-xl">
          {filtered.map((ticker) => (
            <button
              key={ticker}
              className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-slate-700 transition-colors"
              onClick={() => {
                onSelect(ticker);
                setQuery(ticker);
                setOpen(false);
              }}
            >
              <span className="font-medium text-sky-400">{ticker}</span>
              <span className="text-xs text-slate-400 truncate ml-2">
                {MOCK_ETFS[ticker].name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DualSearchBar({
  onSelect,
  selectedA,
  selectedB,
}: DualSearchBarProps) {
  return (
    <div className="flex gap-3">
      <TickerInput
        label="Fund A"
        value={selectedA}
        selected={selectedA}
        onSelect={(t) => onSelect("A", t)}
      />
      <TickerInput
        label="Fund B"
        value={selectedB}
        selected={selectedB}
        onSelect={(t) => onSelect("B", t)}
      />
    </div>
  );
}
