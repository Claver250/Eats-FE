"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, MoreVertical, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import type { OrderRow, OrderState } from "../types";
import RestaurantAvatar from "./RestaurantAvatar";

type Filter = "All" | OrderState;

const filters: Filter[] = ["All", "Delivered", "Pending", "Cancelled"];
const PAGE_SIZE = 6;

const pill: Record<OrderState, string> = {
    Delivered: "bg-brand-50 text-success",
    Pending: "bg-orange-50 text-warning",
    Cancelled: "bg-red-50 text-danger",
};

// Dates in the mock data have no timezone. Parse as UTC and format as UTC so the
// displayed time always matches the data, on the server and in the browser.
function formatDay(iso: string) {
    return new Date(`${iso}Z`).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC",
    });
}

function formatTime(iso: string) {
    return new Date(`${iso}Z`).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "UTC",
    });
}

function pageList(current: number, count: number): (number | "…")[] {
    if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    const from = Math.max(2, current - 1);
    const to = Math.min(count - 1, current + 1);
    if (from > 2) pages.push("…");
    for (let p = from; p <= to; p++) pages.push(p);
    if (to < count - 1) pages.push("…");
    pages.push(count);
    return pages;
}

export default function OrdersTable({ rows }: { rows: OrderRow[] }) {
    const [status, setStatus] = useState<Filter>("All");
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const counts = useMemo(() => {
        const c: Record<Filter, number> = {
        All: rows.length,
        Delivered: 0,
        Pending: 0,
        Cancelled: 0,
        };
        rows.forEach((r) => (c[r.status] += 1));
        return c;
    }, [rows]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return rows.filter((r) => {
        if (status !== "All" && r.status !== status) return false;
        if (!q) return true;
        return (
            r.id.toLowerCase().includes(q) ||
            r.customer.toLowerCase().includes(q) ||
            r.restaurant.toLowerCase().includes(q)
        );
        });
    }, [rows, status, query]);

    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const current = Math.min(page, pageCount);
    const start = (current - 1) * PAGE_SIZE;
    const visible = filtered.slice(start, start + PAGE_SIZE);
    const allSelected = visible.length > 0 && visible.every((r) => selected.has(r.id));

    function changeStatus(next: Filter) {
        setStatus(next);
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

    return (
        <section className="rounded-card bg-surface p-5 shadow-card">
        <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-center 2xl:justify-between">
            <div className="flex gap-2 overflow-x-auto pb-1">
            {filters.map((f) => (
                <button
                key={f}
                onClick={() => changeStatus(f)}
                className={cn(
                    "shrink-0 whitespace-nowrap rounded-lg border px-4 py-2 text-sm font-medium transition-colors",
                    status === f
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-border text-muted hover:bg-gray-50",
                )}
                >
                {f === "All" ? "All Orders" : f} ({formatNumber(counts[f])})
                </button>
            ))}
            </div>

            <div className="flex w-full items-center gap-3 2xl:w-auto">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm text-muted focus-within:border-brand-500 2xl:w-96 2xl:flex-none">
                <Search className="h-4 w-4 shrink-0" />
                <input
                type="search"
                value={query}
                onChange={(e) => {
                    setQuery(e.target.value);
                    setPage(1);
                }}
                placeholder="Search order, customer or restaurant"
                className="w-full bg-transparent text-ink outline-none placeholder:text-muted"
                />
            </label>
            <select
                aria-label="Filter by status"
                value={status}
                onChange={(e) => changeStatus(e.target.value as Filter)}
                className="shrink-0 rounded-lg border border-border px-3 py-2 text-sm outline-none"
            >
                {filters.map((f) => (
                <option key={f} value={f}>
                    {f === "All" ? "All Status" : f}
                </option>
                ))}
            </select>
            </div>
        </div>

        <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
            <thead>
                <tr className="bg-page text-xs text-muted">
                <th className="w-10 rounded-l-lg px-3 py-3">
                    <input
                    type="checkbox"
                    aria-label="Select all rows"
                    checked={allSelected}
                    onChange={toggleAll}
                    />
                </th>
                <th className="px-3 py-3 font-medium">Order ID</th>
                <th className="px-3 py-3 font-medium">Restaurant</th>
                <th className="px-3 py-3 font-medium">Customer</th>
                <th className="px-3 py-3 font-medium">Date &amp; Time</th>
                <th className="px-3 py-3 font-medium">Items</th>
                <th className="px-3 py-3 font-medium">Total Amount</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="rounded-r-lg px-3 py-3 font-medium">Action</th>
                </tr>
            </thead>
            <tbody>
                {visible.map((r) => (
                <tr
                    key={r.id}
                    className={cn(
                    "border-b border-border last:border-0",
                    selected.has(r.id) && "bg-brand-50/40",
                    )}
                >
                    <td className="px-3 py-4">
                    <input
                        type="checkbox"
                        aria-label={`Select order ${r.id}`}
                        checked={selected.has(r.id)}
                        onChange={() => toggleRow(r.id)}
                    />
                    </td>
                    <td className="px-3 py-4">
                    <p className="font-semibold">{r.id}</p>
                    <p className="text-xs text-muted">{r.kind}</p>
                    </td>
                    <td className="px-3 py-4">
                    <div className="flex items-center gap-3">
                        <RestaurantAvatar name={r.restaurant} />
                        <div>
                        <p className="font-medium">{r.restaurant}</p>
                        <p className="text-xs text-muted">{r.area}</p>
                        </div>
                    </div>
                    </td>
                    <td className="px-3 py-4">
                    <p>{r.phone}</p>
                    <p className="text-xs text-muted">{r.customer}</p>
                    </td>
                    <td className="px-3 py-4">
                    <p>{formatDay(r.date)}</p>
                    <p className="text-xs text-muted">{formatTime(r.date)}</p>
                    </td>
                    <td className="px-3 py-4">
                    {r.items} {r.items === 1 ? "item" : "items"}
                    </td>
                    <td className="px-3 py-4 font-medium">
                    {formatCurrency(r.amount, 2, "NGN")}
                    </td>
                    <td className="px-3 py-4">
                    <span
                        className={cn(
                        "inline-block rounded-full px-3 py-1 text-xs font-medium",
                        pill[r.status],
                        )}
                    >
                        {r.status}
                    </span>
                    </td>
                    <td className="px-3 py-4">
                    <div className="flex items-center gap-2">
                        <button className="rounded-lg border border-brand-600 px-5 py-1.5 text-sm font-medium text-brand-600 transition-colors hover:bg-brand-50">
                        View
                        </button>
                        <button
                        aria-label="More actions"
                        className="rounded-md p-1.5 text-muted hover:bg-gray-100"
                        >
                        <MoreVertical className="h-4 w-4" />
                        </button>
                    </div>
                    </td>
                </tr>
                ))}
                {visible.length === 0 && (
                <tr>
                    <td colSpan={9} className="py-12 text-center text-muted">
                    No orders match your search or filter.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
            <span>
            {filtered.length === 0
                ? "Showing 0 orders"
                : `Showing ${start + 1}–${start + visible.length} of ${formatNumber(filtered.length)} orders`}
            {selected.size > 0 ? ` · ${selected.size} selected` : ""}
            </span>

            <div className="flex items-center gap-1">
            <button
                aria-label="Previous page"
                onClick={() => setPage(Math.max(1, current - 1))}
                disabled={current === 1}
                className="rounded-md p-2 hover:bg-gray-100 disabled:opacity-40"
            >
                <ChevronLeft className="h-4 w-4" />
            </button>
            {pageList(current, pageCount).map((p, i) =>
                p === "…" ? (
                <span key={`gap-${i}`} className="px-2">
                    …
                </span>
                ) : (
                <button
                    key={p}
                    onClick={() => setPage(p)}
                    className={cn(
                    "h-8 min-w-8 rounded-md px-2 text-sm",
                    p === current
                        ? "bg-brand-600 font-medium text-white"
                        : "hover:bg-gray-100",
                    )}
                >
                    {p}
                </button>
                ),
            )}
            <button
                aria-label="Next page"
                onClick={() => setPage(Math.min(pageCount, current + 1))}
                disabled={current === pageCount}
                className="rounded-md p-2 hover:bg-gray-100 disabled:opacity-40"
            >
                <ChevronRight className="h-4 w-4" />
            </button>
            </div>
        </div>
        </section>
    );
}
