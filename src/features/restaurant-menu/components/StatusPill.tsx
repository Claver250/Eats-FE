import { cn } from "@/lib/utils";

type Tone = "good" | "warn" | "bad";

const tones: Record<Tone, string> = {
  good: "bg-brand-50 text-success",
  warn: "bg-amber-50 text-amber-600",
  bad: "bg-red-50 text-danger",
};

const toneFor: Record<string, Tone> = {
  Active: "good",
  Paid: "good",
  Pending: "warn",
  Suspended: "bad",
};

export default function StatusPill({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-block whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium",
        tones[toneFor[status] ?? "warn"],
      )}
    >
      {status}
    </span>
  );
}