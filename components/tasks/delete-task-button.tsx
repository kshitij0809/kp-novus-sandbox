"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useTasksStore } from "@/store/tasks-store";
import { track } from "@/lib/pendo";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface Props {
  taskId: string;
  projectId: string;
}

export function DeleteTaskButton({ taskId, projectId }: Props) {
  const [open, setOpen] = useState(false);
  const { deleteTask } = useTasksStore();
  const router = useRouter();

  const handleDelete = async () => {
    await deleteTask(taskId);
    // PENDO: task deleted
    track("task_deleted", { task_id: taskId, project_id: projectId });
    toast.success("Task deleted");
    setOpen(false);
    router.push(`/projects/${projectId}`);
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-1.5 text-destructive border-destructive/30 hover:bg-destructive/5">
        <Trash2 size={13} />
        Delete
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete task?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">This action cannot be undone. The task will be permanently deleted.</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
