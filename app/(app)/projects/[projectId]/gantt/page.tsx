"use client";

import { useEffect } from "react";
import { use } from "react";
import Link from "next/link";
import { TaskGanttView } from "@/components/tasks/task-gantt-view";
import { ProjectViewSwitcher } from "@/components/projects/project-view-switcher";
import { useProjectsStore } from "@/store/projects-store";
import { useTasksStore } from "@/store/tasks-store";
import { useFlag } from "@/lib/flags";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface Props {
  params: Promise<{ projectId: string }>;
}

export default function ProjectGanttPage({ params }: Props) {
  const { projectId } = use(params);
  const { projects } = useProjectsStore();
  const { tasks, loadForProject } = useTasksStore();
  const project = projects.find((p) => p.id === projectId);
  const ganttEnabled = useFlag("gantt_view_enabled");

  useEffect(() => {
    if (project) document.title = `TaskPilot — ${project.name} · Gantt`;
    loadForProject(projectId);
  }, [projectId, project]);

  if (!ganttEnabled) {
    return (
      <div className="flex flex-col h-full">
        <div className="border-b border-border px-6 py-3 flex items-center justify-between flex-shrink-0">
          <h1 className="font-bold text-lg">{project?.name}</h1>
          <ProjectViewSwitcher projectId={projectId} />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-4xl mb-4">🚧</p>
            <h2 className="text-xl font-bold mb-2">Gantt view coming soon</h2>
            <p className="text-muted-foreground text-sm mb-6">This feature is in development. Upgrade to Pro for early access.</p>
            <div className="flex gap-3 justify-center">
              <Link href={`/projects/${projectId}`}>
                <Button variant="outline" className="gap-1.5">
                  <ArrowLeft size={14} />
                  Back to Kanban
                </Button>
              </Link>
              <Link href="/upgrade">
                <Button className="bg-indigo-600 hover:bg-indigo-700">Upgrade to Pro</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border px-6 py-3 flex items-center justify-between flex-shrink-0">
        <h1 className="font-bold text-lg">{project?.name}</h1>
        <ProjectViewSwitcher projectId={projectId} />
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <TaskGanttView tasks={tasks} />
      </div>
    </div>
  );
}
