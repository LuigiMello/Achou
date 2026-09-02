"use client";

import { useRouter } from "next/navigation";
import { CheckCheck } from "lucide-react";
import { useUser } from "@/components/providers";

export function MarkAllReadButton() {
  const router = useRouter();
  const { setUnreadCount } = useUser();

  async function markAll() {
    await fetch("/api/notifications", { method: "PATCH" });
    setUnreadCount(0);
    router.refresh();
  }

  return (
    <button onClick={markAll} className="flex items-center gap-1.5 text-sm font-semibold text-clay hover:underline">
      <CheckCheck className="h-4 w-4" aria-hidden /> Marcar tudo como lido
    </button>
  );
}
