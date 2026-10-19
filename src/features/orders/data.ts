import {
  addDays,
  daysBetween,
  eachDay,
  parseISODate,
  type DateRange,
} from "@/lib/dateRange";
import { orderRows, orderStats } from "@/mocks/orders";
import type { OrderRow, OrderStat, OverviewPoint, StatusSegment } from "./types";

// DEMO DATA GENERATOR. When the backend exists, replace this function with an API call
// such as GET /orders/summary?from=YYYY-MM-DD&to=YYYY-MM-DD returning the same shape.
export type OrdersData = {
  stats: OrderStat[];
  overview: OverviewPoint[];
  status: StatusSegment[];
  rows: OrderRow[];
};

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// The mock table rows are dated 28-30 Apr 2025. They are moved so the latest one
// lands on the end of the chosen range, then only rows inside the range are kept.
const ROW_REFERENCE_DAY = "2025-04-30";

function dayLabel(iso: string, withYear: boolean) {
  const d = parseISODate(iso);
  const base = `${MONTHS[d.getUTCMonth()]} ${String(d.getUTCDate()).padStart(2, "0")}`;
  return withYear ? `${base} ’${String(d.getUTCFullYear()).slice(2)}` : base;
}

export function getOrdersData(range: DateRange): OrdersData {
  const days = eachDay(range);
  const n = days.length;
  const factor = n / 30; // the stat cards in the design describe a 30-day month
  const withYear = range.from.slice(0, 4) !== range.to.slice(0, 4);

  const base = (id: string) => orderStats.find((s) => s.id === id)?.value ?? 0;
  const total = Math.round(base("total") * factor);
  const completed = Math.round(base("completed") * factor);
  const pending = Math.round(base("pending") * factor);
  const cancelled = Math.max(total - completed - pending, 0);
  const scaled: Record<string, number> = { total, completed, pending, cancelled };

  const stats = orderStats.map((s) =>
    s.id in scaled ? { ...s, value: scaled[s.id] } : s,
  );

  const status: StatusSegment[] = [
    { id: "completed", label: "Delivered", count: completed },
    { id: "pending", label: "Pending", count: pending },
    { id: "cancelled", label: "Cancelled", count: cancelled },
  ];

  const overview: OverviewPoint[] = days.map((iso, i) => {
    const t = n > 1 ? (i * 29) / (n - 1) : 0; // trend position, 0..29
    return {
      day: dayLabel(iso, withYear),
      completed: Math.round(450 + t * 52 + Math.sin(i * 2.3) * 140 + Math.cos(i * 4.1) * 90),
      pending: Math.round(220 + t * 13 + Math.sin(i * 2.9) * 45 + Math.cos(i * 5.2) * 30),
      cancelled: Math.round(120 + t * 8 + Math.sin(i * 3.4) * 28 + Math.cos(i * 6.1) * 18),
    };
  });

  const shift = daysBetween(ROW_REFERENCE_DAY, range.to);
  const rows = orderRows
    .map((r) => {
      const [day, time] = r.date.split("T");
      return { ...r, date: `${addDays(day, shift)}T${time}` };
    })
    .filter((r) => {
      const day = r.date.slice(0, 10);
      return day >= range.from && day <= range.to;
    });

  return { stats, overview, status, rows };
}