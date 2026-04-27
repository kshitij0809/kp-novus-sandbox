"use client";

import { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useUIStore } from "@/store/ui-store";

const SHORTCUTS = [
  { keys: "⌘K", description: "Open command palette" },
  { keys: "⌘/", description: "Open keyboard shortcuts" },
  { keys: "⌘B", description: "Toggle sidebar" },
  { keys: "N", description: "New task (on project page)" },
  { keys: "P", description: "New project" },
  { keys: "Esc", description: "Close dialog / panel" },
];

export function KeyboardShortcutsModal() {
  const { keyboardShortcutsOpen, openKeyboardShortcuts, closeKeyboardShortcuts, toggleSidebar } = useUIStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "/" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        keyboardShortcutsOpen ? closeKeyboardShortcuts() : openKeyboardShortcuts();
      }
      if (e.key === "b" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSidebar();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [keyboardShortcutsOpen]);

  return (
    <Dialog open={keyboardShortcutsOpen} onOpenChange={closeKeyboardShortcuts}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Keyboard shortcuts</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {SHORTCUTS.map((s) => (
            <div key={s.keys} className="flex items-center justify-between text-sm py-1">
              <span className="text-muted-foreground">{s.description}</span>
              <kbd className="bg-muted px-2 py-0.5 rounded text-xs font-mono">{s.keys}</kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
