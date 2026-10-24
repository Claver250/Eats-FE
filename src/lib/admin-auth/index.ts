import { httpAuth } from "./http";
import { mockAuth } from "./mock";
import type { AuthApi } from "./types";

export * from "./types";

// The demo version is used while developing, and on a deployed demo when NEXT_PUBLIC_MOCK_AUTH=true.
// In any other build the pages talk to the real backend.
export const isMockAuth =
  process.env.NEXT_PUBLIC_MOCK_AUTH === "true" || process.env.NODE_ENV === "development";

export const auth: AuthApi = isMockAuth ? mockAuth : httpAuth;