"use client";

import { Task, TaskStatus } from "@/types";
import { TaskCard } from "./task-card";
import { NewTaskButton } from "./new-task-button";
import { useTasksStore } from "@/store/tasks-store";
import { track } from "@/lib/pendo";
import { cn } from "@/lib/utils";

const COLUMNS: Array<{ id: TaskStatus; label: string; color: string }> = [
  { id: "todo", label: "Todo", color: "bg-slate-100 dark:bg-slate-800" },
  { id: "in_progress", label: "In Progress", color: "bg-blue-50 dark:bg-blue-900/20" },
  { id: "in_review", label: "In Review", color: "bg-purple-50 dark:bg-purple-900/20" },
  { id: "done", label: "Done", color: "bg-green-50 dark:bg-green-900/20" },
];

interface Props {
  tasks: Task[];
  projectId: string;
}

export function KanbanBoard({ tasks, projectId }: Props) {
  const { updateTask } = useTasksStore();

  const moveTask = async (taskId: string, from: TaskStatus, to: TaskStatus) => {
    await updateTask(taskId, { status: to });
    if (to === "done") {
      // PENDO: task completed when dropped on Done
      track("task_completed", { task_id: taskId, project_id: projectId });
    } else if (from === "done") {
      // PENDO: task reopened
      track("task_reopened", { task_id: taskId });
    }
  };

  return (
    <div className="flex gap-4 overflow-x-auto pb-4 h-full">
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        return (
          <div key={col.id} className="flex-shrink-0 w-72">
            <div className={cn("rounded-xl p-3", col.color)}>
              <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">{col.label}</span>
                  <span className="text-xs text-muted-foreground bg-background/60 px-1.5 py-0.5 rounded-full">
                    {colTasks.length}
                  </span>
                </div>
                <NewTaskButton projectId={projectId} defaultStatus={col.id} variant="ghost" label="" />
              </div>
              <div className="space-y-2 min-h-[200px]">
                {colTasks.map((task) => (
                  <div key={task.id} className="relative group">
                    <TaskCard task={task} projectId={projectId} />
                    {/* Move buttons for status simulation */}
                    <div className="absolute top-1 right-1 hidden group-hover:flex gap-1 z-10">
                      {COLUMNS.filter((c) => c.id !== col.id).map((target) => (
                        <button
                          key={target.id}
                          title={`Move to ${target.label}`}
                          onClick={(e) => {
                            e.preventDefault();
                            moveTask(task.id, col.id, target.id);
                          }}
                          className="text-xs bg-background border border-border rounded px-1.5 py-0.5 shadow-sm hover:bg-accent whitespace-nowrap"
                        >
                          → {target.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-2">
                <NewTaskButton projectId={projectId} defaultStatus={col.id} variant="ghost" label="Add task" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
