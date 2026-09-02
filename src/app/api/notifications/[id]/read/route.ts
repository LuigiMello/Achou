import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const notification = await db.notification.findUnique({ where: { id } });
  if (!notification || notification.userId !== user.id) {
    return NextResponse.json({ error: "Não encontrada" }, { status: 404 });
  }

  await db.notification.update({ where: { id }, data: { read: true } });
  return NextResponse.json({ ok: true });
}
