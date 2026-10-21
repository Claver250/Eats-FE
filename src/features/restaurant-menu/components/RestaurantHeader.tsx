import { Plus } from "lucide-react";
import StorefrontArt from "./StoreFrontArt";

type Props = {
  onCreate?: () => void; // opens the Create Restaurant form (next step)
};

export default function RestaurantsHeader({ onCreate }: Props) {
    return (
        <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
            <h1 className="text-3xl font-bold text-brand-700">Restaurant Management</h1>
            <p className="mt-1 text-sm text-muted">Manage partners, performance and payouts</p>
        </div>

        <div className="flex items-center gap-6">
            <div className="hidden lg:block">
            <StorefrontArt />
            </div>
            <button
            type="button"
            onClick={onCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3.5 text-sm font-semibold text-white shadow-card transition-colors hover:bg-brand-700"
            >
            <Plus className="h-4 w-4" />
            Create New Restaurant
            </button>
        </div>
        </div>
    );
}