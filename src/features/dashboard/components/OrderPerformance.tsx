import DonutProgress from "@/components/charts/DonutProgress";
import type { PerformanceMetric } from "../types";

const toneColor = {
    success: "var(--color-success)",
    warning: "var(--color-warning)",
    danger: "var(--color-danger)",
};

export default function OrderPerformance({
    metrics,
}: {
    metrics: PerformanceMetric[];
}) {
    return (
        <section className="rounded-card bg-surface p-5 shadow-card">
        <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">
            Order Performance{" "}
            <span className="font-normal text-muted">vs last month</span>
            </h2>
            <select
            aria-label="Period"
            className="rounded-md bg-transparent text-xs text-muted outline-none"
            defaultValue="month"
            >
            <option value="week">Week</option>
            <option value="month">Month</option>
            <option value="year">Year</option>
            </select>
        </div>

        <div className="mt-5 grid grid-cols-3 gap-2">
            {metrics.map((m) => (
            <div key={m.id} className="flex flex-col items-center gap-2 text-center">
                <DonutProgress percent={m.percent} color={toneColor[m.tone]} />
                <p className="text-xs text-muted">{m.label}</p>
            </div>
            ))}
        </div>
        </section>
    );
}