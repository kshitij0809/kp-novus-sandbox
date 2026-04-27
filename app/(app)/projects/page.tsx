"use client";

import { useEffect, useState } from "react";
import { CreateProjectButton } from "@/components/projects/create-project-button";
import { ProjectCard } from "@/components/projects/project-card";
import { useProjectsStore } from "@/store/projects-store";
import { useTasksStore } from "@/store/tasks-store";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function ProjectsPage() {
  const { projects } = useProjectsStore();
  const { tasks, load: loadTasks } = useTasksStore();
  const [tab, setTab] = useState("active");

  useEffect(() => {
    document.title = "TaskPilot — Projects";
    loadTasks();
  }, []);

  const filtered = projects.filter((p) => p.status === (tab === "active" ? "active" : "archived"));

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{projects.filter((p) => p.status === "active").length} active projects</p>
        </div>
        <CreateProjectButton />
      </div>

      <Tabs value={tab} onValueChange={setTab} className="mb-6">
        <TabsList>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>
      </Tabs>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg mb-2">No {tab} projects</p>
          {tab === "active" && <p className="text-sm">Create your first project to get started.</p>}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => {
            const pTasks = tasks.filter((t) => t.projectId === p.id);
            const done = pTasks.filter((t) => t.status === "done").length;
            return (
              <ProjectCard key={p.id} project={p} taskCount={pTasks.length} completedCount={done} />
            );
          })}
        </div>
      )}
    </div>
  );
}
