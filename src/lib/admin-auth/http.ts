import { AuthError, type AdminSession, type AuthApi, type SignupInput } from "./types";

// The real client. It follows the contract proposed to the backend (POST /auth/login, /auth/signup,
// /auth/logout and GET /auth/me) and expects the server to set an HttpOnly session cookie.
// Adjust the paths and the response shape here once the backend confirms them.
const BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

async function call(path: string, method: "GET" | "POST", body?: unknown): Promise<Response> {
  try {
    return await fetch(`${BASE}${path}`, {
      method,
      credentials: "include", // sends and receives the session cookie
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new AuthError("network");
  }
}

async function codeOf(res: Response): Promise<string | undefined> {
  try {
    const data = await res.json();
    return typeof data?.code === "string" ? data.code : undefined;
  } catch {
    return undefined;
  }
}

function asSession(data: unknown): AdminSession {
  const d = data as Partial<AdminSession> | null;
  if (!d || typeof d.id !== "string" || typeof d.name !== "string" || typeof d.email !== "string" || d.role !== "admin") {
    throw new AuthError("unknown");
  }
  return { id: d.id, name: d.name, email: d.email, role: "admin" };
}

export const httpAuth: AuthApi = {
  async login(email, password) {
    const res = await call("/auth/login", "POST", { email, password });
    if (res.ok) return asSession(await res.json());
    if (res.status === 429 || res.status === 423) throw new AuthError("rate_limited");
    if (res.status === 403 && (await codeOf(res)) === "pending_approval") throw new AuthError("pending_approval");
    if (res.status === 400 || res.status === 401) throw new AuthError("invalid_credentials");
    throw new AuthError("unknown");
  },

  async signup(input: SignupInput) {
    // The server should answer 2xx whether or not the email already exists.
    const res = await call("/auth/signup", "POST", input);
    if (res.ok) return;
    if (res.status === 429) throw new AuthError("rate_limited");
    throw new AuthError("unknown");
  },

  async logout() {
    const res = await call("/auth/logout", "POST");
    if (!res.ok) throw new AuthError("unknown");
  },

  async me() {
    const res = await call("/auth/me", "GET");
    if (res.status === 401) return null;
    if (!res.ok) throw new AuthError("unknown");
    return asSession(await res.json());
  },
};