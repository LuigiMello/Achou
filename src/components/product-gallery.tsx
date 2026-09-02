"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

export function ProductGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);

  if (images.length === 0) {
    return (
      <div className="grid aspect-[4/3] place-items-center rounded-2xl border-2 border-line bg-surface text-ink-soft">
        <ImageOff className="h-10 w-10" aria-hidden />
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border-2 border-line bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={images[active]}
          alt={`${title} — foto ${active + 1} de ${images.length}`}
          className="absolute inset-0 h-full w-full object-cover"
        />
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => setActive((a) => (a - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-[var(--paper)]/85 backdrop-blur hover:scale-105"
              aria-label="Foto anterior"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden />
            </button>
            <button
              type="button"
              onClick={() => setActive((a) => (a + 1) % images.length)}
              className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded-full bg-[var(--paper)]/85 backdrop-blur hover:scale-105"
              aria-label="Próxima foto"
            >
              <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
            <span className="absolute bottom-3 right-3 rounded-full bg-ink/70 px-2.5 py-1 text-xs font-semibold text-paper">
              {active + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto scrollbar-thin">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActive(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={active === i}
              className={`relative h-16 w-20 shrink-0 overflow-hidden rounded-lg border-2 ${
                active === i ? "border-clay" : "border-line opacity-70 hover:opacity-100"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
