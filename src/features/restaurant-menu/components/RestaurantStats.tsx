import { CheckCircle2, Store, UserRound, Wallet, type LucideIcon } from "lucide-react";
import StatGrid, { type StatItem } from "@/components/ui/StatGrid";
import { formatCompactNaira, formatNumber } from "@/lib/formatters";
import type { RestaurantStat } from "../types";

const icons: Record<RestaurantStat["id"], LucideIcon> = {
    total: Store,
    awaiting: UserRound,
    pending: Wallet,
    paid: CheckCircle2,
};

export default function RestaurantStats({ stats }: { stats: RestaurantStat[] }) {
    const items: StatItem[] = stats.map((s) => ({
        id: s.id,
        label: s.label,
        value: s.kind === "naira" ? formatCompactNaira(s.value) : formatNumber(s.value),
        icon: icons[s.id],
        change: s.change,
        goodWhen: s.goodWhen,
        changeLabel: s.caption,
        tone: s.id === "awaiting" ? "amber" : "brand",
    }));

    return <StatGrid stats={items} columns={4} />;
}