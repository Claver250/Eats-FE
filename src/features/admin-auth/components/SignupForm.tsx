"use client";

import Link from "next/link";
import { useRef, useState, type FormEvent } from "react";
import { CheckCircle2 } from "lucide-react";
import { AuthError, auth } from "@/lib/admin-auth";
import {
  checkPassword,
  isEmail,
  isNigerianPhone,
  normalizePhone,
  passwordAccepted,
} from "@/lib/admin-auth/validators";
import { authErrorMessage } from "../messages";
import AuthShell from "./AuthShell";
import PasswordField from "./PasswordField";
import PasswordStrength from "./PasswordStrength";
import TextField from "./TextField";

type Field = "name" | "phone" | "email" | "password" | "confirm";
type Errors = Partial<Record<Field, string>>;

const ORDER: Field[] = ["name", "phone", "email", "password", "confirm"];

export default function SignupForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [doneFor, setDoneFor] = useState<string | null>(null);
  const inFlight = useRef(false);

  const clear = (f: Field) => errors[f] && setErrors((p) => ({ ...p, [f]: undefined }));

  function validate(): Errors {
    const e: Errors = {};
    if (name.trim().length < 2) e.name = "Enter your full name.";
    if (!isNigerianPhone(phone)) e.phone = "Enter a valid Nigerian phone number, e.g. +234 801 234 5678.";
    if (!isEmail(email)) e.email = "Enter a valid email address.";
    if (!passwordAccepted(checkPassword(password, { email, name }))) {
      e.password = "Choose a stronger password. The checklist shows what’s missing.";
    }
    if (!confirm) e.confirm = "Re-enter your password.";
    else if (confirm !== password) e.confirm = "Passwords don’t match.";
    return e;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (inFlight.current) return;

    const found = validate();
    setErrors(found);
    setFormError("");
    const first = ORDER.find((f) => found[f]);
    if (first) {
      document.getElementById(`signup-${first}`)?.focus();
      return;
    }

    inFlight.current = true;
    setSubmitting(true);
    try {
      await auth.signup({
        name: name.trim(),
        phone: normalizePhone(phone),
        email: email.trim().toLowerCase(),
        password,
      });
      // Whether or not the email was already registered, the person sees the same screen.
      setDoneFor(name.trim().split(/\s+/)[0]);
      setPassword("");
      setConfirm("");
    } catch (err) {
      setFormError(authErrorMessage(err instanceof AuthError ? err.code : "unknown", "signup"));
      inFlight.current = false;
      setSubmitting(false);
    }
  }

  if (doneFor !== null) {
    return (
      <AuthShell title="Request received" subtitle="Your account is waiting for approval.">
        <div className="flex items-start gap-3 rounded-lg bg-brand-50 p-4 text-sm text-brand-700">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
          <p>
            Thanks, {doneFor}. An existing administrator has to approve your account before you can
            sign in. Until then, signing in won’t work.
          </p>
        </div>
        <Link
          href="/login"
          className="mt-5 block w-full rounded-lg border border-brand-600 py-2.5 text-center text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
        >
          Back to sign in
        </Link>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      title="Request admin access"
      subtitle="Create your account. An existing administrator will approve it."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-brand-600 hover:underline">
            Sign in
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
          id="signup-name"
          name="name"
          label="Full name"
          type="text"
          autoComplete="name"
          maxLength={60}
          placeholder="e.g. Ada Okafor"
          value={name}
          error={errors.name}
          onChange={(e) => {
            setName(e.target.value);
            clear("name");
          }}
        />

        <TextField
          id="signup-phone"
          name="phone"
          label="Phone number"
          type="tel"
          autoComplete="tel"
          placeholder="+234 801 234 5678"
          value={phone}
          error={errors.phone}
          onChange={(e) => {
            setPhone(e.target.value.replace(/[^\d+\s-]/g, "").slice(0, 20));
            clear("phone");
          }}
        />

        <TextField
          id="signup-email"
          name="email"
          label="Email address"
          type="email"
          autoComplete="email"
          maxLength={254}
          placeholder="you@company.com"
          value={email}
          error={errors.email}
          onChange={(e) => {
            setEmail(e.target.value);
            clear("email");
          }}
        />

        <PasswordField
          id="signup-password"
          label="Password"
          autoComplete="new-password"
          value={password}
          error={errors.password}
          onChange={(v) => {
            setPassword(v);
            clear("password");
          }}
        >
          <PasswordStrength password={password} email={email} name={name} />
        </PasswordField>

        <PasswordField
          id="signup-confirm"
          label="Confirm password"
          autoComplete="new-password"
          value={confirm}
          error={errors.confirm}
          onChange={(v) => {
            setConfirm(v);
            clear("confirm");
          }}
          hint={confirm && confirm === password ? "Passwords match." : undefined}
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-brand-600 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-700 disabled:opacity-60"
        >
          {submitting ? "Sending request…" : "Request access"}
        </button>
      </form>
    </AuthShell>
  );
}