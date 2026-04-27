"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { track } from "@/lib/pendo";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // PENDO: password reset requested
    track("password_reset_requested", { email });
    setSent(true);
    toast.success(`Reset link sent to ${email}`);
  };

  if (sent) {
    return (
      <div className="text-center py-4">
        <p className="text-sm text-muted-foreground">Check your inbox for a reset link.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1"
          placeholder="you@company.io"
          required
        />
      </div>
      <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
        Send reset link
      </Button>
    </form>
  );
}
