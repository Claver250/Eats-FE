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
    completed: number;
    pending: number;
    cancelled: number;
};

export type StatusSegment = {
    id: "completed" | "pending" | "cancelled";
    label: string;
    count: number;
};

export type OrderState = "Delivered" | "Pending" | "Cancelled";

export type OrderRow = {
    id: string;
    kind: "Delivery" | "Pickup";
    restaurant: string;
    area: string;
    phone: string;
    customer: string;
    date: string; // ISO
    items: number;
    amount: number;
    status: OrderState;
};