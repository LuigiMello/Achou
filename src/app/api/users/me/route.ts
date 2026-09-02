import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function PATCH(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Não autenticado" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const allowed = ["name", "phone", "city", "state", "bio"] as const;
  const data: Record<string, unknown> = {};
  for (const key of allowed) {
    if (key in body) data[key] = body[key];
  }

  const updated = await db.user.update({ where: { id: user.id }, data });
  const { passwordHash: _hash, ...safe } = updated;
  return NextResponse.json({ user: safe });
}
