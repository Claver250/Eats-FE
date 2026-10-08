import type { Kpi, PerformanceMetric, RevenueProfileData, OrderAnalyticsData } from "@/features/dashboard/types";

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

export const vendors = [
    "All Vendor",
    "Al Baik Fast Food Shop",
    "Taza Bukari House",
    "Al Tazaz Fast Food Shop",
];
export const orderStatuses = ["Completed", "Pending", "Cancelled"];

const vendorFactor: Record<string, number> = {
    "All Vendor": 1,
    "Al Baik Fast Food Shop": 0.45,
    "Taza Bukari House": 0.3,
    "Al Tazaz Fast Food Shop": 0.25,
};
const statusFactor: Record<string, number> = {
    Completed: 1,
    Pending: 0.35,
    Cancelled: 0.15,
};

export function getOrderAnalytics(
    vendor: string,
    status: string,
    ): OrderAnalyticsData {
    const k = (vendorFactor[vendor] ?? 1) * (statusFactor[status] ?? 1);
    const series = Array.from({ length: 30 }, (_, i) => {
        const current = 1000 + i * 52 + Math.sin(i * 1.3) * 230;
        const previous = 500 + i * 34 + Math.sin(i * 0.9) * 70;
        return {
        day: String(i + 1).padStart(2, "0"),
        current: Math.round(current * k),
        previous: Math.round(previous * k),
        };
    });
    return { total: Math.round(12120 * k), change: 15, series };
}