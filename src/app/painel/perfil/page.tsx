import { getCurrentUser } from "@/lib/auth";
import { ProfileForm } from "@/components/profile-form";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) return null;

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-wide text-clay">Painel</p>
      <h1 className="mb-6 font-display text-3xl font-semibold">Meu perfil</h1>
      <ProfileForm user={{ ...user, createdAt: user.createdAt.toISOString() }} />
    </div>
  );
}
