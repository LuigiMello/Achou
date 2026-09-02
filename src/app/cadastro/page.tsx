"use client";

import { useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, UserPlus, User, Mail, MapPin } from "lucide-react";
import { AuthShell, StepsPanel } from "@/components/auth-shell";
import { Field, Input, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useUser, useToast } from "@/components/providers";
import { BRAZIL_STATES, cn } from "@/lib/utils";

const SIGNUP_STEPS = [
  { title: "Crie sua conta", text: "Leva menos de um minuto, sem cartão de crédito." },
  { title: "Publique seu anúncio", text: "Fotos, título e preço — pronto, já está no ar." },
  { title: "Converse e venda", text: "Responda interessados pelo chat interno e feche negócio." },
];

function passwordStrength(pw: string) {
  let score = 0;
  if (pw.length >= 6) score++;
  if (pw.length >= 10) score++;
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw)) score++;
  if (/[^A-Za-z0-9]/.test(pw)) score++;
  return Math.min(score, 3);
}

export default function RegisterPage() {
  const router = useRouter();
  const { setUser } = useUser();
  const { push } = useToast();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("SP");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const strength = useMemo(() => passwordStrength(password), [password]);
  const strengthLabel = ["Fraca", "Razoável", "Boa", "Forte"][strength];
  const strengthColor = ["bg-danger", "bg-mustard", "bg-clay", "bg-success"][strength];

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, city: city || "São Paulo", state }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível criar sua conta");
        return;
      }
      setUser(data.user);
      push({ title: `Conta criada, ${data.user.name.split(" ")[0]}!`, description: "Bem-vindo(a) à Achou.", tone: "success" });
      router.push("/painel");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Comece grátis"
      title="Crie sua conta"
      subtitle="Leva menos de um minuto. Sem taxas para anunciar."
      panel={<StepsPanel title="Do anúncio à venda em 3 passos simples." steps={SIGNUP_STEPS} />}
      footer={
        <p>
          Já tem conta?{" "}
          <Link href="/entrar" className="font-semibold text-clay hover:underline">
            Entrar
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Field label="Nome completo" htmlFor="name" required>
          <div className="relative">
            <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden />
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como podemos te chamar?"
              className="pl-10"
            />
          </div>
        </Field>

        <Field label="E-mail" htmlFor="email" required>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden />
            <Input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              className="pl-10"
            />
          </div>
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Cidade" htmlFor="city">
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden />
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="São Paulo" className="pl-10" />
            </div>
          </Field>
          <Field label="Estado" htmlFor="state">
            <Select id="state" value={state} onChange={(e) => setState(e.target.value)}>
              {BRAZIL_STATES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Senha" htmlFor="password" required>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-soft hover:text-ink"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" aria-hidden /> : <Eye className="h-4 w-4" aria-hidden />}
            </button>
          </div>
          {password && (
            <div className="flex items-center gap-2 pt-0.5">
              <div className="flex flex-1 gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className={cn("h-1.5 flex-1 rounded-full bg-line transition-colors", i <= strength - 1 && strengthColor)}
                  />
                ))}
              </div>
              <span className="text-[11px] font-semibold text-ink-soft">{strengthLabel}</span>
            </div>
          )}
        </Field>

        {error && (
          <p role="alert" className="rounded-lg bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" disabled={loading} className="mt-2 w-full">
          <UserPlus className="h-4 w-4" aria-hidden />
          {loading ? "Criando conta..." : "Criar conta grátis"}
        </Button>

        <p className="text-center text-[11px] leading-relaxed text-ink-soft">
          Ao continuar, você concorda com os{" "}
          <Link href="/ajuda#termos" className="underline">
            Termos de uso
          </Link>{" "}
          e a{" "}
          <Link href="/ajuda#privacidade" className="underline">
            Política de Privacidade
          </Link>
          .
        </p>
      </form>
    </AuthShell>
  );
}
