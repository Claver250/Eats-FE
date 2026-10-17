"use client";

import {
    Area,
    CartesianGrid,
    ComposedChart,
    Line,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { OverviewPoint } from "../types";

const legend = [
    { label: "Delivered", color: "var(--color-brand-500)" },
    { label: "Pending", color: "var(--color-warning)" },
    { label: "Cancelled", color: "var(--color-danger)" },
];

export default function OrdersOverview({ data }: { data: OverviewPoint[] }) {
    return (
        <section className="rounded-card bg-surface p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-base font-semibold">Orders Overview</h2>
            <div className="flex items-center gap-4 text-xs text-muted">
            {legend.map((l) => (
                <span key={l.label} className="flex items-center gap-1.5">
                <span
                    className="h-2 w-2 rounded-full"
                    style={{ background: l.color }}
                />
                {l.label}
                </span>
            ))}
            </div>
        </div>

        <div className="mt-4 h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                <defs>
                <linearGradient id="completedFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-brand-500)" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="var(--color-brand-500)" stopOpacity={0} />
                </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--color-border)" />
                <XAxis
                dataKey="day"
                ticks={["Apr 01", "Apr 05", "Apr 10", "Apr 15", "Apr 20", "Apr 25", "Apr 30"]}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--color-muted)" }}
                />
                <YAxis
                domain={[0, 2500]}
                ticks={[0, 500, 1000, 1500, 2000, 2500]}
                tickFormatter={(v: number) => v.toLocaleString()}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--color-muted)" }}
                />
                <Tooltip
                contentStyle={{
                    borderRadius: 8,
                    border: "1px solid var(--color-border)",
                    fontSize: 12,
                }}
                />
                <Area
                type="linear"
                dataKey="completed"
                name="Delivered"
                stroke="var(--color-brand-500)"
                strokeWidth={2}
                fill="url(#completedFill)"
                />
                <Line
                type="linear"
                dataKey="pending"
                name="Pending"
                stroke="var(--color-warning)"
                strokeWidth={2}
                dot={false}
                />
                <Line
                type="linear"
                dataKey="cancelled"
                name="Cancelled"
                stroke="var(--color-danger)"
                strokeWidth={2}
                dot={false}
                />
            </ComposedChart>
            </ResponsiveContainer>
        </div>
        </section>
    );
}
