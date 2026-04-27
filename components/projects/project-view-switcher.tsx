"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Kanban, List, Calendar, GanttChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { track } from "@/lib/pendo";
import { cn } from "@/lib/utils";
import { useFlag } from "@/lib/flags";

const VIEWS = [
  { id: "kanban", label: "Kanban", icon: Kanban, href: (id: string) => `/projects/${id}` },
  { id: "list", label: "List", icon: List, href: (id: string) => `/projects/${id}/list` },
  { id: "calendar", label: "Calendar", icon: Calendar, href: (id: string) => `/projects/${id}/calendar` },
  { id: "gantt", label: "Gantt", icon: GanttChart, href: (id: string) => `/projects/${id}/gantt` },
];

interface Props {
  projectId: string;
}

export function ProjectViewSwitcher({ projectId }: Props) {
  const pathname = usePathname();
  const ganttEnabled = useFlag("gantt_view_enabled");

  const getActiveView = () => {
    if (pathname.endsWith("/list")) return "list";
    if (pathname.endsWith("/calendar")) return "calendar";
    if (pathname.endsWith("/gantt")) return "gantt";
    return "kanban";
  };

  const activeView = getActiveView();

  return (
    <div className="flex items-center gap-1 bg-muted p-0.5 rounded-lg">
      {VIEWS.map((view) => {
        if (view.id === "gantt" && !ganttEnabled) return null;
        const isActive = activeView === view.id;
        return (
          <Link key={view.id} href={view.href(projectId)}>
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-7 px-2.5 gap-1.5 text-xs",
                isActive && "bg-background shadow-sm text-foreground hover:bg-background"
              )}
              onClick={() => {
                // PENDO: view changed
                track(`view_changed_to_${view.id}` as any, { project_id: projectId });
              }}
            >
              <view.icon size={13} />
              {view.label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}
