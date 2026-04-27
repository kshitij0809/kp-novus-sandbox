"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Clock, FolderKanban, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OnboardingChecklistWidget } from "@/components/shared/onboarding-checklist-widget";
import { FeatureAnnouncementBanner } from "@/components/shared/feature-announcement-banner";
import { useAuthStore } from "@/store/auth-store";
import { useTasksStore } from "@/store/tasks-store";
import { useProjectsStore } from "@/store/projects-store";
import { getChecklistDismissed } from "@/lib/mock-api";
import { useFlag } from "@/lib/flags";
import { isAfter, subDays, startOfWeek, endOfWeek } from "date-fns";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { tasks, load: loadTasks } = useTasksStore();
  const { projects } = useProjectsStore();
  const [showChecklist, setShowChecklist] = useState(false);
  const showAIBanner = useFlag("ai_assistant_v2");
  const showPromoBanner = useFlag("promo_banner_q4");

  useEffect(() => {
    document.title = "TaskPilot — Dashboard";
    loadTasks();
    setShowChecklist(!getChecklistDismissed());
  }, []);

  const now = new Date();
  const weekStart = startOfWeek(now);
  const weekEnd = endOfWeek(now);

  const openTasks = tasks.filter((t) => t.status !== "done");
  const completedThisWeek = tasks.filter(
    (t) => t.completedAt && new Date(t.completedAt) >= weekStart && new Date(t.completedAt) <= weekEnd
  );
  const overdue = tasks.filter((t) => t.dueDate && t.status !== "done" && isAfter(now, new Date(t.dueDate)));
  const activeProjects = projects.filter((p) => p.status === "active");
  const recentTasks = [...tasks].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);

  const STATS = [
    { label: "Open tasks", value: openTasks.length, icon: Clock, color: "text-blue-500" },
    { label: "Completed this week", value: completedThisWeek.length, icon: CheckCircle2, color: "text-green-500" },
    { label: "Overdue", value: overdue.length, icon: AlertCircle, color: "text-red-500" },
    { label: "Active projects", value: activeProjects.length, icon: FolderKanban, color: "text-indigo-500" },
  ];

  return (
    <div className="flex flex-col h-full">
      {showAIBanner && (
        <FeatureAnnouncementBanner
          title="New: AI Assistant"
          body="Ask questions about your projects and get instant answers."
          ctaLabel="Try it"
          ctaHref="/help"
        />
      )}
      {showPromoBanner && (
        <FeatureAnnouncementBanner
          title="Q4 Special: 40% off Pro"
          body="Upgrade before Dec 31 and save big."
          ctaLabel="Upgrade"
          ctaHref="/upgrade"
        />
      )}

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-8">
          {/* Greeting */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-1">
              Good {getGreeting()}, {user?.firstName} 👋
            </h1>
            <p className="text-muted-foreground text-sm">Here's what's happening with your team today.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {STATS.map((stat) => (
                  <Card key={stat.label}>
                    <CardContent className="pt-4 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <stat.icon size={16} className={stat.color} />
                        <span className="text-xs text-muted-foreground">{stat.label}</span>
                      </div>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pinned Projects */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold">Active projects</h2>
                  <Link href="/projects">
                    <Button variant="ghost" size="sm" className="text-xs gap-1">
                      All projects <ArrowRight size={12} />
                    </Button>
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {activeProjects.slice(0, 4).map((p) => {
                    const pTasks = tasks.filter((t) => t.projectId === p.id);
                    const done = pTasks.filter((t) => t.status === "done").length;
                    const pct = pTasks.length > 0 ? Math.round((done / pTasks.length) * 100) : 0;
                    return (
                      <Link key={p.id} href={`/projects/${p.id}`}>
                        <Card className="hover:shadow-md transition-shadow cursor-pointer">
                          <CardContent className="pt-4 pb-4">
                            <p className="font-medium text-sm mb-1 truncate">{p.name}</p>
                            <p className="text-xs text-muted-foreground mb-3 line-clamp-1">{p.description}</p>
                            <div className="flex items-center justify-between text-xs text-muted-foreground">
                              <span>{pTasks.length} tasks</span>
                              <span>{pct}% done</span>
                            </div>
                            <div className="h-1 bg-muted rounded-full mt-2">
                              <div
                                className="h-1 bg-indigo-500 rounded-full transition-all"
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </CardContent>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h2 className="font-semibold mb-3">Recent activity</h2>
                <div className="space-y-2">
                  {recentTasks.map((t) => {
                    const project = projects.find((p) => p.id === t.projectId);
                    return (
                      <div key={t.id} className="flex items-center gap-3 py-2 border-b border-border/50 last:border-0">
                        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.status === "done" ? "bg-green-500" : t.status === "in_progress" ? "bg-blue-500" : "bg-slate-300"}`} />
                        <div className="flex-1 min-w-0">
                          <Link href={`/projects/${t.projectId}/tasks/${t.id}`}>
                            <p className="text-sm hover:text-indigo-600 transition-colors truncate">{t.title}</p>
                          </Link>
                          <p className="text-xs text-muted-foreground">{project?.name}</p>
                        </div>
                        <Badge variant="secondary" className="text-xs flex-shrink-0 capitalize">
                          {t.status.replace("_", " ")}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right rail */}
            <div className="space-y-4">
              {showChecklist && (
                <OnboardingChecklistWidget onDismiss={() => setShowChecklist(false)} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}
