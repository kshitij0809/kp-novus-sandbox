"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useProjectsStore } from "@/store/projects-store";
import { useNotificationsStore } from "@/store/notifications-store";
import { SideNav } from "./side-nav";
import { TopBar } from "./top-bar";
import { useUIStore } from "@/store/ui-store";
import { CommandPalette } from "@/components/search/command-palette";
import { KeyboardShortcutsModal } from "@/components/shared/keyboard-shortcuts-modal";
import { PendoIdentify } from "@/components/pendo/pendo-identify";
import { cn } from "@/lib/utils";
import { seedIfNeeded } from "@/lib/mock-api";

export function AppShell({ children }: { children: React.ReactNode }) {
  const { authenticated, signIn } = useAuthStore();
  const { load: loadProjects } = useProjectsStore();
  const { load: loadNotifications } = useNotificationsStore();
  const { sidebarOpen } = useUIStore();

  useEffect(() => {
    seedIfNeeded();
    if (!authenticated) {
      const savedId = typeof window !== "undefined" ? localStorage.getItem("tp_current_user_id") : null;
      signIn(savedId ? "alex@acmecorp.io" : "alex@acmecorp.io");
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      loadProjects();
      loadNotifications("user_current");
    }
  }, [authenticated]);

  return (
    <div className="h-screen flex overflow-hidden bg-background">
      <PendoIdentify />
      <div className={cn("transition-all duration-200", sidebarOpen ? "w-60" : "w-0 overflow-hidden")}>
        <SideNav />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
      <CommandPalette />
      <KeyboardShortcutsModal />
    </div>
  );
}
