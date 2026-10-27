"use client";

import { useMemo, useState } from "react";
import { ChevronRight, Search } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import RestaurantAvatar from "@/features/orders/components/RestaurantAvatar";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import { balanceToPay, type PayoutRow, type PayoutStatus } from "../types";
import PayoutStatusPill from "./PayoutStatusPill";

// "Pending" here means not paid yet, so it includes rows marked Ready (that is how the design's counts add up).
type Tab = "All" | "Pending" | "Paid";
type StatusFilter = "All" | PayoutStatus;

const PAGE_SIZE = 8;
const naira = (n: number) => formatCurrency(n, 0, "NGN");
const isUnpaid = (r: PayoutRow) => r.status !== "Paid";

type Props = {
  rows: PayoutRow[];
  days: number; // length of the chosen period, shown in the Orders column heading
  activeId: string | null; // the highlighted row
  onActiveChange: (id: string) => void; // clicking a row highlights it
  onView: (id: string) => void; // the View button opens that restaurant's payment details
};

export default function PayoutsTable({ rows, days, activeId, onActiveChange, onView }: Props) {
  const [tab, setTab] = useState<Tab>("All");
  const [status, setStatus] = useState<StatusFilter>("All");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const counts = useMemo(
    () => ({
      All: rows.length,
      Pending: rows.filter(isUnpaid).length,
      Paid: rows.filter((r) => !isUnpaid(r)).length,
    }),
    [rows],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (tab === "Pending" && !isUnpaid(r)) return false;
      if (tab === "Paid" && isUnpaid(r)) return false;
      if (status !== "All" && r.status !== status) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    });
  }, [rows, tab, status, query]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);
  const allSelected = visible.length > 0 && visible.every((r) => selected.has(r.id));

  // The tabs and the dropdown never fight each other: choosing one resets the other.
  function chooseTab(next: Tab) {
    setTab(next);
    setStatus("All");
    setPage(1);
  }
  function chooseStatus(next: StatusFilter) {
    setStatus(next);
    setTab("All");
    setPage(1);
  }

  function toggleRow(id: string) {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  }

  function toggleAll() {
    const next = new Set(selected);
    if (allSelected) visible.forEach((r) => next.delete(r.id));
    else visible.forEach((r) => next.add(r.id));
    setSelected(next);
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "All", label: "All Restaurants" },
    { id: "Pending", label: "Pending" },
    { id: "Paid", label: "Paid" },
  ];

  return (
    <section className="rounded-card bg-surface p-5 shadow-card">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by payout status">
          {tabs.map((t) => (
            <button
              key={t.id}
              type="button"
              aria-pressed={tab === t.id}
              onClick={() => chooseTab(t.id)}
              className={cn(
                "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                tab === t.id
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-border bg-page text-muted hover:bg-gray-100",
              )}
            >
              {t.label} ({formatNumber(counts[t.id])})
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted focus-within:border-brand-500 lg:w-64 lg:flex-none">
            <Search className="h-4 w-4 shrink-0" />
            <input
              type="search"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
              placeholder="Search restaurant..."
              className="w-full bg-transparent text-ink outline-none placeholder:text-muted"
            />
          </label>
          <select
            aria-label="Filter by status"
            value={status}
            onChange={(e) => chooseStatus(e.target.value as StatusFilter)}
            className="shrink-0 rounded-lg border border-border px-3 py-2 text-sm outline-none"
          >
            <option value="All">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Ready">Ready</option>
            <option value="Paid">Paid</option>
          </select>
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead>
            <tr className="bg-page text-xs text-muted">
              <th className="w-10 rounded-l-lg px-3 py-3">
                <input
                  type="checkbox"
                  aria-label="Select all restaurants on this page"
                  checked={allSelected}
                  onChange={toggleAll}
                />
              </th>
              <th className="px-3 py-3 font-medium">Restaurant</th>
              <th className="px-3 py-3 font-medium">
                Orders
                <span className="block font-normal">({days} {days === 1 ? "day" : "days"})</span>
              </th>
              <th className="px-3 py-3 font-medium">
                Total Amount
                <span className="block font-normal">(₦)</span>
              </th>
              <th className="px-3 py-3 font-medium">
                Total Payout
                <span className="block font-normal">(₦)</span>
              </th>
              <th className="px-3 py-3 font-medium">
                Balance to Pay
                <span className="block font-normal">(₦)</span>
              </th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="rounded-r-lg px-3 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => {
              const active = r.id === activeId;
              return (
                <tr
                  key={r.id}
                  aria-current={active ? "true" : undefined}
                  onClick={() => onActiveChange(r.id)}
                  className={cn(
                    "cursor-pointer border-b border-border last:border-0",
                    active ? "bg-brand-50/70" : selected.has(r.id) ? "bg-brand-50/30" : "hover:bg-gray-50",
                  )}
                >
                  <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      aria-label={`Select ${r.name}`}
                      checked={selected.has(r.id)}
                      onChange={() => toggleRow(r.id)}
                    />
                  </td>
                  <td className="px-3 py-3.5">
                    <div className="flex items-center gap-3">
                      <RestaurantAvatar name={r.name} />
                      <div className="min-w-0">
                        <p className="truncate font-semibold">{r.name}</p>
                        <p className="truncate text-xs text-muted">{r.location}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 py-3.5">{formatNumber(r.orders)}</td>
                  <td className="px-3 py-3.5">{naira(r.totalAmount)}</td>
                  <td className="px-3 py-3.5">{naira(r.totalPayout)}</td>
                  <td className="px-3 py-3.5 font-medium">{naira(balanceToPay(r))}</td>
                  <td className="px-3 py-3.5">
                    <PayoutStatusPill status={r.status} />
                  </td>
                  <td className="px-3 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        aria-label={`View ${r.name}`}
                        aria-haspopup="dialog"
                        onClick={() => onView(r.id)}
                        className="rounded-lg border border-brand-600 px-4 py-1.5 text-sm font-medium text-brand-700 transition-colors hover:bg-brand-50"
                      >
                        View
                      </button>
                      <ChevronRight className="h-4 w-4 text-muted" aria-hidden="true" />
                    </div>
                  </td>
                </tr>
              );
            })}
            {visible.length === 0 && (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-muted">
                  No restaurants match your search or filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
        <span>
          {filtered.length === 0
            ? "Showing 0 restaurants"
            : `Showing ${start + 1}–${start + visible.length} of ${formatNumber(filtered.length)} restaurants`}
          {selected.size > 0 ? ` · ${selected.size} selected` : ""}
        </span>
        <Pagination page={current} pageCount={pageCount} onChange={setPage} />
      </div>
    </section>
  );
}