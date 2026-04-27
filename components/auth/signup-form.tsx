"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/store/auth-store";
import { track } from "@/lib/pendo";

const schema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "At least 8 characters"),
});

type FormData = z.infer<typeof schema>;

export function SignupForm() {
  const router = useRouter();
  const { signIn } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    // PENDO: signup completed funnel step 4
    track("signup_completed", { email: data.email, first_name: data.firstName });
    signIn(data.email);
    router.push("/onboarding/welcome");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
        <Label htmlFor="email">Email address</Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          className="mt-1"
          onBlur={() => {
            // PENDO: signup email entered funnel step 2
            track("signup_email_entered");
          }}
        />
        {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...register("password")}
          className="mt-1"
          placeholder="At least 8 characters"
          onBlur={() => {
            // PENDO: signup password entered funnel step 3
            track("signup_password_entered");
          }}
        />
        {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isSubmitting}>
        {isSubmitting ? "Creating account…" : "Create account"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        By signing up you agree to our Terms of Service and Privacy Policy.
      </p>
    </form>
  );
}
