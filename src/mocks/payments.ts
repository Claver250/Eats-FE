import type { PayoutRow } from "@/features/payments/types";

// The first eight rows are the ones in the design (figures are for a 30-day period).
const designRows: PayoutRow[] = [
  { id: "WE-REST-001", name: "Mama Cass", location: "Victoria Island, Lagos", cuisine: "Nigerian Cuisine", orders: 186, totalAmount: 2_850_000, totalPayout: 2_450_000, status: "Pending" },
  { id: "WE-REST-002", name: "Chicken Republic", location: "Ikeja, Lagos", cuisine: "Fast Food", orders: 342, totalAmount: 4_120_000, totalPayout: 3_900_000, status: "Pending" },
  { id: "WE-REST-003", name: "Yellow Chilli", location: "Lekki Phase 1, Lagos", cuisine: "Nigerian Cuisine", orders: 289, totalAmount: 3_760_000, totalPayout: 3_200_000, status: "Ready" },
  { id: "WE-REST-004", name: "The Place", location: "Surulere, Lagos", cuisine: "Nigerian Cuisine", orders: 154, totalAmount: 2_340_000, totalPayout: 2_100_000, status: "Paid" },
  { id: "WE-REST-005", name: "Bukka Hut", location: "Yaba, Lagos", cuisine: "Local Dishes", orders: 127, totalAmount: 1_980_000, totalPayout: 1_750_000, status: "Paid" },
  { id: "WE-REST-006", name: "Ocean Basket", location: "Lekki, Lagos", cuisine: "Seafood", orders: 96, totalAmount: 1_420_000, totalPayout: 1_200_000, status: "Ready" },
  { id: "WE-REST-007", name: "Lagos Grill", location: "Gbagada, Lagos", cuisine: "Grills & Suya", orders: 72, totalAmount: 980_000, totalPayout: 860_000, status: "Pending" },
  { id: "WE-REST-008", name: "Zobo Drink", location: "Victoria Island, Lagos", cuisine: "Drinks & Smoothies", orders: 68, totalAmount: 760_000, totalPayout: 680_000, status: "Paid" },
];

const prefixes = ["Mama", "Papa", "Chief", "Aunty", "Royal", "Golden", "Palm", "Savanna", "Island", "Sunrise"];
const suffixes = ["Kitchen", "Grill", "Bukka", "Pot", "Table", "Eatery", "Corner", "Canteen", "Diner", "Bites"];
const places = ["Ikeja, Lagos", "Lekki, Lagos", "Yaba, Lagos", "Surulere, Lagos", "Ajah, Lagos", "Ikoyi, Lagos", "Maryland, Lagos", "Wuse 2, Abuja"];
const cuisines = ["Nigerian Cuisine", "Local Dishes", "Fast Food", "Seafood", "Grills & Suya"];

const round10k = (n: number) => Math.round(n / 10_000) * 10_000;

// 20 more restaurants, so the table matches the design's 28 (8 unpaid, 20 paid).
// Three of them are unpaid here, because five of the first eight already are.
const unpaidAt: Record<number, "Pending" | "Ready"> = { 3: "Ready", 9: "Pending", 15: "Pending" };

// DEMO DATA. Replace with an API call (GET /payments/payouts?from=&to=&status=&search=&page=).
export const payoutRows: PayoutRow[] = [
  ...designRows,
  ...Array.from({ length: 20 }, (_, k): PayoutRow => {
    const unpaid = unpaidAt[k];
    const totalAmount = round10k(300_000 + ((k * 7919) % 1_200_000));
    const balance = round10k(totalAmount * (unpaid ? 0.12 : 0.08));
    return {
      id: `WE-REST-${String(k + 9).padStart(3, "0")}`,
      name: `${prefixes[k % 10]} ${suffixes[(k * 3 + Math.floor(k / 10)) % 10]}`,
      location: places[k % places.length],
      cuisine: cuisines[k % cuisines.length],
      orders: Math.round(totalAmount / 15_000),
      totalAmount,
      totalPayout: totalAmount - balance,
      status: unpaid ?? "Paid",
    };
  }),
];

// Platform-wide figures for the 30-day period in the design. They come from the backend later.
export const paymentBase = {
  paidOut: 18_760_450,
  pending: 6_719_870,
  available: 2_500_000,
  change: { earnings: 12, paidOut: 18, pending: 7 },
};