import { Bell, Search } from "lucide-react";
import MobileNav from "./MobileNav";

export default function Topbar({ title = "Dashboard" }: { title?: string }) {
    return (
        <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-4 sm:px-6">
        <div className="flex items-center gap-2">
            <MobileNav />
            <h1 className="text-lg font-semibold">{title}</h1>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
            <label className="hidden w-64 items-center gap-2 rounded-full border border-border bg-page px-4 py-2 text-sm text-muted focus-within:border-brand-500 sm:flex">
            <Search className="h-4 w-4" />
            <input
                type="search"
                placeholder="Search in here"
                className="w-full bg-transparent text-ink outline-none placeholder:text-muted"
            />
            </label>
            <button aria-label="Notifications" className="rounded-full p-2 hover:bg-gray-100">
            <Bell className="h-5 w-5" />
            </button>
        </div>
        </header>
    );
}