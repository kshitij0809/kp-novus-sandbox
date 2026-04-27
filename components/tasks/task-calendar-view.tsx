"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Task } from "@/types";
import { format, isSameDay } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

interface Props {
  tasks: Task[];
  projectId: string;
}

export function TaskCalendarView({ tasks, projectId }: Props) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const tasksWithDueDates = tasks.filter((t) => t.dueDate);

  const tasksForDay = selectedDate
    ? tasksWithDueDates.filter((t) => isSameDay(new Date(t.dueDate!), selectedDate))
    : [];

  const hasTasks = (date: Date) =>
    tasksWithDueDates.some((t) => isSameDay(new Date(t.dueDate!), date));

  return (
    <div className="flex gap-6">
      <div>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          modifiers={{ hasTasks: (date) => hasTasks(date) }}
          modifiersStyles={{
            hasTasks: { fontWeight: "bold", textDecoration: "underline", color: "var(--color-indigo-600)" },
          }}
        />
      </div>
      <div className="flex-1">
        {selectedDate && (
          <>
            <h3 className="font-semibold mb-3 text-sm">{format(selectedDate, "MMMM d, yyyy")}</h3>
            {tasksForDay.length === 0 ? (
              <p className="text-sm text-muted-foreground">No tasks due on this date.</p>
            ) : (
              <div className="space-y-2">
                {tasksForDay.map((t) => (
                  <Link key={t.id} href={`/projects/${projectId}/tasks/${t.id}`}>
                    <div className="flex items-center gap-2 p-3 border border-border rounded-lg hover:bg-accent transition-colors">
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.status === "done" ? "bg-green-500" : "bg-indigo-500"}`} />
                      <span className="text-sm flex-1">{t.title}</span>
                      <Badge variant="secondary" className="text-xs capitalize">{t.status.replace("_", " ")}</Badge>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
