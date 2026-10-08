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