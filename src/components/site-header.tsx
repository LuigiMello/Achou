import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import { CategoryIcon } from "@/lib/category-icons";
import { SearchBar } from "@/components/search-bar";
import { UserMenu } from "@/components/user-menu";
import { NotificationBell } from "@/components/notification-bell";
import { PreferencesMenu } from "@/components/preferences-menu";
import { LinkButton } from "@/components/ui/button";
import { MobileMenu } from "@/components/mobile-menu";
import { Plus } from "lucide-react";

export async function SiteHeader() {
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  return (
    <header className="sticky top-0 z-50 bg-[var(--paper)]/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3.5 sm:px-6">
        <MobileMenu categories={categories} />

        <Link href="/" className="flex items-center gap-2 shrink-0 group" aria-label="Achou — página inicial">
          <Image
            src="/logo-mark.png"
            alt=""
            width={36}
            height={36}
            priority
            className="h-9 w-9 shrink-0 transition-transform group-hover:scale-105"
          />
          <Image
            src="/logo-wordmark.png"
            alt="Achou"
            width={108}
            height={26}
            priority
            className="hidden h-[26px] w-auto sm:inline-block"
          />
        </Link>

        <div className="hidden flex-1 md:block">
          <SearchBar categories={categories} />
        </div>

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1">
          <PreferencesMenu />
          <NotificationBell />
          <span className="mx-1.5 hidden h-6 w-px bg-line sm:block" aria-hidden />
          <LinkButton href="/anuncios/novo" size="sm" className="hidden sm:inline-flex">
            <Plus className="h-4 w-4" aria-hidden />
            Anunciar
          </LinkButton>
          <UserMenu />
        </div>
      </div>

      <div className="block px-4 pb-3 md:hidden">
        <SearchBar categories={categories} />
      </div>

      <nav aria-label="Categorias" className="relative hidden border-t border-line/60 md:block">
        <div className="mx-auto flex max-w-7xl gap-6 overflow-x-auto px-6 py-2.5 scrollbar-thin">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/categoria/${c.slug}`}
              className="chip-underline flex shrink-0 items-center gap-1.5 py-1 text-xs font-medium text-ink-soft hover:text-clay whitespace-nowrap"
            >
              <CategoryIcon icon={c.icon} className="h-3.5 w-3.5" />
              {c.name}
            </Link>
          ))}
        </div>
        <div className="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-[var(--paper)] to-transparent" aria-hidden />
      </nav>

      <div className="border-t border-line/60" />
    </header>
  );
}
