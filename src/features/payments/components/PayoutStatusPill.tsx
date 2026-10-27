import { cn } from "@/lib/utils";
import type { PayoutStatus } from "../types";

const tones: Record<PayoutStatus, string> = {
  Pending: "bg-amber-50 text-amber-600",
  Ready: "bg-sky-50 text-sky-600",
  Paid: "bg-brand-50 text-success",
};

export default function PayoutStatusPill({ status }: { status: PayoutStatus }) {
  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium",
        tones[status],
      )}
    >
      {status}
    </span>
  );
}