import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Heart } from "lucide-react";
import { ListingCard } from "@/components/listing-card";

export default async function FavoritesPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const favorites = await db.favorite.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      listing: {
        include: { category: true, user: { select: { id: true, name: true, avatarSeed: true, city: true, state: true } } },
      },
    },
  });

  const active = favorites.filter((f) => f.listing.status === "active");

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-clay">Painel</p>
      <h1 className="mb-6 font-display text-3xl font-semibold">Favoritos</h1>

      {active.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-line py-20 text-center">
          <Heart className="h-8 w-8 text-ink-soft" aria-hidden />
          <p className="font-display text-lg font-semibold">Você ainda não favoritou nada</p>
          <Link href="/anuncios" className="text-sm font-semibold text-clay hover:underline">
            Explorar anúncios
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
          {active.map((f) => (
            <ListingCard key={f.id} listing={f.listing} favorited />
          ))}
        </div>
      )}
    </div>
  );
}
