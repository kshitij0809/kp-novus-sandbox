"use client";

import { useEffect } from "react";
import { use } from "react";
import { TaskCalendarView } from "@/components/tasks/task-calendar-view";
import { ProjectViewSwitcher } from "@/components/projects/project-view-switcher";
import { useProjectsStore } from "@/store/projects-store";
import { useTasksStore } from "@/store/tasks-store";

interface Props {
  params: Promise<{ projectId: string }>;
}

export default function ProjectCalendarPage({ params }: Props) {
  const { projectId } = use(params);
  const { projects } = useProjectsStore();
  const { tasks, loadForProject } = useTasksStore();
  const project = projects.find((p) => p.id === projectId);

  useEffect(() => {
    if (project) document.title = `TaskPilot — ${project.name} · Calendar`;
    loadForProject(projectId);
  }, [projectId, project]);

  return (
    <div className="flex flex-col h-full">
      <div className="border-b border-border px-6 py-3 flex items-center justify-between flex-shrink-0">
        <h1 className="font-bold text-lg">{project?.name}</h1>
        <ProjectViewSwitcher projectId={projectId} />
      </div>
      <div className="flex-1 overflow-y-auto px-6 py-6">
        <TaskCalendarView tasks={tasks} projectId={projectId} />
      </div>
    </div>
  );
}
