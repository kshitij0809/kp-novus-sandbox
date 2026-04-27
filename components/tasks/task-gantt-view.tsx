"use client";

import { Task } from "@/types";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { format, differenceInDays, addDays } from "date-fns";

interface Props {
  tasks: Task[];
}

const STATUS_COLORS: Record<string, string> = {
  todo: "#94a3b8",
  in_progress: "#3b82f6",
  in_review: "#a855f7",
  done: "#22c55e",
};

export function TaskGanttView({ tasks }: Props) {
  const tasksWithDates = tasks.filter((t) => t.dueDate);
  const baseDate = new Date();

  const data = tasksWithDates.slice(0, 15).map((t) => {
    const start = differenceInDays(new Date(t.createdAt), baseDate);
    const end = differenceInDays(new Date(t.dueDate!), baseDate);
    return {
      name: t.title.slice(0, 30),
      start: Math.min(start, end),
      duration: Math.max(1, end - start),
      status: t.status,
    };
  });

  return (
    <div>
      <p className="text-sm text-muted-foreground mb-4">Days from today</p>
      <ResponsiveContainer width="100%" height={Math.max(300, data.length * 40)}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 0, right: 20, bottom: 0, left: 180 }}
        >
          <XAxis type="number" domain={["dataMin - 2", "dataMax + 2"]} tickFormatter={(v) => format(addDays(baseDate, v), "MMM d")} />
          <YAxis type="category" dataKey="name" width={170} tick={{ fontSize: 11 }} />
          <Tooltip
            formatter={(value, name, entry: any) => [
              `${entry.payload?.duration ?? value} days`,
              entry.payload?.status?.replace("_", " ") ?? String(name),
            ]}
          />
          <Bar dataKey="duration" isAnimationActive={false} radius={[3, 3, 3, 3]}>
            {data.map((entry, i) => (
              <Cell key={i} fill={STATUS_COLORS[entry.status] ?? "#6366f1"} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
