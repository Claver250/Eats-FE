"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export type ActionItem = {
  label: string;
  icon?: ReactNode;
  onSelect?: () => void;
  href?: string; // renders a link instead of a button
  tone?: "default" | "danger";
};

type Props = {
  label: string; // accessible name, e.g. the row it belongs to
  items: ActionItem[];
};

const ITEM_HEIGHT = 40;

// A "⋯" button with a dropdown. The menu is positioned against the screen (not its parent), so it is
// never cut off inside a table that scrolls sideways, and it opens upward near the bottom of the window.
export default function ActionMenu({ label, items }: Props) {
  const [open, setOpen] = useState(false);
  const [style, setStyle] = useState<CSSProperties>({});
  const wrapRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    const onDown = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", close);
    window.addEventListener("scroll", close, true);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", close);
      window.removeEventListener("scroll", close, true);
    };
  }, [open]);

  function toggle() {
    if (open) {
      setOpen(false);
      return;
    }
    const rect = buttonRef.current?.getBoundingClientRect();
    if (rect) {
      const height = items.length * ITEM_HEIGHT + 8;
      const opensUp = rect.bottom + height + 8 > window.innerHeight && rect.top > height;
      setStyle({
        position: "fixed",
        right: Math.max(window.innerWidth - rect.right, 8),
        ...(opensUp ? { bottom: window.innerHeight - rect.top + 4 } : { top: rect.bottom + 4 }),
      });
    }
    setOpen(true);
  }

  const itemClass = (tone: ActionItem["tone"]) =>
    cn(
      "flex w-full items-center gap-2 px-3 text-left text-sm",
      tone === "danger" ? "text-danger hover:bg-red-50" : "hover:bg-gray-50",
    );

  return (
    <div ref={wrapRef} className="inline-block">
      <button
        ref={buttonRef}
        type="button"
        aria-label={`More actions for ${label}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={toggle}
        className="rounded-md border border-border p-1.5 text-muted hover:bg-gray-100"
      >
        <MoreHorizontal className="h-4 w-4" />
      </button>

      {open && (
        <div
          role="menu"
          style={style}
          className="z-40 w-48 rounded-lg border border-border bg-surface py-1 shadow-lg"
        >
          {items.map((item) => {
            const content = (
              <>
                {item.icon && <span className="text-muted">{item.icon}</span>}
                {item.label}
              </>
            );
            return item.href ? (
              <Link
                key={item.label}
                role="menuitem"
                href={item.href}
                onClick={() => setOpen(false)}
                style={{ height: ITEM_HEIGHT }}
                className={itemClass(item.tone)}
              >
                {content}
              </Link>
            ) : (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  item.onSelect?.();
                }}
                style={{ height: ITEM_HEIGHT }}
                className={itemClass(item.tone)}
              >
                {content}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}