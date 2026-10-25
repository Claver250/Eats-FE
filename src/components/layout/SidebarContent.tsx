"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { mainNav, otherNav, type NavItem } from "@/config/navigation";
import { useSession } from "@/features/admin-auth/session";
import { ROLE_LABEL, canAccess } from "@/lib/admin-auth/access";

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

function NavLink({ item, onNavigate }: { item: NavItem; onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = pathname === item.href || pathname.startsWith(item.href + "/");
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
        active
          ? "bg-gray-200/70 text-ink"
          : "text-muted hover:bg-gray-100 hover:text-ink",
      )}
    >
      <Icon className="h-5 w-5" />
      {item.label}
      {item.badge ? (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-danger px-1.5 text-[11px] font-semibold text-white">
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}

export default function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const session = useSession();

  // Each role only sees the pages it may open.
  const main = mainNav.filter((item) => canAccess(session.role, item.href));
  const others = otherNav.filter((item) => canAccess(session.role, item.href));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2 px-1">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-lg font-bold text-white">
          W
        </div>
        <span className="text-xl font-bold text-brand-600">WeEats</span>
      </div>

      <div className="flex items-center gap-3 rounded-xl bg-surface p-3 shadow-card ring-1 ring-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-700">
          {initials(session.name)}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{session.name}</p>
          <p className="text-xs text-muted">{ROLE_LABEL[session.role]}</p>
        </div>
        <Settings className="h-4 w-4 text-muted" />
      </div>

      <nav className="flex flex-col gap-1">
        {main.map((item) => (
          <NavLink key={item.href} item={item} onNavigate={onNavigate} />
        ))}
      </nav>

      {others.length > 0 && (
        <div>
          <p className="mb-2 px-3 text-xs font-medium text-muted">Others</p>
          <nav className="flex flex-col gap-1">
            {others.map((item) => (
              <NavLink key={item.href} item={item} onNavigate={onNavigate} />
            ))}
          </nav>
        </div>
      )}
    </div>
  );
}