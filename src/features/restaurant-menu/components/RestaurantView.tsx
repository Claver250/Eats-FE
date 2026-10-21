"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { recentOrders, directoryRestaurants } from "@/mocks/restaurant-menu";
import { restaurantStats } from "@/mocks/restaurant-menu";
import type {
  DirectoryRestaurant,
  NewRestaurantInput,
  RestaurantStatus,
  RestaurantSummary,
} from "../types";
import CreateRestaurantModal from "./RestaurantModal";
import QuickLinks from "./QuickLinks";
import RecentOrders from "./RecentOrders";
import RestaurantDirectory from "./RestaurantDirectory";
import RestaurantStats from "./RestaurantStats";
import RestaurantsHeader from "./RestaurantHeader";

// Page-level container. It owns the restaurant list, so the stat cards, the table and the
// Create Restaurant form all stay in step with each other.
export default function RestaurantsView() {
  const [createOpen, setCreateOpen] = useState(false);
  const [restaurants, setRestaurants] = useState<DirectoryRestaurant[]>(directoryRestaurants);
  const [notice, setNotice] = useState<RestaurantSummary | null>(null);

  // Replace the body of this function with the API call. The backend generates the real ID;
  // this preview continues numbering from the restaurants that already exist.
  function createRestaurant(input: NewRestaurantInput) {
    const summary: RestaurantSummary = {
      id: `WE-REST-${String(restaurants.length + 1).padStart(3, "0")}`,
      name: input.name,
      address: input.address,
      city: input.city,
      email: input.email,
      phone: input.phone,
      specialty: input.specialty,
      status: "Pending",
    };
    // Bank details, BVN and documents are sent to the API here, then dropped. They are never kept in state.
    setRestaurants((list) => [
      { id: summary.id, name: summary.name, location: summary.city, status: "Pending" },
      ...list,
    ]);
    setNotice(summary);
  }

  // Replace with an API call (PATCH /restaurants/:id) that returns the updated restaurant.
  function changeStatus(id: string, status: RestaurantStatus) {
    setRestaurants((list) => list.map((r) => (r.id === id ? { ...r, status } : r)));
  }

  // The first two cards are counted from the list. The payout figures come from the backend.
  const stats = restaurantStats.map((s) => {
    if (s.id === "total") return { ...s, value: restaurants.length };
    if (s.id === "awaiting") {
      return { ...s, value: restaurants.filter((r) => r.status === "Pending").length };
    }
    return s;
  });

  return (
    <div className="flex flex-col gap-6">
      <RestaurantsHeader onCreate={() => setCreateOpen(true)} />

      {notice && (
        <div
          role="status"
          className="flex items-start justify-between gap-3 rounded-card bg-brand-50 px-4 py-3 text-sm text-brand-700"
        >
          <p>
            <span className="font-semibold">{notice.name}</span> was created as{" "}
            <span className="font-semibold">{notice.id}</span> and is awaiting approval.
          </p>
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => setNotice(null)}
            className="rounded p-1 hover:bg-white/60"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      <RestaurantStats stats={stats} />

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px] xl:items-start">
        <RestaurantDirectory restaurants={restaurants} onStatusChange={changeStatus} />
        <RecentOrders orders={recentOrders} />
      </div>

      <QuickLinks />

      {createOpen && (
        <CreateRestaurantModal
          onClose={() => setCreateOpen(false)}
          onCreate={createRestaurant}
        />
      )}
    </div>
  );
}