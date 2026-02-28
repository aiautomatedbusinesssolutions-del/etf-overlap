"use client";

import { useState } from "react";
import { Lightbulb, ChevronDown, ChevronUp } from "lucide-react";

export default function EducationCard() {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-3 text-left"
      >
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-400" />
          <span className="font-semibold text-slate-100">
            What is the &quot;Overlap Trap&quot;?
          </span>
        </div>
        {open ? (
          <ChevronUp className="h-4 w-4 text-slate-400" />
        ) : (
          <ChevronDown className="h-4 w-4 text-slate-400" />
        )}
      </button>

      {open && (
        <div className="mt-3 space-y-2 border-t border-slate-800 pt-3 text-sm text-slate-400">
          <p>
            Many investors buy multiple ETFs thinking they&apos;re diversified &mdash;
            but those funds often hold the <span className="text-amber-400 font-medium">same
            companies</span>.
          </p>
          <p>
            For example, <span className="text-sky-400 font-medium">SPY</span> and{" "}
            <span className="text-sky-400 font-medium">QQQ</span> both hold Apple,
            Microsoft, and NVIDIA in their top positions. If tech stocks drop,
            both funds likely drop together.
          </p>
          <p>
            This tool helps you spot that hidden overlap so you can
            make smarter decisions about where your money actually goes.
          </p>
        </div>
      )}
    </div>
  );
}
