"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OnboardingStepShell } from "@/components/onboarding/onboarding-step-shell";
import { track } from "@/lib/pendo";

const schema = z.object({
  companyName: z.string().min(1, "Required"),
  teamSize: z.string(),
  industry: z.string(),
});

type FormData = z.infer<typeof schema>;

const INDUSTRIES = ["Software", "Finance", "Healthcare", "Education", "Retail", "Manufacturing", "Other"];
const TEAM_SIZES = ["1-5", "6-15", "16-50", "51-200", "201-500", "500+"];

export default function OnboardingTeamPage() {
  const router = useRouter();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { companyName: "Acme Corp", teamSize: "6-15", industry: "Software" },
  });

  useEffect(() => {
    document.title = "TaskPilot — Your team";
    // PENDO: onboarding step viewed
    track("onboarding_step_viewed", { step: "team", step_number: 3 });
  }, []);

  const handleNext = handleSubmit(() => {
    // PENDO: onboarding step completed
    track("onboarding_step_completed", { step: "team", step_number: 3 });
    router.push("/onboarding/plan");
  });

  return (
    <OnboardingStepShell
      currentStep={3}
      title="About your team"
      subtitle="Help us tailor TaskPilot for your organization."
      onNext={handleNext}
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="companyName">Company name</Label>
          <Input id="companyName" {...register("companyName")} className="mt-1" placeholder="Acme Corp" />
          {errors.companyName && <p className="text-destructive text-xs mt-1">{errors.companyName.message}</p>}
        </div>
        <div>
          <Label>Team size</Label>
          <Select defaultValue="6-15" onValueChange={(v) => v && setValue("teamSize", v)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TEAM_SIZES.map((s) => (
                <SelectItem key={s} value={s}>{s} people</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Industry</Label>
          <Select defaultValue="Software" onValueChange={(v) => v && setValue("industry", v)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INDUSTRIES.map((i) => (
                <SelectItem key={i} value={i}>{i}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </OnboardingStepShell>
  );
}
