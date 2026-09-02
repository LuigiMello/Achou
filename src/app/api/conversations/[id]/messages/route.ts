import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { messageSchema } from "@/lib/validators";

async function loadConversation(id: string, userId: string) {
  const conversation = await db.conversation.findUnique({
    where: { id },
    include: {
      listing: true,
      buyer: { select: { id: true, name: true, avatarSeed: true } },
      seller: { select: { id: true, name: true, avatarSeed: true } },
      messages: { orderBy: { createdAt: "asc" } },
    },
  });
  if (!conversation) return null;
  if (conversation.buyerId !== userId && conversation.sellerId !== userId) return null;
  return conversation;
}

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const conversation = await loadConversation(id, user.id);
  if (!conversation) return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 });

  await db.message.updateMany({
    where: { conversationId: id, senderId: { not: user.id }, read: false },
    data: { read: true },
  });

  return NextResponse.json({ conversation });
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const conversation = await loadConversation(id, user.id);
  if (!conversation) return NextResponse.json({ error: "Conversa não encontrada" }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Mensagem inválida" }, { status: 400 });
  }

  const message = await db.message.create({
    data: { conversationId: id, senderId: user.id, body: parsed.data.body },
  });
  await db.conversation.update({ where: { id }, data: { updatedAt: new Date() } });

  const recipientId = conversation.buyerId === user.id ? conversation.sellerId : conversation.buyerId;
  await db.notification.create({
    data: {
      userId: recipientId,
      type: "message",
      title: `Nova mensagem de ${user.name}`,
      body: parsed.data.body.slice(0, 120),
      link: `/painel/mensagens/${id}`,
    },
  });

  return NextResponse.json({ message }, { status: 201 });
}
