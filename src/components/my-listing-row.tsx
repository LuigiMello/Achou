"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, Heart, Pause, Play, Trash2, ExternalLink } from "lucide-react";
import { formatPrice, timeAgo } from "@/lib/utils";
import { useToast } from "@/components/providers";

export type MyListing = {
  id: string;
  title: string;
  price: number;
  images: string;
  status: string;
  views: number;
  createdAt: string;
  category: { name: string };
  _count?: { favorites: number };
};

export function MyListingRow({ listing }: { listing: MyListing }) {
  const router = useRouter();
  const { push } = useToast();
  const [status, setStatus] = useState(listing.status);
  const [busy, setBusy] = useState(false);
  const [removed, setRemoved] = useState(false);
  const images: string[] = JSON.parse(listing.images || "[]");

  async function toggleStatus() {
    setBusy(true);
    const next = status === "active" ? "paused" : "active";
    try {
      const res = await fetch(`/api/listings/${listing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (res.ok) {
        setStatus(next);
        push({ title: next === "active" ? "Anúncio reativado" : "Anúncio pausado", tone: "success" });
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!window.confirm("Tem certeza que deseja excluir este anúncio? Essa ação não pode ser desfeita.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/listings/${listing.id}`, { method: "DELETE" });
      if (res.ok) {
        setRemoved(true);
        push({ title: "Anúncio excluído", tone: "default" });
        router.refresh();
      }
    } finally {
      setBusy(false);
    }
  }

  if (removed) return null;

  return (
    <div className="flex flex-col gap-4 rounded-2xl border-2 border-line bg-[var(--paper-raised)] p-4 sm:flex-row sm:items-center">
      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-surface">
        {images[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={images[0]} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        {status !== "active" && (
          <span className="absolute inset-0 grid place-items-center bg-ink/60 text-[10px] font-bold uppercase text-paper">
            Pausado
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-clay">{listing.category.name}</p>
        <Link href={`/anuncios/${listing.id}`} className="truncate font-display font-semibold hover:underline block">
          {listing.title}
        </Link>
        <p className="font-display font-bold text-ink">{listing.price > 0 ? formatPrice(listing.price) : "A combinar"}</p>
        <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-ink-soft">
          <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" aria-hidden /> {listing.views}</span>
          <span className="flex items-center gap-1"><Heart className="h-3.5 w-3.5" aria-hidden /> {listing._count?.favorites ?? 0}</span>
          <span suppressHydrationWarning>Publicado {timeAgo(listing.createdAt)}</span>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <Link
          href={`/anuncios/${listing.id}`}
          className="grid h-9 w-9 place-items-center rounded-full border-2 border-line hover:border-clay"
          aria-label="Ver anúncio"
        >
          <ExternalLink className="h-4 w-4" aria-hidden />
        </Link>
        <button
          onClick={toggleStatus}
          disabled={busy}
          className="grid h-9 w-9 place-items-center rounded-full border-2 border-line hover:border-clay"
          aria-label={status === "active" ? "Pausar anúncio" : "Reativar anúncio"}
        >
          {status === "active" ? <Pause className="h-4 w-4" aria-hidden /> : <Play className="h-4 w-4" aria-hidden />}
        </button>
        <button
          onClick={remove}
          disabled={busy}
          className="grid h-9 w-9 place-items-center rounded-full border-2 border-line text-danger hover:border-danger"
          aria-label="Excluir anúncio"
        >
          <Trash2 className="h-4 w-4" aria-hidden />
        </button>
      </div>
    </div>
  );
}
