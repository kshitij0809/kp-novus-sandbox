"use client";

import { useEffect } from "react";
import Link from "next/link";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  useEffect(() => {
    document.title = "TaskPilot — Reset password";
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Reset your password</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Enter your email and we'll send you a reset link.{" "}
        <Link href="/sign-in" className="text-indigo-600 hover:underline font-medium">
          Back to sign in
        </Link>
      </p>
      <ForgotPasswordForm />
    </div>
  );
}
