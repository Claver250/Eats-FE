// After signing in, go to the page the person was trying to reach (?next=/orders).
// Only paths on this site are allowed. "//evil.com" and "https://evil.com" would otherwise
// let a crafted link send people to another site right after they typed their password.
// Returns null when there is no usable path.
export function safeNext(raw: string | null): string | null {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//") || raw.includes("\\")) return null;
  return raw;
}