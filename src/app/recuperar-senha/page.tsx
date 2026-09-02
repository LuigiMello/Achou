"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { KeyRound, Mail, CheckCircle2 } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devLink, setDevLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível processar o pedido");
        return;
      }
      setSent(true);
      setDevLink(data.devResetUrl ?? null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Recuperação de senha"
      title="Esqueceu sua senha?"
      subtitle="Informe seu e-mail e enviaremos um link para você criar uma nova senha."
      footer={
        <p>
          Lembrou a senha?{" "}
          <Link href="/entrar" className="font-semibold text-clay hover:underline">
            Voltar para o login
          </Link>
        </p>
      }
    >
      {sent ? (
        <div className="rounded-2xl border-2 border-line bg-[var(--paper-raised)] p-5">
          <CheckCircle2 className="mb-3 h-8 w-8 text-success" aria-hidden />
          <p className="text-sm font-semibold text-ink">Verifique seu e-mail</p>
          <p className="mt-1 text-sm text-ink-soft">
            Se este e-mail existir em nossa base, um link de recuperação foi enviado.
          </p>
          {devLink && (
            <div className="mt-4 rounded-xl border-2 border-dashed border-mustard bg-mustard/10 p-3">
              <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wide text-clay-deep">
                Ambiente de demonstração — sem envio real de e-mail
              </p>
              <Link href={devLink} className="text-sm font-semibold text-clay hover:underline break-all">
                Clique aqui para redefinir sua senha
              </Link>
            </div>
          )}
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <Field label="E-mail" htmlFor="email" required>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-soft" aria-hidden />
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="voce@email.com"
                className="pl-10"
              />
            </div>
          </Field>

          {error && (
            <p role="alert" className="rounded-lg bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" disabled={loading} className="mt-2 w-full">
            <KeyRound className="h-4 w-4" aria-hidden />
            {loading ? "Enviando..." : "Enviar link de recuperação"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
