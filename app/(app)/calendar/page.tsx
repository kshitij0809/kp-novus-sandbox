"use client";

import { useEffect, useState } from "react";
import { useTasksStore } from "@/store/tasks-store";
import { useProjectsStore } from "@/store/projects-store";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { format, isSameDay } from "date-fns";
import Link from "next/link";

export default function CalendarPage() {
  const { tasks, load } = useTasksStore();
  const { projects } = useProjectsStore();
  const [selected, setSelected] = useState<Date | undefined>(new Date());

  useEffect(() => {
    document.title = "TaskPilot — Calendar";
    load();
  }, []);

  const tasksWithDates = tasks.filter((t) => t.dueDate);
  const tasksForDay = selected ? tasksWithDates.filter((t) => isSameDay(new Date(t.dueDate!), selected)) : [];

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold mb-6">Calendar</h1>
      <div className="flex gap-8 flex-wrap">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={setSelected}
          modifiers={{ hasTasks: (d) => tasksWithDates.some((t) => isSameDay(new Date(t.dueDate!), d)) }}
          modifiersStyles={{ hasTasks: { fontWeight: "bold", color: "#6366f1" } }}
          className="rounded-xl border border-border shadow-sm"
        />
        <div className="flex-1 min-w-60">
          {selected && (
            <>
              <h2 className="font-semibold mb-3">{format(selected, "EEEE, MMMM d")}</h2>
              {tasksForDay.length === 0 ? (
                <p className="text-sm text-muted-foreground">No tasks due on this day.</p>
              ) : (
                <div className="space-y-2">
                  {tasksForDay.map((t) => {
                    const project = projects.find((p) => p.id === t.projectId);
                    return (
                      <Link key={t.id} href={`/projects/${t.projectId}/tasks/${t.id}`}>
                        <div className="p-3 border border-border rounded-lg hover:bg-accent transition-colors flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.status === "done" ? "bg-green-500" : "bg-indigo-500"}`} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{t.title}</p>
                            <p className="text-xs text-muted-foreground">{project?.name}</p>
                          </div>
                          <Badge variant="secondary" className="text-xs capitalize flex-shrink-0">{t.status.replace("_", " ")}</Badge>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
