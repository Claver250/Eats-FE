import type { InputHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export const fieldClass = (invalid: boolean) =>
  cn(
    "w-full rounded-lg border bg-surface px-3 py-2.5 text-sm outline-none placeholder:text-muted focus:border-brand-500",
    invalid ? "border-danger" : "border-border",
  );

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  label: string;
  error?: string;
  hint?: ReactNode;
};

export default function TextField({ id, label, error, hint, className, ...input }: Props) {
  const describedBy =
    [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ") || undefined;

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={!!error}
        aria-describedby={describedBy}
        className={cn(fieldClass(!!error), className)}
        {...input}
      />
      {hint && (
        <p id={`${id}-hint`} className="mt-1 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} className="mt-1 text-xs text-danger">
          {error}
        </p>
      )}
    </div>
  );
}