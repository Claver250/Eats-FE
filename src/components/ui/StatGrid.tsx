import type { LucideIcon } from "lucide-react";
import TrendBadge from "@/features/dashboard/components/TrendBadge";

export type StatItem = {
    id: string;
    label: string;
    value: string; // already formatted, e.g. "12,120" or "₦2,350"
    icon: LucideIcon;
    change: number; // percent, negative = down
    goodWhen: "up" | "down"; // is an increase good or bad? decides the badge color
    changeLabel?: string;
};

const columnClass = {
    4: "sm:grid-cols-2 xl:grid-cols-4",
    5: "sm:grid-cols-2 xl:grid-cols-5",
    } as const;

export default function StatGrid({
    stats,
    columns = 4,
    }: {
    stats: StatItem[];
    columns?: 4 | 5;
    }) {
    return (
        <section className={`grid grid-cols-1 gap-4 ${columnClass[columns]}`}>
        {stats.map((s) => {
            const Icon = s.icon;
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
                <p className="mt-1 text-2xl font-bold">{s.value}</p>
                <div className="mt-2">
                    <TrendBadge
                    change={s.change}
                    goodWhen={s.goodWhen}
                    label={s.changeLabel ?? "vs. last month"}
                    />
                </div>
                </div>
            </div>
            );
        })}
        </section>
    );
}
