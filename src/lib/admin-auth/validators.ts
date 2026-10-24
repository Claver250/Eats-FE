export const isEmail = (s: string) => {
  const v = s.trim();
  return v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
};

// "0801 234 5678", "234 801 234 5678" and "+234 801 234 5678" all become "+2348012345678".
export function normalizePhone(raw: string) {
  const cleaned = raw.replace(/[\s\-()]/g, "");
  if (cleaned.startsWith("+234")) return cleaned;
  if (cleaned.startsWith("234")) return `+${cleaned}`;
  if (cleaned.startsWith("0")) return `+234${cleaned.slice(1)}`;
  return cleaned;
}

export const isNigerianPhone = (raw: string) => /^\+234[1-9]\d{9}$/.test(normalizePhone(raw));

// Passwords that contain any of these are refused, whatever else they contain.
const COMMON = ["password", "qwerty", "12345678", "letmein", "iloveyou", "admin123", "welcome", "weeats"];

export type PasswordCheck = {
  length: boolean; // at least 10 characters
  mix: boolean; // contains a letter and a number
  notCommon: boolean; // isn't built on an easily guessed word or pattern
  notPersonal: boolean; // doesn't contain the person's email name or first name
};

export const MIN_PASSWORD = 10;
export const MAX_PASSWORD = 128;

export function checkPassword(pw: string, who: { email?: string; name?: string } = {}): PasswordCheck {
  const lower = pw.toLowerCase();
  const emailName = (who.email ?? "").split("@")[0].toLowerCase();
  const firstName = (who.name ?? "").trim().split(/\s+/)[0].toLowerCase();
  const personal = [emailName, firstName].filter((x) => x.length >= 4);

  return {
    length: pw.length >= MIN_PASSWORD && pw.length <= MAX_PASSWORD,
    mix: /[A-Za-z]/.test(pw) && /\d/.test(pw),
    notCommon: pw.length > 0 && !COMMON.some((w) => lower.includes(w)),
    notPersonal: pw.length > 0 && !personal.some((w) => lower.includes(w)),
  };
}

export const passwordAccepted = (c: PasswordCheck) => c.length && c.mix && c.notCommon && c.notPersonal;

// 0 (empty) to 4 (strong), for the strength bar.
export function passwordScore(pw: string, who: { email?: string; name?: string } = {}): 0 | 1 | 2 | 3 | 4 {
  if (!pw) return 0;
  const c = checkPassword(pw, who);
  if (!c.notCommon || !c.notPersonal) return 1;
  let score = 1;
  if (c.length) score++;
  if (pw.length >= 14) score++;
  if (/[a-z]/.test(pw) && /[A-Z]/.test(pw) && /\d/.test(pw) && /[^A-Za-z0-9]/.test(pw)) score++;
  if (!c.mix) score = Math.min(score, 2);
  return Math.min(score, 4) as 1 | 2 | 3 | 4;
}