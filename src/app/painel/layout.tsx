import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { PainelSidebar } from "@/components/painel-sidebar";

export default async function PainelLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/entrar?next=/painel");

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <div className="flex flex-col gap-8 lg:flex-row">
        <PainelSidebar user={user} />
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
