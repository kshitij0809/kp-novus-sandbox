"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useProjectsStore } from "@/store/projects-store";
import { useAuthStore } from "@/store/auth-store";
import { track } from "@/lib/pendo";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const schema = z.object({
  name: z.string().min(1, "Project name required"),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onClose: () => void;
}

export function CreateProjectDialog({ open, onClose }: Props) {
  const { createProject } = useProjectsStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    const project = await createProject({
      name: data.name,
      description: data.description ?? "",
      status: "active",
      ownerId: user?.id ?? "user_current",
      memberIds: [user?.id ?? "user_current"],
      labelIds: [],
    });
    // PENDO: project created funnel step 2
    track("project_created", { project_id: project.id, name: project.name, source: "dialog" });
    toast.success(`Project "${project.name}" created`);
    reset();
    onClose();
    router.push(`/projects/${project.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New project</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="name">Project name</Label>
            <Input id="name" {...register("name")} className="mt-1" placeholder="e.g. Website Redesign" autoFocus />
            {errors.name && <p className="text-destructive text-xs mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea id="description" {...register("description")} className="mt-1 resize-none" rows={3} placeholder="What is this project about?" />
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
            <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700" disabled={isSubmitting}>
              {isSubmitting ? "Creating…" : "Create project"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
