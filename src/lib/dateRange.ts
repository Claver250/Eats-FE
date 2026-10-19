// Dates are plain "YYYY-MM-DD" strings and every calculation is done in UTC,
// so the same range gives the same result in any timezone, on the server or in the browser.

export type DateRange = { from: string; to: string };

export const MAX_DAYS = 366;
const DAY_MS = 86_400_000;

export const parseISODate = (s: string) => {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
};

export const toISODate = (d: Date) => d.toISOString().slice(0, 10);

export const addDays = (s: string, n: number) =>
  toISODate(new Date(parseISODate(s).getTime() + n * DAY_MS));

export const daysBetween = (a: string, b: string) =>
  Math.round((parseISODate(b).getTime() - parseISODate(a).getTime()) / DAY_MS);

export const countDays = (r: DateRange) => daysBetween(r.from, r.to) + 1;

export const eachDay = (r: DateRange): string[] =>
  Array.from({ length: countDays(r) }, (_, i) => addDays(r.from, i));

// Today in the viewer's own timezone. Only call this from event handlers or effects,
// never while rendering, so server and browser output can't differ.
export function todayISO() {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

const fmt = (s: string, opts: Intl.DateTimeFormatOptions) =>
  parseISODate(s).toLocaleDateString("en-US", { ...opts, timeZone: "UTC" });

export const formatDate = (s: string) =>
  fmt(s, { month: "short", day: "numeric", year: "numeric" });

export const formatRange = (r: DateRange) =>
  r.from === r.to ? formatDate(r.from) : `${formatDate(r.from)} – ${formatDate(r.to)}`;

export const formatMonthYear = (year: number, month: number) =>
  fmt(toISODate(new Date(Date.UTC(year, month, 1))), { month: "long", year: "numeric" });

// Cells for one month, Monday first. null = empty cell before/after the month.
export function monthGrid(year: number, month: number): (string | null)[] {
  const first = new Date(Date.UTC(year, month, 1));
  const lead = (first.getUTCDay() + 6) % 7;
  const days = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const cells: (string | null)[] = Array(lead).fill(null);
  for (let d = 1; d <= days; d++) {
    cells.push(toISODate(new Date(Date.UTC(year, month, d))));
  }
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
}

export type Preset = { label: string; range: DateRange };

export function getPresets(today: string): Preset[] {
  const [y, m] = today.split("-").map(Number);
  const monthFirst = toISODate(new Date(Date.UTC(y, m - 1, 1)));
  const lastMonthFirst = toISODate(new Date(Date.UTC(y, m - 2, 1)));
  const lastMonthLast = addDays(monthFirst, -1);

  return [
    { label: "Last 7 days", range: { from: addDays(today, -6), to: today } },
    { label: "Last 30 days", range: { from: addDays(today, -29), to: today } },
    { label: "Last 90 days", range: { from: addDays(today, -89), to: today } },
    { label: "This month", range: { from: monthFirst, to: today } },
    { label: "Last month", range: { from: lastMonthFirst, to: lastMonthLast } },
    { label: "Year to date", range: { from: `${y}-01-01`, to: today } },
  ];
}