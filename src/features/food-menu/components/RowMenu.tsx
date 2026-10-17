"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";

type Props = {
    label: string; // the dish name, used for the accessible button label
    onEdit: () => void;
    onDelete: () => void;
};

export default function RowMenu({ label, onEdit, onDelete }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) return;
        const onDown = (e: MouseEvent) => {
        if (!ref.current?.contains(e.target as Node)) setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        document.addEventListener("keydown", onKey);
        return () => {
        document.removeEventListener("mousedown", onDown);
        document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    return (
        <div ref={ref} className="relative">
        <button
            type="button"
            aria-label={`More actions for ${label}`}
            aria-haspopup="menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="rounded-md border border-border p-1.5 text-muted hover:bg-gray-100"
        >
            <MoreHorizontal className="h-4 w-4" />
        </button>

        {open && (
            <div
            role="menu"
            className="absolute right-0 top-full z-20 mt-1 w-40 rounded-lg border border-border bg-surface py-1 shadow-lg"
            >
            <button
                type="button"
                role="menuitem"
                onClick={() => {
                setOpen(false);
                onEdit();
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
            >
                <Pencil className="h-4 w-4 text-muted" />
                Edit item
            </button>
            <button
                type="button"
                role="menuitem"
                onClick={() => {
                setOpen(false);
                onDelete();
                }}
                className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-danger hover:bg-red-50"
            >
                <Trash2 className="h-4 w-4" />
                Delete
            </button>
            </div>
        )}
        </div>
    );
}