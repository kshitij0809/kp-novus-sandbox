"use client";

import { useEffect } from "react";
import { use } from "react";
import { notFound } from "next/navigation";
import { KanbanBoard } from "@/components/tasks/kanban-board";
import { ProjectViewSwitcher } from "@/components/projects/project-view-switcher";
import { NewTaskButton } from "@/components/tasks/new-task-button";
import { ShareLinkButton } from "@/components/shared/share-link-button";
import { useProjectsStore } from "@/store/projects-store";
import { useTasksStore } from "@/store/tasks-store";

interface Props {
  params: Promise<{ projectId: string }>;
}

export default function ProjectKanbanPage({ params }: Props) {
  const { projectId } = use(params);
  const { projects } = useProjectsStore();
  const { tasks, loadForProject } = useTasksStore();
  const project = projects.find((p) => p.id === projectId);

  useEffect(() => {
    if (project) document.title = `TaskPilot — ${project.name}`;
    loadForProject(projectId);
  }, [projectId, project]);

  if (projects.length > 0 && !project) notFound();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border px-6 py-3 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="font-bold text-lg">{project?.name}</h1>
          <p className="text-muted-foreground text-xs">{project?.description}</p>
        </div>
        <div className="flex items-center gap-2">
          <ProjectViewSwitcher projectId={projectId} />
          <ShareLinkButton />
          <NewTaskButton projectId={projectId} />
        </div>
      </div>
      {/* Board */}
      <div className="flex-1 overflow-hidden p-6">
        <KanbanBoard tasks={tasks} projectId={projectId} />
      </div>
    </div>
  );
}
