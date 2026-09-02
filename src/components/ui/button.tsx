import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg" | "icon";

const base =
  "inline-flex items-center justify-center gap-2 font-semibold rounded-full transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none active:scale-[0.97] whitespace-nowrap";

const variants: Record<Variant, string> = {
  primary: "bg-clay text-clay-ink hover:bg-clay-deep shadow-[0_10px_24px_-12px_rgba(193,80,46,0.6)]",
  secondary: "bg-olive text-olive-ink hover:opacity-90",
  outline: "border-2 border-ink/15 text-ink hover:border-clay hover:text-clay bg-transparent",
  ghost: "text-ink hover:bg-ink/6",
  danger: "bg-danger text-white hover:opacity-90",
};

const sizes: Record<Size, string> = {
  sm: "text-sm px-3.5 py-1.5",
  md: "text-sm px-5 py-2.5",
  lg: "text-base px-7 py-3.5",
  icon: "h-10 w-10 shrink-0 p-0",
};

export function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ComponentProps<"button"> & { variant?: Variant; size?: Size }) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}

export function LinkButton({
  className,
  variant = "primary",
  size = "md",
  href,
  ...props
}: ComponentProps<typeof Link> & { variant?: Variant; size?: Size; href: string }) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)} {...props} />
  );
}
