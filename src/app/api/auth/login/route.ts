import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/validators";
import { createSessionToken, setSessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 }
    );
  }

  const { email, password } = parsed.data;
  const user = await db.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ error: "E-mail ou senha incorretos" }, { status: 401 });
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return NextResponse.json({ error: "E-mail ou senha incorretos" }, { status: 401 });
  }

  const token = await createSessionToken({ uid: user.id, email: user.email });
  await setSessionCookie(token);

  const { passwordHash: _hash, ...safe } = user;
  return NextResponse.json({ user: safe });
}
