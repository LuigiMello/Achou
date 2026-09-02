import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { CreateListingWizard } from "@/components/create-listing-wizard";

export default async function NewListingPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?next=/anuncios/novo");

  const categories = await db.category.findMany({ orderBy: { name: "asc" } });

  return (
    <div className="mx-auto max-w-3xl px-6 py-10">
      <p className="text-xs font-bold uppercase tracking-wide text-clay">Novo anúncio</p>
      <h1 className="font-display text-3xl font-semibold">Vamos anunciar seu produto</h1>
      <p className="mt-1 text-sm text-ink-soft">Leva menos de 3 minutos e é 100% gratuito.</p>

      <div className="mt-8">
        <CreateListingWizard categories={categories} userCity={user.city} userState={user.state} />
      </div>
    </div>
  );
}
