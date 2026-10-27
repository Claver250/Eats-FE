"use client";

import Link from "next/link";
import { ChevronRight, FileClock, Send, ShieldCheck, Store } from "lucide-react";
import Modal from "@/components/ui/Modal";
import RestaurantAvatar from "@/features/orders/components/RestaurantAvatar";
import { useSession } from "@/features/admin-auth/session";
import { canAccess } from "@/lib/admin-auth/access";
import { formatDate } from "@/lib/dateRange";
import { formatCurrency, formatNumber } from "@/lib/formatters";
import { balanceToPay, type PayoutRow, type RecentPayoutOrder } from "../types";
import PayoutStatusPill from "./PayoutStatusPill";

const naira = (n: number) => formatCurrency(n, 0, "NGN");

type Props = {
  row: PayoutRow;
  days: number; // length of the chosen period
  orders: RecentPayoutOrder[];
  onClose: () => void;
};

export default function PayoutDetailModal({ row, days, orders, onClose }: Props) {
  const session = useSession();
  // "View All" opens the Orders page, so it only appears for people who are allowed to open it.
  const canSeeOrders = canAccess(session.role, "/orders");
  const balance = balanceToPay(row);

  return (
    <Modal
      size="sm"
      title={row.name}
      description={`${row.location} · ${row.cuisine}`}
      icon={<RestaurantAvatar name={row.name} />}
      onClose={onClose}
    >
      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-6 py-5">
        <div className="flex items-center justify-between">
          <PayoutStatusPill status={row.status} />
          <span className="text-xs text-muted">ID: {row.id.replace(/^WE-/, "")}</span>
        </div>

        <section aria-label="Payment summary">
          <h3 className="text-sm font-semibold">Payment Summary</h3>

          <dl className="mt-3 grid grid-cols-3 divide-x divide-border rounded-xl border border-border text-center">
            <div className="px-2 py-3">
              <dt className="text-xs text-muted">
                Total Orders ({days} {days === 1 ? "day" : "days"})
              </dt>
              <dd className="mt-1 text-sm font-bold">{formatNumber(row.orders)}</dd>
            </div>
            <div className="px-2 py-3">
              <dt className="text-xs text-muted">Total Amount</dt>
              <dd className="mt-1 text-sm font-bold">{naira(row.totalAmount)}</dd>
            </div>
            <div className="px-2 py-3">
              <dt className="text-xs text-muted">Total Payout</dt>
              <dd className="mt-1 text-sm font-bold">{naira(row.totalPayout)}</dd>
            </div>
          </dl>

          <div className="mt-3 rounded-xl bg-brand-50 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-brand-700">Balance to Pay</p>
                <p className="mt-0.5 text-xl font-bold">{naira(balance)}</p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  disabled
                  title="Not available yet"
                  className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg border border-brand-600 px-3 py-2 text-sm font-semibold text-brand-700 opacity-60"
                >
                  <ShieldCheck className="h-4 w-4" aria-hidden="true" />
                  Deductions
                </button>
                <button
                  type="button"
                  disabled
                  title="Not available yet"
                  className="inline-flex cursor-not-allowed items-center gap-1.5 rounded-lg bg-brand-600 px-3 py-2 text-sm font-semibold text-white opacity-60"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  Pay Now
                </button>
              </div>
            </div>
            <p className="mt-3 text-xs text-muted">Deductions and Pay Now aren’t available yet.</p>
          </div>
        </section>

        <section aria-label="Recent orders">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold">Recent Orders</h3>
            {canSeeOrders && (
              <Link href="/orders" className="text-sm font-medium text-brand-600 hover:underline">
                View All
              </Link>
            )}
          </div>

          {orders.length === 0 ? (
            <p className="mt-3 rounded-lg bg-page px-3 py-6 text-center text-sm text-muted">
              No orders in this period.
            </p>
          ) : (
            <div className="mt-3 overflow-x-auto">
              <table className="w-full min-w-[360px] text-left text-sm">
                <thead>
                  <tr className="bg-page text-xs text-muted">
                    <th className="rounded-l-lg px-3 py-2.5 font-medium">Date</th>
                    <th className="px-3 py-2.5 font-medium">Order ID</th>
                    <th className="px-3 py-2.5 font-medium">Amount</th>
                    <th className="rounded-r-lg px-3 py-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} className="border-b border-border last:border-0">
                      <td className="whitespace-nowrap px-3 py-3 text-muted">{formatDate(o.date)}</td>
                      <td className="px-3 py-3">{o.id}</td>
                      <td className="px-3 py-3">{naira(o.amount)}</td>
                      <td className="px-3 py-3">
                        <PayoutStatusPill status={o.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <section aria-label="More about this restaurant" className="divide-y divide-border rounded-xl border border-border">
          {[
            { label: "Payment History", icon: <FileClock className="h-4 w-4" aria-hidden="true" /> },
            { label: "Restaurant Details", icon: <Store className="h-4 w-4" aria-hidden="true" /> },
          ].map((item) => (
            <button
              key={item.label}
              type="button"
              disabled
              title="Not available yet"
              className="flex w-full cursor-not-allowed items-center gap-3 px-4 py-3 text-left text-sm font-medium opacity-60"
            >
              <span className="text-brand-600">{item.icon}</span>
              {item.label}
              <span className="ml-auto text-xs font-normal text-muted">Coming soon</span>
              <ChevronRight className="h-4 w-4 text-muted" aria-hidden="true" />
            </button>
          ))}
        </section>
      </div>
    </Modal>
  );
}