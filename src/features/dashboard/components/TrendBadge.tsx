import { ArrowDown, ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
    change: number;
    goodWhen?: "up" | "down";
    label?: string;
};

export default function TrendBadge({
    change,
    goodWhen = "up",
    label = "/Month",
}: Props) {
    const up = change >= 0;
    const good = up === (goodWhen === "up");
    const Icon = up ? ArrowUp : ArrowDown;

    return (
        <span className="inline-flex flex-wrap items-center gap-x-1.5 gap-y-1">
        <span
            className={cn(
            "inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium",
            good ? "bg-brand-50 text-success" : "bg-red-50 text-danger",
            )}
        >
            <Icon className="h-3 w-3" />
            {Math.abs(change)}%
        </span>
        <span className="whitespace-nowrap text-xs text-muted">{label}</span>
        </span>
    );
}