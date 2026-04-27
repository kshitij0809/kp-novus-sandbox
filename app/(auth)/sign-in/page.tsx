"use client";

import { useEffect } from "react";
import Link from "next/link";
import { SigninForm } from "@/components/auth/signin-form";

export default function SignInPage() {
  useEffect(() => {
    document.title = "TaskPilot — Sign in";
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Welcome back</h1>
      <p className="text-muted-foreground text-sm mb-6">
        Don't have an account?{" "}
        <Link href="/sign-up" className="text-indigo-600 hover:underline font-medium">
          Sign up free
        </Link>
      </p>
      <SigninForm />
    </div>
  );
}
