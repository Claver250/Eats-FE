"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, LogOut, Search } from "lucide-react";
import { mainNav, otherNav } from "@/config/navigation";
import { auth } from "@/lib/admin-auth";
import MobileNav from "./MobileNav";

// Pages that render their own large heading, so the topbar skips the title
// and shows the long search bar instead. Add each new page here as you build it.
const pagesWithOwnHeading = ["/dashboard", "/orders", "/food-menu", "/restaurant-menu"];

const allNav = [...mainNav, ...otherNav];

function titleFor(pathname: string) {
  const item = allNav.find(
    (n) => pathname === n.href || pathname.startsWith(n.href + "/"),
  );
  return item?.label ?? "Dashboard";
}

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);
  const [signOutFailed, setSignOutFailed] = useState(false);
  // Set synchronously, so a second click can never start a second request before React re-renders.
  const inFlight = useRef(false);

  const showTitle = !pagesWithOwnHeading.some(
    (p) => pathname === p || pathname.startsWith(p + "/"),
  );

  useEffect(() => {
    if (!signOutFailed) return;
    const t = setTimeout(() => setSignOutFailed(false), 5000);
    return () => clearTimeout(t);
  }, [signOutFailed]);

  async function signOut() {
    if (inFlight.current) return;
    inFlight.current = true;
    setSigningOut(true);
    setSignOutFailed(false);
    try {
      await auth.logout();
      router.replace("/login");
    } catch {
      // If the server didn't confirm, the session may still be alive, so don't pretend it ended.
      setSignOutFailed(true);
      inFlight.current = false;
      setSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-4 sm:px-6">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <MobileNav />
        {showTitle ? (
          <h1 className="text-lg font-semibold">{titleFor(pathname)}</h1>
        ) : (
          <label className="hidden w-full max-w-md items-center gap-2 rounded-lg border border-border bg-page px-4 py-2 text-sm text-muted focus-within:border-brand-500 sm:flex">
            <Search className="h-4 w-4 shrink-0" />
            <input
              type="search"
              placeholder="Search restaurants, orders, or partner ID..."
              className="w-full bg-transparent text-ink outline-none placeholder:text-muted"
            />
          </label>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {showTitle && (
          <label className="hidden w-64 items-center gap-2 rounded-full border border-border bg-page px-4 py-2 text-sm text-muted focus-within:border-brand-500 sm:flex">
            <Search className="h-4 w-4 shrink-0" />
            <input
              type="search"
              placeholder="Search in here"
              className="w-full bg-transparent text-ink outline-none placeholder:text-muted"
            />
          </label>
        )}
        <button
          aria-label="Notifications"
          className="relative rounded-full p-2 hover:bg-gray-100"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-0.5 top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold text-white">
            3
          </span>
        </button>

        <div className="relative">
          <button
            type="button"
            aria-label="Log out"
            title="Log out"
            disabled={signingOut}
            onClick={signOut}
            className="rounded-full p-2 hover:bg-gray-100 disabled:opacity-50"
          >
            <LogOut className="h-5 w-5" />
          </button>
          {signOutFailed && (
            <p
              role="alert"
              className="absolute right-0 top-full z-20 mt-2 w-52 rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-danger shadow"
            >
              Couldn’t sign out. Check your connection and try again.
            </p>
          )}
        </div>
      </div>
    </header>
  );
}