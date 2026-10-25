import { safeNext } from "./redirect";
import type { Role } from "./types";

export const ROLE_LABEL: Record<Role, string> = {
  super_admin: "Super Admin",
  finance_admin: "Finance Admin",
  restaurant_owner: "Restaurant Owner",
};

// THE ONE PLACE that decides who may open what. Each list holds route prefixes:
// "/payments" also covers "/payments/anything", but not "/payments-old".
// This only controls what the browser shows. The backend must enforce the same rules on every request,
// because anyone can call the API directly without using these pages.
const ACCESS: Record<Role, "all" | readonly string[]> = {
  super_admin: "all",
  finance_admin: ["/payments"],
  restaurant_owner: ["/restaurants"],
};

// Where each role lands after signing in, and where they are sent if they open a page they can't use.
const HOME: Record<Role, string> = {
  super_admin: "/dashboard",
  finance_admin: "/payments",
  restaurant_owner: "/restaurants",
};

export function canAccess(role: Role, pathname: string): boolean {
  const rule = ACCESS[role];
  if (!rule) return false; // an unknown role gets nothing
  if (rule === "all") return true;
  const path = pathname.split("?")[0].split("#")[0];
  return rule.some((prefix) => path === prefix || path.startsWith(`${prefix}/`));
}

export const homeFor = (role: Role): string => HOME[role];

// Where to send someone right after sign-in: the page they asked for if they may use it, otherwise their home.
export function landingFor(role: Role, rawNext: string | null): string {
  const next = safeNext(rawNext);
  return next && canAccess(role, next) ? next : homeFor(role);
}