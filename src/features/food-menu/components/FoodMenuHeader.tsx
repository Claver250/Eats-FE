"use client";

import { Plus } from "lucide-react";
import { restaurants } from "@/mocks/food-menu";
import RestaurantSelector from "./RestaurantSelector";

type Props = {
    restaurant: string;
    onRestaurantChange: (name: string) => void;
    onAdd?: () => void; // wired to the add-item form
};

export default function FoodMenuHeader({
    restaurant,
    onRestaurantChange,
    onAdd,
    }: Props) {
    return (
        <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-brand-700">Food Menu</h1>
            <p className="mt-1 text-sm text-muted">
            Manage meals and menu items for your restaurant partners
            </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
            <RestaurantSelector
            restaurants={restaurants}
            value={restaurant}
            onChange={onRestaurantChange}
            />
            <button
            type="button"
            onClick={onAdd}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-semibold text-white shadow-card transition-colors hover:bg-brand-700"
            >
            <Plus className="h-4 w-4" />
            Add New Menu Item
            </button>
        </div>
        </div>
    );
}