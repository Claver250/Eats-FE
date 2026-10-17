"use client";

import { useEffect, useState } from "react";
import { foodStats, getMenu, restaurants } from "@/mocks/food-menu";
import type { MenuItem } from "../types";
import AddItemForm, { type NewMenuItem } from "./AddItemForm";
import FoodMenuHeader from "./FoodMenuHeader";
import FoodStats from "./FoodStats";
import MenuList from "./MenuList";

const slug = (s: string) => s.toLowerCase().replace(/\s+/g, "-");

// Owns the page state: the selected restaurant, each restaurant's menu items,
// whether the form is showing, and which item (if any) is being edited.
export default function FoodMenuView() {
    const [restaurant, setRestaurant] = useState(restaurants[0].name);
    const [menus, setMenus] = useState<Record<string, MenuItem[]>>(() =>
        Object.fromEntries(restaurants.map((r) => [r.name, getMenu(r.name)])),
    );
    const [formOpen, setFormOpen] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [focusTick, setFocusTick] = useState(0);

    const items = menus[restaurant] ?? [];
    const editing = items.find((i) => i.id === editingId) ?? null;

    // After the form opens (or switches to another item), scroll to it and focus the name field.
    useEffect(() => {
        if (focusTick === 0) return;
        const frame = requestAnimationFrame(() => {
        document
            .getElementById("add-menu-item")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        document.getElementById("menu-item-name")?.focus({ preventScroll: true });
        });
        return () => cancelAnimationFrame(frame);
    }, [focusTick]);

    function updateItems(fn: (list: MenuItem[]) => MenuItem[]) {
        setMenus((prev) => ({ ...prev, [restaurant]: fn(prev[restaurant]) }));
    }

    function toggleAvailability(id: string) {
        updateItems((list) =>
        list.map((i) => (i.id === id ? { ...i, available: !i.available } : i)),
        );
    }

    function setAvailability(ids: string[], available: boolean) {
        updateItems((list) =>
        list.map((i) => (ids.includes(i.id) ? { ...i, available } : i)),
        );
    }

    function deleteItems(ids: string[]) {
        updateItems((list) => list.filter((i) => !ids.includes(i.id)));
    }

    function saveItem(data: NewMenuItem) {
        if (editing) {
        updateItems((list) =>
            list.map((i) => (i.id === editing.id ? { ...i, ...data } : i)),
        );
        setEditingId(null); // back to "add" mode
        return;
        }
        const item: MenuItem = {
        ...data,
        id: `${slug(restaurant)}-${Date.now()}`,
        createdAt: new Date().toISOString().slice(0, 19),
        };
        updateItems((list) => [item, ...list]);
    }

    function openAddForm() {
        setEditingId(null);
        setFormOpen(true);
        setFocusTick((t) => t + 1);
    }

    function openEditForm(id: string) {
        setEditingId(id);
        setFormOpen(true);
        setFocusTick((t) => t + 1);
    }

    function closeForm() {
        setEditingId(null);
        setFormOpen(false);
    }

    function changeRestaurant(name: string) {
        setEditingId(null);
        setRestaurant(name);
    }

    return (
        <div className="flex flex-col gap-6">
        <FoodMenuHeader
            restaurant={restaurant}
            onRestaurantChange={changeRestaurant}
            onAdd={openAddForm}
        />
        <FoodStats stats={foodStats(items)} />

        <div
            className={
            formOpen
                ? "grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start"
                : "grid grid-cols-1 gap-6"
            }
        >
            <MenuList
            key={restaurant}
            items={items}
            onToggle={toggleAvailability}
            onEdit={openEditForm}
            onDelete={deleteItems}
            onSetAvailability={setAvailability}
            />
            {formOpen && (
            <AddItemForm
                key={`${restaurant}-${editing?.id ?? "new"}`}
                restaurant={restaurant}
                editing={editing}
                onSave={saveItem}
                onCancel={closeForm}
            />
            )}
        </div>
        </div>
    );
}