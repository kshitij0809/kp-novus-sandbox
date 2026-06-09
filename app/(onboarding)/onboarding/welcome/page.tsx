"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Zap, CheckCircle } from "lucide-react";
import { OnboardingStepShell } from "@/components/onboarding/onboarding-step-shell";
import { track } from "@/lib/pendo";

const HIGHLIGHTS = [
  "Set up your team workspace",
  "Create your first project",
  "Invite your teammates",
  "Start tracking tasks",
];

export default function OnboardingWelcomePage() {
  const router = useRouter();

  useEffect(() => {
    document.title = "TaskPilot — Welcome";
    // PENDO: onboarding started + step viewed
    track("onboarding_started", { source: "signup" });
    track("onboarding_step_viewed", { step: "welcome", step_number: 1 });
  }, []);

  const handleNext = () => {
    // PENDO: onboarding step completed
    track("onboarding_step_completed", { step: "welcome", step_number: 1 });
    router.push("/onboarding/profile");
  };

  return (
    <OnboardingStepShell
      currentStep={1}
      title="Welcome to TaskPilot! 🎉"
      subtitle="Let's get your workspace set up in just a few minutes."
      onNext={handleNext}
      nextLabel="Let's go"
    >
      <div className="space-y-3">
        {HIGHLIGHTS.map((item) => (
          <div key={item} className="flex items-center gap-3 text-sm">
            <CheckCircle size={16} className="text-indigo-500 flex-shrink-0" />
            <span>{item}</span>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl p-4 flex items-center gap-3">
        <Zap className="text-indigo-500" size={20} />
        <p className="text-sm text-indigo-700 dark:text-indigo-300">
          Most teams are up and running in under 5 minutes.
        </p>
      </div>
    </OnboardingStepShell>
  );
}
