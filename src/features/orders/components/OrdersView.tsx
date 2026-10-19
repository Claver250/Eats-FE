"use client";

import { useMemo, useState } from "react";
import type { DateRange } from "@/lib/dateRange";
import { getOrdersData } from "../data";
import DateRangePicker from "./DateRangePicker";
import OrderStatus from "./OrderStatus";
import OrdersOverview from "./OrdersOverview";
import OrdersTable from "./OrderTable";
import StatCards from "./StatsCards";

// The design's date range. Matches the demo data; the picker can move it to any dates.
const DEFAULT_RANGE: DateRange = { from: "2025-04-01", to: "2025-04-30" };

// Owns the selected date range. Every widget below is calculated from it.
export default function OrdersView() {
  const [range, setRange] = useState<DateRange>(DEFAULT_RANGE);
  const data = useMemo(() => getOrdersData(range), [range]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-700">Orders</h1>
          <p className="mt-1 text-sm text-muted">
            Track, manage and monitor all food delivery orders in real time.
          </p>
        </div>
        <DateRangePicker value={range} onChange={setRange} />
      </div>

      <StatCards stats={data.stats} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <OrdersOverview data={data.overview} />
        </div>
        <OrderStatus segments={data.status} />
      </div>

      <OrdersTable key={`${range.from}_${range.to}`} rows={data.rows} />
    </div>
  );
}