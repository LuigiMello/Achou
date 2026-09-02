"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useUser, useToast } from "@/components/providers";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { setUser } = useUser();
  const { push } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível entrar");
        return;
      }
      setUser(data.user);
      push({ title: `Bem-vindo(a) de volta, ${data.user.name.split(" ")[0]}!`, tone: "success" });
      router.push(params.get("next") ?? "/painel");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      eyebrow="Acesse sua conta"
      title="Que bom te ver de novo"
      subtitle="Entre para gerenciar seus anúncios, favoritos e conversas."
      footer={
        <p>
          Ainda não tem conta?{" "}
          <Link href="/cadastro" className="font-semibold text-clay hover:underline">
            Criar conta grátis
          </Link>
        </p>
      }
    >
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <Field label="E-mail" htmlFor="email" required>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="voce@email.com"
          />
        </Field>

        <Field label="Senha" htmlFor="password" required>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
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
        </Field>

        <div className="flex justify-end -mt-1">
          <Link href="/recuperar-senha" className="text-xs font-semibold text-clay hover:underline">
            Esqueceu a senha?
          </Link>
        </div>

        {error && (
          <p role="alert" className="rounded-lg bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" disabled={loading} className="mt-2 w-full">
          <LogIn className="h-4 w-4" aria-hidden />
          {loading ? "Entrando..." : "Entrar"}
        </Button>

        <p className="text-center text-xs text-ink-soft">
          Conta demo: <span className="font-mono">marina@achou.dev</span> / senha{" "}
          <span className="font-mono">senha123</span>
        </p>
      </form>
    </AuthShell>
  );
}
