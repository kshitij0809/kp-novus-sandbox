"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { track } from "@/lib/pendo";
import { toast } from "sonner";

const INTEGRATIONS = [
  { id: "slack", name: "Slack", description: "Post task updates to Slack channels", icon: "💬" },
  { id: "github", name: "GitHub", description: "Link PRs and commits to tasks", icon: "🐙" },
  { id: "jira", name: "Jira", description: "Sync issues with Jira projects", icon: "📋" },
  { id: "google_calendar", name: "Google Calendar", description: "Add task due dates to your calendar", icon: "📅" },
  { id: "zapier", name: "Zapier", description: "Connect TaskPilot to 5000+ apps", icon: "⚡" },
  { id: "linear", name: "Linear", description: "Two-way sync with Linear issues", icon: "🔷" },
];

export default function IntegrationsSettingsPage() {
  const [connected, setConnected] = useState<Record<string, boolean>>({ slack: true });

  useEffect(() => {
    document.title = "TaskPilot — Integrations";
  }, []);

  const handleToggle = (id: string, value: boolean) => {
    setConnected({ ...connected, [id]: value });
    if (value) {
      // PENDO: integration connected
      track("integration_connected", { integration: id });
      toast.success(`${INTEGRATIONS.find((i) => i.id === id)?.name} connected`);
    } else {
      // PENDO: integration disconnected
      track("integration_disconnected", { integration: id });
      toast.success(`${INTEGRATIONS.find((i) => i.id === id)?.name} disconnected`);
    }
  };

  return (
    <div>
      <h2 className="font-semibold mb-4">Integrations</h2>
      <div className="space-y-3">
        {INTEGRATIONS.map((integration) => (
          <Card key={integration.id}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{integration.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-sm">{integration.name}</p>
                      {connected[integration.id] && (
                        <Badge className="h-4 px-1.5 text-xs bg-green-50 text-green-700 border-green-200">Connected</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground">{integration.description}</p>
                  </div>
                </div>
                <Switch
                  checked={connected[integration.id] ?? false}
                  onCheckedChange={(v) => handleToggle(integration.id, v)}
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
