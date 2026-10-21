import Link from "next/link";
import {
    ChevronRight,
    Landmark,
    MapPin,
    MessageSquareText,
    TrendingUp,
    type LucideIcon,
} from "lucide-react";

type QuickLink = { title: string; text: string; href: string; icon: LucideIcon };

// Manage Locations goes to the Restaurant page for now. Point it elsewhere if a locations page is planned.
const links: QuickLink[] = [
    { title: "Performance Insights", text: "Track sales, orders and ratings", href: "/reports", icon: TrendingUp },
    { title: "Payouts & Finance", text: "View balances and payment history", href: "/payments", icon: Landmark },
    { title: "Manage Locations", text: "Filter by city, state or zone", href: "/restaurants", icon: MapPin },
    { title: "Send Message", text: "Notify partners and share updates", href: "/messages", icon: MessageSquareText },
];

export default function QuickLinks() {
    return (
        <section
        aria-label="Quick links"
        className="grid grid-cols-1 gap-1 rounded-card bg-surface p-2 shadow-card sm:grid-cols-2 xl:grid-cols-4"
        >
        {links.map(({ title, text, href, icon: Icon }) => (
            <Link
            key={title}
            href={href}
            className="flex items-center gap-3 rounded-xl p-3 transition-colors hover:bg-gray-50 xl:border-l xl:border-border xl:first:border-l-0"
            >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{title}</span>
                <span className="block truncate text-xs text-muted">{text}</span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted" />
            </Link>
        ))}
        </section>
    );
}