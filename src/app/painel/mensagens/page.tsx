import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { MessageCircle } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { timeAgo, formatPrice } from "@/lib/utils";

export default async function MessagesListPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const conversations = await db.conversation.findMany({
    where: { OR: [{ buyerId: user.id }, { sellerId: user.id }] },
    orderBy: { updatedAt: "desc" },
    include: {
      listing: { select: { id: true, title: true, price: true, images: true } },
      buyer: { select: { id: true, name: true, avatarSeed: true } },
      seller: { select: { id: true, name: true, avatarSeed: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-clay">Painel</p>
      <h1 className="mb-6 font-display text-3xl font-semibold">Mensagens</h1>

      {conversations.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-line py-20 text-center">
          <MessageCircle className="h-8 w-8 text-ink-soft" aria-hidden />
          <p className="font-display text-lg font-semibold">Nenhuma conversa ainda</p>
          <p className="max-w-xs text-sm text-ink-soft">Quando você comprar ou vender, as conversas aparecem aqui.</p>
        </div>
      ) : (
        <ul className="flex flex-col gap-2">
          {conversations.map((c) => {
            const other = c.buyerId === user.id ? c.seller : c.buyer;
            const lastMessage = c.messages[0];
            const images: string[] = JSON.parse(c.listing.images || "[]");
            return (
              <li key={c.id}>
                <Link
                  href={`/painel/mensagens/${c.id}`}
                  className="flex items-center gap-3 rounded-2xl border-2 border-line bg-[var(--paper-raised)] p-4 hover:border-clay"
                >
                  <Avatar name={other.name} seed={other.avatarSeed} size={44} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate font-display font-semibold">{other.name}</p>
                      {lastMessage && <span className="shrink-0 text-xs text-ink-soft">{timeAgo(lastMessage.createdAt)}</span>}
                    </div>
                    <p className="truncate text-sm text-ink-soft">{lastMessage?.body ?? "Conversa iniciada"}</p>
                    <p className="truncate text-xs text-clay font-semibold mt-0.5">{c.listing.title} · {c.listing.price > 0 ? formatPrice(c.listing.price) : "A combinar"}</p>
                  </div>
                  {images[0] && (
                    <img src={images[0]} alt="" className="hidden h-14 w-16 shrink-0 rounded-lg object-cover sm:block" />
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
