"use client";

import { X, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTasksStore } from "@/store/tasks-store";
import { track } from "@/lib/pendo";
import { toast } from "sonner";

interface Props {
  selectedIds: string[];
  projectId: string;
  onClear: () => void;
}

export function BulkActionsBar({ selectedIds, projectId, onClear }: Props) {
  const { updateTask, deleteTask } = useTasksStore();

  const handleMarkDone = async () => {
    for (const id of selectedIds) {
      await updateTask(id, { status: "done" });
    }
    // PENDO: bulk action performed
    track("bulk_action_performed", { action: "mark_done", count: selectedIds.length, project_id: projectId });
    toast.success(`${selectedIds.length} tasks marked as done`);
    onClear();
  };

  const handleDelete = async () => {
    for (const id of selectedIds) {
      await deleteTask(id);
    }
    // PENDO: bulk action performed
    track("bulk_action_performed", { action: "delete", count: selectedIds.length, project_id: projectId });
    toast.success(`${selectedIds.length} tasks deleted`);
    onClear();
  };

  return (
    <div className="flex items-center gap-2 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/30 rounded-lg px-4 py-2 mb-3">
      <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">{selectedIds.length} selected</span>
      <div className="ml-auto flex items-center gap-2">
        <Button variant="ghost" size="sm" className="gap-1.5 h-7" onClick={handleMarkDone}>
          <CheckCircle size={13} />
          Mark done
        </Button>
        <Button variant="ghost" size="sm" className="gap-1.5 h-7 text-destructive hover:text-destructive" onClick={handleDelete}>
          <Trash2 size={13} />
          Delete
        </Button>
        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClear}>
          <X size={13} />
        </Button>
      </div>
    </div>
  );
}
