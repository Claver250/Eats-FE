"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MAX_DAYS,
  daysBetween,
  formatMonthYear,
  formatRange,
  getPresets,
  monthGrid,
  parseISODate,
  todayISO,
  type DateRange,
} from "@/lib/dateRange";

type Props = {
  value: DateRange;
  onChange: (range: DateRange) => void;
};

type Pending = { from: string | null; to: string | null };

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export default function DateRangePicker({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState<Pending>({ from: value.from, to: value.to });
  const [view, setView] = useState(() => monthOf(value.from));
  const [hover, setHover] = useState<string | null>(null);
  const [error, setError] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  // Presets depend on today's date, so they are only built once the popover is open (client only).
  const presets = useMemo(() => (open ? getPresets(todayISO()) : []), [open]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function openPicker() {
    setPending({ from: value.from, to: value.to });
    setView(monthOf(value.from));
    setHover(null);
    setError("");
    setOpen(true);
  }

  function pickDay(day: string) {
    setError("");
    if (!pending.from || pending.to) {
      setPending({ from: day, to: null });
      return;
    }
    const [a, b] = day < pending.from ? [day, pending.from] : [pending.from, day];
    if (daysBetween(a, b) + 1 > MAX_DAYS) {
      setError("Pick a range of up to one year.");
      return;
    }
    setPending({ from: a, to: b });
  }

  function applyPreset(range: DateRange) {
    setError("");
    setPending(range);
    setView(monthOf(range.from));
  }

  function apply() {
    if (!pending.from) return;
    onChange({ from: pending.from, to: pending.to ?? pending.from });
    setOpen(false);
  }

  function shiftMonth(delta: number) {
    setView((v) => {
      const d = new Date(Date.UTC(v.year, v.month + delta, 1));
      return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
    });
  }

  // While only a start day is chosen, the hovered day previews the range.
  const end = pending.to ?? (pending.from && hover ? hover : null);
  const lo = pending.from && end ? (pending.from < end ? pending.from : end) : pending.from;
  const hi = pending.from && end ? (pending.from < end ? end : pending.from) : pending.from;

  const cells = monthGrid(view.year, view.month);
  const pendingLabel = pending.from
    ? formatRange({ from: pending.from, to: pending.to ?? pending.from })
    : "Select a start date";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => (open ? setOpen(false) : openPicker())}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm shadow-card hover:bg-gray-50"
      >
        <CalendarDays className="h-4 w-4 text-brand-600" />
        <span className="whitespace-nowrap">{formatRange(value)}</span>
        <ChevronDown className="h-4 w-4 text-muted" />
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Choose a date range"
          className="absolute right-0 top-full z-30 mt-2 w-[min(92vw,560px)] rounded-xl border border-border bg-surface p-4 shadow-lg"
        >
          <div className="flex flex-col gap-4 sm:flex-row">
            <div className="flex flex-wrap gap-2 sm:w-36 sm:flex-col sm:gap-1">
              {presets.map((p) => {
                const active = pending.from === p.range.from && pending.to === p.range.to;
                return (
                  <button
                    type="button"
                    key={p.label}
                    onClick={() => applyPreset(p.range)}
                    className={cn(
                      "rounded-md px-3 py-1.5 text-left text-sm transition-colors",
                      active
                        ? "bg-brand-50 font-medium text-brand-700"
                        : "text-muted hover:bg-gray-100",
                    )}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            <div className="flex-1">
              <div className="mb-2 flex items-center justify-between">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => shiftMonth(-1)}
                  className="rounded-md p-1.5 hover:bg-gray-100"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <p className="text-sm font-semibold">
                  {formatMonthYear(view.year, view.month)}
                </p>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => shiftMonth(1)}
                  className="rounded-md p-1.5 hover:bg-gray-100"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div className="grid grid-cols-7 text-center text-[11px] text-muted">
                {WEEKDAYS.map((w) => (
                  <span key={w} className="py-1">
                    {w}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7" onMouseLeave={() => setHover(null)}>
                {cells.map((day, i) => {
                  if (!day) return <span key={`blank-${i}`} className="h-9" />;
                  const inRange = !!lo && !!hi && day >= lo && day <= hi;
                  const isEdge = day === lo || day === hi;
                  return (
                    <button
                      type="button"
                      key={day}
                      aria-label={formatRange({ from: day, to: day })}
                      aria-pressed={isEdge}
                      onClick={() => pickDay(day)}
                      onMouseEnter={() => setHover(day)}
                      className={cn(
                        "h-9 text-sm transition-colors",
                        isEdge
                          ? "rounded-md bg-brand-600 font-medium text-white"
                          : inRange
                            ? "bg-brand-50 text-brand-700"
                            : "rounded-md hover:bg-gray-100",
                      )}
                    >
                      {parseISODate(day).getUTCDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {error && <p className="mt-3 text-xs text-danger">{error}</p>}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
            <p className="text-xs text-muted">{pendingLabel}</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={apply}
                disabled={!pending.from}
                className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700 disabled:opacity-50"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function monthOf(iso: string) {
  const d = parseISODate(iso);
  return { year: d.getUTCFullYear(), month: d.getUTCMonth() };
}