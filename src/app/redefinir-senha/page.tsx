"use client";

import { Suspense, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, ShieldCheck, CheckCircle2 } from "lucide-react";
import { AuthShell } from "@/components/auth-shell";
import { Field, Input } from "@/components/ui/field";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get("token") ?? "";
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível redefinir a senha");
        return;
      }
      setDone(true);
      setTimeout(() => router.push("/entrar"), 2200);
    } finally {
      setLoading(false);
    }
  }

  if (!token) {
    return (
      <AuthShell eyebrow="Redefinir senha" title="Link inválido" subtitle="Este link de recuperação está incompleto ou expirou.">
        <Link href="/recuperar-senha" className="font-semibold text-clay hover:underline">
          Solicitar um novo link
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Última etapa"
      title="Crie uma nova senha"
      subtitle="Escolha uma senha forte que você ainda não tenha usado."
    >
      {done ? (
        <div className="rounded-2xl border-2 border-line bg-[var(--paper-raised)] p-5">
          <CheckCircle2 className="mb-3 h-8 w-8 text-success" aria-hidden />
          <p className="text-sm font-semibold">Senha redefinida com sucesso!</p>
          <p className="mt-1 text-sm text-ink-soft">Levando você para o login...</p>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
          <Field label="Nova senha" htmlFor="password" hint="Mínimo de 6 caracteres" required>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
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
          </Field>

          {error && (
            <p role="alert" className="rounded-lg bg-danger/10 px-3 py-2 text-sm font-medium text-danger">
              {error}
            </p>
          )}

          <Button type="submit" size="lg" disabled={loading} className="mt-2 w-full">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            {loading ? "Salvando..." : "Redefinir senha"}
          </Button>
        </form>
      )}
    </AuthShell>
  );
}
