"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { track } from "@/lib/pendo";
import { toast } from "sonner";

const NOTIFICATION_SETTINGS = [
  { id: "email_task_assigned", label: "Task assigned to me", channel: "email", defaultValue: true },
  { id: "email_comment", label: "New comment on my tasks", channel: "email", defaultValue: true },
  { id: "email_due_soon", label: "Task due soon", channel: "email", defaultValue: false },
  { id: "email_weekly_digest", label: "Weekly digest", channel: "email", defaultValue: true },
  { id: "inapp_task_assigned", label: "Task assigned to me", channel: "in-app", defaultValue: true },
  { id: "inapp_comment", label: "New comment", channel: "in-app", defaultValue: true },
  { id: "inapp_mention", label: "@mention", channel: "in-app", defaultValue: true },
  { id: "slack_task_completed", label: "Task completed", channel: "slack", defaultValue: false },
  { id: "slack_project_updates", label: "Project updates", channel: "slack", defaultValue: false },
];

export default function NotificationsSettingsPage() {
  const [settings, setSettings] = useState<Record<string, boolean>>({});

  useEffect(() => {
    document.title = "TaskPilot — Notifications";
    const initial: Record<string, boolean> = {};
    NOTIFICATION_SETTINGS.forEach((s) => (initial[s.id] = s.defaultValue));
    setSettings(initial);
  }, []);

  const handleToggle = (id: string, value: boolean) => {
    setSettings({ ...settings, [id]: value });
    const setting = NOTIFICATION_SETTINGS.find((s) => s.id === id);
    // PENDO: notification setting changed
    track("notification_setting_changed", { setting: id, channel: setting?.channel, enabled: value });
    toast.success(`${setting?.label} ${value ? "enabled" : "disabled"}`);
  };

  const channels = ["email", "in-app", "slack"];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {channels.map((channel) => {
          const channelSettings = NOTIFICATION_SETTINGS.filter((s) => s.channel === channel);
          return (
            <div key={channel}>
              <h3 className="font-semibold text-sm capitalize mb-3">{channel} notifications</h3>
              <div className="space-y-3">
                {channelSettings.map((s) => (
                  <div key={s.id} className="flex items-center justify-between">
                    <Label htmlFor={s.id} className="text-sm cursor-pointer">{s.label}</Label>
                    <Switch
                      id={s.id}
                      checked={settings[s.id] ?? s.defaultValue}
                      onCheckedChange={(v) => handleToggle(s.id, v)}
                    />
                  </div>
                ))}
              </div>
              <Separator className="mt-4" />
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
