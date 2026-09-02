import { cn } from "@/lib/utils";
import type { ComponentProps, ReactNode } from "react";

export function Field({
  label,
  hint,
  error,
  htmlFor,
  children,
  required,
}: {
  label: string;
  hint?: string;
  error?: string;
  htmlFor: string;
  children: ReactNode;
  required?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={htmlFor} className="text-sm font-semibold text-ink flex items-center gap-1">
        {label}
        {required && <span className="text-clay">*</span>}
      </label>
      {children}
      {hint && !error && <p className="text-xs text-ink-soft">{hint}</p>}
      {error && (
        <p className="text-xs text-danger font-medium" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export function Input({ className, ...props }: ComponentProps<"input">) {
  return (
    <input
      className={cn(
        "w-full rounded-xl border-2 border-line bg-[var(--paper-raised)] px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/70 outline-none transition-colors focus:border-clay",
        className
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "w-full rounded-xl border-2 border-line bg-[var(--paper-raised)] px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft/70 outline-none transition-colors focus:border-clay resize-y",
        className
      )}
      {...props}
    />
  );
}

export function Select({ className, ...props }: ComponentProps<"select">) {
  return (
    <select
      className={cn(
        "w-full rounded-xl border-2 border-line bg-[var(--paper-raised)] px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-clay",
        className
      )}
      {...props}
    />
  );
}
