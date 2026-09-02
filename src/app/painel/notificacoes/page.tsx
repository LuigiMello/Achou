import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Bell, MessageCircle, Sparkles, Heart, Tag } from "lucide-react";
import { timeAgo } from "@/lib/utils";
import { MarkAllReadButton } from "@/components/mark-all-read-button";

const ICONS: Record<string, typeof Bell> = { message: MessageCircle, welcome: Sparkles, favorite: Heart, price: Tag };

export default async function NotificationsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const notifications = await db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-clay">Painel</p>
          <h1 className="font-display text-3xl font-semibold">Notificações</h1>
        </div>
        <MarkAllReadButton />
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-line py-20 text-center">
          <Bell className="h-8 w-8 text-ink-soft" aria-hidden />
          <p className="font-display text-lg font-semibold">Sem notificações por aqui</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {notifications.map((n) => {
            const Icon = ICONS[n.type] ?? Bell;
            return (
              <li key={n.id}>
                <Link
                  href={n.link ?? "#"}
                  className={`flex items-start gap-3 rounded-2xl border-2 p-4 transition-colors hover:border-clay ${
                    n.read ? "border-line bg-[var(--paper-raised)]" : "border-clay/40 bg-clay/5"
                  }`}
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-surface text-clay">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold">{n.title}</span>
                    <span className="block text-sm text-ink-soft">{n.body}</span>
                    <span className="block text-xs text-ink-soft/70 mt-1">{timeAgo(n.createdAt)}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
