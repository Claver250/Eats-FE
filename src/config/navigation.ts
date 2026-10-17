import {
  LayoutDashboard,
  ShoppingBag,
  Soup,
  ClipboardList,
  Bike,
  Store,
  CreditCard,
  MessageCircle,
  Megaphone,
  Headset,
  Settings,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
};

export const mainNav: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/orders", icon: ShoppingBag },
  { label: "Food Menu", href: "/food-menu", icon: Soup },
  { label: "Restaurant Menu", href: "/restaurant-menu", icon: ClipboardList },
  { label: "Riders", href: "/riders", icon: Bike },
  { label: "Restaurant", href: "/restaurants", icon: Store },
  { label: "Payment", href: "/payments", icon: CreditCard },
  { label: "Message", href: "/messages", icon: MessageCircle, badge: 3 },
];

export const otherNav: NavItem[] = [
  { label: "Marketing", href: "/marketing", icon: Megaphone },
  { label: "Support", href: "/support", icon: Headset },
  { label: "Settings", href: "/settings", icon: Settings },
];