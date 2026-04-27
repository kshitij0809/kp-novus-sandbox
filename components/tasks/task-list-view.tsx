"use client";

import { useState } from "react";
import Link from "next/link";
import { Task } from "@/types";
import { TaskStatusBadge } from "./task-status-badge";
import { TaskPriorityFlagToggle } from "./task-priority-flag-toggle";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SEED_USERS } from "@/lib/seed";
import { format } from "date-fns";
import { useTasksStore } from "@/store/tasks-store";
import { track } from "@/lib/pendo";
import { NewTaskButton } from "./new-task-button";
import { BulkActionsBar } from "./bulk-actions-bar";

interface Props {
  tasks: Task[];
  projectId: string;
}

export function TaskListView({ tasks, projectId }: Props) {
  const { updateTask } = useTasksStore();
  const [selected, setSelected] = useState<string[]>([]);

  const toggleSelect = (id: string) => {
    if (selected.includes(id)) {
      setSelected(selected.filter((s) => s !== id));
    } else {
      if (selected.length === 0) {
        // PENDO: bulk select started
        track("bulk_select_started", { project_id: projectId });
      }
      setSelected([...selected, id]);
    }
  };

  const toggleComplete = async (task: Task) => {
    const newStatus = task.status === "done" ? "todo" : "done";
    await updateTask(task.id, { status: newStatus });
    if (newStatus === "done") {
      // PENDO: task completed
      track("task_completed", { task_id: task.id });
    } else {
      // PENDO: task reopened
      track("task_reopened", { task_id: task.id });
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">{tasks.length} tasks</p>
        <NewTaskButton projectId={projectId} />
      </div>

      {selected.length > 0 && (
        <BulkActionsBar
          selectedIds={selected}
          projectId={projectId}
          onClear={() => setSelected([])}
        />
      )}

      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="w-8 px-3 py-2.5" />
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground">Task</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground w-28">Status</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground w-20">Priority</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground w-28">Assignee</th>
              <th className="text-left px-3 py-2.5 font-medium text-muted-foreground w-24">Due date</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => {
              const assignee = task.assigneeId ? SEED_USERS.find((u) => u.id === task.assigneeId) : null;
              return (
                <tr key={task.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors last:border-0">
                  <td className="px-3 py-2.5">
                    <Checkbox
                      checked={selected.includes(task.id)}
                      onCheckedChange={() => toggleSelect(task.id)}
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={task.status === "done"}
                        onCheckedChange={() => toggleComplete(task)}
                        className="flex-shrink-0"
                      />
                      <Link href={`/projects/${projectId}/tasks/${task.id}`} className="hover:text-indigo-600 transition-colors truncate max-w-xs">
                        {task.title}
                      </Link>
                    </div>
                  </td>
                  <td className="px-3 py-2.5">
                    <TaskStatusBadge status={task.status} />
                  </td>
                  <td className="px-3 py-2.5">
                    <TaskPriorityFlagToggle
                      priority={task.priority}
                      onChangePriority={(p) => updateTask(task.id, { priority: p })}
                      compact
                    />
                  </td>
                  <td className="px-3 py-2.5">
                    {assignee ? (
                      <div className="flex items-center gap-1.5">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">
                            {assignee.firstName[0]}{assignee.lastName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-xs">{assignee.firstName}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-muted-foreground">Unassigned</span>
                    )}
                  </td>
                  <td className="px-3 py-2.5 text-xs text-muted-foreground">
                    {task.dueDate ? format(new Date(task.dueDate), "MMM d") : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
