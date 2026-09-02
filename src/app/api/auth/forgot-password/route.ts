import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { db } from "@/lib/db";
import { forgotPasswordSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 }
    );
  }

  const { email } = parsed.data;
  const user = await db.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({
      ok: true,
      message: "Se este e-mail existir em nossa base, enviaremos um link de recuperação.",
    });
  }

  const token = nanoid(48);
  await db.passwordReset.create({
    data: {
      token,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 30),
    },
  });

  return NextResponse.json({
    ok: true,
    message: "Link de recuperação gerado.",
    devResetUrl: `/redefinir-senha?token=${token}`,
  });
}
