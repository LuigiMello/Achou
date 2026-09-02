import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { Tag, Eye, Heart, MessageCircle, ArrowRight, Plus, Sparkles } from "lucide-react";
import { ListingCard } from "@/components/listing-card";

export default async function PainelOverviewPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [listings, totalViews, favoritesReceived, unreadMessages, recentListings] = await Promise.all([
    db.listing.count({ where: { userId: user.id } }),
    db.listing.aggregate({ where: { userId: user.id }, _sum: { views: true } }),
    db.favorite.count({ where: { listing: { userId: user.id } } }),
    db.message.count({ where: { conversation: { sellerId: user.id }, senderId: { not: user.id }, read: false } }),
    db.listing.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 4,
      include: { category: true, user: { select: { id: true, name: true, avatarSeed: true, city: true, state: true } } },
    }),
  ]);

  const stats = [
    { label: "Anúncios ativos", value: listings, icon: Tag, href: "/painel/meus-anuncios" },
    { label: "Visualizações totais", value: totalViews._sum.views ?? 0, icon: Eye, href: "/painel/meus-anuncios" },
    { label: "Favoritado por", value: favoritesReceived, icon: Heart, href: "/painel/meus-anuncios" },
    { label: "Mensagens não lidas", value: unreadMessages, icon: MessageCircle, href: "/painel/mensagens" },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-clay">Painel</p>
        <h1 className="flex items-center gap-2.5 font-display text-3xl font-semibold">
          Olá, {user.name.split(" ")[0]}
          <Sparkles className="h-6 w-6 text-mustard" aria-hidden />
        </h1>
        <p className="mt-1 text-sm text-ink-soft">Aqui está um resumo da sua atividade na Achou.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="card-lift flex flex-col gap-3 rounded-2xl border-2 border-line bg-[var(--paper-raised)] p-5"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface text-clay">
              <s.icon className="h-5 w-5" aria-hidden />
            </span>
            <p className="font-display text-2xl font-bold">{s.value}</p>
            <p className="text-xs font-semibold text-ink-soft">{s.label}</p>
          </Link>
        ))}
      </div>

      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Seus últimos anúncios</h2>
          {listings > 0 && (
            <Link href="/painel/meus-anuncios" className="flex items-center gap-1 text-sm font-semibold text-clay hover:underline">
              Ver todos <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          )}
        </div>

        {recentListings.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-line py-16 text-center">
            <p className="font-display text-lg font-semibold">Você ainda não publicou nada</p>
            <p className="max-w-xs text-sm text-ink-soft">Anuncie gratuitamente e comece a vender hoje mesmo.</p>
            <Link href="/anuncios/novo" className="mt-1 flex items-center gap-2 rounded-full bg-clay px-5 py-2.5 text-sm font-semibold text-clay-ink hover:bg-clay-deep">
              <Plus className="h-4 w-4" aria-hidden /> Criar meu primeiro anúncio
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {recentListings.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
