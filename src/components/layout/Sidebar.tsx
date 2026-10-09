"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNav, otherNav, type NavItem } from "@/config/navigation";

function NavLink({ item }: { item: NavItem }) {
    const pathname = usePathname();
    const active = pathname === item.href || pathname.startsWith(item.href + "/");
    const Icon = item.icon;

    return (
        <Link
        href={item.href}
        className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            active
            ? "bg-gray-200/70 text-ink"
            : "text-muted hover:bg-gray-100 hover:text-ink",
        )}
        >
        <Icon className="h-5 w-5" />
        {item.label}
        </Link>
    );
}

export default function Sidebar() {
    return (
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-6 overflow-y-auto border-r border-border bg-surface p-4 lg:flex">
        <div className="flex items-center gap-2 px-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">
            W
            </div>
            <span className="text-xl font-bold text-brand-600">WeEats</span>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-surface p-3 shadow-card ring-1 ring-border">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">
            KM
            </div>
            <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">Kazi Mahbub</p>
            <p className="text-xs text-muted">Super Admin</p>
            </div>
            <Settings className="h-4 w-4 text-muted" />
        </div>

        <nav className="flex flex-col gap-1">
            {mainNav.map((item) => (
            <NavLink key={item.href} item={item} />
            ))}
        </nav>

        <div>
            <p className="mb-2 px-3 text-xs font-medium text-muted">Others</p>
            <nav className="flex flex-col gap-1">
            {otherNav.map((item) => (
                <NavLink key={item.href} item={item} />
            ))}
            </nav>
        </div>
        </aside>
    );
}