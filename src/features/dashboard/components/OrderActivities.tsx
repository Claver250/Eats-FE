"use client";

import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { orders } from "@/mocks/dashboard";
import type { Order, OrderStatus } from "../types";

type SortKey = "id" | "restaurant" | "customer" | "date" | "items" | "amount" | "status";

const columns: { key: SortKey; label: string }[] = [
    { key: "id", label: "Order ID" },
    { key: "restaurant", label: "Restaurant Name" },
    { key: "customer", label: "Customer Name" },
    { key: "date", label: "Date & Time" },
    { key: "items", label: "Total Item" },
    { key: "amount", label: "Amount" },
    { key: "status", label: "Status" },
];

const statusStyle: Record<OrderStatus, string> = {
    Delivered: "text-success",
    Pending: "text-warning",
    "On the way": "text-chart",
    Cancelled: "text-danger",
};

const statusFilters = ["All", "Delivered", "Pending", "On the way", "Cancelled"] as const;
const PAGE_SIZE = 5;

function formatDate(iso: string) {
    const d = new Date(iso);
    const day = d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
    });
    const time = d.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "UTC",
    });
    return `${day} at ${time}`;
}

export default function OrderActivities() {
    const [status, setStatus] = useState<(typeof statusFilters)[number]>("All");
    const [sortKey, setSortKey] = useState<SortKey>("date");
    const [asc, setAsc] = useState(false);
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const rows = useMemo(() => {
        const filtered: Order[] =
        status === "All" ? orders : orders.filter((o) => o.status === status);
        return [...filtered].sort((a, b) => {
        const x = a[sortKey];
        const y = b[sortKey];
        const cmp = typeof x === "number" && typeof y === "number"
            ? x - y
            : String(x).localeCompare(String(y));
        return asc ? cmp : -cmp;
        });
    }, [status, sortKey, asc]);

    const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    const visible = rows.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
    const allSelected = visible.length > 0 && visible.every((o) => selected.has(o.id));

    function toggleSort(key: SortKey) {
        if (key === sortKey) setAsc(!asc);
        else {
        setSortKey(key);
        setAsc(true);
        }
    }

    function toggleRow(id: string) {
        const next = new Set(selected);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelected(next);
    }

    function toggleAll() {
        const next = new Set(selected);
        if (allSelected) visible.forEach((o) => next.delete(o.id));
        else visible.forEach((o) => next.add(o.id));
        setSelected(next);
    }

    return (
        <section className="rounded-card bg-surface p-5 shadow-card">
        <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
            <h2 className="text-base font-semibold">Order Activities</h2>
            <p className="text-xs text-muted">Keep track of recent order activities</p>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
            <label className="flex items-center gap-1">
                Status:
                <select
                className="rounded-md bg-transparent text-xs font-semibold text-ink outline-none"
                value={status}
                onChange={(e) => {
                    setStatus(e.target.value as (typeof statusFilters)[number]);
                    setPage(1);
                }}
                >
                {statusFilters.map((s) => (
                    <option key={s}>{s}</option>
                ))}
                </select>
            </label>
            <label className="flex items-center gap-1">
                Days:
                <select
                className="rounded-md bg-transparent text-xs font-semibold text-ink outline-none"
                defaultValue="today"
                >
                <option value="today">Today</option>
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                </select>
            </label>
            </div>
        </div>

        <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[820px] text-left text-sm">
            <thead>
                <tr className="border-b border-border text-xs text-muted">
                <th className="w-10 py-3 pr-2">
                    <input
                    type="checkbox"
                    aria-label="Select all rows"
                    checked={allSelected}
                    onChange={toggleAll}
                    />
                </th>
                {columns.map((c) => {
                    const Icon =
                    sortKey !== c.key ? ChevronsUpDown : asc ? ArrowUp : ArrowDown;
                    return (
                    <th key={c.key} className="py-3 pr-4 font-medium">
                        <button
                        onClick={() => toggleSort(c.key)}
                        className="flex items-center gap-1 hover:text-ink"
                        >
                        {c.label}
                        <Icon className="h-3 w-3" />
                        </button>
                    </th>
                    );
                })}
                </tr>
            </thead>
            <tbody>
                {visible.map((o) => (
                <tr
                    key={o.id}
                    className={cn(
                    "border-b border-border last:border-0",
                    selected.has(o.id) && "bg-brand-50/50",
                    )}
                >
                    <td className="py-4 pr-2">
                    <input
                        type="checkbox"
                        aria-label={`Select order ${o.id}`}
                        checked={selected.has(o.id)}
                        onChange={() => toggleRow(o.id)}
                    />
                    </td>
                    <td className="py-4 pr-4 font-medium">{o.id}</td>
                    <td className="py-4 pr-4">{o.restaurant}</td>
                    <td className="py-4 pr-4">{o.customer}</td>
                    <td className="py-4 pr-4 text-muted">{formatDate(o.date)}</td>
                    <td className="py-4 pr-4">{formatNumber(o.items)}</td>
                    <td className="py-4 pr-4">{formatCurrency(o.amount, 2)}</td>
                    <td className={cn("py-4 pr-4 font-medium", statusStyle[o.status])}>
                    {o.status}
                    </td>
                </tr>
                ))}
                {visible.length === 0 && (
                <tr>
                    <td colSpan={8} className="py-10 text-center text-muted">
                    No orders match this filter.
                    </td>
                </tr>
                )}
            </tbody>
            </table>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-muted">
            <span>
            {selected.size > 0 ? `${selected.size} selected · ` : ""}
            Page {page} of {pageCount}
            </span>
            <div className="flex gap-2">
            <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="rounded-md border border-border px-3 py-1 disabled:opacity-40"
            >
                Previous
            </button>
            <button
                onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                disabled={page === pageCount}
                className="rounded-md border border-border px-3 py-1 disabled:opacity-40"
            >
                Next
            </button>
            </div>
        </div>
        </section>
    );
}