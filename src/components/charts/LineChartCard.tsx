"use client";

import {
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import type { AnalyticsPoint } from "@/features/dashboard/types";

type TipProps = {
    active?: boolean;
    payload?: ReadonlyArray<{ payload?: AnalyticsPoint }>;
};

function ChartTooltip({ active, payload }: TipProps) {
    const point = payload?.[0]?.payload;
    if (!active || !point) return null;

    return (
        <div className="space-y-1.5 text-xs">
        <div className="rounded-md bg-ink px-2.5 py-1.5 text-white">
            <p className="text-[10px] opacity-70">February, Day {point.day}</p>
            <p className="font-semibold">{point.current.toLocaleString()}</p>
        </div>
        <div className="rounded-md bg-gray-400 px-2.5 py-1.5 text-white">
            <p className="text-[10px] opacity-80">January, Day {point.day}</p>
            <p className="font-semibold">{point.previous.toLocaleString()}</p>
        </div>
        </div>
    );
}

export default function LineChartCard({ data }: { data: AnalyticsPoint[] }) {
    return (
        <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--color-border)" />
            <XAxis
                dataKey="day"
                ticks={["01", "03", "06", "09", "12", "15", "18", "21", "24", "27", "30"]}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--color-muted)" }}
            />
            <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--color-muted)" }}
                tickFormatter={(v: number) => v.toLocaleString()}
            />
            <Tooltip
                content={<ChartTooltip />}
                cursor={{ stroke: "var(--color-ink)", strokeWidth: 1 }}
            />
            <Line
                type="linear"
                dataKey="previous"
                stroke="#9ca3af"
                strokeWidth={1.5}
                strokeDasharray="3 3"
                dot={false}
            />
            <Line
                type="linear"
                dataKey="current"
                stroke="var(--color-ink)"
                strokeWidth={1.5}
                dot={false}
                activeDot={{ r: 3 }}
            />
            </LineChart>
        </ResponsiveContainer>
        </div>
    );
}