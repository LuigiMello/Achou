"use client";

import { useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import { Field, Input, Textarea, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { useUser, useToast } from "@/components/providers";
import { BRAZIL_STATES } from "@/lib/utils";
import type { PublicUser } from "@/components/providers";

export function ProfileForm({ user }: { user: Omit<PublicUser, "createdAt"> & { createdAt: string } }) {
  const { setUser } = useUser();
  const { push } = useToast();
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone ?? "");
  const [city, setCity] = useState(user.city);
  const [state, setState] = useState(user.state);
  const [bio, setBio] = useState(user.bio ?? "");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, city, state, bio }),
      });
      const data = await res.json();
      if (res.ok) {
        setUser(data.user);
        push({ title: "Perfil atualizado!", tone: "success" });
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[auto_1fr]">
      <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-line bg-[var(--paper-raised)] p-6 lg:w-56">
        <Avatar name={name} seed={user.avatarSeed} size={88} />
        <p className="text-center font-display font-semibold">{name}</p>
        <p className="text-center text-xs text-ink-soft break-all">{user.email}</p>
      </div>

      <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-2xl border-2 border-line bg-[var(--paper-raised)] p-6">
        <Field label="Nome completo" htmlFor="name" required>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
        </Field>

        <Field label="Telefone / WhatsApp" htmlFor="phone" hint="Opcional — visível apenas para quem você conversar">
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(11) 90000-0000" />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Cidade" htmlFor="city">
            <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
          </Field>
          <Field label="Estado" htmlFor="state">
            <Select id="state" value={state} onChange={(e) => setState(e.target.value)}>
              {BRAZIL_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="Sobre você" htmlFor="bio" hint="Apareça de forma mais confiável para compradores">
          <Textarea id="bio" value={bio} onChange={(e) => setBio(e.target.value)} rows={4} placeholder="Conte um pouco sobre você..." />
        </Field>

        <Button type="submit" disabled={saving} className="w-fit">
          <Save className="h-4 w-4" aria-hidden />
          {saving ? "Salvando..." : "Salvar alterações"}
        </Button>
      </form>
    </div>
  );
}
