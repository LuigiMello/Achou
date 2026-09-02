import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { ShieldCheck, Sparkles, Users2 } from "lucide-react";

export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
  panel,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  panel?: ReactNode;
}) {
  return (
    <div className="mx-auto grid min-h-[calc(100vh-64px)] max-w-6xl grid-cols-1 lg:grid-cols-2">
      <div className="flex flex-col justify-center px-6 py-14 sm:px-12">
        <div className="mx-auto w-full max-w-sm">
          <Link href="/" className="mb-8 inline-flex items-center gap-2">
            <Image src="/logo-mark.png" alt="" width={34} height={34} className="h-[34px] w-[34px]" />
            <span className="font-display text-xl font-semibold">achou</span>
          </Link>

          <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-clay">{eyebrow}</p>
          <h1 className="font-display text-3xl font-semibold text-ink">{title}</h1>
          <p className="mt-2 text-sm text-ink-soft">{subtitle}</p>

          <div className="mt-8 rounded-3xl border-2 border-line bg-[var(--paper-raised)] p-6 shadow-sm sm:p-7">
            {children}
          </div>
          {footer && <div className="mt-6 text-center text-sm text-ink-soft">{footer}</div>}
        </div>
      </div>

      <div className="texture-noise relative hidden overflow-hidden bg-olive lg:block">
        <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-mustard/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-80 w-80 rounded-full bg-clay/25 blur-3xl" />
        {panel ?? <DefaultPanel />}
      </div>
    </div>
  );
}

function DefaultPanel() {
  return (
    <div className="relative flex h-full flex-col justify-center gap-6 px-14 text-olive-ink">
      <blockquote className="font-display text-2xl font-medium leading-snug">
        “Publiquei meu carro de manhã e à tarde já tinha três interessados. Vendi no mesmo dia.”
      </blockquote>
      <p className="text-sm opacity-75">— Marina Alves, vendedora na Achou</p>

      <div className="mt-8 flex flex-col gap-4 border-t border-olive-ink/15 pt-8">
        <Feature icon={ShieldCheck} text="Dicas de segurança em cada negociação" />
        <Feature icon={Sparkles} text="Anúncios gratuitos e ilimitados" />
        <Feature icon={Users2} text="Milhões de compradores ativos" />
      </div>
    </div>
  );
}

export function StepsPanel({
  title,
  steps,
}: {
  title: string;
  steps: { title: string; text: string }[];
}) {
  return (
    <div className="relative flex h-full flex-col justify-center gap-8 px-14 text-olive-ink">
      <p className="font-display text-2xl font-medium leading-snug">{title}</p>
      <ol className="flex flex-col gap-6">
        {steps.map((s, i) => (
          <li key={s.title} className="flex gap-4">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-mustard font-display text-sm font-bold text-mustard-ink">
              {i + 1}
            </span>
            <div>
              <p className="font-display font-semibold">{s.title}</p>
              <p className="mt-0.5 text-sm text-olive-ink/70">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function Feature({ icon: Icon, text }: { icon: typeof ShieldCheck; text: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-olive-ink/10">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <span className="text-sm font-medium">{text}</span>
    </div>
  );
}
