import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resetPasswordSchema } from "@/lib/validators";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 }
    );
  }

  const { token, password } = parsed.data;
  const reset = await db.passwordReset.findUnique({ where: { token } });

  if (!reset || reset.used || reset.expiresAt < new Date()) {
    return NextResponse.json({ error: "Link inválido ou expirado" }, { status: 400 });
  }

  const passwordHash = await hashPassword(password);
  await db.$transaction([
    db.user.update({ where: { id: reset.userId }, data: { passwordHash } }),
    db.passwordReset.update({ where: { token }, data: { used: true } }),
  ]);

  return NextResponse.json({ ok: true });
}
