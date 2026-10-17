export type RestaurantInfo = {
    name: string; // also used to find the badge: /public/restaurants/<slug>.svg
    cuisine: string;
    area: string;
};

export const menuCategories = [
    "Main Dishes",
    "Soups",
    "Sides",
    "Drinks",
    "Desserts",
] as const;

export type MenuCategory = (typeof menuCategories)[number];

export type MenuItem = {
    id: string;
    name: string;
    description: string;
    category: MenuCategory;
    price: number; // Naira
    available: boolean;
    createdAt: string; // ISO without timezone, used for "Newest" sorting
    image?: string; // e.g. "/food/jollof-rice.jpg". Leave out to show an icon tile.
    instructions?: string; // optional notes from the form, e.g. allergy info
};

export type FoodStat = {
    id: "total" | "available" | "outOfStock" | "avgPrice";
    label: string;
    value: number;
    kind: "number" | "currency";
    change: number;
    goodWhen: "up" | "down";
};
