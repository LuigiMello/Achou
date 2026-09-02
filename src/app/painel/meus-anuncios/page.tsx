import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Plus, Tag } from "lucide-react";
import { MyListingRow } from "@/components/my-listing-row";

export default async function MyListingsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const listings = await db.listing.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { category: true, _count: { select: { favorites: true } } },
  });

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-clay">Painel</p>
          <h1 className="font-display text-3xl font-semibold">Meus anúncios</h1>
        </div>
        <Link href="/anuncios/novo" className="flex items-center gap-2 rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-clay-ink hover:bg-clay-deep">
          <Plus className="h-4 w-4" aria-hidden /> Novo anúncio
        </Link>
      </div>

      {listings.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-line py-20 text-center">
          <Tag className="h-8 w-8 text-ink-soft" aria-hidden />
          <p className="font-display text-lg font-semibold">Nenhum anúncio publicado ainda</p>
          <Link href="/anuncios/novo" className="text-sm font-semibold text-clay hover:underline">
            Criar meu primeiro anúncio
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {listings.map((l) => (
            <MyListingRow
              key={l.id}
              listing={{ ...l, createdAt: l.createdAt.toISOString() }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
