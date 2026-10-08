import KpiSummary from "@/features/dashboard/components/KpiSummary";
import { kpis } from "@/mocks/dashboard";

export default function DashboardPage() {
    return (
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
            <KpiSummary kpis={kpis} />
        </div>
        {/* Order Performance goes here */}
        </div>
    );
}