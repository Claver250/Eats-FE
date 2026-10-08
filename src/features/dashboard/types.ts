export type Kpi = {
    id: string;
    label: string;
    value: number;
    format: "number" | "currency";
    change: number; // percent vs last month, negative = down
};

export type PerformanceMetric = {
    id: string;
    label: string;
    percent: number;
    tone: "success" | "warning" | "danger";
};

export type RevenuePoint = {
    date: string;
    revenue: number;
    baseline: number;
};

export type RevenueProfileData = {
    total: number;
    change: number;
    series: RevenuePoint[];
};

export type AnalyticsPoint = {
    day: string;
    current: number;
    previous: number;
};

export type OrderAnalyticsData = {
    total: number;
    change: number;
    series: AnalyticsPoint[];
};

export type OrderStatus = "Delivered" | "Pending" | "On the way" | "Cancelled";

export type Order = {
    id: string;
    restaurant: string;
    customer: string;
    date: string; // ISO string, formatted at display time
    items: number;
    amount: number;
    status: OrderStatus;
};