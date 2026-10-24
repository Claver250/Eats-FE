"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthError, auth, isMockAuth } from "@/lib/admin-auth";
import { DEMO_EMAIL, DEMO_PASSWORD } from "@/lib/admin-auth/mock";
import { safeNext } from "@/lib/admin-auth/redirect";
import { isEmail } from "@/lib/admin-auth/validators";
import { authErrorMessage } from "../messages";
import AuthShell from "./AuthShell";
import PasswordField from "./PasswordField";
import TextField from "./TextField";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const inFlight = useRef(false);

  useEffect(() => {
    document.getElementById("login-email")?.focus();
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (inFlight.current) return;

    const found: typeof errors = {};
    if (!isEmail(email)) found.email = "Enter your email address.";
    if (!password) found.password = "Enter your password.";
    setErrors(found);
    setFormError("");
    if (found.email || found.password) {
      document.getElementById(found.email ? "login-email" : "login-password")?.focus();
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    try {
      await auth.login(email.trim(), password);
      router.replace(safeNext(new URLSearchParams(window.location.search).get("next")));
    } catch (err) {
      setFormError(authErrorMessage(err instanceof AuthError ? err.code : "unknown", "login"));
      setPassword(""); // never leave a rejected password sitting in the field
      inFlight.current = false;
      setSubmitting(false);
      document.getElementById("login-password")?.focus();
    }
  }

  return (
    <AuthShell
      title="Sign in"
      subtitle="Use your administrator email and password."
      footer={
        <>
          Don’t have an account?{" "}
          <Link href="/signup" className="font-medium text-brand-600 hover:underline">
            Request access
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {formError && (
          <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-danger">
            {formError}
          </p>
        )}

        <TextField
          id="login-email"
          name="email"
          label="Email address"
          type="email"
          autoComplete="username"
          placeholder="you@company.com"
          value={email}
          error={errors.email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors((p) => ({ ...p, email: undefined }));
          }}
        />

        <PasswordField
          id="login-password"
          label="Password"
          autoComplete="current-password"
          value={password}
          error={errors.password}
          onChange={(v) => {
            setPassword(v);
            if (errors.password) setErrors((p) => ({ ...p, password: undefined }));
          }}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? "Signing in…" : "Sign in"}
        </button>
      </form>

      {isMockAuth && (
        <p className="mt-5 rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-700">
          Demo mode: sign in with <span className="font-semibold">{DEMO_EMAIL}</span> and{" "}
          <span className="font-semibold">{DEMO_PASSWORD}</span>. No real accounts exist yet.
        </p>
      )}
    </AuthShell>
  );
}