"use client";

import { useMemo, useState } from "react";
import LineChartCard from "@/components/charts/LineChartCard";
import { formatNumber } from "@/lib/formatters";
import { getOrderAnalytics, orderStatuses, vendors } from "@/mocks/dashboard";
import TrendBadge from "./TrendBadge";

const selectClass =
    "rounded-md bg-transparent text-xs font-semibold text-ink outline-none";

export default function OrderAnalytics() {
    const [vendor, setVendor] = useState(vendors[0]);
    const [status, setStatus] = useState(orderStatuses[0]);

    const data = useMemo(() => getOrderAnalytics(vendor, status), [vendor, status]);

    return (
        <section className="rounded-card bg-surface p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-sm font-semibold">Order Analytics</h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
            <label className="flex items-center gap-1">
                Vendor:
                <select
                className={selectClass}
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                >
                {vendors.map((v) => (
                    <option key={v}>{v}</option>
                ))}
                </select>
            </label>
            <label className="flex items-center gap-1">
                Status:
                <select
                className={selectClass}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                >
                {orderStatuses.map((s) => (
                    <option key={s}>{s}</option>
                ))}
                </select>
            </label>
            <select
                aria-label="Period"
                className="rounded-md border border-border px-2 py-1 text-xs text-muted outline-none"
                defaultValue="monthly"
            >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
            </select>
            </div>
        </div>

        <div className="mt-3 flex flex-wrap items-end justify-between gap-2">
            <div>
            <div className="flex items-center gap-2">
                <p className="text-3xl font-bold">{formatNumber(data.total)}.00</p>
                <TrendBadge change={data.change} />
            </div>
            <p className="mt-1 text-xs text-muted">Excellent job on your order 💪</p>
            </div>
            <div className="flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-gray-400" /> January
            </span>
            <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-ink" /> February
            </span>
            </div>
        </div>

        <div className="mt-4">
            <LineChartCard data={data.series} />
        </div>
        </section>
    );
}