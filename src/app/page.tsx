import Link from "next/link";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { ParallaxHero } from "@/components/parallax-hero";
import { ListingCard } from "@/components/listing-card";
import { CategoryIcon } from "@/lib/category-icons";
import { ArrowRight, ShieldCheck, Zap, MessageCircle, Award } from "lucide-react";

export default async function HomePage() {
  const user = await getCurrentUser();

  const [categories, featured, recent, favorites] = await Promise.all([
    db.category.findMany({ orderBy: { name: "asc" } }),
    db.listing.findMany({
      where: { status: "active", featured: true },
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { category: true, user: { select: { id: true, name: true, avatarSeed: true, city: true, state: true } } },
    }),
    db.listing.findMany({
      where: { status: "active" },
      take: 12,
      orderBy: { createdAt: "desc" },
      include: { category: true, user: { select: { id: true, name: true, avatarSeed: true, city: true, state: true } } },
    }),
    user
      ? db.favorite.findMany({ where: { userId: user.id }, select: { listingId: true } })
      : Promise.resolve([]),
  ]);

  const favSet = new Set(favorites.map((f) => f.listingId));

  return (
    <>
      <ParallaxHero categories={categories.slice(0, 10)} />

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">Explore por categoria</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {categories.map((c, i) => (
            <Link
              key={c.id}
              href={`/categoria/${c.slug}`}
              className="card-lift group flex flex-col items-center gap-3 rounded-2xl border-2 border-line bg-[var(--paper-raised)] p-5 text-center rise-in"
              style={{ animationDelay: `${i * 0.03}s` }}
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-surface text-clay transition-colors group-hover:bg-clay group-hover:text-clay-ink">
                <CategoryIcon icon={c.icon} className="h-6 w-6" />
              </span>
              <span className="text-sm font-semibold leading-tight">{c.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="border-y border-line bg-surface/60 py-14">
          <div className="mx-auto max-w-7xl px-6">
            <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-wide text-clay">Selecionados para você</p>
                <h2 className="font-display text-2xl font-semibold sm:text-3xl">Anúncios em destaque</h2>
              </div>
              <Link href="/anuncios" className="chip-underline flex items-center gap-1 text-sm font-semibold text-ink-soft hover:text-clay">
                Ver tudo <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {featured.map((listing, i) => (
                <ListingCard key={listing.id} listing={listing} favorited={favSet.has(listing.id)} priority={i < 4} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-6 py-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-clay">Fresquinho</p>
            <h2 className="font-display text-2xl font-semibold sm:text-3xl">Publicados recentemente</h2>
          </div>
          <Link href="/anuncios" className="chip-underline flex items-center gap-1 text-sm font-semibold text-ink-soft hover:text-clay">
            Ver tudo <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {recent.map((listing) => (
            <ListingCard key={listing.id} listing={listing} favorited={favSet.has(listing.id)} />
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-ink py-16 text-paper">
        <div className="mx-auto grid max-w-7xl gap-8 px-6 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, title: "Negociação segura", desc: "Dicas e verificações para você comprar e vender com tranquilidade." },
            { icon: Zap, title: "Publique em minutos", desc: "Suba fotos, escreva o essencial e pronto — seu anúncio já está no ar." },
            { icon: MessageCircle, title: "Fale direto com quem interessa", desc: "Sem intermediários: converse pelo chat interno e combine tudo." },
          ].map((f) => (
            <div key={f.title} className="flex flex-col gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-xl bg-mustard text-mustard-ink">
                <f.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="font-display text-lg font-semibold">{f.title}</h3>
              <p className="text-sm text-paper/70">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16 text-center">
        <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-mustard/20 px-4 py-1.5 text-xs font-semibold text-clay-deep">
          <Award className="h-3.5 w-3.5" aria-hidden /> Comece agora, é grátis
        </span>
        <h2 className="mx-auto max-w-xl font-display text-3xl font-semibold sm:text-4xl">
          Tem algo parado aí em casa? Coloque à venda hoje mesmo.
        </h2>
        <Link
          href="/anuncios/novo"
          className="mt-7 inline-flex items-center gap-2 rounded-full bg-clay px-7 py-3.5 text-sm font-semibold text-clay-ink hover:bg-clay-deep"
        >
          Anunciar grátis <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </section>
    </>
  );
}
