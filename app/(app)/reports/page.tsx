"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ExportButton } from "@/components/shared/export-button";
import { useTasksStore } from "@/store/tasks-store";
import { GOALS } from "@/lib/goals";
import { track } from "@/lib/pendo";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, Legend, Cell,
} from "recharts";
import { subDays, format } from "date-fns";

function generateCompletionData() {
  return Array.from({ length: 12 }, (_, i) => ({
    week: format(subDays(new Date(), (11 - i) * 7), "MMM d"),
    completed: Math.floor(Math.random() * 15 + 5),
    created: Math.floor(Math.random() * 18 + 6),
  }));
}

function generateVelocityData() {
  return Array.from({ length: 8 }, (_, i) => ({
    sprint: `Sprint ${i + 1}`,
    points: Math.floor(Math.random() * 20 + 25),
  }));
}

const completionData = generateCompletionData();
const velocityData = generateVelocityData();

export default function ReportsPage() {
  const { tasks, load } = useTasksStore();
  const [reportRange, setReportRange] = useState("30d");

  useEffect(() => {
    document.title = "TaskPilot — Reports";
    load();
    // PENDO: report viewed
    track("report_viewed", { report: "overview" });
  }, []);

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const overdueTasks = tasks.filter((t) => t.dueDate && t.status !== "done" && new Date() > new Date(t.dueDate)).length;

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Reports</h1>
          <p className="text-muted-foreground text-sm mt-0.5">Team performance and project health</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={reportRange} onValueChange={(v) => {
            setReportRange(v);
            // PENDO: report filter changed
            track("report_filter_changed", { filter: "range", report: "overview", value: v });
          }}>
            <SelectTrigger className="w-28 h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <ExportButton label="Export report" eventName="report_exported" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Completion rate", value: `${completionRate}%`, sub: `${completedTasks}/${totalTasks} tasks` },
              { label: "Overdue tasks", value: overdueTasks, sub: "need attention" },
              { label: "Avg velocity", value: "32 pts", sub: "per sprint" },
            ].map((s) => (
              <Card key={s.label}>
                <CardContent className="pt-4 pb-4">
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-bold mt-0.5">{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.sub}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Completion Rate Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Task Completion Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={completionData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Legend />
                  <Area type="monotone" dataKey="completed" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} name="Completed" />
                  <Area type="monotone" dataKey="created" stroke="#94a3b8" fill="#94a3b8" fillOpacity={0.1} name="Created" />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Velocity Chart */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Sprint Velocity</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={velocityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis dataKey="sprint" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Bar dataKey="points" name="Story points" radius={[4, 4, 0, 0]}>
                    {velocityData.map((_, i) => (
                      <Cell key={i} fill="#6366f1" fillOpacity={0.7 + (i % 3) * 0.1} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Goals Panel */}
        <div>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {GOALS.map((goal) => {
                const isDecreasing = "direction" in goal && goal.direction === "decrease";
                let pct: number;
                if (typeof goal.currentValue === "number" && typeof goal.target === "number") {
                  if (isDecreasing) {
                    pct = Math.round(((goal.target / goal.currentValue) * 100));
                  } else if (goal.target > 1) {
                    pct = Math.min(100, Math.round((goal.currentValue / goal.target) * 100));
                  } else {
                    pct = Math.min(100, Math.round((goal.currentValue / goal.target) * 100));
                  }
                } else {
                  pct = 0;
                }
                const onTrack = pct >= 80;
                return (
                  <div key={goal.id}>
                    <p className="text-xs font-medium mb-1 leading-snug">{goal.name}</p>
                    <div className="flex items-center gap-2">
                      <Progress value={pct} className="h-1.5 flex-1" />
                      <span className={`text-xs font-semibold flex-shrink-0 ${onTrack ? "text-green-600" : "text-orange-500"}`}>
                        {pct}%
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {typeof goal.currentValue === "number" && goal.target > 1
                        ? `${goal.currentValue.toLocaleString()} / ${goal.target.toLocaleString()}`
                        : `${Math.round((goal.currentValue as number) * 100)}% / ${Math.round(goal.target * 100)}%`}
                    </p>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
