import KpiSummary from "@/features/dashboard/components/KpiSummary";
import OrderActivities from "@/features/dashboard/components/OrderActivities";
import OrderAnalytics from "@/features/dashboard/components/OrderAnalytics";
import OrderPerformance from "@/features/dashboard/components/OrderPerformance";
import RevenueProfile from "@/features/dashboard/components/RevenueProfile";
import { kpis, orderPerformance, revenueProfile } from "@/mocks/dashboard";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold text-brand-700">Dashboard</h1>
        <p className="mt-1 text-sm text-muted">
          Overview of orders, revenue and restaurant performance.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <KpiSummary kpis={kpis} />
        </div>
        <OrderPerformance metrics={orderPerformance} />

        <div className="xl:col-span-2">
          <OrderAnalytics />
        </div>
        <RevenueProfile data={revenueProfile} />

        <div className="xl:col-span-3">
          <OrderActivities />
        </div>
      </div>
    </div>
  );
}