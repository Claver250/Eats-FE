import { Clock, Landmark, Utensils, Wallet } from "lucide-react";
import StatGrid, { type StatItem } from "@/components/ui/StatGrid";
import { formatCurrency } from "@/lib/formatters";
import { paymentBase } from "@/mocks/payments";
import type { PaymentTotals } from "../types";

const naira = (n: number) => formatCurrency(n, 0, "NGN");

export default function PaymentStats({ totals }: { totals: PaymentTotals }) {
  const items: StatItem[] = [
    {
      id: "earnings",
      label: "Total Partner Earnings",
      info: "Everything restaurants earned in this period: money already paid out plus money still owed to them.",
      value: naira(totals.earnings),
      icon: Utensils,
      change: paymentBase.change.earnings,
    },
    {
      id: "paidOut",
      label: "Total Paid Out",
      value: naira(totals.paidOut),
      icon: Wallet,
      change: paymentBase.change.paidOut,
    },
    {
      id: "pending",
      label: "Pending Payouts",
      value: naira(totals.pending),
      icon: Clock,
      change: paymentBase.change.pending,
    },
    {
      id: "available",
      label: "Available Balance",
      value: naira(totals.available),
      icon: Landmark,
      note: "In your WeEats account",
    },
  ];

  return <StatGrid stats={items} columns={4} />;
}