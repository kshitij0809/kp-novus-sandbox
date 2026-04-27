"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useAuthStore } from "@/store/auth-store";
import { track } from "@/lib/pendo";

const schema = z.object({
  email: z.string().email("Valid email required"),
  password: z.string().min(1, "Required"),
});

type FormData = z.infer<typeof schema>;

export function SigninForm() {
  const router = useRouter();
  const { signIn } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    // PENDO: signin attempted
    track("signin_attempted", { email: data.email });
    await new Promise((r) => setTimeout(r, 400));
    // PENDO: signin succeeded
    track("signin_succeeded", { email: data.email });
    signIn(data.email);
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="email">Email address</Label>
        <Input id="email" type="email" {...register("email")} className="mt-1" placeholder="you@company.io" />
        {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
      </div>
      <div>
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <Link href="/forgot-password" className="text-xs text-indigo-600 hover:underline">
            Forgot password?
          </Link>
        </div>
        <Input id="password" type="password" {...register("password")} className="mt-1" placeholder="••••••••" />
        {errors.password && <p className="text-destructive text-xs mt-1">{errors.password.message}</p>}
      </div>
      <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700" disabled={isSubmitting}>
        {isSubmitting ? "Signing in…" : "Sign in"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Enter any email to sign in with a demo account.
      </p>
    </form>
  );
}
