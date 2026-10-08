"use client";

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { RevenuePoint } from "@/features/dashboard/types";

const xTicks = ["Jan, 01", "Jan, 07", "Jan, 14", "Jan, 21", "Jan, 28"];
const yTicks = [0, 10000, 20000, 30000, 40000, 50000];

export default function AreaChartCard({ data }: { data: RevenuePoint[] }) {
    return (
        <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <defs>
                <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-chart)" stopOpacity={0.9} />
                <stop offset="100%" stopColor="var(--color-chart)" stopOpacity={0.7} />
                </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--color-border)" />
            <XAxis
                dataKey="date"
                ticks={xTicks}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--color-muted)" }}
            />
            <YAxis
                domain={[0, 50000]}
                ticks={yTicks}
                tickFormatter={(v: number) => (v === 0 ? "0" : `${v / 1000}k`)}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--color-muted)" }}
            />
            <Tooltip
                formatter={(v) => `$${Number(v).toLocaleString()}`}
                contentStyle={{ borderRadius: 8, border: "1px solid var(--color-border)", fontSize: 12 }}
            />
            <Area
                type="monotone"
                dataKey="revenue"
                stroke="none"
                fill="url(#revFill)"
            />
            <Area
                type="monotone"
                dataKey="baseline"
                stroke="none"
                fill="#eceaff"
                fillOpacity={1}
            />
            </AreaChart>
        </ResponsiveContainer>
        </div>
    );
}