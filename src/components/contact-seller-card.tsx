"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Send, Heart, Share2 } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useUser, useToast } from "@/components/providers";
import { timeAgo } from "@/lib/utils";

export function ContactSellerCard({
  listingId,
  isOwner,
  seller,
  favorited,
}: {
  listingId: string;
  isOwner: boolean;
  seller: { id: string; name: string; avatarSeed: string; city: string; state: string; createdAt: string };
  favorited: boolean;
}) {
  const { user } = useUser();
  const { push } = useToast();
  const router = useRouter();
  const [message, setMessage] = useState(
    "Olá! Ainda está disponível? Tenho interesse."
  );
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [isFav, setIsFav] = useState(favorited);

  async function sendMessage(e: FormEvent) {
    e.preventDefault();
    if (!user) {
      router.push(`/entrar?next=/anuncios/${listingId}`);
      return;
    }
    if (!message.trim()) return;
    setSending(true);
    try {
      const res = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId, body: message }),
      });
      const data = await res.json();
      if (!res.ok) {
        push({ title: "Não foi possível enviar", description: data.error, tone: "danger" });
        return;
      }
      setSent(true);
      push({ title: "Mensagem enviada!", description: "Acompanhe a conversa no seu painel.", tone: "success" });
    } finally {
      setSending(false);
    }
  }

  async function toggleFavorite() {
    if (!user) {
      router.push(`/entrar?next=/anuncios/${listingId}`);
      return;
    }
    setIsFav((v) => !v);
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ listingId }),
    });
    const data = await res.json();
    setIsFav(data.favorited);
  }

  async function share() {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: "Confira este anúncio na Achou", url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(url);
      push({ title: "Link copiado!", tone: "success" });
    }
  }

  return (
    <div className="flex flex-col gap-5 rounded-2xl border-2 border-line bg-[var(--paper-raised)] p-5">
      <div className="flex items-center gap-3">
        <Avatar name={seller.name} seed={seller.avatarSeed} size={48} />
        <div className="min-w-0">
          <p className="truncate font-display font-semibold">{seller.name}</p>
          <p suppressHydrationWarning className="text-xs text-ink-soft">
            {seller.city}, {seller.state} · na Achou {timeAgo(seller.createdAt)}
          </p>
        </div>
      </div>

      {isOwner ? (
        <p className="rounded-xl bg-surface px-3 py-2.5 text-sm text-ink-soft">Este é o seu anúncio.</p>
      ) : sent ? (
        <p className="rounded-xl bg-success/10 px-3 py-2.5 text-sm font-medium text-success">
          Mensagem enviada! O vendedor foi notificado.
        </p>
      ) : (
        <form onSubmit={sendMessage} className="flex flex-col gap-2.5">
          <label htmlFor="msg" className="text-xs font-semibold text-ink-soft">
            Envie uma mensagem
          </label>
          <textarea
            id="msg"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-xl border-2 border-line bg-[var(--paper)] px-3 py-2.5 text-sm outline-none focus:border-clay"
          />
          <Button type="submit" disabled={sending} className="w-full">
            <Send className="h-4 w-4" aria-hidden />
            {sending ? "Enviando..." : "Enviar mensagem"}
          </Button>
        </form>
      )}

      <div className="flex gap-2">
        <button
          onClick={toggleFavorite}
          aria-pressed={isFav}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border-2 border-line py-2 text-sm font-semibold hover:border-clay"
        >
          <Heart className={`h-4 w-4 ${isFav ? "fill-clay text-clay" : ""}`} aria-hidden />
          {isFav ? "Favoritado" : "Favoritar"}
        </button>
        <button
          onClick={share}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border-2 border-line py-2 text-sm font-semibold hover:border-clay"
        >
          <Share2 className="h-4 w-4" aria-hidden /> Compartilhar
        </button>
      </div>

      <p className="flex items-center gap-1.5 text-[11px] text-ink-soft">
        <MessageCircle className="h-3.5 w-3.5" aria-hidden />
        Combine sempre em locais públicos e evite pagamentos antecipados.
      </p>
    </div>
  );
}
