"use client";

import { useEffect, useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { auth, type Session } from "@/lib/admin-auth";
import { canAccess, homeFor } from "@/lib/admin-auth/access";
import { SessionContext } from "../session";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; session: Session | null };

// Wraps the signed-in part of the app. Nothing inside it is rendered until the session is known and
// the current page is allowed for this role, so a restricted page never flashes on screen.
// This is a convenience for honest users. The backend still has to check every request.
export default function AuthGate({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let live = true;
    auth
      .me()
      .then((session) => live && setState({ status: "ready", session }))
      .catch(() => live && setState({ status: "error" }));
    return () => {
      live = false;
    };
  }, [attempt]);

  const session = state.status === "ready" ? state.session : null;
  const allowed = !!session && canAccess(session.role, pathname);

  useEffect(() => {
    if (state.status !== "ready") return;
    if (!session) router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    else if (!allowed) router.replace(homeFor(session.role));
  }, [state.status, session, allowed, pathname, router]);

  if (state.status === "error") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-page p-6 text-center">
        <p role="alert" className="text-sm font-medium text-danger">
          We couldn’t reach the server to check your sign-in.
        </p>
        <button
          type="button"
          onClick={() => {
            setState({ status: "loading" });
            setAttempt((n) => n + 1);
          }}
          className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!session || !allowed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-page">
        <p role="status" className="text-sm text-muted">
          Checking your sign-in…
        </p>
      </div>
    );
  }

  return <SessionContext.Provider value={session}>{children}</SessionContext.Provider>;
}