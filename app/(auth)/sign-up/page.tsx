"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";
import { track } from "@/lib/pendo";

export default function SignUpPage() {
  useEffect(() => {
    document.title = "TaskPilot — Create your account";
    // PENDO: signup page viewed funnel step 1
    const params = new URLSearchParams(window.location.search);
    track("signup_page_viewed", {
      referrer: document.referrer || undefined,
      utm_source: params.get("utm_source") || undefined,
      utm_campaign: params.get("utm_campaign") || undefined,
    });
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Create your account</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Already have an account?{" "}
        <Link href="/sign-in" className="text-indigo-600 hover:underline font-medium">
          Sign in
        </Link>
      </p>
      <SignupForm />
    </div>
  );
}
