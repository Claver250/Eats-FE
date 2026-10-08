import KpiSummary from "@/features/dashboard/components/KpiSummary";
import OrderPerformance from "@/features/dashboard/components/OrderPerformance";
import { kpis, orderPerformance } from "@/mocks/dashboard";

export default function DashboardPage() {
    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
            <KpiSummary kpis={kpis} />
        </div>
        <OrderPerformance metrics={orderPerformance} />
        {/* Order Analytics + Revenue Profile go here */}
        </div>
    );
}