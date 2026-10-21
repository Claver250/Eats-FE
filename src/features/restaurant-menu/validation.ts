export type RestaurantFormValues = {
  name: string;
  address: string;
  city: string;
  email: string;
  phone: string;
  specialty: string;
  bankName: string;
  accountNumber: string;
  accountName: string;
  bvn: string;
  registrationNumber: string;
};

export type FieldKey = keyof RestaurantFormValues;
export type RestaurantFormErrors = Partial<Record<FieldKey, string>>;

export const emptyValues: RestaurantFormValues = {
  name: "",
  address: "",
  city: "",
  email: "",
  phone: "",
  specialty: "",
  bankName: "",
  accountNumber: "",
  accountName: "",
  bvn: "",
  registrationNumber: "",
};

// Top-to-bottom order of the form, so the first error is the one nearest the top.
export const FIELD_ORDER: FieldKey[] = [
  "name",
  "address",
  "city",
  "email",
  "phone",
  "specialty",
  "bankName",
  "accountNumber",
  "accountName",
  "bvn",
  "registrationNumber",
];

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// "0801 234 5678", "234 801 234 5678" and "+234 801 234 5678" all become "+2348012345678".
export function normalizePhone(raw: string) {
  const cleaned = raw.replace(/[\s\-()]/g, "");
  if (cleaned.startsWith("+234")) return cleaned;
  if (cleaned.startsWith("234")) return `+${cleaned}`;
  if (cleaned.startsWith("0")) return `+234${cleaned.slice(1)}`;
  return cleaned;
}

// These rules only save the user a round trip. The backend must check everything again.
export function validateValues(v: RestaurantFormValues): RestaurantFormErrors {
  const e: RestaurantFormErrors = {};

  if (v.name.trim().length < 2) e.name = "Enter the restaurant’s name (at least 2 characters).";
  if (v.address.trim().length < 5) e.address = "Enter the street address.";
  if (!v.city) e.city = "Choose a location.";
  if (!EMAIL.test(v.email.trim())) e.email = "Enter a valid email address.";
  if (!/^\+234[1-9]\d{9}$/.test(normalizePhone(v.phone))) {
    e.phone = "Enter a valid Nigerian phone number, e.g. +234 801 234 5678.";
  }
  if (!v.specialty) e.specialty = "Choose a menu specialty.";

  if (!v.bankName) e.bankName = "Choose a bank.";
  if (!/^\d{10,11}$/.test(v.accountNumber)) e.accountNumber = "Enter a 10 or 11 digit account number.";
  if (v.accountName.trim().length < 2) e.accountName = "Enter the account name exactly as it appears at the bank.";
  if (v.bvn && !/^\d{11}$/.test(v.bvn)) e.bvn = "A BVN has 11 digits. Leave it empty if you don’t have it.";

  const reg = v.registrationNumber.trim();
  if (reg && !/^[A-Za-z0-9 /-]{3,20}$/.test(reg)) {
    e.registrationNumber = "Use 3 to 20 letters, numbers, spaces, / or -.";
  }

  return e;
}

export const MAX_FILES = 5;
export const MAX_FILE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"];
const ALLOWED_EXTENSION = /\.(pdf|jpe?g|png)$/i;

// Adds the files that pass the checks and reports the last problem found.
// The browser’s checks are a convenience only; the server must verify type, size and content.
export function addFiles(existing: File[], incoming: File[]): { files: File[]; error: string } {
  const files = [...existing];
  let error = "";

  for (const f of incoming) {
    const typeOk = ALLOWED_EXTENSION.test(f.name) && (f.type === "" || ALLOWED_TYPES.includes(f.type));
    if (!typeOk) {
      error = `“${f.name}” isn’t a PDF, JPG or PNG file.`;
      continue;
    }
    if (f.size > MAX_FILE_BYTES) {
      error = `“${f.name}” is larger than 5MB.`;
      continue;
    }
    if (files.some((x) => x.name === f.name && x.size === f.size)) continue;
    if (files.length >= MAX_FILES) {
      error = `You can attach up to ${MAX_FILES} files.`;
      break;
    }
    files.push(f);
  }

  return { files, error };
}

export function formatBytes(n: number) {
  return n < 1024 * 1024
    ? `${Math.max(1, Math.round(n / 1024))} KB`
    : `${(n / 1024 / 1024).toFixed(1)} MB`;
}