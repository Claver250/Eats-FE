import type { Kpi, PerformanceMetric, RevenueProfileData, OrderAnalyticsData, Order } from "@/features/dashboard/types";

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

export const orders: Order[] = [
    { id: "#26839628288", restaurant: "Al Baik Fast Food Shop", customer: "Muhammed Fateh", date: "2024-12-22T11:20:00", items: 200, amount: 5576.9, status: "Delivered" },
    { id: "#26839628289", restaurant: "Taza Bukari House", customer: "Mukarram Kazi", date: "2024-12-22T11:30:00", items: 1050, amount: 5576.9, status: "Delivered" },
    { id: "#26839628290", restaurant: "Al Tazaz Fast Food Shop", customer: "Muhammed Khan", date: "2024-12-22T13:20:00", items: 2090, amount: 5576.9, status: "Delivered" },
    { id: "#26839628291", restaurant: "Burger Hub", customer: "Aisha Bello", date: "2024-12-22T14:05:00", items: 340, amount: 2310.5, status: "Pending" },
    { id: "#26839628292", restaurant: "Mama Put Kitchen", customer: "Tunde Adeyemi", date: "2024-12-22T14:40:00", items: 75, amount: 980.0, status: "On the way" },
    { id: "#26839628293", restaurant: "Al Baik Fast Food Shop", customer: "Fatima Yusuf", date: "2024-12-22T15:10:00", items: 410, amount: 3120.75, status: "Cancelled" },
    { id: "#26839628294", restaurant: "Taza Bukari House", customer: "Chidi Okafor", date: "2024-12-22T15:55:00", items: 160, amount: 1745.2, status: "Delivered" },
    { id: "#26839628295", restaurant: "Pizza Corner", customer: "Zainab Musa", date: "2024-12-22T16:30:00", items: 520, amount: 4200.0, status: "Delivered" },
    { id: "#26839628296", restaurant: "Burger Hub", customer: "Emeka Obi", date: "2024-12-22T17:00:00", items: 90, amount: 1120.4, status: "Pending" },
    { id: "#26839628297", restaurant: "Mama Put Kitchen", customer: "Ngozi Eze", date: "2024-12-22T17:45:00", items: 260, amount: 2890.0, status: "On the way" },
    { id: "#26839628298", restaurant: "Pizza Corner", customer: "Ibrahim Sani", date: "2024-12-22T18:15:00", items: 310, amount: 3560.3, status: "Delivered" },
    { id: "#26839628299", restaurant: "Al Tazaz Fast Food Shop", customer: "Blessing Udo", date: "2024-12-22T19:00:00", items: 45, amount: 640.0, status: "Cancelled" },
];