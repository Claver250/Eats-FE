export type OrderStat = {
    id: string;
    label: string;
    value: number;
    unit?: string;
    change: number;
    goodWhen: "up" | "down";
};

export type OverviewPoint = {
    day: string;
    delivered: number;
    pending: number;
    cancelled: number;
};

export type StatusSegment = {
    id: "delivered" | "pending" | "cancelled";
    label: string;
    count: number;
};