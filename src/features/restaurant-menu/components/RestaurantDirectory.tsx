"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Copy, Download, PauseCircle, Search } from "lucide-react";
import ActionMenu, { type ActionItem } from "@/components/ui/ActionView";
import Pagination from "@/components/ui/Pagination";
import RestaurantAvatar from "@/features/orders/components/RestaurantAvatar";
import { downloadCsv } from "@/lib/csv";
import { todayISO } from "@/lib/dateRange";
import { formatNumber } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { DirectoryRestaurant, RestaurantStatus } from "../types";
import StatusPill from "./StatusPill";

type Filter = "All" | RestaurantStatus;

const filters: Filter[] = ["All", "Active", "Pending", "Suspended"];
const PAGE_SIZE = 6;

// The design shows "REST-001"; the system ID is "WE-REST-001".
const displayId = (id: string) => id.replace(/^WE-/, "");

type Props = {
  restaurants: DirectoryRestaurant[];
  onStatusChange: (id: string, status: RestaurantStatus) => void;
};

export default function RestaurantDirectory({ restaurants, onStatusChange }: Props) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("All");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return restaurants.filter((r) => {
      if (filter !== "All" && r.status !== filter) return false;
      if (!q) return true;
      return (
        r.name.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.id.toLowerCase().includes(q)
      );
    });
  }, [restaurants, query, filter]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const current = Math.min(page, pageCount);
  const start = (current - 1) * PAGE_SIZE;
  const visible = filtered.slice(start, start + PAGE_SIZE);
  const allSelected = visible.length > 0 && visible.every((r) => selected.has(r.id));

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

  function exportCsv() {
    // Exports everything that matches the current search and filter, not only the visible page.
    downloadCsv(`restaurants-${todayISO()}.csv`, [
      ["Restaurant ID", "Name", "Location", "Status"],
      ...filtered.map((r) => [r.id, r.name, r.location, r.status]),
    ]);
  }

  function actionsFor(r: DirectoryRestaurant): ActionItem[] {
    const items: ActionItem[] = [];
    if (r.status === "Pending") {
      items.push({
        label: "Approve",
        icon: <CheckCircle2 className="h-4 w-4" />,
        onSelect: () => onStatusChange(r.id, "Active"),
      });
    }
    if (r.status === "Active") {
      items.push({
        label: "Suspend",
        icon: <PauseCircle className="h-4 w-4" />,
        tone: "danger",
        onSelect: () => {
          if (window.confirm(`Suspend ${r.name}? You can reactivate it later.`)) {
            onStatusChange(r.id, "Suspended");
          }
        },
      });
    }
    if (r.status === "Suspended") {
      items.push({
        label: "Reactivate",
        icon: <CheckCircle2 className="h-4 w-4" />,
        onSelect: () => onStatusChange(r.id, "Active"),
      });
    }
    items.push({
      label: "Copy restaurant ID",
      icon: <Copy className="h-4 w-4" />,
      onSelect: () => {
        void navigator.clipboard?.writeText(r.id);
      },
    });
    return items;
  }

  return (
    <section className="rounded-card bg-surface p-5 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold">Restaurant Directory</h2>
          <p className="mt-0.5 text-xs text-muted">Search by name, location or restaurant ID</p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          className="inline-flex items-center gap-2 rounded-lg border border-brand-600 px-4 py-2 text-sm font-medium text-brand-700 hover:bg-brand-50"
        >
          <Download className="h-4 w-4" />
          Export
        </button>
      </div>

      <div className="mt-4 flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm text-muted focus-within:border-brand-500">
          <Search className="h-4 w-4 shrink-0" />
          <input
            type="search"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            placeholder="Search restaurants..."
            className="w-full bg-transparent text-ink outline-none placeholder:text-muted"
          />
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by status">
          {filters.map((f) => (
            <button
              key={f}
              type="button"
              aria-pressed={filter === f}
              onClick={() => {
                setFilter(f);
                setPage(1);
              }}
              className={cn(
                "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                filter === f
                  ? "border-brand-600 bg-brand-600 text-white"
                  : "border-border bg-page text-muted hover:bg-gray-100",
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[560px] text-left text-sm">
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
              <th className="px-3 py-3 font-medium">Location</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="rounded-r-lg px-3 py-3 font-medium">Actions</th>
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
                <td className="px-3 py-3.5">
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
                      <p className="text-xs text-muted">ID: {displayId(r.id)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-3 py-3.5 text-muted">{r.location}</td>
                <td className="px-3 py-3.5">
                  <StatusPill status={r.status} />
                </td>
                <td className="px-3 py-3.5">
                  <ActionMenu label={r.name} items={actionsFor(r)} />
                </td>
              </tr>
            ))}
            {visible.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-sm text-muted">
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