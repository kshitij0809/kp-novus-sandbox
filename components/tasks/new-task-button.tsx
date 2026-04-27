"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewTaskDialog } from "./new-task-dialog";
import { track } from "@/lib/pendo";
import { TaskStatus } from "@/types";

interface Props {
  projectId: string;
  defaultStatus?: TaskStatus;
  variant?: "default" | "ghost" | "outline";
  label?: string;
}

export function NewTaskButton({ projectId, defaultStatus, variant = "default", label = "New task" }: Props) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    // PENDO: task create dialog opened funnel step 1
    track("task_create_dialog_opened", { project_id: projectId });
    setOpen(true);
  };

  return (
    <>
      <Button
        variant={variant}
        size="sm"
        onClick={handleOpen}
        className={variant === "default" ? "bg-indigo-600 hover:bg-indigo-700 gap-1.5" : "gap-1.5"}
      >
        <Plus size={14} />
        {label}
      </Button>
      <NewTaskDialog open={open} onClose={() => setOpen(false)} projectId={projectId} defaultStatus={defaultStatus} />
    </>
  );
}
