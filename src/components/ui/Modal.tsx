"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { X } from "lucide-react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const widths = {
  sm: "sm:max-w-md", // short summaries and confirmations
  lg: "sm:max-w-2xl", // long forms
} as const;

type Props = {
  title: string;
  description?: string;
  icon?: ReactNode;
  size?: keyof typeof widths; // width on larger screens, "lg" by default
  onClose: () => void; // called for Escape, the X button and clicks on the backdrop
  children: ReactNode; // usually a <form className="flex min-h-0 flex-1 flex-col">
};

// Accessible dialog shell: focus moves in on open, Tab stays inside, Escape closes,
// the page behind stops scrolling, and focus returns to the button that opened it.
export default function Modal({ title, description, icon, size = "lg", onClose, children }: Props) {
  const titleId = useId();
  const descId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const dialog = dialogRef.current;
    const first =
      dialog?.querySelector<HTMLElement>("[data-autofocus]") ??
      dialog?.querySelector<HTMLElement>(FOCUSABLE);
    first?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current();
    };
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
      opener?.focus?.();
    };
  }, []);

  function keepFocusInside(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== "Tab" || !dialogRef.current) return;
    const nodes = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    const active = document.activeElement;

    if (e.shiftKey && active === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
      <div
        data-testid="modal-backdrop"
        className="absolute inset-0 bg-black/40"
        onClick={() => onCloseRef.current()}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={description ? descId : undefined}
        onKeyDown={keepFocusInside}
        className={`relative flex max-h-[100dvh] w-full flex-col rounded-t-2xl bg-surface shadow-xl sm:max-h-[90vh] sm:rounded-2xl ${widths[size]}`}
      >
        <div className="flex shrink-0 items-start gap-3 border-b border-border px-6 py-4">
          {icon && (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
              {icon}
            </span>
          )}
          <div className="min-w-0 flex-1">
            <h2 id={titleId} className="text-base font-semibold">
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-0.5 text-xs text-muted">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => onCloseRef.current()}
            className="rounded-full p-1.5 text-muted hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}