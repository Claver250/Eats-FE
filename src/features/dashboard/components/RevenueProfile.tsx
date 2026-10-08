import AreaChartCard from "@/components/charts/AreaChartCard";
import { formatCurrency } from "@/lib/formatters";
import type { RevenueProfileData } from "../types";
import TrendBadge from "./TrendBadge";

export default function RevenueProfile({ data }: { data: RevenueProfileData }) {
    return (
        <section className="rounded-card bg-surface p-5 shadow-card">
        <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Revenue Profile</h2>
            <select
            aria-label="Period"
            className="rounded-md border border-border px-2 py-1 text-xs text-muted outline-none"
            defaultValue="month"
            >
            <option value="week">Weekly</option>
            <option value="month">Monthly</option>
            <option value="year">Yearly</option>
            </select>
        </div>

        <div className="mt-3 flex items-center gap-2">
            <p className="text-3xl font-bold">{formatCurrency(data.total, 2)}</p>
            <TrendBadge change={data.change} />
        </div>
        <p className="mb-4 mt-1 text-xs text-muted">Your performance is excellent 👌</p>

        <AreaChartCard data={data.series} />
        </section>
    );
}