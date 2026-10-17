import OrderStatus from "@/features/orders/components/OrderStatus";
import OrdersOverview from "@/features/orders/components/OrdersOverview";
import OrdersTable from "@/features/orders/components/OrderTable";
import StatCards from "@/features/orders/components/StatsCards";
import { orderRows, orderStats, orderStatus, ordersOverview } from "@/mocks/orders";

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

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <OrdersOverview data={ordersOverview} />
        </div>
        <OrderStatus segments={orderStatus} />
      </div>

      <OrdersTable rows={orderRows} />
    </div>
  );
}