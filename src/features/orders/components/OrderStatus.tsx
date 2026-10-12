import { formatNumber } from "@/lib/formatters";
import type { StatusSegment } from "../types";

const colors: Record<StatusSegment["id"], string> = {
    delivered: "var(--color-brand-600)",
    pending: "var(--color-warning)",
    cancelled: "var(--color-danger)",
};

const SIZE = 190;
const STROKE = 22;
const RADIUS = (SIZE - STROKE) / 2;
const GAP = 0.8; // visual gap between segments, in percent of the ring

export default function OrderStatus({ segments }: { segments: StatusSegment[] }) {
    const total = segments.reduce((sum, s) => sum + s.count, 0);

    const arcs = segments.map((s, i) => {
        const pct = (s.count / total) * 100;
        const start = segments
        .slice(0, i)
        .reduce((sum, p) => sum + (p.count / total) * 100, 0);
        return { ...s, pct, start };
    });

    return (
        <section className="flex h-full flex-col rounded-card bg-surface p-5 shadow-card">
        <h2 className="text-base font-semibold">Order Status</h2>

        <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-6 sm:flex-row xl:flex-col 2xl:flex-row">
            <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
            <svg width={SIZE} height={SIZE} className="-rotate-90">
                {arcs.map((a) => (
                <circle
                    key={a.id}
                    cx={SIZE / 2}
                    cy={SIZE / 2}
                    r={RADIUS}
                    fill="none"
                    stroke={colors[a.id]}
                    strokeWidth={STROKE}
                    pathLength={100}
                    strokeDasharray={`${Math.max(a.pct - GAP, 0)} ${100 - Math.max(a.pct - GAP, 0)}`}
                    strokeDashoffset={-a.start}
                />
                ))}
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-2xl font-bold">{formatNumber(total)}</p>
                <p className="text-xs text-muted">Total Orders</p>
            </div>
            </div>

            <ul className="w-full max-w-xs space-y-3 text-sm">
            {arcs.map((a) => (
                <li key={a.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-4">
                <span className="flex items-center gap-2">
                    <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ background: colors[a.id] }}
                    />
                    {a.label}
                </span>
                <span className="text-muted">{a.pct.toFixed(1)}%</span>
                <span className="min-w-12 text-right font-medium">
                    {formatNumber(a.count)}
                </span>
                </li>
            ))}
            </ul>
        </div>
        </section>
    );
}