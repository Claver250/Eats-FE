import StatCards from "@/features/orders/components/StatsCards";
import { orderStats } from "@/mocks/orders";

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-700">Orders</h1>
        <p className="mt-1 text-sm text-muted">
          Track, manage and monitor all food delivery orders in real time.
        </p>
      </div>

      <StatCards stats={orderStats} />
    </div>
  );
}