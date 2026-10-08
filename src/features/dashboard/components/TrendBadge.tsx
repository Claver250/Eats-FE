import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TrendBadge({ change }: { change: number }) {
    const up = change >= 0;
    const Icon = up ? ArrowUp : ArrowDown;

    return (
        <span className="inline-flex items-center gap-1.5">
        <span
            className={cn(
            "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium",
            up ? "bg-brand-50 text-success" : "bg-red-50 text-danger",
            )}
        >
            <Icon className="h-3 w-3" />
            {Math.abs(change)}%
        </span>
        <span className="text-xs text-muted">/Month</span>
        </span>
    );
}