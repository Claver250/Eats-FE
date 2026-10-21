// A spreadsheet runs any cell that starts with = + - or @ as a formula, so a restaurant named
// "=HYPERLINK(...)" could do harm once exported. Those cells get a leading apostrophe to keep them as text.
function cell(value: string | number) {
  let s = String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  if (/[",\n\r]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
}

export function toCsv(rows: (string | number)[][]) {
  return rows.map((r) => r.map(cell).join(",")).join("\r\n");
}

// "\uFEFF" makes Excel read the file as UTF-8, so the ₦ sign and accents display correctly.
export function downloadCsv(filename: string, rows: (string | number)[][]) {
  const blob = new Blob(["\uFEFF" + toCsv(rows)], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}