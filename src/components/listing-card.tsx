"use client";

import Link from "next/link";
import { useState } from "react";
import { Heart, MapPin, Eye } from "lucide-react";
import { formatPrice, timeAgo, CONDITIONS } from "@/lib/utils";
import { useUser, useToast } from "@/components/providers";
import { useRouter } from "next/navigation";

export type ListingCardData = {
  id: string;
  title: string;
  price: number;
  negotiable: boolean;
  condition: string;
  city: string;
  state: string;
  images: string;
  createdAt: string | Date;
  views: number;
  category: { name: string; slug: string };
};

export function ListingCard({
  listing,
  favorited = false,
  priority = false,
}: {
  listing: ListingCardData;
  favorited?: boolean;
  priority?: boolean;
}) {
  const { user } = useUser();
  const { push } = useToast();
  const router = useRouter();
  const [isFav, setIsFav] = useState(favorited);
  const [busy, setBusy] = useState(false);

  const images: string[] = JSON.parse(listing.images || "[]");
  const cover = images[0];

  async function toggleFavorite(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      push({ title: "Entre na sua conta", description: "Faça login para favoritar anúncios.", tone: "default" });
      router.push("/entrar");
      return;
    }
    if (busy) return;
    setBusy(true);
    setIsFav((v) => !v);
    try {
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId: listing.id }),
      });
      const data = await res.json();
      setIsFav(data.favorited);
      push({
        title: data.favorited ? "Adicionado aos favoritos" : "Removido dos favoritos",
        tone: "success",
      });
    } catch {
      setIsFav((v) => !v);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Link
      href={`/anuncios/${listing.id}`}
      className="card-lift group flex flex-col overflow-hidden rounded-2xl border-2 border-line bg-[var(--paper-raised)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-surface">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cover}
            alt={listing.title}
            loading={priority ? "eager" : "lazy"}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 grid place-items-center text-ink-soft">Sem foto</div>
        )}
        <button
          type="button"
          onClick={toggleFavorite}
          aria-pressed={isFav}
          aria-label={isFav ? "Remover dos favoritos" : "Adicionar aos favoritos"}
          className="absolute right-2.5 top-2.5 grid h-9 w-9 place-items-center rounded-full bg-[var(--paper)]/90 backdrop-blur transition-transform hover:scale-110"
        >
          <Heart className={`h-4 w-4 ${isFav ? "fill-clay text-clay" : "text-ink"}`} aria-hidden />
        </button>
        {listing.condition === "new" && (
          <span className="absolute left-2.5 top-2.5 rounded-full bg-mustard px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-mustard-ink">
            Novo
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-1.5 p-4">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-clay">{listing.category.name}</p>
        <h3 className="font-display text-base font-semibold leading-snug line-clamp-2 text-ink">{listing.title}</h3>
        <p className="font-display text-lg font-bold text-ink mt-auto">
          {listing.price > 0 ? formatPrice(listing.price) : "A combinar"}
          {listing.negotiable && listing.price > 0 && (
            <span className="ml-1.5 text-xs font-normal text-ink-soft">negociável</span>
          )}
        </p>
        <div className="flex items-center justify-between text-xs text-ink-soft">
          <span className="flex items-center gap-1 truncate">
            <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden />
            {listing.city}, {listing.state}
          </span>
          <span className="flex items-center gap-1 shrink-0">
            <Eye className="h-3.5 w-3.5" aria-hidden /> {listing.views}
          </span>
        </div>
        <p suppressHydrationWarning className="text-[11px] text-ink-soft/70">{timeAgo(listing.createdAt)}</p>
      </div>
    </Link>
  );
}

export { CONDITIONS };
