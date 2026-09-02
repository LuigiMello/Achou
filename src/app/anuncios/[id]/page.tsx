import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { formatPrice, timeAgo, CONDITIONS } from "@/lib/utils";
import { ProductGallery } from "@/components/product-gallery";
import { ContactSellerCard } from "@/components/contact-seller-card";
import { ListingCard } from "@/components/listing-card";
import { CategoryIcon } from "@/lib/category-icons";
import { MapPin, Eye, Clock, ChevronRight } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await db.listing.findUnique({ where: { id } });
  return { title: listing ? `${listing.title} — Achou` : "Anúncio — Achou" };
}

export default async function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();

  const listing = await db.listing.findUnique({
    where: { id },
    include: {
      category: true,
      user: { select: { id: true, name: true, avatarSeed: true, city: true, state: true, createdAt: true } },
    },
  });

  if (!listing || listing.status !== "active") notFound();

  db.listing.update({ where: { id }, data: { views: { increment: 1 } } }).catch(() => {});

  const [favorite, related] = await Promise.all([
    user
      ? db.favorite.findUnique({ where: { userId_listingId: { userId: user.id, listingId: id } } })
      : Promise.resolve(null),
    db.listing.findMany({
      where: { categoryId: listing.categoryId, status: "active", id: { not: id } },
      take: 4,
      orderBy: { createdAt: "desc" },
      include: { category: true, user: { select: { id: true, name: true, avatarSeed: true, city: true, state: true } } },
    }),
  ]);

  const images: string[] = JSON.parse(listing.images || "[]");

  return (
    <div className="mx-auto max-w-7xl px-6 py-8">
      <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-ink-soft">
        <Link href="/" className="hover:text-clay">Início</Link>
        <ChevronRight className="h-3 w-3" aria-hidden />
        <Link href={`/categoria/${listing.category.slug}`} className="flex items-center gap-1 hover:text-clay">
          <CategoryIcon icon={listing.category.icon} className="h-3.5 w-3.5" />
          {listing.category.name}
        </Link>
        <ChevronRight className="h-3 w-3" aria-hidden />
        <span className="truncate text-ink">{listing.title}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div>
          <ProductGallery images={images} title={listing.title} />

          <div className="mt-8">
            <div className="mb-1 flex items-center gap-2 text-xs font-semibold text-clay">
              <span className="rounded-full bg-clay/10 px-2.5 py-1 uppercase tracking-wide">{CONDITIONS[listing.condition]}</span>
            </div>
            <h1 className="font-display text-3xl font-semibold leading-tight text-ink sm:text-4xl">{listing.title}</h1>
            <p className="font-display mt-3 text-3xl font-bold text-clay">
              {listing.price > 0 ? formatPrice(listing.price) : "A combinar"}
              {listing.negotiable && listing.price > 0 && (
                <span className="ml-2 text-sm font-normal text-ink-soft">negociável</span>
              )}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 border-y border-line py-3 text-sm text-ink-soft">
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" aria-hidden /> {listing.city}, {listing.state}
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4" aria-hidden /> Publicado {timeAgo(listing.createdAt)}
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="h-4 w-4" aria-hidden /> {listing.views} visualizações
              </span>
            </div>

            <div className="mt-6">
              <h2 className="mb-2 font-display text-lg font-semibold">Descrição</h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-ink-soft">{listing.description}</p>
            </div>
          </div>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <ContactSellerCard
            listingId={listing.id}
            isOwner={user?.id === listing.userId}
            seller={{ ...listing.user, createdAt: listing.user.createdAt.toISOString() }}
            favorited={Boolean(favorite)}
          />
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 font-display text-2xl font-semibold">Você também pode gostar</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {related.map((r) => (
              <ListingCard key={r.id} listing={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
