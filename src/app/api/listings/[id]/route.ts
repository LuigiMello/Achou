import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const listing = await db.listing.findUnique({
    where: { id },
    include: {
      category: true,
      user: { select: { id: true, name: true, avatarSeed: true, city: true, state: true, createdAt: true } },
    },
  });
  if (!listing) return NextResponse.json({ error: "Anúncio não encontrado" }, { status: 404 });

  db.listing.update({ where: { id }, data: { views: { increment: 1 } } }).catch(() => {});

  return NextResponse.json({ listing });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const listing = await db.listing.findUnique({ where: { id } });
  if (!listing) return NextResponse.json({ error: "Anúncio não encontrado" }, { status: 404 });
  if (listing.userId !== user.id) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const allowed = ["status", "title", "description", "price", "negotiable", "condition"] as const;
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }

  const updated = await db.listing.update({ where: { id }, data });
  return NextResponse.json({ listing: updated });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const listing = await db.listing.findUnique({ where: { id } });
  if (!listing) return NextResponse.json({ error: "Anúncio não encontrado" }, { status: 404 });
  if (listing.userId !== user.id) return NextResponse.json({ error: "Sem permissão" }, { status: 403 });

  await db.listing.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
