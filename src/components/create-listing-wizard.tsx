"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ImagePlus, Loader2, Trash2, ArrowLeft, ArrowRight, PartyPopper } from "lucide-react";
import type { Category } from "@/generated/prisma";
import { CategoryIcon } from "@/lib/category-icons";
import { Field, Input, Textarea, Select } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/providers";
import { formatPrice, BRAZIL_STATES, CONDITIONS } from "@/lib/utils";
import { cn } from "@/lib/utils";

const STEPS = ["Detalhes", "Fotos e preço", "Local e revisão"];

export function CreateListingWizard({
  categories,
  userCity,
  userState,
}: {
  categories: Category[];
  userCity: string;
  userState: string;
}) {
  const router = useRouter();
  const { push } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState(0);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [condition, setCondition] = useState<"new" | "used" | "refurbished">("used");
  const [price, setPrice] = useState("");
  const [negotiable, setNegotiable] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [city, setCity] = useState(userCity);
  const [state, setState] = useState(userState);
  const [errors, setErrors] = useState<string[]>([]);
  const [publishing, setPublishing] = useState(false);
  const [done, setDone] = useState<string | null>(null);

  function validateStep(target: number) {
    const errs: string[] = [];
    if (target > 0) {
      if (title.trim().length < 5) errs.push("Escreva um título com pelo menos 5 caracteres");
      if (description.trim().length < 20) errs.push("Descreva melhor o produto (mín. 20 caracteres)");
    }
    if (target > 1) {
      if (images.length === 0) errs.push("Adicione ao menos uma foto");
      if (!price || Number(price) < 0) errs.push("Informe um preço válido (ou 0 para 'a combinar')");
    }
    setErrors(errs);
    return errs.length === 0;
  }

  function goNext() {
    if (validateStep(step + 1)) setStep((s) => Math.min(2, s + 1));
  }

  async function handleFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    const remaining = 8 - images.length;
    const files = Array.from(fileList).slice(0, remaining);
    if (files.length === 0) return;

    setUploading(true);
    try {
      const form = new FormData();
      files.forEach((f) => form.append("files", f));
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) {
        push({ title: "Erro ao enviar fotos", description: data.error, tone: "danger" });
        return;
      }
      setImages((prev) => [...prev, ...data.urls]);
    } finally {
      setUploading(false);
    }
  }

  async function publish() {
    if (!validateStep(2)) return;
    setPublishing(true);
    try {
      const res = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
          price: Number(price) || 0,
          negotiable,
          condition,
          city,
          state,
          categoryId,
          images,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setErrors([data.error ?? "Não foi possível publicar o anúncio"]);
        return;
      }
      setDone(data.listing.id);
      push({ title: "Anúncio publicado!", description: "Já está visível para todo mundo.", tone: "success" });
    } finally {
      setPublishing(false);
    }
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-2xl border-2 border-line bg-[var(--paper-raised)] py-16 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-success/15 text-success">
          <PartyPopper className="h-8 w-8" aria-hidden />
        </span>
        <h2 className="font-display text-2xl font-semibold">Seu anúncio está no ar!</h2>
        <p className="max-w-sm text-sm text-ink-soft">
          Agora é só aguardar interessados. Você será notificado a cada nova mensagem.
        </p>
        <div className="mt-2 flex gap-3">
          <Button onClick={() => router.push(`/anuncios/${done}`)}>Ver anúncio</Button>
          <Button variant="outline" onClick={() => router.push("/painel/meus-anuncios")}>
            Meus anúncios
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ol className="mb-8 flex items-center gap-2">
        {STEPS.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-2">
            <span
              className={cn(
                "grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold transition-colors",
                i < step ? "bg-olive text-olive-ink" : i === step ? "bg-clay text-clay-ink" : "bg-surface text-ink-soft"
              )}
            >
              {i < step ? <Check className="h-4 w-4" aria-hidden /> : i + 1}
            </span>
            <span className={cn("hidden text-xs font-semibold sm:block", i === step ? "text-ink" : "text-ink-soft")}>
              {label}
            </span>
            {i < STEPS.length - 1 && <span className="h-0.5 flex-1 bg-line" aria-hidden />}
          </li>
        ))}
      </ol>

      <div className="rounded-2xl border-2 border-line bg-[var(--paper-raised)] p-6">
        {step === 0 && (
          <div className="flex flex-col gap-4">
            <Field label="Categoria" htmlFor="category" required>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {categories.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setCategoryId(c.id)}
                    className={cn(
                      "flex flex-col items-center gap-1.5 rounded-xl border-2 p-3 text-center transition-colors",
                      categoryId === c.id ? "border-clay bg-clay/5" : "border-line hover:border-clay/50"
                    )}
                  >
                    <CategoryIcon icon={c.icon} className={cn("h-5 w-5", categoryId === c.id ? "text-clay" : "text-ink-soft")} />
                    <span className="text-[11px] font-semibold leading-tight">{c.name}</span>
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Título do anúncio" htmlFor="title" required hint="Seja específico: marca, modelo, estado.">
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Ex: iPhone 13 128GB Azul" maxLength={100} />
            </Field>

            <Field label="Descrição" htmlFor="description" required hint="Detalhe estado de conservação, motivo da venda, etc.">
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={6} placeholder="Descreva seu produto..." maxLength={3000} />
            </Field>

            <Field label="Condição" htmlFor="condition" required>
              <div className="flex gap-2">
                {Object.entries(CONDITIONS).map(([value, label]) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setCondition(value as typeof condition)}
                    className={cn(
                      "flex-1 rounded-xl border-2 py-2.5 text-sm font-semibold transition-colors",
                      condition === value ? "border-clay bg-clay/5 text-clay" : "border-line text-ink-soft hover:border-clay/50"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        )}

        {step === 1 && (
          <div className="flex flex-col gap-5">
            <Field label="Fotos" htmlFor="photos" required hint={`${images.length}/8 fotos adicionadas`}>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {images.map((img, i) => (
                  <div key={img} className="group relative aspect-square overflow-hidden rounded-xl border-2 border-line">
                    <img src={img} alt="" className="h-full w-full object-cover" />
                    {i === 0 && (
                      <span className="absolute left-1 top-1 rounded bg-ink/70 px-1.5 py-0.5 text-[9px] font-bold text-paper">CAPA</span>
                    )}
                    <button
                      type="button"
                      onClick={() => setImages((prev) => prev.filter((_, idx) => idx !== i))}
                      className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-full bg-danger text-white opacity-0 transition-opacity group-hover:opacity-100"
                      aria-label="Remover foto"
                    >
                      <Trash2 className="h-3 w-3" aria-hidden />
                    </button>
                  </div>
                ))}
                {images.length < 8 && (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-line text-ink-soft hover:border-clay hover:text-clay"
                  >
                    {uploading ? <Loader2 className="h-5 w-5 animate-spin" aria-hidden /> : <ImagePlus className="h-5 w-5" aria-hidden />}
                    <span className="text-[11px] font-semibold">Adicionar</span>
                  </button>
                )}
              </div>
              <input
                ref={fileInputRef}
                id="photos"
                type="file"
                accept="image/*"
                multiple
                className="sr-only"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Preço (R$)" htmlFor="price" required hint="Use 0 para 'a combinar'">
                <Input id="price" type="number" min={0} inputMode="decimal" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0,00" />
              </Field>
              <div className="flex items-end pb-2.5">
                <label className="flex items-center gap-2 text-sm font-medium">
                  <input type="checkbox" checked={negotiable} onChange={(e) => setNegotiable(e.target.checked)} className="h-4 w-4 accent-[var(--clay)]" />
                  Preço negociável
                </label>
              </div>
            </div>

            {price && Number(price) > 0 && (
              <p className="text-sm text-ink-soft">
                Pré-visualização: <span className="font-display font-semibold text-ink">{formatPrice(Number(price))}</span>
              </p>
            )}
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col gap-5">
            <div className="grid grid-cols-2 gap-4">
              <Field label="Cidade" htmlFor="city" required>
                <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
              </Field>
              <Field label="Estado" htmlFor="state" required>
                <Select id="state" value={state} onChange={(e) => setState(e.target.value)}>
                  {BRAZIL_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              </Field>
            </div>

            <div className="rounded-xl border-2 border-line bg-surface p-4">
              <p className="mb-3 text-xs font-bold uppercase tracking-wide text-ink-soft">Revisão do anúncio</p>
              <div className="flex gap-3">
                {images[0] && <img src={images[0]} alt="" className="h-20 w-20 rounded-lg object-cover" />}
                <div className="min-w-0">
                  <p className="truncate font-display font-semibold">{title}</p>
                  <p className="font-display text-clay font-bold">{Number(price) > 0 ? formatPrice(Number(price)) : "A combinar"}</p>
                  <p className="text-xs text-ink-soft">{city}, {state} · {CONDITIONS[condition]}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {errors.length > 0 && (
          <ul className="mt-4 flex flex-col gap-1 rounded-xl bg-danger/10 p-3 text-sm font-medium text-danger">
            {errors.map((e) => (
              <li key={e} role="alert">{e}</li>
            ))}
          </ul>
        )}

        <div className="mt-6 flex items-center justify-between">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(0, s - 1))} disabled={step === 0} type="button">
            <ArrowLeft className="h-4 w-4" aria-hidden /> Voltar
          </Button>

          {step < 2 ? (
            <Button onClick={goNext} type="button">
              Continuar <ArrowRight className="h-4 w-4" aria-hidden />
            </Button>
          ) : (
            <Button onClick={publish} disabled={publishing} type="button">
              {publishing ? "Publicando..." : "Publicar anúncio"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
