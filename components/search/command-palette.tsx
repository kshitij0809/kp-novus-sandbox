"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Command, CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { useUIStore } from "@/store/ui-store";
import { useProjectsStore } from "@/store/projects-store";
import { LayoutDashboard, FolderKanban, Users, BarChart3, Settings, HelpCircle, CreditCard } from "lucide-react";
import { track } from "@/lib/pendo";

const STATIC_PAGES = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Reports", href: "/reports", icon: BarChart3 },
  { label: "Team", href: "/team", icon: Users },
  { label: "Settings", href: "/settings/profile", icon: Settings },
  { label: "Help & AI Assistant", href: "/help", icon: HelpCircle },
  { label: "Upgrade plan", href: "/upgrade", icon: CreditCard },
];

export function CommandPalette() {
  const { commandPaletteOpen, openCommandPalette, closeCommandPalette } = useUIStore();
  const { projects } = useProjectsStore();
  const router = useRouter();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        e.preventDefault();
        if (commandPaletteOpen) {
          closeCommandPalette();
        } else {
          openCommandPalette();
        }
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [commandPaletteOpen]);

  const navigate = (href: string, label: string) => {
    // PENDO: search performed via command palette
    track("search_performed", { result: label, source: "command_palette" });
    closeCommandPalette();
    router.push(href);
  };

  return (
    <CommandDialog open={commandPaletteOpen} onOpenChange={closeCommandPalette}>
      <CommandInput placeholder="Search pages, projects…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {STATIC_PAGES.map((page) => (
            <CommandItem key={page.href} onSelect={() => navigate(page.href, page.label)}>
              <page.icon size={14} className="mr-2" />
              {page.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandGroup heading="Projects">
          {projects
            .filter((p) => p.status === "active")
            .map((p) => (
              <CommandItem key={p.id} onSelect={() => navigate(`/projects/${p.id}`, p.name)}>
                <FolderKanban size={14} className="mr-2" />
                {p.name}
              </CommandItem>
            ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
