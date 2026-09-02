"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, Tag, Heart, MessageCircle, User, Bell, Plus } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/painel", label: "Visão geral", icon: LayoutGrid, exact: true },
  { href: "/painel/meus-anuncios", label: "Meus anúncios", icon: Tag },
  { href: "/painel/favoritos", label: "Favoritos", icon: Heart },
  { href: "/painel/mensagens", label: "Mensagens", icon: MessageCircle },
  { href: "/painel/notificacoes", label: "Notificações", icon: Bell },
  { href: "/painel/perfil", label: "Meu perfil", icon: User },
];

export function PainelSidebar({
  user,
}: {
  user: { name: string; email: string; avatarSeed: string; city: string; state: string };
}) {
  const pathname = usePathname();

  return (
    <aside className="w-full shrink-0 lg:w-64">
      <div className="mb-4 flex items-center gap-3 rounded-2xl border-2 border-line bg-[var(--paper-raised)] p-4">
        <Avatar name={user.name} seed={user.avatarSeed} size={44} />
        <div className="min-w-0">
          <p className="truncate font-display font-semibold">{user.name}</p>
          <p className="truncate text-xs text-ink-soft">{user.city}, {user.state}</p>
        </div>
      </div>

      <nav className="flex flex-row gap-1 overflow-x-auto rounded-2xl border-2 border-line bg-[var(--paper-raised)] p-1.5 lg:flex-col lg:overflow-visible">
        {LINKS.map((link) => {
          const active = link.exact ? pathname === link.href : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex shrink-0 items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap",
                active ? "bg-clay text-clay-ink" : "text-ink-soft hover:bg-ink/5 hover:text-ink"
              )}
            >
              <link.icon className="h-4 w-4" aria-hidden />
              {link.label}
            </Link>
          );
        })}
      </nav>

      <Link
        href="/anuncios/novo"
        className="mt-4 hidden items-center justify-center gap-2 rounded-2xl bg-olive px-4 py-3 text-sm font-semibold text-olive-ink hover:opacity-90 lg:flex"
      >
        <Plus className="h-4 w-4" aria-hidden /> Novo anúncio
      </Link>
    </aside>
  );
}
