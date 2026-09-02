import type { Metadata } from "next";
import { Fraunces, Manrope } from "next/font/google";
import "./globals.css";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { AppProviders } from "@/components/providers";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  axes: ["opsz", "SOFT", "WONK"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Achou — Compre e venda perto de você",
  description:
    "Achou é o marketplace para comprar, vender e negociar com sua vizinhança: veículos, imóveis, eletrônicos e muito mais.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const user = await getCurrentUser();
  const unreadCount = user
    ? await db.notification.count({ where: { userId: user.id, read: false } })
    : 0;

  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${manrope.variable} h-full antialiased`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AppProviders user={user} unreadCount={unreadCount}>
          <a href="#conteudo" className="skip-link">
            Pular para o conteúdo
          </a>
          <SiteHeader />
          <main id="conteudo" className="flex-1">
            {children}
          </main>
          <SiteFooter />
        </AppProviders>
      </body>
    </html>
  );
}
