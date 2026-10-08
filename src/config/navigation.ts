import {
    LayoutDashboard,
    ShoppingBag,
    UtensilsCrossed,
    Bike,
    Store,
    FileText,
    MessageCircle,
    Megaphone,
    Headset,
    Settings,
    type LucideIcon,
} from "lucide-react";

export type NavItem = { label: string; href: string; icon: LucideIcon };

export const mainNav: NavItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Orders", href: "/orders", icon: ShoppingBag },
    { label: "Food Menu", href: "/food-menu", icon: UtensilsCrossed },
    { label: "Riders", href: "/riders", icon: Bike },
    { label: "Restaurant", href: "/restaurants", icon: Store },
    { label: "Report", href: "/reports", icon: FileText },
    { label: "Message", href: "/messages", icon: MessageCircle },
];

export const otherNav: NavItem[] = [
    { label: "Marketing", href: "/marketing", icon: Megaphone },
    { label: "Support", href: "/support", icon: Headset },
    { label: "Settings", href: "/settings", icon: Settings },
];