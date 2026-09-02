"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";
import type { Category } from "@/generated/prisma";

export function SearchBar({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [categoria, setCategoria] = useState(searchParams.get("categoria") ?? "");

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (categoria) params.set("categoria", categoria);
    router.push(`/anuncios${params.toString() ? `?${params.toString()}` : ""}`);
  }

  return (
    <form onSubmit={onSubmit} role="search" className="flex w-full max-w-2xl items-stretch overflow-hidden rounded-full border-2 border-line bg-[var(--paper-raised)] focus-within:border-clay">
      <label htmlFor="header-search" className="sr-only">
        Buscar anúncios
      </label>
      <select
        aria-label="Categoria"
        value={categoria}
        onChange={(e) => setCategoria(e.target.value)}
        className="hidden shrink-0 border-r border-line bg-transparent px-3 text-xs font-medium text-ink-soft outline-none sm:block max-w-[140px]"
      >
        <option value="">Tudo</option>
        {categories.map((c) => (
          <option key={c.id} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
      <input
        id="header-search"
        type="search"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Busque por carros, imóveis, celulares..."
        className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-ink outline-none placeholder:text-ink-soft/70"
      />
      <button
        type="submit"
        className="flex shrink-0 items-center gap-1.5 bg-clay px-4 text-sm font-semibold text-clay-ink hover:bg-clay-deep"
      >
        <Search className="h-4 w-4" aria-hidden />
        <span className="hidden sm:inline">Buscar</span>
      </button>
    </form>
  );
}
