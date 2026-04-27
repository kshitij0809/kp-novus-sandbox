"use client";

import Link from "next/link";
import { FolderKanban, Archive, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Project } from "@/types";
import { useProjectsStore } from "@/store/projects-store";
import { track } from "@/lib/pendo";
import { toast } from "sonner";

interface Props {
  project: Project;
  taskCount?: number;
  completedCount?: number;
}

export function ProjectCard({ project, taskCount = 0, completedCount = 0 }: Props) {
  const { updateProject } = useProjectsStore();
  const pct = taskCount > 0 ? Math.round((completedCount / taskCount) * 100) : 0;

  const handleArchive = async (e: React.MouseEvent) => {
    e.preventDefault();
    await updateProject(project.id, { status: "archived" });
    // PENDO: project archived
    track("project_archived", { project_id: project.id });
    toast.success(`"${project.name}" archived`);
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="pt-4 pb-4">
        <div className="flex items-start justify-between mb-3">
          <Link href={`/projects/${project.id}`} className="flex items-center gap-2 hover:text-indigo-600 transition-colors">
            <FolderKanban size={16} className="text-indigo-500 flex-shrink-0" />
            <span className="font-semibold text-sm truncate">{project.name}</span>
          </Link>
          <div className="flex items-center gap-1">
            <Badge variant={project.status === "active" ? "secondary" : "outline"} className="text-xs capitalize">
              {project.status}
            </Badge>
            <DropdownMenu>
              <DropdownMenuTrigger className="h-6 w-6 inline-flex items-center justify-center rounded opacity-0 group-hover:opacity-100 hover:bg-accent transition-colors">
                <MoreHorizontal size={14} />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); window.location.href = `/projects/${project.id}`; }}>
                  Open
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleArchive} className="text-muted-foreground">
                  <Archive size={12} className="mr-2" />
                  Archive
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
          <span>{taskCount} tasks</span>
          <span>{pct}% done</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full">
          <div className="h-1.5 bg-indigo-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
        </div>
      </CardContent>
    </Card>
  );
}
