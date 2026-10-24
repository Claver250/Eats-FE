import type { Metadata } from "next";
import SignupForm from "@/features/admin-auth/components/SignupForm";

export const metadata: Metadata = { title: "Request access · WeEats Admin" };

export default function SignupPage() {
  return <SignupForm />;
}