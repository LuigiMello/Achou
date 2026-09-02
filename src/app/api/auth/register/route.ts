import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { registerSchema } from "@/lib/validators";
import { createSessionToken, hashPassword, setSessionCookie } from "@/lib/auth";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 }
    );
  }

  const { name, email, password, city, state } = parsed.data;

  const existing = await db.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Já existe uma conta com esse e-mail" }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);
  const user = await db.user.create({
    data: { name, email, passwordHash, city, state, avatarSeed: name },
  });

  await db.notification.create({
    data: {
      userId: user.id,
      type: "welcome",
      title: `Bem-vindo(a) à Achou, ${name.split(" ")[0]}!`,
      body: "Complete seu perfil e publique seu primeiro anúncio gratuitamente.",
      link: "/painel/meus-anuncios",
    },
  });

  const token = await createSessionToken({ uid: user.id, email: user.email });
  await setSessionCookie(token);

  const { passwordHash: _hash, ...safe } = user;
  return NextResponse.json({ user: safe }, { status: 201 });
}
