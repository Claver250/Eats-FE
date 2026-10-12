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