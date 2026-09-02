import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { reviewSchema } from "@/lib/validators";

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para avaliar" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Dados inválidos" }, { status: 400 });
  }
  if (parsed.data.targetId === user.id) {
    return NextResponse.json({ error: "Você não pode avaliar a si mesmo" }, { status: 400 });
  }

  const review = await db.review.create({
    data: { ...parsed.data, authorId: user.id },
  });

  return NextResponse.json({ review }, { status: 201 });
}
