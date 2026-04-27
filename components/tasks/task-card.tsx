"use client";

import Link from "next/link";
import { Flag, Calendar, MessageSquare, Paperclip } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Task } from "@/types";
import { SEED_USERS } from "@/lib/seed";
import { format, isAfter } from "date-fns";
import { cn } from "@/lib/utils";

const PRIORITY_COLORS = {
  low: "text-slate-400",
  medium: "text-yellow-500",
  high: "text-orange-500",
  urgent: "text-red-500",
};

interface Props {
  task: Task;
  projectId: string;
}

export function TaskCard({ task, projectId }: Props) {
  const assignee = task.assigneeId ? SEED_USERS.find((u) => u.id === task.assigneeId) : null;
  const isOverdue = task.dueDate && task.status !== "done" && isAfter(new Date(), new Date(task.dueDate));

  return (
    <Link href={`/projects/${projectId}/tasks/${task.id}`}>
      <div className="bg-background border border-border rounded-lg p-3 hover:shadow-sm hover:border-indigo-200 dark:hover:border-indigo-700 transition-all cursor-pointer group">
        <div className="flex items-start gap-1.5 mb-2">
          <Flag size={12} className={cn("flex-shrink-0 mt-0.5", PRIORITY_COLORS[task.priority])} />
          <p className="text-sm font-medium leading-snug group-hover:text-indigo-600 transition-colors">{task.title}</p>
        </div>

        {task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {task.labels.map((l) => (
              <Badge key={l} variant="secondary" className="text-xs h-4 px-1.5">
                {l}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            {task.dueDate && (
              <span className={cn("flex items-center gap-0.5", isOverdue && "text-red-500")}>
                <Calendar size={10} />
                {format(new Date(task.dueDate), "MMM d")}
              </span>
            )}
            {task.comments.length > 0 && (
              <span className="flex items-center gap-0.5">
                <MessageSquare size={10} /> {task.comments.length}
              </span>
            )}
            {task.attachments.length > 0 && (
              <span className="flex items-center gap-0.5">
                <Paperclip size={10} /> {task.attachments.length}
              </span>
            )}
          </div>
          {assignee && (
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">
                {assignee.firstName[0]}{assignee.lastName[0]}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </div>
    </Link>
  );
}
