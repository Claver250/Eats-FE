import type { Metadata } from "next";
import LoginForm from "@/features/admin-auth/components/LoginForm";

export const metadata: Metadata = { title: "Sign in · WeEats Admin" };

export default function LoginPage() {
  return <LoginForm />;
}