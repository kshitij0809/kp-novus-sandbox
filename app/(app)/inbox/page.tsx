"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useTasksStore } from "@/store/tasks-store";
import { useAuthStore } from "@/store/auth-store";
import { useProjectsStore } from "@/store/projects-store";
import { TaskStatusBadge } from "@/components/tasks/task-status-badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { track } from "@/lib/pendo";
import { isAfter } from "date-fns";

export default function InboxPage() {
  const { tasks, load } = useTasksStore();
  const { user } = useAuthStore();
  const { projects } = useProjectsStore();
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    document.title = "TaskPilot — Inbox";
    load();
  }, []);

  const myTasks = tasks.filter((t) => t.assigneeId === user?.id);
  const filtered = myTasks.filter((t) => {
    if (filter === "overdue") return t.dueDate && t.status !== "done" && isAfter(new Date(), new Date(t.dueDate));
    if (filter === "active") return t.status !== "done";
    if (filter === "done") return t.status === "done";
    return true;
  });

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">My Tasks</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{myTasks.length} tasks assigned to you</p>
        </div>
        <Select value={filter} onValueChange={(v) => {
          if (v) {
            if (v === "all" && filter !== "all") {
              // PENDO: filter cleared on inbox
              track("filter_cleared", { source: "inbox", previous_filter: filter });
            } else {
              // PENDO: filter applied on inbox
              track("filter_applied", { source: "inbox", filter: v });
            }
            setFilter(v);
          }
        }}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="done">Done</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg mb-1">Nothing here!</p>
          <p className="text-sm">Tasks assigned to you will show up here.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((t) => {
            const project = projects.find((p) => p.id === t.projectId);
            return (
              <Link key={t.id} href={`/projects/${t.projectId}/tasks/${t.id}`}>
                <div className="flex items-center gap-3 p-4 border border-border rounded-xl hover:bg-accent transition-colors">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{t.title}</p>
                    <p className="text-xs text-muted-foreground">{project?.name}</p>
                  </div>
                  <TaskStatusBadge status={t.status} />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
