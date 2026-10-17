import {
    CupSoda,
    IceCream,
    Salad,
    Soup,
    Utensils,
    type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { MenuCategory, MenuItem } from "../types";

const tiles: Record<MenuCategory, { icon: LucideIcon; tone: string }> = {
    "Main Dishes": { icon: Utensils, tone: "bg-orange-100 text-orange-600" },
    Soups: { icon: Soup, tone: "bg-amber-100 text-amber-700" },
    Sides: { icon: Salad, tone: "bg-emerald-100 text-emerald-700" },
    Drinks: { icon: CupSoda, tone: "bg-rose-100 text-rose-600" },
    Desserts: { icon: IceCream, tone: "bg-pink-100 text-pink-600" },
};

// Shows the photo when the item has `image`, otherwise a colored icon tile for its category.
export default function FoodThumb({ item }: { item: MenuItem }) {
    if (item.image) {
        return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
            src={item.image}
            alt={item.name}
            className="h-14 w-14 shrink-0 rounded-xl object-cover"
        />
        );
    }

    const { icon: Icon, tone } = tiles[item.category];
    return (
        <span
        aria-hidden
        className={cn(
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl",
            tone,
        )}
        >
        <Icon className="h-6 w-6" />
        </span>
    );
}
