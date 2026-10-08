import type { Kpi, PerformanceMetric, RevenueProfileData } from "@/features/dashboard/types";

export const kpis: Kpi[] = [
    { id: "restaurants", label: "Total Restaurant", value: 10000, format: "number", change: 17 },
    { id: "revenue", label: "Total Revenue", value: 87363, format: "currency", change: 11 },
    { id: "customers", label: "New Customers", value: 120, format: "number", change: -15 },
];

export const orderPerformance: PerformanceMetric[] = [
    { id: "completed", label: "Total Order Completed", percent: 82, tone: "success" },
    { id: "returned", label: "Total Delivery Return", percent: 10, tone: "warning" },
    { id: "cancelled", label: "Total Delivery Cancel", percent: 40, tone: "danger" },
];

const revenueSeries = Array.from({ length: 28 }, (_, i) => {
  const revenue = Math.round(800 + 48000 * Math.pow(i / 27, 2.2));
    return {
        date: `Jan, ${String(i + 1).padStart(2, "0")}`,
        revenue,
        baseline: Math.round(revenue * 0.55),
    };
});

export const revenueProfile: RevenueProfileData = {
    total: 25843.45,
    change: 11,
    series: revenueSeries,
};