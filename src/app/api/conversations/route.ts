import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const conversations = await db.conversation.findMany({
    where: { OR: [{ buyerId: user.id }, { sellerId: user.id }] },
    orderBy: { updatedAt: "desc" },
    include: {
      listing: { select: { id: true, title: true, price: true, images: true, status: true } },
      buyer: { select: { id: true, name: true, avatarSeed: true } },
      seller: { select: { id: true, name: true, avatarSeed: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
  });

  return NextResponse.json({ conversations });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para conversar" }, { status: 401 });

  const { listingId, body } = await req.json().catch(() => ({}));
  if (!listingId || !body?.trim()) {
    return NextResponse.json({ error: "Preencha a mensagem" }, { status: 400 });
  }

  const listing = await db.listing.findUnique({ where: { id: listingId } });
  if (!listing) return NextResponse.json({ error: "Anúncio não encontrado" }, { status: 404 });
  if (listing.userId === user.id) {
    return NextResponse.json({ error: "Você não pode iniciar uma conversa com você mesmo" }, { status: 400 });
  }

  const conversation = await db.conversation.upsert({
    where: { listingId_buyerId: { listingId, buyerId: user.id } },
    update: { updatedAt: new Date() },
    create: { listingId, buyerId: user.id, sellerId: listing.userId },
  });

  const message = await db.message.create({
    data: { conversationId: conversation.id, senderId: user.id, body: body.trim() },
  });

  await db.notification.create({
    data: {
      userId: listing.userId,
      type: "message",
      title: `Nova mensagem sobre "${listing.title}"`,
      body: body.trim().slice(0, 120),
      link: `/painel/mensagens/${conversation.id}`,
    },
  });

  return NextResponse.json({ conversation, message }, { status: 201 });
}
