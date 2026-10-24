export type AdminSession = {
  id: string;
  name: string;
  email: string;
  role: "admin";
};

// confirm-password is checked in the browser only and is never sent.
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
  login(email: string, password: string): Promise<AdminSession>;
  signup(input: SignupInput): Promise<void>;
  logout(): Promise<void>;
  me(): Promise<AdminSession | null>;
}