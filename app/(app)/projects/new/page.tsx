"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProjectsStore } from "@/store/projects-store";
import { useAuthStore } from "@/store/auth-store";
import { track } from "@/lib/pendo";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(1, "Project name required"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function NewProjectPage() {
  const router = useRouter();
  const { createProject } = useProjectsStore();
  const { user } = useAuthStore();

  useEffect(() => {
    document.title = "TaskPilot — New project";
    // PENDO: project create dialog opened (standalone page)
    track("project_create_dialog_opened", { source: "page" });
  }, []);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const project = await createProject({
      name: data.name,
      description: data.description ?? "",
      status: "active",
      ownerId: user?.id ?? "user_current",
      memberIds: [user?.id ?? "user_current"],
      labelIds: [],
    });
    // PENDO: project created
    track("project_created", { project_id: project.id, name: project.name, source: "page" });
    toast.success(`Project "${project.name}" created`);
    router.push(`/projects/${project.id}`);
  };

  return (
    <div className="max-w-lg mx-auto px-6 py-12">
      <Card>
        <CardHeader>
          <CardTitle>Create a new project</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="name">Project name</Label>
              <Input id="name" {...register("name")} className="mt-1" placeholder="e.g. Website Redesign" autoFocus />
              {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <Label htmlFor="description">Description (optional)</Label>
              <Textarea id="description" {...register("description")} className="mt-1 resize-none" rows={4} placeholder="What is this project about?" />
            </div>
            <div className="flex gap-3 pt-2">
              <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 flex-1" disabled={isSubmitting}>
                {isSubmitting ? "Creating…" : "Create project"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
