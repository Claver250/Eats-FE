"use client";

import { createContext, useContext } from "react";
import type { Session } from "@/lib/admin-auth";

export const SessionContext = createContext<Session | null>(null);

// The signed-in person. Only available inside <AuthGate>, which never renders its children without one.
export function useSession(): Session {
  const session = useContext(SessionContext);
  if (!session) throw new Error("useSession must be used inside <AuthGate>.");
  return session;
}