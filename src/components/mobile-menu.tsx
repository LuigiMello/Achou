"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, HelpCircle, Plus } from "lucide-react";
import { CategoryIcon } from "@/lib/category-icons";
import type { Category } from "@/generated/prisma";

export function MobileMenu({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ink/6 hover:text-clay md:hidden"
        aria-label="Abrir menu"
      >
        <Menu className="h-5 w-5" aria-hidden />
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            className="absolute inset-0 bg-ink/40"
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
          />
          <div className="rise-in absolute left-0 top-0 h-full w-[82vw] max-w-xs overflow-y-auto bg-[var(--paper)] p-5 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <Image src="/logo-wordmark.png" alt="Achou" width={100} height={24} className="h-6 w-auto" />
              <button onClick={() => setOpen(false)} aria-label="Fechar" className="grid h-9 w-9 place-items-center rounded-full border border-line">
                <X className="h-4 w-4" aria-hidden />
              </button>
            </div>

            <Link
              href="/anuncios/novo"
              onClick={() => setOpen(false)}
              className="mb-6 flex items-center justify-center gap-2 rounded-full bg-clay px-4 py-3 text-sm font-semibold text-clay-ink"
            >
              <Plus className="h-4 w-4" aria-hidden /> Anunciar grátis
            </Link>

            <p className="mb-2 text-xs font-bold uppercase tracking-wide text-ink-soft">Categorias</p>
            <ul className="mb-6 flex flex-col gap-0.5">
              {categories.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/categoria/${c.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm font-medium hover:bg-ink/5"
                  >
                    <CategoryIcon icon={c.icon} className="h-4 w-4 text-clay" />
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              href="/ajuda"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-2 py-2.5 text-sm font-medium hover:bg-ink/5"
            >
              <HelpCircle className="h-4 w-4 text-clay" aria-hidden /> Ajuda
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
