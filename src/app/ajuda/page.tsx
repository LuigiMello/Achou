import Link from "next/link";
import { ShieldCheck, MessageCircle, Tag, CreditCard, Users, HelpCircle } from "lucide-react";
import { FaqAccordion } from "@/components/faq-accordion";

const TOPICS = [
  { icon: Tag, title: "Anunciar", desc: "Como criar, editar e gerenciar seus anúncios." },
  { icon: CreditCard, title: "Pagamentos", desc: "Como funciona a negociação de preços e formas de pagamento." },
  { icon: MessageCircle, title: "Mensagens", desc: "Converse com compradores e vendedores com segurança." },
  { icon: ShieldCheck, title: "Segurança", desc: "Dicas para evitar golpes e negociar com tranquilidade." },
  { icon: Users, title: "Minha conta", desc: "Gerencie seu perfil, senha e preferências." },
];

const GENERAL_FAQ = [
  { q: "Como faço para anunciar um produto?", a: "Clique em \"Anunciar\" no topo da página, escolha uma categoria, adicione fotos, título, descrição e preço. Seu anúncio fica no ar imediatamente após a publicação, sem custo algum." },
  { q: "Anunciar na Achou é gratuito?", a: "Sim! Publicar anúncios na Achou é 100% gratuito e sem limite de quantidade." },
  { q: "Como entro em contato com o vendedor?", a: "Na página do anúncio, use o formulário \"Envie uma mensagem\" na lateral direita. A conversa fica salva no seu painel, em Mensagens." },
  { q: "Posso editar ou excluir um anúncio depois de publicado?", a: "Sim. Acesse Painel > Meus anúncios para pausar, reativar ou excluir qualquer anúncio a qualquer momento." },
  { q: "Como funciona a recuperação de senha?", a: "Na tela de login, clique em \"Esqueceu a senha?\", informe seu e-mail e siga o link de recuperação enviado (neste ambiente de demonstração, o link é exibido na própria tela)." },
];

const SAFETY_TIPS = [
  { q: "Prefira encontros em locais públicos e movimentados", a: "Combine a entrega em locais como shoppings, praças ou agências bancárias, preferencialmente durante o dia." },
  { q: "Desconfie de preços muito abaixo do mercado", a: "Se uma oferta parece boa demais para ser verdade, pesquise o valor médio do produto antes de negociar." },
  { q: "Evite pagamentos antecipados ou fora da plataforma", a: "Nunca envie dinheiro antes de ver o produto pessoalmente, principalmente para desconhecidos." },
  { q: "Verifique o perfil de quem está vendendo ou comprando", a: "Veja há quanto tempo a conta existe e se possui avaliações de outros usuários." },
];

export default function HelpPage() {
  return (
    <div>
      <section className="texture-noise border-b border-line bg-surface py-16 text-center">
        <div className="mx-auto max-w-2xl px-6">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-clay/10 px-4 py-1.5 text-xs font-semibold text-clay">
            <HelpCircle className="h-3.5 w-3.5" aria-hidden /> Central de ajuda
          </span>
          <h1 className="font-display text-4xl font-semibold">Como podemos ajudar?</h1>
          <p className="mt-3 text-ink-soft">Tire suas dúvidas sobre como comprar, vender e usar a Achou com segurança.</p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-6 py-14">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {TOPICS.map((t) => (
            <div key={t.title} className="card-lift flex flex-col gap-2.5 rounded-2xl border-2 border-line bg-[var(--paper-raised)] p-5">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface text-clay">
                <t.icon className="h-5 w-5" aria-hidden />
              </span>
              <p className="font-display font-semibold">{t.title}</p>
              <p className="text-xs text-ink-soft">{t.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="dicas" className="mx-auto max-w-3xl scroll-mt-24 px-6 py-6">
        <h2 className="mb-5 font-display text-2xl font-semibold">Perguntas frequentes</h2>
        <FaqAccordion items={GENERAL_FAQ} />
      </section>

      <section id="seguranca" className="mx-auto max-w-3xl scroll-mt-24 px-6 py-14">
        <h2 className="mb-5 font-display text-2xl font-semibold">Dicas de segurança</h2>
        <FaqAccordion items={SAFETY_TIPS} />
      </section>

      <section id="termos" className="mx-auto max-w-3xl scroll-mt-24 px-6 py-14">
        <h2 className="mb-4 font-display text-2xl font-semibold">Termos de uso</h2>
        <div className="flex flex-col gap-3 text-sm leading-relaxed text-ink-soft">
          <p>
            Este é um projeto de demonstração. Ao usar a Achou, você concorda em publicar apenas anúncios lícitos, com
            informações verdadeiras, e em manter uma conduta respeitosa nas conversas com outros usuários.
          </p>
          <p>
            A Achou atua apenas como uma vitrine que conecta pessoas — não participamos, processamos ou garantimos
            nenhuma transação financeira realizada entre compradores e vendedores.
          </p>
          <p>Reservamo-nos o direito de remover anúncios que violem nossas diretrizes de conteúdo a qualquer momento.</p>
        </div>
      </section>

      <section id="privacidade" className="mx-auto max-w-3xl scroll-mt-24 px-6 py-14">
        <h2 className="mb-4 font-display text-2xl font-semibold">Privacidade</h2>
        <div className="flex flex-col gap-3 text-sm leading-relaxed text-ink-soft">
          <p>
            Coletamos apenas as informações necessárias para o funcionamento da plataforma: nome, e-mail, cidade e os
            dados dos anúncios que você publica.
          </p>
          <p>
            Seus dados de contato só são exibidos para usuários com quem você inicia uma conversa. Você pode editar ou
            remover suas informações a qualquer momento em Painel &gt; Meu perfil.
          </p>
        </div>
      </section>

      <section className="border-t border-line bg-olive py-14 text-center text-olive-ink">
        <p className="mb-4 font-display text-xl font-semibold">Ainda precisa de ajuda?</p>
        <Link href="/anuncios/novo" className="inline-flex items-center gap-2 rounded-full bg-mustard px-6 py-3 text-sm font-semibold text-mustard-ink hover:opacity-90">
          Comece a anunciar agora
        </Link>
      </section>
    </div>
  );
}
