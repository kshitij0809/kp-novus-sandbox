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
import { useAuthStore } from "@/store/auth-store";
import { track } from "@/lib/pendo";
import { Role } from "@/types";

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  role: z.enum(["admin", "manager", "member"]),
});

type FormData = z.infer<typeof schema>;

export default function OnboardingProfilePage() {
  const router = useRouter();
  const { user, updateProfile } = useAuthStore();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: user?.firstName ?? "", lastName: user?.lastName ?? "", role: user?.role ?? "member" },
  });

  useEffect(() => {
    document.title = "TaskPilot — Your profile";
    // PENDO: onboarding step viewed
    track("onboarding_step_viewed", { step: "profile", step_number: 2 });
  }, []);

  const handleNext = handleSubmit((data) => {
    updateProfile({ firstName: data.firstName, lastName: data.lastName, role: data.role as Role });
    // PENDO: onboarding step completed
    track("onboarding_step_completed", { step: "profile", step_number: 2 });
    router.push("/onboarding/team");
  });

  return (
    <OnboardingStepShell
      currentStep={2}
      title="Tell us about yourself"
      subtitle="This helps us personalize your experience."
      onNext={handleNext}
    >
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="firstName">First name</Label>
            <Input id="firstName" {...register("firstName")} className="mt-1" />
            {errors.firstName && <p className="text-destructive text-xs mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <Label htmlFor="lastName">Last name</Label>
            <Input id="lastName" {...register("lastName")} className="mt-1" />
            {errors.lastName && <p className="text-destructive text-xs mt-1">{errors.lastName.message}</p>}
          </div>
        </div>
        <div>
          <Label>Your role</Label>
          <Select defaultValue={user?.role ?? "member"} onValueChange={(v) => v && setValue("role", v as Role)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="member">Member</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </OnboardingStepShell>
  );
}
