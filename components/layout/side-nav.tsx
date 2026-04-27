"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Inbox,
  Calendar,
  BarChart3,
  Users,
  Settings,
  FolderKanban,
  Zap,
  ChevronDown,
  Plus,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useProjectsStore } from "@/store/projects-store";
import { useNotificationsStore } from "@/store/notifications-store";
import { useAuthStore } from "@/store/auth-store";
import { useState } from "react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/inbox", label: "Inbox", icon: Inbox },
  { href: "/calendar", label: "Calendar", icon: Calendar },
  { href: "/reports", label: "Reports", icon: BarChart3 },
];

export function SideNav() {
  const pathname = usePathname();
  const { projects } = useProjectsStore();
  const { unreadCount } = useNotificationsStore();
  const { user } = useAuthStore();
  const [projectsExpanded, setProjectsExpanded] = useState(true);
  const activeProjects = projects.filter((p) => p.status === "active").slice(0, 5);

  return (
    <aside className="w-60 flex-shrink-0 border-r border-border bg-background flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-4 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold text-lg">
          <Zap className="text-indigo-500" size={20} />
          TaskPilot
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href}>
            <div
              className={cn(
                "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === href || pathname.startsWith(href + "/")
                  ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon size={16} />
              <span className="flex-1">{label}</span>
              {label === "Inbox" && unreadCount > 0 && (
                <Badge className="h-4 min-w-4 px-1 text-xs bg-indigo-500 text-white border-0">
                  {unreadCount}
                </Badge>
              )}
            </div>
          </Link>
        ))}

        {/* Projects section */}
        <div className="pt-4">
          <button
            onClick={() => setProjectsExpanded(!projectsExpanded)}
            className="flex items-center gap-2 px-3 py-1 w-full text-xs font-semibold text-muted-foreground uppercase tracking-wider hover:text-foreground"
          >
            <ChevronDown
              size={12}
              className={cn("transition-transform", !projectsExpanded && "-rotate-90")}
            />
            Projects
            <Link href="/projects/new" className="ml-auto" onClick={(e) => e.stopPropagation()}>
              <Plus size={14} className="hover:text-foreground" />
            </Link>
          </button>

          {projectsExpanded && (
            <div className="mt-1 space-y-0.5">
              {activeProjects.map((p) => (
                <Link key={p.id} href={`/projects/${p.id}`}>
                  <div
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm transition-colors",
                      pathname.startsWith(`/projects/${p.id}`)
                        ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                  >
                    <FolderKanban size={14} />
                    <span className="truncate flex-1">{p.name}</span>
                  </div>
                </Link>
              ))}
              <Link href="/projects">
                <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                  <span className="text-xs">All projects →</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Bottom nav */}
        <div className="pt-4 space-y-0.5">
          <Link href="/team">
            <div className={cn("flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname === "/team" ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300" : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}>
              <Users size={16} />
              Team
            </div>
          </Link>
          {user?.role === "admin" && (
            <Link href="/admin">
              <div className={cn("flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === "/admin" ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300" : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}>
                <Shield size={16} />
                Admin
              </div>
            </Link>
          )}
          <Link href="/settings/profile">
            <div className={cn("flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
              pathname.startsWith("/settings") ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300" : "text-muted-foreground hover:text-foreground hover:bg-accent"
            )}>
              <Settings size={16} />
              Settings
            </div>
          </Link>
        </div>
      </nav>
    </aside>
  );
}
