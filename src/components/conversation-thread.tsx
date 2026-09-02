"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import Link from "next/link";
import { ArrowLeft, Send } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { formatPrice, timeAgo } from "@/lib/utils";

type Message = { id: string; senderId: string; body: string; createdAt: string };

export function ConversationThread({
  conversationId,
  currentUserId,
  other,
  listing,
  initialMessages,
}: {
  conversationId: string;
  currentUserId: string;
  other: { id: string; name: string; avatarSeed: string };
  listing: { id: string; title: string; price: number; images: string; status: string };
  initialMessages: Message[];
}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const images: string[] = JSON.parse(listing.images || "[]");

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length]);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch(`/api/conversations/${conversationId}/messages`);
      if (!res.ok) return;
      const data = await res.json();
      setMessages(
        data.conversation.messages.map((m: Message) => ({ ...m, createdAt: String(m.createdAt) }))
      );
    }, 5000);
    return () => clearInterval(interval);
  }, [conversationId]);

  async function send(e: FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setSending(true);
    const body = text.trim();
    setText("");
    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessages((prev) => [...prev, { ...data.message, createdAt: String(data.message.createdAt) }]);
      }
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="flex h-[calc(100vh-160px)] flex-col overflow-hidden rounded-2xl border-2 border-line bg-[var(--paper-raised)]">
      <div className="flex items-center gap-3 border-b border-line p-4">
        <Link href="/painel/mensagens" className="grid h-9 w-9 shrink-0 place-items-center rounded-full border-2 border-line lg:hidden" aria-label="Voltar">
          <ArrowLeft className="h-4 w-4" aria-hidden />
        </Link>
        <Avatar name={other.name} seed={other.avatarSeed} size={40} />
        <div className="min-w-0 flex-1">
          <p className="truncate font-display font-semibold">{other.name}</p>
          <Link href={`/anuncios/${listing.id}`} className="truncate text-xs text-clay hover:underline block">
            {listing.title} · {listing.price > 0 ? formatPrice(listing.price) : "A combinar"}
          </Link>
        </div>
        {images[0] && <img src={images[0]} alt="" className="hidden h-12 w-14 rounded-lg object-cover sm:block" />}
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((m) => {
          const mine = m.senderId === currentUserId;
          return (
            <div key={m.id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm ${
                  mine ? "bg-clay text-clay-ink rounded-br-sm" : "bg-surface text-ink rounded-bl-sm"
                }`}
              >
                <p className="whitespace-pre-line">{m.body}</p>
                <p suppressHydrationWarning className={`mt-1 text-[10px] ${mine ? "text-clay-ink/70" : "text-ink-soft"}`}>{timeAgo(m.createdAt)}</p>
              </div>
            </div>
          );
        })}
        <div ref={endRef} />
      </div>

      <form onSubmit={send} className="flex items-center gap-2 border-t border-line p-3">
        <label htmlFor="chat-input" className="sr-only">Mensagem</label>
        <input
          id="chat-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva uma mensagem..."
          className="min-w-0 flex-1 rounded-full border-2 border-line bg-[var(--paper)] px-4 py-2.5 text-sm outline-none focus:border-clay"
        />
        <button
          type="submit"
          disabled={sending || !text.trim()}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-clay text-clay-ink disabled:opacity-50"
          aria-label="Enviar"
        >
          <Send className="h-4 w-4" aria-hidden />
        </button>
      </form>
    </div>
  );
}
