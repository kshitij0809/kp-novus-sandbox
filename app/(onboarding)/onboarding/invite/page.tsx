"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { OnboardingStepShell } from "@/components/onboarding/onboarding-step-shell";
import { setOnboardingDone } from "@/lib/mock-api";
import { track } from "@/lib/pendo";

export default function OnboardingInvitePage() {
  const router = useRouter();
  const [emails, setEmails] = useState(["", ""]);

  useEffect(() => {
    document.title = "TaskPilot — Invite your team";
    // PENDO: onboarding step viewed
    track("onboarding_step_viewed", { step: "invite", step_number: 5 });
  }, []);

  const addEmail = () => setEmails([...emails, ""]);
  const removeEmail = (i: number) => setEmails(emails.filter((_, idx) => idx !== i));
  const updateEmail = (i: number, v: string) => setEmails(emails.map((e, idx) => (idx === i ? v : e)));

  const handleSkip = () => {
    // PENDO: onboarding skipped on invite step
    track("onboarding_skipped", { step: "invite", step_number: 5 });
    finishOnboarding(0);
  };

  const handleNext = () => {
    const valid = emails.filter((e) => e.trim() && e.includes("@"));
    if (valid.length > 0) {
      // PENDO: team member invited during onboarding
      track("team_member_invited", { count: valid.length, source: "onboarding" });
    }
    // PENDO: onboarding step completed
    track("onboarding_step_completed", { step: "invite", step_number: 5 });
    finishOnboarding(valid.length);
  };

  const finishOnboarding = (inviteCount: number) => {
    setOnboardingDone();
    // PENDO: onboarding completed funnel final step
    track("onboarding_completed", { invites_sent: inviteCount });
    router.push("/dashboard");
  };

  return (
    <OnboardingStepShell
      currentStep={5}
      title="Invite your team"
      subtitle="Add teammates to get started collaborating right away."
      onNext={handleNext}
      onSkip={handleSkip}
      nextLabel="Finish setup"
    >
      <div className="space-y-2">
        {emails.map((email, i) => (
          <div key={i} className="flex items-center gap-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => updateEmail(i, e.target.value)}
              placeholder={`teammate${i + 1}@company.io`}
            />
            {emails.length > 1 && (
              <Button variant="ghost" size="icon" onClick={() => removeEmail(i)} className="h-8 w-8 flex-shrink-0">
                <X size={14} />
              </Button>
            )}
          </div>
        ))}
        <Button variant="ghost" size="sm" onClick={addEmail} className="text-muted-foreground">
          <Plus size={14} className="mr-1" /> Add another
        </Button>
      </div>
    </OnboardingStepShell>
  );
}
