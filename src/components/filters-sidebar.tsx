"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { BRAZIL_STATES, CONDITIONS } from "@/lib/utils";
import type { Category } from "@/generated/prisma";
import { Button } from "@/components/ui/button";

export function FiltersSidebar({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [open, setOpen] = useState(false);

  const categoria = searchParams.get("categoria") ?? "";
  const estado = searchParams.get("estado") ?? "";
  const condicao = searchParams.get("condicao") ?? "";
  const min = searchParams.get("min") ?? "";
  const max = searchParams.get("max") ?? "";
  const sort = searchParams.get("sort") ?? "recent";

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  function clearAll() {
    const q = searchParams.get("q");
    router.push(q ? `${pathname}?q=${encodeURIComponent(q)}` : pathname);
  }

  const activeCount = [categoria, estado, condicao, min, max].filter(Boolean).length;

  const content = (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <p className="font-display text-base font-semibold">Filtros</p>
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-xs font-semibold text-clay hover:underline">
            Limpar ({activeCount})
          </button>
        )}
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-soft">Ordenar por</p>
        <select
          value={sort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="w-full rounded-xl border-2 border-line bg-[var(--paper-raised)] px-3 py-2 text-sm outline-none focus:border-clay"
        >
          <option value="recent">Mais recentes</option>
          <option value="price_asc">Menor preço</option>
          <option value="price_desc">Maior preço</option>
          <option value="popular">Mais vistos</option>
        </select>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-soft">Categoria</p>
        <select
          value={categoria}
          onChange={(e) => updateParam("categoria", e.target.value)}
          className="w-full rounded-xl border-2 border-line bg-[var(--paper-raised)] px-3 py-2 text-sm outline-none focus:border-clay"
        >
          <option value="">Todas</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-soft">Preço</p>
        <div className="flex items-center gap-2">
          <input
            type="number"
            inputMode="numeric"
            placeholder="Mín."
            defaultValue={min}
            onBlur={(e) => updateParam("min", e.target.value)}
            className="w-full rounded-xl border-2 border-line bg-[var(--paper-raised)] px-3 py-2 text-sm outline-none focus:border-clay"
          />
          <span className="text-ink-soft">—</span>
          <input
            type="number"
            inputMode="numeric"
            placeholder="Máx."
            defaultValue={max}
            onBlur={(e) => updateParam("max", e.target.value)}
            className="w-full rounded-xl border-2 border-line bg-[var(--paper-raised)] px-3 py-2 text-sm outline-none focus:border-clay"
          />
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-soft">Condição</p>
        <div className="flex flex-col gap-1.5">
          {Object.entries(CONDITIONS).map(([value, label]) => (
            <label key={value} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="condicao"
                checked={condicao === value}
                onChange={() => updateParam("condicao", value)}
                className="h-4 w-4 accent-[var(--clay)]"
              />
              {label}
            </label>
          ))}
          {condicao && (
            <button onClick={() => updateParam("condicao", "")} className="mt-1 text-left text-xs text-clay hover:underline">
              Limpar condição
            </button>
          )}
        </div>
      </div>

      <div>
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-soft">Estado</p>
        <select
          value={estado}
          onChange={(e) => updateParam("estado", e.target.value)}
          className="w-full rounded-xl border-2 border-line bg-[var(--paper-raised)] px-3 py-2 text-sm outline-none focus:border-clay"
        >
          <option value="">Todos</option>
          {BRAZIL_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>
    </div>
  );

  return (
    <>
      <div className="mb-4 lg:hidden">
        <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
          <SlidersHorizontal className="h-4 w-4" aria-hidden />
          Filtros {activeCount > 0 && `(${activeCount})`}
        </Button>
      </div>

      <aside className="hidden w-64 shrink-0 lg:block">{content}</aside>

      {open && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <button className="absolute inset-0 bg-ink/40" aria-label="Fechar filtros" onClick={() => setOpen(false)} />
          <div className="rise-in absolute right-0 top-0 h-full w-[85vw] max-w-sm overflow-y-auto bg-[var(--paper)] p-5">
            <div className="mb-5 flex items-center justify-between">
              <p className="font-display text-lg font-semibold">Filtros</p>
              <button onClick={() => setOpen(false)} aria-label="Fechar" className="grid h-9 w-9 place-items-center rounded-full border border-line">
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
