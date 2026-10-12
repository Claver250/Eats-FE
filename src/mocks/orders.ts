import type { OrderStat } from "@/features/orders/types";

export const orderStats: OrderStat[] = [
    { id: "total", label: "Total Orders", value: 12120, change: 15, goodWhen: "up" },
    { id: "delivered", label: "Delivered Orders", value: 10245, change: 18, goodWhen: "up" },
    { id: "pending", label: "Pending Orders", value: 1230, change: 7, goodWhen: "up" },
    { id: "cancelled", label: "Cancelled Orders", value: 645, change: 12, goodWhen: "down" },
    { id: "delivery", label: "Average Delivery Time", value: 28, unit: "mins", change: -9, goodWhen: "down" },
]