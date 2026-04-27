"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskStatusBadge } from "@/components/tasks/task-status-badge";
import { TaskPriorityFlagToggle } from "@/components/tasks/task-priority-flag-toggle";
import { TaskAssignDropdown } from "@/components/tasks/task-assign-dropdown";
import { DueDatePicker } from "@/components/tasks/due-date-picker";
import { LabelManager } from "@/components/tasks/label-manager";
import { CommentBox } from "@/components/tasks/comment-box";
import { FileUploadButton } from "@/components/tasks/file-upload-button";
import { DeleteTaskButton } from "@/components/tasks/delete-task-button";
import { useTasksStore } from "@/store/tasks-store";
import { useProjectsStore } from "@/store/projects-store";
import { track } from "@/lib/pendo";
import { TaskPriority, TaskStatus } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {
  params: Promise<{ projectId: string; taskId: string }>;
}

export default function TaskDetailPage({ params }: Props) {
  const { projectId, taskId } = use(params);
  const router = useRouter();
  const { tasks, updateTask, load } = useTasksStore();
  const { projects } = useProjectsStore();
  const task = tasks.find((t) => t.id === taskId);
  const project = projects.find((p) => p.id === projectId);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (task) {
      document.title = `TaskPilot — ${task.title}`;
      setTitle(task.title);
      setDescription(task.description);
    }
  }, [task]);

  if (!task) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  const handleUpdateTitle = () => {
    if (title !== task.title) updateTask(task.id, { title });
  };

  const handleUpdateDescription = () => {
    if (description !== task.description) updateTask(task.id, { description });
  };

  const handleStatusChange = async (status: TaskStatus) => {
    await updateTask(task.id, { status });
    if (status === "done") {
      // PENDO: task completed
      track("task_completed", { task_id: task.id, project_id: projectId });
    } else if (task.status === "done") {
      // PENDO: task reopened
      track("task_reopened", { task_id: task.id });
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      {/* Back */}
      <Button variant="ghost" size="sm" className="mb-4 gap-1.5 -ml-2 text-muted-foreground" onClick={() => router.back()}>
        <ArrowLeft size={14} />
        {project?.name}
      </Button>

      {/* Title */}
      <Input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={handleUpdateTitle}
        className="text-2xl font-bold border-0 px-0 shadow-none focus-visible:ring-0 bg-transparent h-auto text-foreground"
        style={{ fontSize: "1.5rem", fontWeight: 700 }}
      />

      {/* Actions row */}
      <div className="flex flex-wrap items-center gap-2 mt-4 mb-6">
        <Select value={task.status} onValueChange={(v) => handleStatusChange(v as TaskStatus)}>
          <SelectTrigger className="w-36 h-8">
            <SelectValue>
              <TaskStatusBadge status={task.status} />
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todo">Todo</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="in_review">In Review</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
        <TaskPriorityFlagToggle
          priority={task.priority}
          onChangePriority={(p: TaskPriority) => updateTask(task.id, { priority: p })}
        />
        <TaskAssignDropdown
          assigneeId={task.assigneeId}
          onAssign={(uid) => updateTask(task.id, { assigneeId: uid })}
        />
        <DueDatePicker
          dueDate={task.dueDate}
          onChangeDueDate={(d) => updateTask(task.id, { dueDate: d })}
        />
        <div className="ml-auto flex gap-2">
          <FileUploadButton taskId={task.id} />
          <DeleteTaskButton taskId={task.id} projectId={projectId} />
        </div>
      </div>

      {/* Labels */}
      <div className="mb-6">
        <Label className="text-xs text-muted-foreground mb-1.5 block">Labels</Label>
        <LabelManager
          labels={task.labels}
          onChangeLabels={(labels) => updateTask(task.id, { labels })}
        />
      </div>

      <Separator className="mb-6" />

      {/* Description */}
      <div className="mb-6">
        <Label className="text-xs text-muted-foreground mb-1.5 block">Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={handleUpdateDescription}
          placeholder="Add a description…"
          className="resize-none text-sm min-h-[120px]"
          rows={5}
        />
      </div>

      {/* Attachments */}
      {task.attachments.length > 0 && (
        <div className="mb-6">
          <Label className="text-xs text-muted-foreground mb-1.5 block">Attachments</Label>
          <div className="space-y-1">
            {task.attachments.map((a) => (
              <div key={a} className="text-sm text-indigo-600 hover:underline cursor-pointer">
                📎 {a}
              </div>
            ))}
          </div>
        </div>
      )}

      <Separator className="mb-6" />

      {/* Comments */}
      <CommentBox task={task} />
    </div>
  );
}
