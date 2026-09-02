"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MapPin, ShieldCheck, Zap, TrendingUp } from "lucide-react";
import { CategoryIcon } from "@/lib/category-icons";
import { HeroCarousel } from "@/components/hero-carousel";
import type { Category } from "@/generated/prisma";

const QUICK_STATS = [
  { icon: TrendingUp, label: "+2.400 anúncios hoje" },
  { icon: ShieldCheck, label: "Negociação segura" },
  { icon: Zap, label: "Publique em minutos" },
];

export function ParallaxHero({ categories = [] }: { categories?: Category[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [q, setQ] = useState("");
  const [city, setCity] = useState("");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const yBack = useTransform(scrollYProgress, [0, 1], [0, 90]);
  const yFront = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const opacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (city.trim()) params.set("cidade", city.trim());
    router.push(params.toString() ? `/anuncios?${params.toString()}` : "/anuncios");
  }

  return (
    <section ref={ref} className="relative overflow-hidden bg-olive">
      <HeroCarousel />

      <motion.div
        aria-hidden
        style={{ y: yBack }}
        className="parallax-layer pointer-events-none absolute -right-24 -top-32 h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,var(--mustard)_0%,transparent_70%)] opacity-25 blur-2xl"
      />
      <motion.div
        aria-hidden
        style={{ y: yFront }}
        className="parallax-layer pointer-events-none absolute -left-28 bottom-0 h-[360px] w-[360px] rounded-full bg-[radial-gradient(circle,var(--clay)_0%,transparent_70%)] opacity-30 blur-2xl"
      />

      <motion.div style={{ opacity }} className="relative mx-auto max-w-6xl px-6 pb-16 pt-16 sm:pb-20 sm:pt-20">
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="rise-in font-display text-3xl font-semibold leading-[1.1] tracking-tight text-olive-ink sm:text-5xl">
            Compre e venda perto de você, sem complicação
          </h1>
          <p className="rise-in mt-4 text-sm text-olive-ink/75 sm:text-base" style={{ animationDelay: "0.05s" }}>
            Milhares de anúncios de veículos, imóveis, eletrônicos e muito mais — publique o seu de graça agora mesmo.
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rise-in mx-auto mt-8 flex max-w-3xl flex-col gap-2 rounded-2xl bg-[var(--paper-raised)] p-2 shadow-2xl sm:flex-row sm:rounded-full"
          style={{ animationDelay: "0.1s" }}
        >
          <label htmlFor="hero-search" className="sr-only">
            O que você está procurando?
          </label>
          <div className="flex flex-1 items-center gap-2 rounded-full px-4 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-ink-soft" aria-hidden />
            <input
              id="hero-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Ex: iPhone 13, apartamento, bicicleta..."
              className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft/70"
            />
          </div>
          <div className="hidden w-px self-stretch bg-line sm:block" aria-hidden />
          <label htmlFor="hero-city" className="sr-only">
            Cidade
          </label>
          <div className="flex items-center gap-2 border-t border-line px-4 py-2.5 sm:w-44 sm:border-t-0">
            <MapPin className="h-4 w-4 shrink-0 text-ink-soft" aria-hidden />
            <input
              id="hero-city"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Sua cidade"
              className="min-w-0 flex-1 bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft/70"
            />
          </div>
          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-full bg-clay px-7 py-3 text-sm font-semibold text-clay-ink hover:bg-clay-deep"
          >
            <Search className="h-4 w-4" aria-hidden />
            Buscar
          </button>
        </form>

        <div
          className="rise-in mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs font-semibold text-olive-ink/80"
          style={{ animationDelay: "0.15s" }}
        >
          {QUICK_STATS.map((s) => (
            <span key={s.label} className="flex items-center gap-1.5">
              <s.icon className="h-3.5 w-3.5 text-mustard" aria-hidden />
              {s.label}
            </span>
          ))}
        </div>

        {categories.length > 0 && (
          <div className="rise-in mt-10 flex justify-center" style={{ animationDelay: "0.2s" }}>
            <div className="flex max-w-full gap-2.5 overflow-x-auto scrollbar-thin px-1 pb-1">
              {categories.map((c) => (
                <Link
                  key={c.id}
                  href={`/categoria/${c.slug}`}
                  className="flex shrink-0 flex-col items-center gap-2 rounded-2xl bg-[var(--paper-raised)]/10 px-4 py-3 text-center backdrop-blur-sm transition-colors hover:bg-[var(--paper-raised)]/20"
                >
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-[var(--paper-raised)] text-clay">
                    <CategoryIcon icon={c.icon} className="h-5 w-5" />
                  </span>
                  <span className="w-16 text-[11px] font-semibold leading-tight text-olive-ink">{c.name}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </motion.div>
    </section>
  );
}
