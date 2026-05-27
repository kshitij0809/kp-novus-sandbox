"use client";

import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { track } from "@/lib/pendo";

export default function AccountSettingsPage() {
  useEffect(() => {
    document.title = "TaskPilot — Account settings";
  }, []);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Company name</Label>
            <Input defaultValue="Acme Corp" className="mt-1" />
          </div>
          <div>
            <Label>Industry</Label>
            <Select defaultValue="software">
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="software">Software</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="healthcare">Healthcare</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Theme</Label>
            <Select defaultValue="system" onValueChange={(v) => {
              // PENDO: theme changed
              track("theme_changed", { theme: v });
            }}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button className="bg-indigo-600 hover:bg-indigo-700" onClick={() => {
            // PENDO: account settings saved
            track("account_settings_saved");
            toast.success("Account settings saved");
          }}>
            Save changes
          </Button>
        </CardContent>
      </Card>

      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-destructive text-base">Danger zone</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-3">Once you delete your account, all data will be permanently removed.</p>
          <Button variant="destructive" onClick={() => {
            // PENDO: account deletion attempted
            track("account_deletion_attempted");
            toast.error("Account deletion is disabled in demo mode");
          }}>
            Delete account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
