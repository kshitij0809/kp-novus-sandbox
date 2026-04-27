"use client";

import { Flag } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { TaskPriority } from "@/types";
import { cn } from "@/lib/utils";
import { track } from "@/lib/pendo";

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  low: "text-slate-400",
  medium: "text-yellow-500",
  high: "text-orange-500",
  urgent: "text-red-500",
};

interface Props {
  priority: TaskPriority;
  onChangePriority: (priority: TaskPriority) => void;
  compact?: boolean;
}

export function TaskPriorityFlagToggle({ priority, onChangePriority, compact }: Props) {
  const handleChange = (p: TaskPriority) => {
    // PENDO: task priority changed
    track("task_priority_changed", { from: priority, to: p });
    onChangePriority(p);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={cn("inline-flex items-center justify-center gap-1 rounded-md hover:bg-accent transition-colors", compact ? "h-7 w-7" : "h-7 px-2")}>
        <Flag size={12} className={PRIORITY_COLORS[priority]} />
        {!compact && <span className="text-xs capitalize">{priority}</span>}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {(["urgent", "high", "medium", "low"] as TaskPriority[]).map((p) => (
          <DropdownMenuItem key={p} onClick={() => handleChange(p)} className="gap-2">
            <Flag size={12} className={PRIORITY_COLORS[p]} />
            <span className="capitalize">{p}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
