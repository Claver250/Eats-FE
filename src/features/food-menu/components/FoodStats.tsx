import { ConciergeBell, EyeOff, Star, Utensils, type LucideIcon } from "lucide-react";
import StatGrid, { type StatItem } from "@/components/ui/StatGrid";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import type { FoodStat } from "../types";

const icons: Record<FoodStat["id"], LucideIcon> = {
    total: ConciergeBell,
    available: Utensils,
    outOfStock: EyeOff,
    avgPrice: Star,
};

export default function FoodStats({ stats }: { stats: FoodStat[] }) {
    const items: StatItem[] = stats.map((s) => ({
        id: s.id,
        label: s.label,
        value:
        s.kind === "currency"
            ? formatCurrency(s.value, 0, "NGN")
            : formatNumber(s.value),
        icon: icons[s.id],
        change: s.change,
        goodWhen: s.goodWhen,
    }));

    return <StatGrid stats={items} columns={4} />;
}
