import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function pageList(current: number, count: number): (number | "…")[] {
    if (count <= 7) return Array.from({ length: count }, (_, i) => i + 1);
    const pages: (number | "…")[] = [1];
    const from = Math.max(2, current - 1);
    const to = Math.min(count - 1, current + 1);
    if (from > 2) pages.push("…");
    for (let p = from; p <= to; p++) pages.push(p);
    if (to < count - 1) pages.push("…");
    pages.push(count);
    return pages;
}

type Props = {
    page: number;
    pageCount: number;
    onChange: (page: number) => void;
};

export default function Pagination({ page, pageCount, onChange }: Props) {
    return (
        <div className="flex items-center gap-1">
        <button
            type="button"
            aria-label="Previous page"
            onClick={() => onChange(Math.max(1, page - 1))}
            disabled={page === 1}
            className="rounded-md p-2 hover:bg-gray-100 disabled:opacity-40"
        >
            <ChevronLeft className="h-4 w-4" />
        </button>
        {pageList(page, pageCount).map((p, i) =>
            p === "…" ? (
            <span key={`gap-${i}`} className="px-2">
                …
            </span>
            ) : (
            <button
                type="button"
                key={p}
                onClick={() => onChange(p)}
                className={cn(
                "h-8 min-w-8 rounded-md px-2 text-sm",
                p === page ? "bg-brand-600 font-medium text-white" : "hover:bg-gray-100",
                )}
            >
                {p}
            </button>
            ),
        )}
        <button
            type="button"
            aria-label="Next page"
            onClick={() => onChange(Math.min(pageCount, page + 1))}
            disabled={page === pageCount}
            className="rounded-md p-2 hover:bg-gray-100 disabled:opacity-40"
        >
            <ChevronRight className="h-4 w-4" />
        </button>
        </div>
    );
}
