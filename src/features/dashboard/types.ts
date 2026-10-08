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