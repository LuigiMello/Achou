import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ListingCard } from "@/components/listing-card";
import { FiltersSidebar } from "@/components/filters-sidebar";
import { CategoryIcon } from "@/lib/category-icons";
import { PackageSearch } from "lucide-react";

const PAGE_SIZE = 12;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const user = await getCurrentUser();

  const category = await db.category.findUnique({ where: { slug } });
  if (!category) notFound();

  const where: Record<string, unknown> = { status: "active", categoryId: category.id };
  if (sp.q) where.OR = [{ title: { contains: sp.q } }, { description: { contains: sp.q } }];
  if (sp.estado) where.state = sp.estado;
  if (sp.condicao) where.condition = sp.condicao;
  if (sp.min || sp.max) {
    where.price = { ...(sp.min ? { gte: Number(sp.min) } : {}), ...(sp.max ? { lte: Number(sp.max) } : {}) };
  }

  const sort = sp.sort ?? "recent";
  const orderBy =
    sort === "price_asc"
      ? { price: "asc" as const }
      : sort === "price_desc"
        ? { price: "desc" as const }
        : sort === "popular"
          ? { views: "desc" as const }
          : { createdAt: "desc" as const };

  const page = Math.max(1, Number(sp.page ?? "1"));

  const [categories, items, total, favorites] = await Promise.all([
    db.category.findMany({ orderBy: { name: "asc" } }),
    db.listing.findMany({
      where,
      orderBy,
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { category: true, user: { select: { id: true, name: true, avatarSeed: true, city: true, state: true } } },
    }),
    db.listing.count({ where }),
    user ? db.favorite.findMany({ where: { userId: user.id }, select: { listingId: true } }) : Promise.resolve([]),
  ]);

  const favSet = new Set(favorites.map((f) => f.listingId));
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div>
      <div className="texture-noise border-b border-line bg-surface">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-6 py-10">
          <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-clay text-clay-ink">
            <CategoryIcon icon={category.icon} className="h-7 w-7" />
          </span>
          <div>
            <h1 className="font-display text-3xl font-semibold">{category.name}</h1>
            <p className="text-sm text-ink-soft">{total} anúncios ativos nesta categoria</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="flex flex-col gap-8 lg:flex-row">
          <FiltersSidebar categories={categories} />

          <div className="flex-1">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-line py-24 text-center">
                <PackageSearch className="h-10 w-10 text-ink-soft" aria-hidden />
                <p className="font-display text-lg font-semibold">Ainda não há anúncios aqui</p>
                <p className="max-w-xs text-sm text-ink-soft">Seja o primeiro a anunciar nesta categoria.</p>
                <Link href="/anuncios/novo" className="text-sm font-semibold text-clay hover:underline">
                  Criar anúncio
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                  {items.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} favorited={favSet.has(listing.id)} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <nav aria-label="Paginação" className="mt-10 flex items-center justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <Link
                        key={p}
                        href={`/categoria/${slug}?page=${p}`}
                        aria-current={p === page ? "page" : undefined}
                        className={`grid h-9 w-9 place-items-center rounded-full text-sm font-semibold ${
                          p === page ? "bg-clay text-clay-ink" : "border-2 border-line text-ink hover:border-clay"
                        }`}
                      >
                        {p}
                      </Link>
                    ))}
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
