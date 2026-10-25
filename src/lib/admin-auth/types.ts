export type Role = "super_admin" | "finance_admin" | "restaurant_owner";

export const ROLES: readonly Role[] = ["super_admin", "finance_admin", "restaurant_owner"];

export type Session = {
  id: string;
  name: string;
  email: string;
  role: Role;
  restaurantId?: string; // set for restaurant owners: the one restaurant they belong to
};

// Accepts only a well-formed session with a known role. Anything else is treated as "not signed in".
export function parseSession(data: unknown): Session | null {
  const d = data as Partial<Session> | null;
  if (
    !d ||
    typeof d.id !== "string" ||
    typeof d.name !== "string" ||
    typeof d.email !== "string" ||
    !ROLES.includes(d.role as Role)
  ) {
    return null;
  }
  return {
    id: d.id,
    name: d.name,
    email: d.email,
    role: d.role as Role,
    ...(typeof d.restaurantId === "string" ? { restaurantId: d.restaurantId } : {}),
  };
}

// confirm-password is checked in the browser only and is never sent.
// There is deliberately no "role" here: people can't choose their own access level.
// An administrator assigns the role when they approve the request.
export type SignupInput = {
  name: string;
  phone: string; // normalised to +234XXXXXXXXXX
  email: string;
  password: string;
};

export type AuthErrorCode =
  | "invalid_credentials" // wrong email or password (one message for both, on purpose)
  | "pending_approval" // correct password, but an admin hasn't approved the account yet
  | "rate_limited" // too many attempts
  | "network" // the server couldn't be reached
  | "unknown";

export class AuthError extends Error {
  code: AuthErrorCode;
  constructor(code: AuthErrorCode) {
    super(code);
    this.name = "AuthError";
    this.code = code;
  }
}

// The only thing the pages know about. Swap the implementation, not the pages.
export interface AuthApi {
  login(email: string, password: string): Promise<Session>;
  signup(input: SignupInput): Promise<void>;
  logout(): Promise<void>;
  me(): Promise<Session | null>;
}