import KpiSummary from "@/features/dashboard/components/KpiSummary";
import OrderAnalytics from "@/features/dashboard/components/OrderAnalytics";
import OrderPerformance from "@/features/dashboard/components/OrderPerformance";
import RevenueProfile from "@/features/dashboard/components/RevenueProfile";
import OrderActivities from "@/features/dashboard/components/OrderActivities";
import { kpis, orderPerformance, revenueProfile } from "@/mocks/dashboard";

export default function DashboardPage() {
    return (
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
    );
}