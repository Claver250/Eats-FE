"use client";

import { useMemo, useState } from "react";
import DateRangePicker from "@/features/orders/components/DateRangePicker";
import type { DateRange } from "@/lib/dateRange";
import { getPaymentsData, getRecentOrders } from "../data";
import PaymentStats from "./PaymentStats";
import PayoutDetailModal from "./PayoutDetailModal";
import PayoutsTable from "./PayoutTable";

// The design's date range. Matches the demo data; the picker can move it to any dates.
const DEFAULT_RANGE: DateRange = { from: "2025-04-01", to: "2025-04-30" };

// Owns the date range, the highlighted row, and which restaurant's details popup is open.
export default function PaymentsView() {
  const [range, setRange] = useState<DateRange>(DEFAULT_RANGE);
  const data = useMemo(() => getPaymentsData(range), [range]);
  const [activeId, setActiveId] = useState<string | null>(data.rows[0]?.id ?? null);
  const [detailId, setDetailId] = useState<string | null>(null);

  const detail = data.rows.find((r) => r.id === detailId) ?? null;

  function viewDetails(id: string) {
    setActiveId(id); // the row you opened stays highlighted behind the popup
    setDetailId(id);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-700">Payment</h1>
          <p className="mt-1 text-sm text-muted">
            Manage partner payouts and track transaction history.
          </p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      <PaymentStats totals={data.totals} />

      <PayoutsTable
        rows={data.rows}
        days={data.totals.days}
        activeId={activeId}
        onActiveChange={setActiveId}
        onView={viewDetails}
      />

      {detail && (
        <PayoutDetailModal
          row={detail}
          days={data.totals.days}
          orders={getRecentOrders(detail, range)}
          onClose={() => setDetailId(null)}
        />
      )}
    </div>
  );
}