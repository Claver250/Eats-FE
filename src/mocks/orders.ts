import type { OrderStat, OverviewPoint, StatusSegment, OrderRow } from "@/features/orders/types";

export const orderStats: OrderStat[] = [
    { id: "total", label: "Total Orders", value: 12120, change: 15, goodWhen: "up" },
    { id: "completed", label: "Delivered Orders", value: 10245, change: 18, goodWhen: "up" },
    { id: "pending", label: "Pending Orders", value: 1230, change: 7, goodWhen: "up" },
    { id: "cancelled", label: "Cancelled Orders", value: 645, change: 12, goodWhen: "down" },
    { id: "delivery", label: "Average Delivery Time", value: 28, unit: "mins", change: -9, goodWhen: "down" },
]

export const ordersOverview: OverviewPoint[] = Array.from({ length: 30 }, (_, i) => ({
    day: `Apr ${String(i + 1).padStart(2, "0")}`,
    completed: Math.round(
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
    { id: "completed", label: "Delivered", count: 10245 },
    { id: "pending", label: "Pending", count: 1230 },
    { id: "cancelled", label: "Cancelled", count: 645 },
];

export const orderRows: OrderRow[] = [
    { id: "#WE123456", kind: "Delivery", restaurant: "Mama Cass", area: "Victoria Island, Lagos", phone: "+234 801 234 5678", customer: "John Doe", date: "2025-04-30T12:45:00", items: 3, amount: 5480, status: "Delivered" },
    { id: "#WE123455", kind: "Delivery", restaurant: "Chicken Republic", area: "Ikeja, Lagos", phone: "+234 803 876 5432", customer: "Amina Yusuf", date: "2025-04-30T12:32:00", items: 2, amount: 4200, status: "Pending" },
    { id: "#WE123454", kind: "Pickup", restaurant: "Yellow Chilli", area: "Lekki Phase 1, Lagos", phone: "+234 706 111 2233", customer: "Tunde Adeyemi", date: "2025-04-30T11:58:00", items: 4, amount: 7850, status: "Delivered" },
    { id: "#WE123453", kind: "Delivery", restaurant: "The Place", area: "Surulere, Lagos", phone: "+234 802 555 6677", customer: "Faith Okafor", date: "2025-04-30T10:24:00", items: 1, amount: 2340, status: "Cancelled" },
    { id: "#WE123452", kind: "Delivery", restaurant: "Bukka Hut", area: "Yaba, Lagos", phone: "+234 703 998 7766", customer: "Emeka Nwosu", date: "2025-04-30T09:12:00", items: 5, amount: 12600, status: "Delivered" },
    { id: "#WE123451", kind: "Pickup", restaurant: "Ocean Basket", area: "Lekki, Lagos", phone: "+234 809 334 7788", customer: "Chinonso Eze", date: "2025-04-29T20:45:00", items: 3, amount: 9750, status: "Delivered" },
    { id: "#WE123450", kind: "Delivery", restaurant: "Mama Cass", area: "Victoria Island, Lagos", phone: "+234 805 667 1200", customer: "Bisi Alade", date: "2025-04-29T19:30:00", items: 2, amount: 3900, status: "Pending" },
    { id: "#WE123449", kind: "Delivery", restaurant: "Chicken Republic", area: "Ikeja, Lagos", phone: "+234 810 222 3344", customer: "Ibrahim Sani", date: "2025-04-29T18:10:00", items: 6, amount: 11200, status: "Delivered" },
    { id: "#WE123448", kind: "Pickup", restaurant: "Yellow Chilli", area: "Lekki Phase 1, Lagos", phone: "+234 813 450 9981", customer: "Ngozi Eze", date: "2025-04-29T17:25:00", items: 2, amount: 6100, status: "Cancelled" },
    { id: "#WE123447", kind: "Delivery", restaurant: "The Place", area: "Surulere, Lagos", phone: "+234 902 118 4455", customer: "Seun Balogun", date: "2025-04-29T16:40:00", items: 4, amount: 8300, status: "Delivered" },
    { id: "#WE123446", kind: "Delivery", restaurant: "Bukka Hut", area: "Yaba, Lagos", phone: "+234 816 700 2211", customer: "Zainab Musa", date: "2025-04-29T15:05:00", items: 3, amount: 5900, status: "Pending" },
    { id: "#WE123445", kind: "Delivery", restaurant: "Ocean Basket", area: "Lekki, Lagos", phone: "+234 701 345 6789", customer: "Kunle Ojo", date: "2025-04-29T14:20:00", items: 1, amount: 15400, status: "Delivered" },
    { id: "#WE123444", kind: "Pickup", restaurant: "Mama Cass", area: "Victoria Island, Lagos", phone: "+234 808 912 3300", customer: "Blessing Udo", date: "2025-04-29T13:15:00", items: 2, amount: 4750, status: "Delivered" },
    { id: "#WE123443", kind: "Delivery", restaurant: "Chicken Republic", area: "Ikeja, Lagos", phone: "+234 704 556 1122", customer: "Chidi Okafor", date: "2025-04-29T12:00:00", items: 5, amount: 9800, status: "Cancelled" },
    { id: "#WE123442", kind: "Delivery", restaurant: "Yellow Chilli", area: "Lekki Phase 1, Lagos", phone: "+234 812 667 8890", customer: "Aisha Bello", date: "2025-04-28T21:10:00", items: 3, amount: 7200, status: "Delivered" },
    { id: "#WE123441", kind: "Delivery", restaurant: "The Place", area: "Surulere, Lagos", phone: "+234 807 223 4410", customer: "Femi Adebayo", date: "2025-04-28T20:00:00", items: 2, amount: 3600, status: "Pending" },
    { id: "#WE123440", kind: "Pickup", restaurant: "Bukka Hut", area: "Yaba, Lagos", phone: "+234 903 778 5566", customer: "Halima Garba", date: "2025-04-28T18:35:00", items: 4, amount: 6850, status: "Delivered" },
    { id: "#WE123439", kind: "Delivery", restaurant: "Ocean Basket", area: "Lekki, Lagos", phone: "+234 706 889 0012", customer: "Obinna Eke", date: "2025-04-28T17:05:00", items: 3, amount: 13200, status: "Delivered" },
];