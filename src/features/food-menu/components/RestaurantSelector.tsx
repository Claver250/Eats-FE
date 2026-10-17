"use client";

import { ChevronDown } from "lucide-react";
import RestaurantAvatar from "@/features/orders/components/RestaurantAvatar";
import type { RestaurantInfo } from "../types";

type Props = {
    restaurants: RestaurantInfo[];
    value: string;
    onChange: (name: string) => void;
};

export default function RestaurantSelector({ restaurants, value, onChange }: Props) {
    const current = restaurants.find((r) => r.name === value) ?? restaurants[0];

    return (
        <label className="relative flex min-w-64 cursor-pointer items-center gap-3 rounded-xl border border-border bg-surface px-4 py-2.5 shadow-card">
        <RestaurantAvatar key={current.name} name={current.name} />
        <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">{current.name}</p>
            <p className="truncate text-xs text-muted">
            {current.cuisine} · {current.area}
            </p>
        </div>
        <ChevronDown className="pointer-events-none h-4 w-4 shrink-0 text-muted" />
        <select
            aria-label="Select restaurant"
            value={current.name}
            onChange={(e) => onChange(e.target.value)}
            className="absolute inset-0 w-full cursor-pointer opacity-0"
        >
            {restaurants.map((r) => (
            <option key={r.name} value={r.name}>
                {r.name}
            </option>
            ))}
        </select>
        </label>
    );
}
