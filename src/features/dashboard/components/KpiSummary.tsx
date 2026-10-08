import { formatCurrency, formatNumber } from "@/lib/formatters";
import type { Kpi } from "../types";
import TrendBadge from "./TrendBadge";

export default function KpiSummary({ kpis }: { kpis: Kpi[] }) {
    return (
        <section className="grid grid-cols-1 gap-6 rounded-card bg-surface p-6 shadow-card sm:grid-cols-3 sm:gap-0">
        {kpis.map((kpi, i) => (
            <div
            key={kpi.id}
            className={i > 0 ? "sm:border-l sm:border-border sm:pl-8" : "sm:pr-8"}
            >
            <p className="text-sm text-muted">{kpi.label}</p>
            <p className="mt-4 text-3xl font-bold">
                {kpi.format === "currency"
                ? formatCurrency(kpi.value)
                : formatNumber(kpi.value)}
            </p>
            <div className="mt-3">
                <TrendBadge change={kpi.change} />
            </div>
            </div>
        ))}
        </section>
    );
}