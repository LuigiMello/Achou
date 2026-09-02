import { avatarColors, initials } from "@/lib/utils";

export function Avatar({ name, seed, size = 40 }: { name: string; seed?: string; size?: number }) {
  const [bg, fg] = avatarColors(seed ?? name);
  return (
    <div
      className="flex items-center justify-center rounded-full font-display font-semibold shrink-0"
      style={{ width: size, height: size, background: bg, color: fg, fontSize: size * 0.38 }}
      aria-hidden
    >
      {initials(name)}
    </div>
  );
}
