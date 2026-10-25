import {
  AuthError,
  parseSession,
  type AuthApi,
  type Role,
  type Session,
  type SignupInput,
} from "./types";

// DEMO ONLY. This stands in for the backend until the real API exists. Accounts live in the page's
// memory (they disappear on refresh), passwords are compared in plain text, and the "session" is a
// small note in this tab's sessionStorage. The real backend uses an HttpOnly cookie instead.
// It must never hold real people's details.
export const DEMO_ACCOUNTS: { role: Role; label: string; email: string; password: string }[] = [
  { role: "super_admin", label: "Super admin", email: "admin@weeats.test", password: "Admin-Demo-2025" },
  { role: "finance_admin", label: "Finance admin", email: "finance@weeats.test", password: "Finance-Demo-2025" },
  { role: "restaurant_owner", label: "Restaurant owner", email: "owner@weeats.test", password: "Owner-Demo-2025" },
];
export const DEMO_EMAIL = DEMO_ACCOUNTS[0].email;
export const DEMO_PASSWORD = DEMO_ACCOUNTS[0].password;

type MockUser = {
  id: string;
  name: string;
  phone: string;
  email: string;
  password: string;
  role: Role | null; // null until an administrator approves the account and gives it a role
  restaurantId?: string;
};

const users: MockUser[] = [
  { id: "u-super", name: "Demo Admin", phone: "+2348012345678", email: DEMO_ACCOUNTS[0].email, password: DEMO_ACCOUNTS[0].password, role: "super_admin" },
  { id: "u-finance", name: "Femi Finance", phone: "+2348023456789", email: DEMO_ACCOUNTS[1].email, password: DEMO_ACCOUNTS[1].password, role: "finance_admin" },
  { id: "u-owner", name: "Mama Cass Owner", phone: "+2348034567890", email: DEMO_ACCOUNTS[2].email, password: DEMO_ACCOUNTS[2].password, role: "restaurant_owner", restaurantId: "WE-REST-001" },
];

const STORAGE_KEY = "weeats-demo-session";

function readStored(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    return raw ? parseSession(JSON.parse(raw)) : null;
  } catch {
    return null;
  }
}

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
    if (!user.role) throw new AuthError("pending_approval");

    const session: Session = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      ...(user.restaurantId ? { restaurantId: user.restaurantId } : {}),
    };
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return session;
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
      role: null,
    });
  },

  async logout() {
    await wait();
    window.sessionStorage.removeItem(STORAGE_KEY);
  },

  async me() {
    return readStored();
  },
};

// Lets a demo approve the account it just requested, and choose its role. Not part of AuthApi:
// in the real system an existing super admin does this, in the backend.
export function approveMockUser(email: string, role: Role, restaurantId?: string) {
  const u = users.find((x) => x.email === norm(email));
  if (u) {
    u.role = role;
    u.restaurantId = restaurantId;
  }
}