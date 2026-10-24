import type { AuthErrorCode } from "@/lib/admin-auth";

export function authErrorMessage(code: AuthErrorCode, context: "login" | "signup"): string {
  switch (code) {
    case "invalid_credentials":
      return "Incorrect email or password.";
    case "pending_approval":
      return "Your account is still waiting for approval by an administrator.";
    case "rate_limited":
      return "Too many attempts. Please wait a few minutes and try again.";
    case "network":
      return "We couldn’t reach the server. Check your connection and try again.";
    default:
      return context === "login"
        ? "Something went wrong signing you in. Please try again."
        : "Something went wrong sending your request. Please try again.";
  }
}