import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ favorites: [] });

  const favorites = await db.favorite.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { listing: { include: { category: true, user: { select: { id: true, name: true, avatarSeed: true, city: true, state: true } } } } },
  });
  return NextResponse.json({ favorites });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para favoritar" }, { status: 401 });

  const { listingId } = await req.json().catch(() => ({ listingId: null }));
  if (!listingId) return NextResponse.json({ error: "listingId obrigatório" }, { status: 400 });

  const existing = await db.favorite.findUnique({
    where: { userId_listingId: { userId: user.id, listingId } },
  });

  if (existing) {
    await db.favorite.delete({ where: { id: existing.id } });
    return NextResponse.json({ favorited: false });
  }

  await db.favorite.create({ data: { userId: user.id, listingId } });
  return NextResponse.json({ favorited: true });
}
