"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import SidebarContent from "./SidebarContent";

export default function MobileNav() {
    const [open, setOpen] = useState(false);

    useEffect(() => {
        if (!open) return;
        const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [open]);

    return (
        <div className="lg:hidden">
        <button
            aria-label="Open menu"
            onClick={() => setOpen(true)}
            className="rounded-lg p-2 hover:bg-gray-100"
        >
            <Menu className="h-5 w-5" />
        </button>

        {open && (
            <div className="fixed inset-0 z-50 flex">
            <div
                className="absolute inset-0 bg-black/40"
                onClick={() => setOpen(false)}
                aria-hidden
            />
            <aside className="relative h-full w-72 max-w-[85%] overflow-y-auto bg-surface p-4 shadow-xl">
                <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="absolute right-3 top-3 rounded-lg p-2 hover:bg-gray-100"
                >
                <X className="h-5 w-5" />
                </button>
                <SidebarContent onNavigate={() => setOpen(false)} />
            </aside>
            </div>
        )}
        </div>
    );
}