import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Sparkles, Users } from "lucide-react";

const columns = [
  {
    title: "Sobre a Achou",
    links: [
      { href: "/ajuda", label: "Central de ajuda" },
      { href: "/ajuda#seguranca", label: "Dicas de segurança" },
      { href: "/ajuda#termos", label: "Termos de uso" },
      { href: "/ajuda#privacidade", label: "Privacidade" },
    ],
  },
  {
    title: "Comprar",
    links: [
      { href: "/anuncios", label: "Todos os anúncios" },
      { href: "/categoria/veiculos", label: "Veículos" },
      { href: "/categoria/imoveis", label: "Imóveis" },
      { href: "/categoria/eletronicos", label: "Eletrônicos" },
    ],
  },
  {
    title: "Vender",
    links: [
      { href: "/anuncios/novo", label: "Anunciar grátis" },
      { href: "/painel/meus-anuncios", label: "Meus anúncios" },
      { href: "/ajuda#dicas", label: "Dicas para vender rápido" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="texture-noise mt-16 border-t border-line bg-olive text-olive-ink">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Image src="/logo-mark.png" alt="" width={36} height={36} className="h-9 w-9" />
              <span className="font-display text-2xl font-semibold">achou</span>
            </div>
            <p className="max-w-xs text-sm leading-relaxed opacity-80">
              O jeito simples de comprar e vender perto de você. Publique em minutos,
              converse direto com quem interessa e feche negócio com segurança.
            </p>
            <div className="mt-5 flex flex-wrap gap-4 text-xs font-semibold opacity-90">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4" aria-hidden /> Negociação segura
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" aria-hidden /> +12 milhões de usuários
              </span>
              <span className="flex items-center gap-1.5">
                <Sparkles className="h-4 w-4" aria-hidden /> Anúncio grátis
              </span>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <p className="mb-3 font-display text-sm font-semibold">{col.title}</p>
              <ul className="flex flex-col gap-2 text-sm opacity-85">
                {col.links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="chip-underline hover:opacity-100">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-olive-ink/15 pt-6 text-xs opacity-70 sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Achou. Projeto de demonstração — nenhuma transação real é processada.</p>
          <p>Feito com carinho para conectar pessoas.</p>
        </div>
      </div>
    </footer>
  );
}
