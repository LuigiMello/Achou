"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, MessageCircle, Sparkles, Heart, Tag } from "lucide-react";
import { useUser } from "@/components/providers";
import { timeAgo } from "@/lib/utils";

type Notification = {
  id: string;
  type: string;
  title: string;
  body: string;
  link: string | null;
  read: boolean;
  createdAt: string;
};

const ICONS: Record<string, typeof Bell> = {
  message: MessageCircle,
  welcome: Sparkles,
  favorite: Heart,
  price: Tag,
};

export function NotificationBell() {
  const { user, unreadCount, setUnreadCount } = useUser();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function openMenu() {
    setOpen((v) => !v);
    if (!loaded && user) {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setItems(data.notifications ?? []);
      setLoaded(true);
    }
  }

  async function markAllRead() {
    setUnreadCount(0);
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
    await fetch("/api/notifications", { method: "PATCH" });
  }

  if (!user) return null;

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={openMenu}
        aria-expanded={open}
        aria-label={`Notificações${unreadCount > 0 ? `, ${unreadCount} não lidas` : ""}`}
        className="relative grid h-10 w-10 place-items-center rounded-full text-ink-soft transition-colors hover:bg-ink/6 hover:text-clay"
      >
        <Bell className="h-[18px] w-[18px]" aria-hidden />
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-mustard px-1 text-[10px] font-bold text-mustard-ink">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div
          role="menu"
          className="rise-in absolute right-0 top-12 max-h-[70vh] w-80 overflow-y-auto rounded-2xl border-2 border-line bg-[var(--paper-raised)] shadow-2xl"
        >
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="font-display text-sm font-semibold">Notificações</p>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs font-semibold text-clay hover:underline">
                Marcar tudo como lido
              </button>
            )}
          </div>
          {items.length === 0 ? (
            <p className="px-4 py-8 text-center text-sm text-ink-soft">Nenhuma notificação por aqui ainda.</p>
          ) : (
            <ul>
              {items.map((n) => {
                const Icon = ICONS[n.type] ?? Bell;
                return (
                  <li key={n.id} className="border-b border-line/60 last:border-0">
                    <Link
                      href={n.link ?? "#"}
                      onClick={() => setOpen(false)}
                      className={`flex gap-3 px-4 py-3 hover:bg-ink/5 transition-colors ${!n.read ? "bg-clay/5" : ""}`}
                    >
                      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-surface">
                        <Icon className="h-4 w-4 text-clay" aria-hidden />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-sm font-semibold leading-snug">{n.title}</span>
                        <span className="block text-xs text-ink-soft leading-snug mt-0.5 line-clamp-2">{n.body}</span>
                        <span className="block text-[11px] text-ink-soft/70 mt-1">{timeAgo(n.createdAt)}</span>
                      </span>
                      {!n.read && <span className="ml-auto mt-1.5 h-2 w-2 shrink-0 rounded-full bg-clay" aria-hidden />}
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
