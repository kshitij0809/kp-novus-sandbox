"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle } from "lucide-react";
import { OnboardingStepShell } from "@/components/onboarding/onboarding-step-shell";
import { track } from "@/lib/pendo";
import { Plan } from "@/types";
import { cn } from "@/lib/utils";

const PLANS: Array<{ id: Plan; name: string; price: string; features: string[] }> = [
  { id: "free", name: "Free", price: "$0/mo", features: ["3 projects", "5 members", "Basic reports"] },
  { id: "pro", name: "Pro", price: "$12/mo", features: ["Unlimited projects", "Unlimited members", "Gantt view", "Advanced reports"] },
  { id: "enterprise", name: "Enterprise", price: "Custom", features: ["Everything in Pro", "SSO", "Custom integrations"] },
];

export default function OnboardingPlanPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<Plan>("free");

  useEffect(() => {
    document.title = "TaskPilot — Choose a plan";
    // PENDO: onboarding step viewed
    track("onboarding_step_viewed", { step: "plan", step_number: 4 });
  }, []);

  const handleNext = () => {
    // PENDO: plan selected during onboarding
    track("plan_selected", { plan: selected, source: "onboarding" });
    // PENDO: onboarding step completed
    track("onboarding_step_completed", { step: "plan", step_number: 4 });
    router.push("/onboarding/invite");
  };

  return (
    <OnboardingStepShell
      currentStep={4}
      title="Pick your plan"
      subtitle="You can change this anytime. Start free, upgrade when ready."
      onNext={handleNext}
    >
      <div className="space-y-3">
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            onClick={() => setSelected(plan.id)}
            className={cn(
              "w-full text-left border rounded-xl p-4 transition-all",
              selected === plan.id
                ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-500/10"
                : "border-border hover:border-indigo-300"
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold">{plan.name}</span>
              <span className="text-sm font-medium text-indigo-600">{plan.price}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {plan.features.map((f) => (
                <span key={f} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <CheckCircle size={10} className="text-indigo-500" /> {f}
                </span>
              ))}
            </div>
          </button>
        ))}
      </div>
    </OnboardingStepShell>
  );
}
