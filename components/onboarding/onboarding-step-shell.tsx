"use client";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const STEPS = ["Welcome", "Profile", "Team", "Plan", "Invite"];

interface Props {
  currentStep: number;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onNext: () => void;
  onSkip?: () => void;
  nextLabel?: string;
  loading?: boolean;
}

export function OnboardingStepShell({
  currentStep,
  title,
  subtitle,
  children,
  onNext,
  onSkip,
  nextLabel = "Continue",
  loading,
}: Props) {
  const progress = ((currentStep) / STEPS.length) * 100;

  return (
    <div className="w-full max-w-lg">
      {/* Progress */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
          <span>
            Step {currentStep} of {STEPS.length}
          </span>
          <span>{STEPS[currentStep - 1]}</span>
        </div>
        <Progress value={progress} className="h-1.5" />
      </div>

      {/* Card */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl p-8">
        <h1 className="text-2xl font-bold mb-1">{title}</h1>
        <p className="text-muted-foreground text-sm mb-8">{subtitle}</p>
        {children}
        <div className="flex items-center justify-between mt-8">
          {onSkip ? (
            <Button variant="ghost" size="sm" onClick={onSkip} className="text-muted-foreground">
              Skip for now
            </Button>
          ) : (
            <div />
          )}
          <Button onClick={onNext} className="bg-indigo-600 hover:bg-indigo-700 px-6" disabled={loading}>
            {loading ? "Saving…" : nextLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
