import type { OrderStat, OverviewPoint, StatusSegment } from "@/features/orders/types";

export const orderStats: OrderStat[] = [
    { id: "total", label: "Total Orders", value: 12120, change: 15, goodWhen: "up" },
    { id: "delivered", label: "Delivered Orders", value: 10245, change: 18, goodWhen: "up" },
    { id: "pending", label: "Pending Orders", value: 1230, change: 7, goodWhen: "up" },
    { id: "cancelled", label: "Cancelled Orders", value: 645, change: 12, goodWhen: "down" },
    { id: "delivery", label: "Average Delivery Time", value: 28, unit: "mins", change: -9, goodWhen: "down" },
]

export const ordersOverview: OverviewPoint[] = Array.from({ length: 30 }, (_, i) => ({
    day: `Apr ${String(i + 1).padStart(2, "0")}`,
    delivered: Math.round(
        450 + i * 52 + Math.sin(i * 2.3) * 140 + Math.cos(i * 4.1) * 90,
    ),
    pending: Math.round(
        220 + i * 13 + Math.sin(i * 2.9) * 45 + Math.cos(i * 5.2) * 30,
    ),
    cancelled: Math.round(
        120 + i * 8 + Math.sin(i * 3.4) * 28 + Math.cos(i * 6.1) * 18,
    ),
}));

export const orderStatus: StatusSegment[] = [
    { id: "delivered", label: "Completed", count: 10245 },
    { id: "pending", label: "Pending", count: 1230 },
    { id: "cancelled", label: "Cancelled", count: 645 },
];