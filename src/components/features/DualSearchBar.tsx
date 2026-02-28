"use client";

import { useState, useRef, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { MOCK_ETFS } from "@/lib/data/mockEtfs";

const etfKeys = Object.keys(MOCK_ETFS);

interface DualSearchBarProps {
  onSelect: (side: "A" | "B", ticker: string) => void;
  selectedA: string;
  selectedB: string;
  loadingA?: boolean;
  loadingB?: boolean;
}

function TickerInput({
  label,
  selected,
  onSelect,
  loading,
}: {
  label: string;
  selected: string;
  onSelect: (ticker: string) => void;
  loading?: boolean;
}) {
  const [query, setQuery] = useState(selected);
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

  function handleSubmit() {
    const trimmed = query.trim().toUpperCase();
    if (trimmed.length > 0) {
      onSelect(trimmed);
      setOpen(false);
    }
  }

  return (
    <div ref={ref} className="relative flex-1">
      <label className="mb-1 block text-xs font-medium text-slate-400">
        {label}
      </label>
      <div className="flex items-center rounded-lg border border-slate-700 bg-slate-800 px-3 py-2.5 focus-within:border-sky-500 transition-colors">
        {loading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-sky-400" />
        ) : (
          <Search className="mr-2 h-4 w-4 text-slate-500" />
        )}
        <input
          type="text"
          placeholder="e.g. SPY, VTI, ARKK"
          aria-label={`Search ETF for ${label}`}
          className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value.toUpperCase());
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
        />
      </div>
      {open && (
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
          {query.trim().length > 0 && !etfKeys.includes(query.trim().toUpperCase()) && (
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-700 transition-colors border-t border-slate-700"
              onClick={handleSubmit}
            >
              <Search className="h-3.5 w-3.5 text-sky-400" />
              <span className="text-slate-300">
                Search <span className="font-medium text-sky-400">{query.trim().toUpperCase()}</span> live
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function DualSearchBar({
  onSelect,
  selectedA,
  selectedB,
  loadingA,
  loadingB,
}: DualSearchBarProps) {
  return (
    <div className="flex gap-3">
      <TickerInput
        label="Fund A"
        selected={selectedA}
        onSelect={(t) => onSelect("A", t)}
        loading={loadingA}
      />
      <TickerInput
        label="Fund B"
        selected={selectedB}
        onSelect={(t) => onSelect("B", t)}
        loading={loadingB}
      />
    </div>
  );
}
