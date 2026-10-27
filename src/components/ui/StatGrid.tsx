import { Info, type LucideIcon } from "lucide-react";
import TrendBadge from "@/features/dashboard/components/TrendBadge";

export type StatItem = {
  id: string;
  label: string;
  value: string; // already formatted, e.g. "12,120" or "₦2,350"
  icon: LucideIcon;
  change?: number; // percent, negative = down. Leave out for a card with no trend.
  goodWhen?: "up" | "down"; // is an increase good or bad? decides the badge color (default "up")
  changeLabel?: string;
  note?: string; // plain text under the value, used when there is no trend
  info?: string; // adds a small (i) icon next to the label, with this text on hover
  tone?: "brand" | "amber"; // icon circle color, brand (green) by default
};

const columnClass = {
  4: "sm:grid-cols-2 xl:grid-cols-4",
  5: "sm:grid-cols-2 xl:grid-cols-5",
} as const;

const toneClass = {
  brand: "bg-brand-50 text-brand-600",
  amber: "bg-amber-100 text-amber-600",
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
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full ${toneClass[s.tone ?? "brand"]}`}
            >
              <Icon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <p className="flex items-center gap-1 text-sm text-muted">
                {s.label}
                {s.info && (
                  <span title={s.info} className="cursor-help">
                    <Info className="h-3.5 w-3.5" aria-label={s.info} />
                  </span>
                )}
              </p>
              <p className="mt-1 text-2xl font-bold">{s.value}</p>
              {s.change !== undefined ? (
                <div className="mt-2">
                  <TrendBadge
                    change={s.change}
                    goodWhen={s.goodWhen ?? "up"}
                    label={s.changeLabel ?? "vs. last month"}
                  />
                </div>
              ) : (
                s.note && <p className="mt-2 text-xs text-muted">{s.note}</p>
              )}
            </div>
          </div>
        );
      })}
    </section>
  );
}