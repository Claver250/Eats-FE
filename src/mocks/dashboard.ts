import type { Kpi, PerformanceMetric } from "@/features/dashboard/types";

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