"use client";

import { track } from "./pendo";

export const FLAGS = {
  gantt_view_enabled: { default: false, description: "Enables Gantt view on project detail" },
  ai_assistant_v2: { default: true, description: "New AI assistant chat panel" },
  bulk_actions_v2: { default: false, description: "Bulk actions toolbar v2" },
  new_onboarding_flow: { default: true, description: "5-step onboarding flow" },
  promo_banner_q4: { default: false, description: "Q4 upgrade promo banner" },
} as const;

export function useFlag(name: keyof typeof FLAGS): boolean {
  if (typeof window === "undefined") return FLAGS[name].default;
  const override = localStorage.getItem(`flag_${name}`);
  const value = override !== null ? override === "true" : FLAGS[name].default;
  // PENDO: feature flag evaluation — fires once per flag read
  track("feature_flag_evaluated", { flag: name, value });
  return value;
}

export function setFlagOverride(name: keyof typeof FLAGS, value: boolean) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`flag_${name}`, String(value));
}
