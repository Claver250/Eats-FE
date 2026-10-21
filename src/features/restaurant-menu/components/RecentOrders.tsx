import Link from "next/link";
import { Eye } from "lucide-react";
import ActionMenu from "@/components/ui/ActionView";
import { formatDate } from "@/lib/dateRange";
import { formatCurrency } from "@/lib/formatters";
import type { RecentOrder } from "../types";
import StatusPill from "./StatusPill";

export default function RecentOrders({ orders }: { orders: RecentOrder[] }) {
  return (
    <section className="rounded-card bg-surface p-5 shadow-card">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-semibold">Recent Orders</h2>
        <Link href="/orders" className="text-sm font-medium text-brand-600 hover:underline">
          View All
        </Link>
      </div>

      <div className="mt-4 overflow-x-auto">
        <table className="w-full min-w-[380px] text-left text-sm">
          <thead>
            <tr className="bg-page text-xs text-muted">
              <th className="rounded-l-lg px-3 py-3 font-medium">Date</th>
              <th className="px-3 py-3 font-medium">Order ID</th>
              <th className="px-3 py-3 font-medium">Amount</th>
              <th className="px-3 py-3 font-medium">Status</th>
              <th className="rounded-r-lg px-3 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0">
                <td className="whitespace-nowrap px-3 py-3.5 text-muted">{formatDate(o.date)}</td>
                <td className="px-3 py-3.5">{o.id}</td>
                <td className="px-3 py-3.5">{formatCurrency(o.amount, 0, "NGN")}</td>
                <td className="px-3 py-3.5">
                  <StatusPill status={o.status} />
                </td>
                <td className="px-3 py-3.5">
                  <ActionMenu
                    label={`order ${o.id}`}
                    items={[{ label: "View in Orders", icon: <Eye className="h-4 w-4" />, href: "/orders" }]}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}