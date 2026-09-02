import { notFound, redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { ConversationThread } from "@/components/conversation-thread";

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) redirect("/entrar");

  const conversation = await db.conversation.findUnique({
    where: { id },
    include: {
      listing: { select: { id: true, title: true, price: true, images: true, status: true } },
      buyer: { select: { id: true, name: true, avatarSeed: true } },
      seller: { select: { id: true, name: true, avatarSeed: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!conversation || (conversation.buyerId !== user.id && conversation.sellerId !== user.id)) notFound();

  await db.message.updateMany({
    where: { conversationId: id, senderId: { not: user.id }, read: false },
    data: { read: true },
  });

  const other = conversation.buyerId === user.id ? conversation.seller : conversation.buyer;

  return (
    <ConversationThread
      conversationId={conversation.id}
      currentUserId={user.id}
      other={other}
      listing={{ ...conversation.listing }}
      initialMessages={conversation.messages.map((m) => ({ ...m, createdAt: m.createdAt.toISOString() }))}
    />
  );
}
