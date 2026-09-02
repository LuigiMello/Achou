"use client";

import { useEffect, useRef, useState } from "react";
import { Settings2, Sun, Moon, MonitorCog, Minus, Plus, Contrast, Waves } from "lucide-react";
import { useA11y } from "@/components/providers";
import { cn } from "@/lib/utils";

const THEME_OPTIONS = [
  { value: "light" as const, label: "Claro", icon: Sun },
  { value: "dark" as const, label: "Escuro", icon: Moon },
  { value: "system" as const, label: "Auto", icon: MonitorCog },
];

const SCALES = [1, 1.125, 1.25, 1.4] as const;

export function PreferencesMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const {
    theme,
    setTheme,
    fontScale,
    setFontScale,
    highContrast,
    toggleHighContrast,
    reduceMotion,
    toggleReduceMotion,
  } = useA11y();

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  const scaleIndex = SCALES.indexOf(fontScale);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Preferências de tema e acessibilidade"
        title="Preferências"
        className="grid h-10 w-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ink/6 hover:text-clay"
      >
        <Settings2 className="h-[18px] w-[18px]" aria-hidden />
      </button>

      {open && (
        <div
          role="menu"
          aria-label="Preferências"
          className="rise-in absolute right-0 top-12 rounded-2xl border border-line bg-[var(--paper-raised)] p-4 shadow-xl"
          style={{ width: 300 }}
        >
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-soft">Tema</p>
          <div className="mb-5 grid grid-cols-3 gap-1.5">
            {THEME_OPTIONS.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => setTheme(o.value)}
                aria-pressed={theme === o.value}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-xl border py-2.5 text-xs font-semibold transition-colors",
                  theme === o.value ? "border-clay bg-clay/8 text-clay" : "border-line text-ink-soft hover:border-clay/40"
                )}
              >
                <o.icon className="h-4 w-4" aria-hidden />
                {o.label}
              </button>
            ))}
          </div>

          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-soft">Tamanho do texto</p>
          <div className="mb-4 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFontScale(SCALES[Math.max(0, scaleIndex - 1)])}
              disabled={scaleIndex === 0}
              className="grid h-8 w-8 place-items-center rounded-full border border-line disabled:opacity-30"
              aria-label="Diminuir texto"
            >
              <Minus className="h-3.5 w-3.5" aria-hidden />
            </button>
            <div className="flex flex-1 gap-1" aria-hidden>
              {SCALES.map((s, i) => (
                <span key={s} className={cn("h-1.5 flex-1 rounded-full", i <= scaleIndex ? "bg-clay" : "bg-line")} />
              ))}
            </div>
            <button
              type="button"
              onClick={() => setFontScale(SCALES[Math.min(SCALES.length - 1, scaleIndex + 1)])}
              disabled={scaleIndex === SCALES.length - 1}
              className="grid h-8 w-8 place-items-center rounded-full border border-line disabled:opacity-30"
              aria-label="Aumentar texto"
            >
              <Plus className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>

          <label className="flex items-center justify-between gap-3 py-1.5 cursor-pointer">
            <span className="flex items-center gap-2 text-sm font-medium">
              <Contrast className="h-4 w-4" aria-hidden /> Alto contraste
            </span>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={toggleHighContrast}
              className="h-5 w-9 appearance-none rounded-full bg-line checked:bg-clay relative transition-colors before:absolute before:left-0.5 before:top-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-transform checked:before:translate-x-4"
            />
          </label>

          <label className="flex items-center justify-between gap-3 py-1.5 cursor-pointer">
            <span className="flex items-center gap-2 text-sm font-medium">
              <Waves className="h-4 w-4" aria-hidden /> Reduzir animações
            </span>
            <input
              type="checkbox"
              checked={reduceMotion}
              onChange={toggleReduceMotion}
              className="h-5 w-9 appearance-none rounded-full bg-line checked:bg-clay relative transition-colors before:absolute before:left-0.5 before:top-0.5 before:h-4 before:w-4 before:rounded-full before:bg-white before:transition-transform checked:before:translate-x-4"
            />
          </label>
        </div>
      )}
    </div>
  );
}
