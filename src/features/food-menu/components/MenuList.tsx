"use client";

import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import Pagination from "@/components/ui/Pagination";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { menuCategories, type MenuCategory, type MenuItem } from "../types";
import FoodThumb from "./FoodThumb";
import RowMenu from "./RowMenu";

type CategoryFilter = "All" | MenuCategory;
type AvailabilityFilter = "all" | "available" | "out";
type SortKey = "newest" | "priceLow" | "priceHigh" | "name";

const PAGE_SIZE = 7;
const tabs: CategoryFilter[] = ["All", ...menuCategories];

type Props = {
    items: MenuItem[];
    onToggle: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (ids: string[]) => void;
    onSetAvailability: (ids: string[], available: boolean) => void;
};

export default function MenuList({
    items,
    onToggle,
    onEdit,
    onDelete,
    onSetAvailability,
}: Props) {
    const [category, setCategory] = useState<CategoryFilter>("All");
    const [query, setQuery] = useState("");
    const [availability, setAvailability] = useState<AvailabilityFilter>("all");
    const [sort, setSort] = useState<SortKey>("newest");
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<Set<string>>(new Set());

    const counts = useMemo(() => {
        const c: Record<CategoryFilter, number> = {
        All: items.length,
        "Main Dishes": 0,
        Soups: 0,
        Sides: 0,
        Drinks: 0,
        Desserts: 0,
        };
        items.forEach((i) => (c[i.category] += 1));
        return c;
    }, [items]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        const list = items.filter((i) => {
        if (category !== "All" && i.category !== category) return false;
        if (availability === "available" && !i.available) return false;
        if (availability === "out" && i.available) return false;
        if (!q) return true;
        return (
            i.name.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q)
        );
        });

        return [...list].sort((a, b) => {
        switch (sort) {
            case "priceLow":
            return a.price - b.price;
            case "priceHigh":
            return b.price - a.price;
            case "name":
            return a.name.localeCompare(b.name);
            default:
            return b.createdAt.localeCompare(a.createdAt);
        }
        });
    }, [items, category, availability, query, sort]);

    const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    const current = Math.min(page, pageCount);
    const start = (current - 1) * PAGE_SIZE;
    const visible = filtered.slice(start, start + PAGE_SIZE);

    // Only ids that still exist, so deleted items never linger in the selection.
    const selectedIds = useMemo(
        () => items.filter((i) => selected.has(i.id)).map((i) => i.id),
        [items, selected],
    );

    function resetPage<T>(setter: (v: T) => void) {
        return (v: T) => {
        setter(v);
        setPage(1);
        };
    }

    function toggleRow(id: string) {
        const next = new Set(selected);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelected(next);
    }

    function confirmDelete(ids: string[]) {
        const label = ids.length === 1 ? "this menu item" : `${ids.length} menu items`;
        if (!window.confirm(`Delete ${label}? This can't be undone.`)) return;
        onDelete(ids);
        setSelected(new Set());
    }

    return (
        <section className="rounded-card bg-surface p-5 shadow-card">
        <div className="flex gap-2 overflow-x-auto pb-1">
            {tabs.map((t) => (
            <button
                type="button"
                key={t}
                onClick={() => resetPage(setCategory)(t)}
                className={cn(
                "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition-colors",
                category === t
                    ? "border-brand-600 bg-brand-600 text-white"
                    : "border-border bg-page text-muted hover:bg-gray-100",
                )}
            >
                {t === "All" ? "All Items" : t} ({formatNumber(counts[t])})
            </button>
            ))}
        </div>

        <div className="mt-4 flex flex-col gap-3 md:flex-row">
            <label className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border px-3 py-2.5 text-sm text-muted focus-within:border-brand-500">
            <Search className="h-4 w-4 shrink-0" />
            <input
                type="search"
                value={query}
                onChange={(e) => resetPage(setQuery)(e.target.value)}
                placeholder="Search menu items..."
                className="w-full bg-transparent text-ink outline-none placeholder:text-muted"
            />
            </label>
            <select
            aria-label="Filter by availability"
            value={availability}
            onChange={(e) =>
                resetPage(setAvailability)(e.target.value as AvailabilityFilter)
            }
            className="rounded-lg border border-border px-3 py-2.5 text-sm outline-none md:w-48"
            >
            <option value="all">Availability: All</option>
            <option value="available">Availability: Available</option>
            <option value="out">Availability: Out of Stock</option>
            </select>
            <select
            aria-label="Sort menu items"
            value={sort}
            onChange={(e) => resetPage(setSort)(e.target.value as SortKey)}
            className="rounded-lg border border-border px-3 py-2.5 text-sm outline-none md:w-52"
            >
            <option value="newest">Sort: Newest</option>
            <option value="priceLow">Sort: Price (low to high)</option>
            <option value="priceHigh">Sort: Price (high to low)</option>
            <option value="name">Sort: Name (A–Z)</option>
            </select>
        </div>

        {selectedIds.length > 0 && (
            <div className="mt-4 flex flex-wrap items-center gap-2 rounded-lg bg-brand-50 px-4 py-2.5 text-sm">
            <span className="font-medium text-brand-700">
                {selectedIds.length} selected
            </span>
            <div className="ml-auto flex flex-wrap items-center gap-2">
                <button
                type="button"
                onClick={() => {
                    onSetAvailability(selectedIds, true);
                    setSelected(new Set());
                }}
                className="rounded-md border border-brand-600 px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-white"
                >
                Mark available
                </button>
                <button
                type="button"
                onClick={() => {
                    onSetAvailability(selectedIds, false);
                    setSelected(new Set());
                }}
                className="rounded-md border border-brand-600 px-3 py-1.5 text-xs font-medium text-brand-700 hover:bg-white"
                >
                Mark out of stock
                </button>
                <button
                type="button"
                onClick={() => confirmDelete(selectedIds)}
                className="rounded-md border border-danger px-3 py-1.5 text-xs font-medium text-danger hover:bg-red-50"
                >
                Delete
                </button>
                <button
                type="button"
                onClick={() => setSelected(new Set())}
                className="px-2 py-1.5 text-xs font-medium text-muted hover:text-ink"
                >
                Clear
                </button>
            </div>
            </div>
        )}

        <ul className="mt-4 divide-y divide-border">
            {visible.map((item) => (
            <li
                key={item.id}
                className={cn(
                "flex items-center gap-4 py-4",
                selected.has(item.id) && "bg-brand-50/40",
                )}
            >
                <input
                type="checkbox"
                aria-label={`Select ${item.name}`}
                checked={selected.has(item.id)}
                onChange={() => toggleRow(item.id)}
                />
                <FoodThumb item={item} />

                <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{item.name}</p>
                <p className="mt-0.5 truncate text-xs text-muted">{item.description}</p>
                <span className="mt-1.5 inline-block rounded-md bg-brand-50 px-2 py-0.5 text-[11px] font-medium text-brand-700">
                    {item.category}
                </span>
                </div>

                <p className="hidden w-24 text-right text-sm font-semibold sm:block">
                {formatCurrency(item.price, 0, "NGN")}
                </p>

                <span
                className={cn(
                    "hidden w-28 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium md:inline-flex",
                    item.available
                    ? "bg-brand-50 text-success"
                    : "bg-red-50 text-danger",
                )}
                >
                <span
                    className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    item.available ? "bg-success" : "bg-danger",
                    )}
                />
                {item.available ? "Available" : "Out of Stock"}
                </span>

                <RowMenu
                label={item.name}
                onEdit={() => onEdit(item.id)}
                onDelete={() => confirmDelete([item.id])}
                />

                <button
                type="button"
                role="switch"
                aria-checked={item.available}
                aria-label={`${item.name} is ${item.available ? "available" : "out of stock"}`}
                onClick={() => onToggle(item.id)}
                className={cn(
                    "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                    item.available ? "bg-brand-600" : "bg-gray-300",
                )}
                >
                <span
                    className={cn(
                    "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all",
                    item.available ? "left-[22px]" : "left-0.5",
                    )}
                />
                </button>
            </li>
            ))}

            {visible.length === 0 && (
            <li className="py-12 text-center text-sm text-muted">
                No menu items match your search or filters.
            </li>
            )}
        </ul>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-sm text-muted">
            <span>
            {filtered.length === 0
                ? "Showing 0 menu items"
                : `Showing ${start + 1}–${start + visible.length} of ${formatNumber(filtered.length)} menu items`}
            </span>
            <Pagination page={current} pageCount={pageCount} onChange={setPage} />
        </div>
        </section>
    );
}