"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/store/auth-store";
import { toast } from "sonner";
import { track } from "@/lib/pendo";

const schema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
});

type FormData = z.infer<typeof schema>;

export default function ProfileSettingsPage() {
  const { user, updateProfile } = useAuthStore();

  useEffect(() => {
    document.title = "TaskPilot — Profile settings";
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { firstName: user?.firstName, lastName: user?.lastName, email: user?.email },
  });

  const onSubmit = (data: FormData) => {
    const changed: string[] = [];
    if (data.firstName !== user?.firstName) changed.push("first_name");
    if (data.lastName !== user?.lastName) changed.push("last_name");
    if (data.email !== user?.email) changed.push("email");
    updateProfile(data);
    // PENDO: profile updated
    track("profile_updated", { fields_changed: changed.join(",") });
    toast.success("Profile updated");
    if (typeof window !== "undefined") {
      (window as any).pendo?.updateOptions?.({ visitor: { email: data.email, first_name: data.firstName, last_name: data.lastName } });
    }
  };

  const initials = user ? `${user.firstName[0]}${user.lastName[0]}` : "?";

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-xl bg-indigo-100 text-indigo-700">{initials}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-semibold">{user?.firstName} {user?.lastName}</p>
            <p className="text-sm text-muted-foreground user-pii">{user?.email}</p>
          </div>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label>First name</Label>
              <Input {...register("firstName")} className="mt-1" />
              {errors.firstName && <p className="text-destructive text-xs mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label>Last name</Label>
              <Input {...register("lastName")} className="mt-1" />
              {errors.lastName && <p className="text-destructive text-xs mt-1">{errors.lastName.message}</p>}
            </div>
          </div>
          <div>
            <Label>Email</Label>
            <Input {...register("email")} type="email" className="mt-1 user-pii" />
            {errors.email && <p className="text-destructive text-xs mt-1">{errors.email.message}</p>}
          </div>
          <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={isSubmitting}>Save changes</Button>
        </form>
      </CardContent>
    </Card>
  );
}
