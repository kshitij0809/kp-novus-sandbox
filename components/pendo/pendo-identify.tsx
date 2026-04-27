"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";

declare global {
  interface Window {
    pendo?: any;
  }
}

export function PendoIdentify() {
  const { user, account, authenticated } = useAuthStore();

  useEffect(() => {
    if (!authenticated || !user || !account || typeof window === "undefined") return;
    const p = window.pendo;
    if (!p) return;

    // PENDO: identify visitor and account on auth
    p.initialize({
      visitor: {
        id: user.id,
        email: user.email,
        full_name: `${user.firstName} ${user.lastName}`,
        first_name: user.firstName,
        last_name: user.lastName,
        role: user.role,
        plan: user.plan,
        signup_date: user.signupDate,
        last_login: user.lastLogin,
        theme: user.theme,
      },
      account: {
        id: account.id,
        name: account.companyName,
        industry: account.industry,
        team_size: account.teamSize,
        plan: account.plan,
        mrr: account.mrr,
        signup_source: account.signupSource,
        trial_end_date: account.trialEndDate,
      },
    });
  }, [authenticated, user, account]);

  return null;
}
