"use client";

import { useState } from "react";
import { CheckCircle, Circle, X, ChevronDown, ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { setChecklistDismissed } from "@/lib/mock-api";
import Link from "next/link";

const CHECKLIST_ITEMS = [
  { id: "onboarding", label: "Complete onboarding", href: "/onboarding/welcome", done: true },
  { id: "create_project", label: "Create your first project", href: "/projects/new", done: false },
  { id: "invite_team", label: "Invite a teammate", href: "/team", done: false },
  { id: "create_task", label: "Create a task", href: "/projects", done: false },
  { id: "upgrade", label: "Explore Pro features", href: "/upgrade", done: false },
];

interface Props {
  onDismiss: () => void;
}

export function OnboardingChecklistWidget({ onDismiss }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const doneCnt = CHECKLIST_ITEMS.filter((i) => i.done).length;

  const handleDismiss = () => {
    setChecklistDismissed();
    onDismiss();
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-border rounded-xl shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div>
          <p className="text-sm font-semibold">Getting started</p>
          <p className="text-xs text-muted-foreground">
            {doneCnt} / {CHECKLIST_ITEMS.length} completed
          </p>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleDismiss}>
            <X size={14} />
          </Button>
        </div>
      </div>
      {!collapsed && (
        <div className="p-4 space-y-2">
          {CHECKLIST_ITEMS.map((item) => (
            <Link key={item.id} href={item.href}>
              <div className="flex items-center gap-2.5 py-1.5 hover:bg-accent rounded-lg px-2 -mx-2 transition-colors">
                {item.done ? (
                  <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                ) : (
                  <Circle size={16} className="text-muted-foreground flex-shrink-0" />
                )}
                <span className={`text-sm ${item.done ? "line-through text-muted-foreground" : ""}`}>
                  {item.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
