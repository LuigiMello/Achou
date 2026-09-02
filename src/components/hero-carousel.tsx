"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";

const SLIDES = [
  {
    src: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=1600&auto=format&fit=crop",
    alt: "Casa moderna à venda",
  },
  {
    src: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop",
    alt: "Smartphone em anúncio",
  },
  {
    src: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1600&auto=format&fit=crop",
    alt: "Carro à venda",
  },
  {
    src: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=1600&auto=format&fit=crop",
    alt: "Sofá e móveis para casa",
  },
  {
    src: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop",
    alt: "Tênis e moda",
  },
  {
    src: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=1600&auto=format&fit=crop",
    alt: "Bicicleta para esporte e lazer",
  },
];

export function HeroCarousel() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDES.length);
    }, 2200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <AnimatePresence initial={false}>
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 1.06 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={SLIDES[index].src}
            alt={SLIDES[index].alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      <div className="absolute inset-0 bg-[linear-gradient(180deg,color-mix(in_oklab,var(--olive)_88%,transparent)_0%,color-mix(in_oklab,var(--olive)_78%,transparent)_55%,var(--olive)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,transparent_0%,color-mix(in_oklab,var(--olive)_55%,transparent)_100%)]" />

      <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
        {SLIDES.map((s, i) => (
          <span
            key={s.src}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === index ? "w-5 bg-mustard" : "w-1.5 bg-[var(--paper-raised)]/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
