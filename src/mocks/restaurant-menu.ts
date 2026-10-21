import type { RestaurantStat, DirectoryRestaurant, RecentOrder } from "@/features/restaurant-menu/types";

// Platform-wide figures, so they come from the backend later (they are not the sum of one page of rows).
// The design shows green badges on all four, so goodWhen stays "up" for each.
export const restaurantStats: RestaurantStat[] = [
    { id: "total", label: "Total Restaurants", value: 248, kind: "number", change: 12, caption: "vs. last month", goodWhen: "up" },
    { id: "awaiting", label: "Awaiting Approval", value: 12, kind: "number", change: 3, caption: "require attention", goodWhen: "up" },
    { id: "pending", label: "Pending Payouts", value: 4_820_000, kind: "naira", change: 8, caption: "outstanding balance", goodWhen: "up" },
    { id: "paid", label: "Paid This Month", value: 18_600_000, kind: "naira", change: 15, caption: "completed payouts", goodWhen: "up" },
];

// The first six rows are the ones in the design.
const designRows: DirectoryRestaurant[] = [
  { id: "WE-REST-001", name: "Mama Cass", location: "Victoria Island, Lagos", status: "Active" },
  { id: "WE-REST-002", name: "Chicken Republic", location: "Ikeja, Lagos", status: "Active" },
  { id: "WE-REST-003", name: "Yellow Chilli", location: "Lekki Phase 1, Lagos", status: "Pending" },
  { id: "WE-REST-004", name: "The Place", location: "Surulere, Lagos", status: "Active" },
  { id: "WE-REST-005", name: "Bukka Hut", location: "Yaba, Lagos", status: "Active" },
  { id: "WE-REST-006", name: "Ocean Basket", location: "Lekki, Lagos", status: "Suspended" },
];

const prefixes = [
  "Mama", "Papa", "Chief", "Aunty", "Uncle", "Royal", "Golden", "Green", "Sunrise", "Island",
  "Savanna", "Harmattan", "Palm", "Cocoa", "Baobab", "Zobo", "Suya", "Jollof", "Amala", "Iyan",
];
const suffixes = [
  "Kitchen", "Grill", "Bukka", "Place", "Pot", "Table", "Eatery", "Corner", "Spot", "Canteen",
  "House", "Bites", "Diner",
];
const areas = [
  "Victoria Island, Lagos", "Ikeja, Lagos", "Lekki Phase 1, Lagos", "Surulere, Lagos", "Yaba, Lagos",
  "Lekki, Lagos", "Ikoyi, Lagos", "Ajah, Lagos", "Maryland, Lagos", "Gbagada, Lagos",
  "Wuse 2, Abuja", "Garki, Abuja", "GRA, Port Harcourt", "Bodija, Ibadan", "Independence Layout, Enugu",
];

// Chosen so the whole list matches the stat cards: 248 restaurants, 12 awaiting approval.
const pendingAt = new Set([17, 39, 61, 83, 105, 127, 149, 171, 193, 215, 237]); // 11 + Yellow Chilli = 12
const suspendedAt = new Set([29, 67, 101, 139, 163, 199, 223, 245]);

// DEMO DATA. Replace with a paginated API call (page, search and status as query parameters).
export const directoryRestaurants: DirectoryRestaurant[] = [
  ...designRows,
  ...Array.from({ length: 242 }, (_, k): DirectoryRestaurant => {
    const n = k + 7;
    return {
      id: `WE-REST-${String(n).padStart(3, "0")}`,
      name: `${prefixes[n % 20]} ${suffixes[Math.floor(n / 20) % 13]}`,
      location: areas[(n * 3) % areas.length],
      status: pendingAt.has(n) ? "Pending" : suspendedAt.has(n) ? "Suspended" : "Active",
    };
  }),
];

export const recentOrders: RecentOrder[] = [
  { id: "#WE123456", date: "2025-04-28", amount: 18000, status: "Paid" },
  { id: "#WE123455", date: "2025-04-27", amount: 12500, status: "Paid" },
  { id: "#WE123454", date: "2025-04-26", amount: 16800, status: "Paid" },
  { id: "#WE123453", date: "2025-04-25", amount: 22000, status: "Pending" },
  { id: "#WE123452", date: "2025-04-24", amount: 14500, status: "Paid" },
  { id: "#WE123451", date: "2025-04-23", amount: 9750, status: "Suspended" },
];