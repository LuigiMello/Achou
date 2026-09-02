"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FaqAccordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="flex flex-col gap-2.5">
      {items.map((item, i) => (
        <div key={item.q} className="overflow-hidden rounded-2xl border-2 border-line bg-[var(--paper-raised)]">
          <button
            type="button"
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
          >
            <span className="font-display font-semibold">{item.q}</span>
            <ChevronDown className={`h-4 w-4 shrink-0 text-clay transition-transform ${open === i ? "rotate-180" : ""}`} aria-hidden />
          </button>
          {open === i && <p className="px-5 pb-4 text-sm leading-relaxed text-ink-soft">{item.a}</p>}
        </div>
      ))}
    </div>
  );
}
