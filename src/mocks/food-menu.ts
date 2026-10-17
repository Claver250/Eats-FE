import type { MenuCategory, MenuItem, RestaurantInfo, FoodStat } from "@/features/food-menu/types";

export const restaurants: RestaurantInfo[] = [
  { name: "Mama Cass", cuisine: "Nigerian Cuisine", area: "Victoria Island, Lagos" },
  { name: "Chicken Republic", cuisine: "Fast Food", area: "Ikeja, Lagos" },
  { name: "Yellow Chilli", cuisine: "Nigerian Cuisine", area: "Lekki Phase 1, Lagos" },
  { name: "The Place", cuisine: "Nigerian Cuisine", area: "Surulere, Lagos" },
  { name: "Bukka Hut", cuisine: "Local Dishes", area: "Yaba, Lagos" },
  { name: "Ocean Basket", cuisine: "Seafood", area: "Lekki, Lagos" },
];

// "vs. last month" figures are fixed demo values. The numbers themselves are calculated.
// Out of Stock keeps the design's red badge: a falling number is shown as bad (goodWhen "up").
export function foodStats(items: MenuItem[]): FoodStat[] {
    const total = items.length;
    const available = items.filter((i) => i.available).length;
    const avgPrice =
        total === 0 ? 0 : Math.round(items.reduce((sum, i) => sum + i.price, 0) / total);

    return [
        { id: "total", label: "Total Menu Items", value: total, kind: "number", change: 12, goodWhen: "up" },
        { id: "available", label: "Available Items", value: available, kind: "number", change: 20, goodWhen: "up" },
        { id: "outOfStock", label: "Out of Stock", value: total - available, kind: "number", change: -33, goodWhen: "up" },
        { id: "avgPrice", label: "Avg. Price", value: avgPrice, kind: "currency", change: 8, goodWhen: "up" },
    ];
}


// Demo data: every restaurant serves the same 28 dishes, with prices scaled per restaurant.
const priceFactor: Record<string, number> = {
  "Mama Cass": 1,
  "Chicken Republic": 0.8,
  "Yellow Chilli": 1.1,
  "The Place": 0.95,
  "Bukka Hut": 0.7,
  "Ocean Basket": 1.3,
};

type Base = {
  name: string;
  description: string;
  category: MenuCategory;
  price: number;
  available: boolean;
};

// Listed newest first. At factor 1 this gives 28 items, 24 available, 4 out of stock, average ₦2,350.
const baseMenu: Base[] = [
  { name: "Jollof Rice with Chicken", description: "Classic Nigerian jollof rice served with grilled chicken.", category: "Main Dishes", price: 4000, available: true },
  { name: "Plantain with Stew", description: "Fried plantain served with spicy tomato stew.", category: "Main Dishes", price: 2500, available: true },
  { name: "Egusi Soup", description: "Traditional egusi soup with assorted meat.", category: "Soups", price: 3000, available: true },
  { name: "Fried Rice", description: "Vegetable fried rice with your choice of protein.", category: "Main Dishes", price: 3500, available: false },
  { name: "Grilled Fish", description: "Freshly grilled fish with pepper sauce.", category: "Main Dishes", price: 5000, available: true },
  { name: "Puff Puff (Pack of 5)", description: "Soft and fluffy Nigerian puff puff.", category: "Sides", price: 1000, available: true },
  { name: "Zobo Drink", description: "Refreshing hibiscus drink.", category: "Drinks", price: 800, available: true },
  { name: "Ofada Rice & Ayamase", description: "Local ofada rice with spicy green pepper sauce.", category: "Main Dishes", price: 4500, available: true },
  { name: "Amala with Ewedu & Gbegiri", description: "Smooth amala served with ewedu and gbegiri soup.", category: "Main Dishes", price: 3200, available: true },
  { name: "Beans & Plantain", description: "Honey beans served with fried plantain.", category: "Main Dishes", price: 2200, available: true },
  { name: "Suya Platter", description: "Spicy grilled beef suya with onions and tomatoes.", category: "Main Dishes", price: 4800, available: true },
  { name: "Turkey & Chips", description: "Crispy fried turkey served with golden chips.", category: "Main Dishes", price: 3500, available: true },
  { name: "Peppered Chicken Plate", description: "Tender chicken tossed in rich pepper sauce.", category: "Main Dishes", price: 3600, available: true },
  { name: "Okra Soup", description: "Fresh okra soup with assorted meat and fish.", category: "Soups", price: 2800, available: true },
  { name: "Pepper Soup (Catfish)", description: "Spicy catfish pepper soup with local spices.", category: "Soups", price: 3200, available: true },
  { name: "Ogbono Soup", description: "Rich ogbono soup cooked with assorted meat.", category: "Soups", price: 2900, available: true },
  { name: "Efo Riro", description: "Vegetable soup with spinach, peppers and locust beans.", category: "Soups", price: 2600, available: true },
  { name: "Fried Plantain (Dodo)", description: "Sweet ripe plantain fried until golden.", category: "Sides", price: 1200, available: true },
  { name: "Moi Moi", description: "Steamed bean pudding with peppers and fish.", category: "Sides", price: 800, available: false },
  { name: "Coleslaw", description: "Creamy cabbage and carrot slaw.", category: "Sides", price: 600, available: true },
  { name: "Chin Chin", description: "Crunchy fried snack, lightly sweetened.", category: "Sides", price: 700, available: true },
  { name: "Akara", description: "Deep-fried bean cakes, crisp outside and soft inside.", category: "Sides", price: 900, available: true },
  { name: "Chapman", description: "Fruity non-alcoholic cocktail with a citrus finish.", category: "Drinks", price: 1500, available: true },
  { name: "Fresh Orange Juice", description: "Freshly squeezed orange juice, no added sugar.", category: "Drinks", price: 1200, available: false },
  { name: "Kunu", description: "Traditional chilled millet drink with ginger.", category: "Drinks", price: 700, available: true },
  { name: "Ice Cream Cup", description: "Creamy vanilla ice cream with chocolate drizzle.", category: "Desserts", price: 1500, available: true },
  { name: "Cake Slice", description: "Soft sponge cake with buttercream icing.", category: "Desserts", price: 1800, available: true },
  { name: "Fruit Salad", description: "Seasonal fruits with a light honey dressing.", category: "Desserts", price: 1800, available: false },
];

export function getMenu(restaurant: string): MenuItem[] {
  const factor = priceFactor[restaurant] ?? 1;
  const newest = Date.UTC(2025, 3, 30, 12, 0, 0);

  return baseMenu.map((b, i) => ({
    id: `${restaurant.toLowerCase().replace(/\s+/g, "-")}-${String(i + 1).padStart(2, "0")}`,
    name: b.name,
    description: b.description,
    category: b.category,
    price: Math.round((b.price * factor) / 50) * 50,
    available: b.available,
    // deterministic: each item is one hour older than the one before it
    createdAt: new Date(newest - i * 3_600_000).toISOString().slice(0, 19),
  }));
}
