import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ notifications: [] });

  const notifications = await db.notification.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 30,
  });
  return NextResponse.json({ notifications });
}

export async function PATCH() {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  await db.notification.updateMany({ where: { userId: user.id, read: false }, data: { read: true } });
  return NextResponse.json({ ok: true });
}
