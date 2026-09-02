"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutGrid, Heart, MessageCircle, User, LogOut, ChevronDown, Tag } from "lucide-react";
import { useUser, useToast } from "@/components/providers";
import { Avatar } from "@/components/ui/avatar";
import { LinkButton } from "@/components/ui/button";
import type { ComponentType } from "react";

export function UserMenu() {
  const { user, setUser } = useUser();
  const { push } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setOpen(false);
    push({ title: "Até logo!", description: "Você saiu da sua conta.", tone: "default" });
    router.push("/");
    router.refresh();
  }

  if (!user) {
    return (
      <div className="flex items-center gap-2">
        <LinkButton href="/entrar" variant="ghost" size="sm" className="hidden sm:inline-flex">
          Entrar
        </LinkButton>
        <LinkButton href="/cadastro" variant="outline" size="sm">
          Criar conta
        </LinkButton>
      </div>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="Menu da conta"
        className="flex items-center gap-1.5 rounded-full border-2 border-transparent p-0.5 hover:border-line"
      >
        <Avatar name={user.name} seed={user.avatarSeed} size={34} />
        <ChevronDown className="hidden h-3.5 w-3.5 text-ink-soft sm:block" aria-hidden />
      </button>

      {open && (
        <div
          role="menu"
          className="rise-in absolute right-0 top-12 w-64 overflow-hidden rounded-2xl border-2 border-line bg-[var(--paper-raised)] shadow-2xl"
        >
          <div className="flex items-center gap-3 border-b border-line px-4 py-3">
            <Avatar name={user.name} seed={user.avatarSeed} size={40} />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-xs text-ink-soft">{user.email}</p>
            </div>
          </div>
          <nav className="py-1.5 text-sm">
            <MenuLink href="/painel" icon={LayoutGrid} onClick={() => setOpen(false)}>
              Painel
            </MenuLink>
            <MenuLink href="/painel/meus-anuncios" icon={Tag} onClick={() => setOpen(false)}>
              Meus anúncios
            </MenuLink>
            <MenuLink href="/painel/favoritos" icon={Heart} onClick={() => setOpen(false)}>
              Favoritos
            </MenuLink>
            <MenuLink href="/painel/mensagens" icon={MessageCircle} onClick={() => setOpen(false)}>
              Mensagens
            </MenuLink>
            <MenuLink href="/painel/perfil" icon={User} onClick={() => setOpen(false)}>
              Meu perfil
            </MenuLink>
          </nav>
          <div className="border-t border-line py-1.5">
            <button
              onClick={logout}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm font-medium text-danger hover:bg-danger/10"
            >
              <LogOut className="h-4 w-4" aria-hidden /> Sair
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function MenuLink({
  href,
  icon: Icon,
  children,
  onClick,
}: {
  href: string;
  icon: ComponentType<{ className?: string }>;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link href={href} onClick={onClick} className="flex items-center gap-2.5 px-4 py-2 hover:bg-ink/5">
      <Icon className="h-4 w-4 text-ink-soft" aria-hidden />
      {children}
    </Link>
  );
}
