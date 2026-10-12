import {
    CheckCircle2,
    Clock,
    Star,
    Utensils,
    XCircle,
    type LucideIcon,
} from "lucide-react";
import TrendBadge from "@/features/dashboard/components/TrendBadge";
import { formatNumber } from "@/lib/formatters";
import type { OrderStat } from "../types";

const icons: Record<string, LucideIcon> = {
    total: Utensils,
    delivered: CheckCircle2,
    pending: Clock,
    cancelled: XCircle,
    delivery: Star,
};

export default function StatCards({ stats }: { stats: OrderStat[] }) {
    return (
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((s) => {
            const Icon = icons[s.id] ?? Star;
            return (
            <div
                key={s.id}
                className="flex items-start gap-4 rounded-card bg-surface p-5 shadow-card"
            >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Icon className="h-6 w-6" />
                </div>
                <div className="min-w-0">
                <p className="text-sm text-muted">{s.label}</p>
                <p className="mt-1 text-2xl font-bold">
                    {formatNumber(s.value)}
                    {s.unit ? ` ${s.unit}` : ""}
                </p>
                <div className="mt-2">
                    <TrendBadge
                    change={s.change}
                    goodWhen={s.goodWhen}
                    label="vs. last month"
                    />
                </div>
                </div>
            </div>
            );
        })}
        </section>
    );
}