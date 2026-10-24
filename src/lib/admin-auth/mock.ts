import { AuthError, type AdminSession, type AuthApi, type SignupInput } from "./types";

// DEMO ONLY. This stands in for the backend until the real API exists. It keeps accounts in the
// page's memory (they disappear on refresh), compares passwords in plain text and issues no real session.
// It must never hold real people's details.
export const DEMO_EMAIL = "admin@weeats.test";
export const DEMO_PASSWORD = "Admin-Demo-2025";

type MockUser = {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  status: "approved" | "pending";
};

const users: MockUser[] = [
  { id: "u-demo", name: "Demo Admin", phone: "+2348012345678", email: DEMO_EMAIL, password: DEMO_PASSWORD, status: "approved" },
];

let current: AdminSession | null = null;
let latency = 400;
export function setMockLatency(ms: number) {
  latency = ms;
}
const wait = () => new Promise((r) => setTimeout(r, latency));

const MAX_FAILURES = 5;
const LOCK_MS = 60_000;
const failures = new Map<string, { count: number; lockedUntil: number }>();
const norm = (email: string) => email.trim().toLowerCase();

export const mockAuth: AuthApi = {
  async login(email, password) {
    await wait();
    const key = norm(email);
    const record = failures.get(key) ?? { count: 0, lockedUntil: 0 };
    if (record.lockedUntil > Date.now()) throw new AuthError("rate_limited");

    const user = users.find((u) => u.email === key);
    if (!user || user.password !== password) {
      // Unknown emails are counted too, so an attacker learns nothing from the lockout.
      record.count += 1;
      if (record.count >= MAX_FAILURES) {
        record.count = 0;
        record.lockedUntil = Date.now() + LOCK_MS;
      }
      failures.set(key, record);
      throw new AuthError("invalid_credentials");
    }

    failures.delete(key);
    // Approval is only revealed after the password was right, so it can't be used to discover accounts.
    if (user.status === "pending") throw new AuthError("pending_approval");

    current = { id: user.id, name: user.name, email: user.email, role: "admin" };
    return current;
  },

  async signup(input: SignupInput) {
    await wait();
    const email = norm(input.email);
    // An existing email is ignored silently, so the response is the same either way
    // and the form can't be used to find out who already has an account.
    if (users.some((u) => u.email === email)) return;
    users.push({
      id: `u-${users.length + 1}`,
      name: input.name,
      phone: input.phone,
      email,
      password: input.password,
      status: "pending",
    });
  },

  async logout() {
    await wait();
    current = null;
  },

  async me() {
    return current;
  },
};

// Lets a demo approve the account it just requested. Not part of AuthApi: the real approval
// happens in the backend, by an existing admin.
export function approveMockUser(email: string) {
  const u = users.find((x) => x.email === norm(email));
  if (u) u.status = "approved";
}