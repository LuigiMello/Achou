import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { listingSchema } from "@/lib/validators";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim();
  const category = url.searchParams.get("categoria");
  const state = url.searchParams.get("estado");
  const condition = url.searchParams.get("condicao");
  const minPrice = url.searchParams.get("min");
  const maxPrice = url.searchParams.get("max");
  const sort = url.searchParams.get("sort") ?? "recent";
  const userId = url.searchParams.get("userId");
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
  const pageSize = 12;

  const where: Record<string, unknown> = { status: "active" };
  if (q) {
    where.OR = [
      { title: { contains: q } },
      { description: { contains: q } },
    ];
  }
  if (category) where.category = { slug: category };
  if (state) where.state = state;
  if (condition) where.condition = condition;
  if (userId) where.userId = userId;
  if (minPrice || maxPrice) {
    where.price = {
      ...(minPrice ? { gte: Number(minPrice) } : {}),
      ...(maxPrice ? { lte: Number(maxPrice) } : {}),
    };
  }

  const orderBy =
    sort === "price_asc"
      ? { price: "asc" as const }
      : sort === "price_desc"
        ? { price: "desc" as const }
        : sort === "popular"
          ? { views: "desc" as const }
          : { createdAt: "desc" as const };

  const [items, total] = await Promise.all([
    db.listing.findMany({
      where,
      orderBy,
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: { category: true, user: { select: { id: true, name: true, avatarSeed: true, city: true, state: true } } },
    }),
    db.listing.count({ where }),
  ]);

  return NextResponse.json({
    items,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  });
}

export async function POST(req: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Faça login para anunciar" }, { status: 401 });

  const body = await req.json().catch(() => null);
  const parsed = listingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 }
    );
  }

  const { images, ...rest } = parsed.data;
  const listing = await db.listing.create({
    data: { ...rest, images: JSON.stringify(images), userId: user.id },
    include: { category: true },
  });

  return NextResponse.json({ listing }, { status: 201 });
}
