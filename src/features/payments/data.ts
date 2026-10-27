import { addDays, countDays, type DateRange } from "@/lib/dateRange";
import { paymentBase, payoutRows } from "@/mocks/payments";
import type { PaymentTotals, PayoutRow, RecentPayoutOrder } from "./types";

// DEMO DATA GENERATOR. Replace with an API call that takes the same `from` and `to`.
// The sample figures describe a 30-day period, so they are scaled to the length of the chosen range.
export function getPaymentsData(range: DateRange): { totals: PaymentTotals; rows: PayoutRow[] } {
  const days = countDays(range);
  const f = days / 30;

  const rows = payoutRows.map((r) => ({
    ...r,
    orders: Math.round(r.orders * f),
    totalAmount: Math.round(r.totalAmount * f),
    totalPayout: Math.round(r.totalPayout * f),
  }));

  const paidOut = Math.round(paymentBase.paidOut * f);
  const pending = Math.round(paymentBase.pending * f);

  return {
    totals: {
      earnings: paidOut + pending, // earnings are always what's been paid plus what is still owed
      paidOut,
      pending,
      available: paymentBase.available, // a balance, not a flow, so it doesn't depend on the period
      days,
    },
    rows,
  };
}

// The five orders in the design, shown for Mama Cass.
const designOrders = [
  { amount: 18_000, status: "Paid" },
  { amount: 12_500, status: "Paid" },
  { amount: 16_800, status: "Paid" },
  { amount: 22_000, status: "Pending" },
  { amount: 14_500, status: "Paid" },
] as const;

const hash = (s: string) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) % 100_003, 7);

// DEMO DATA. Replace with an API call (GET /payments/payouts/:restaurantId/orders?from=&to=&limit=5).
// Up to five recent orders for one restaurant, newest first, always inside the chosen range.
export function getRecentOrders(row: PayoutRow, range: DateRange): RecentPayoutOrder[] {
  const lag = countDays(range) > 7 ? 2 : 0; // the design's newest order is two days before the end
  const h = hash(row.id);
  const firstNumber = row.id === "WE-REST-001" ? 123_456 : 100_000 + (h % 20_000);

  return Array.from({ length: 5 }, (_, i): RecentPayoutOrder => {
    const design = row.id === "WE-REST-001" ? designOrders[i] : null;
    return {
      id: `#WE${firstNumber - i}`,
      date: addDays(range.to, -(lag + i)),
      amount: design ? design.amount : 8_000 + Math.round(((h * (i + 5) * 7919) % 22_000) / 100) * 100,
      // a restaurant that still has money owed shows one order that isn't settled yet
      status: design ? design.status : i === 3 && row.status !== "Paid" ? "Pending" : "Paid",
    };
  }).filter((o) => o.date >= range.from);
}