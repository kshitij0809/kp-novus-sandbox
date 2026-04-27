"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User, Role } from "@/types";
import { getUsers } from "@/lib/mock-api";
import { track } from "@/lib/pendo";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";

export default function TeamPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");

  useEffect(() => {
    document.title = "TaskPilot — Team";
    getUsers().then(setUsers);
  }, []);

  const handleRoleChange = (userId: string, role: Role) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, role } : u)));
    // PENDO: team member role changed
    track("team_member_role_changed", { user_id: userId, new_role: role });
    toast.success("Role updated");
  };

  const handleInvite = () => {
    if (!inviteEmail.trim()) return;
    // PENDO: team member invited
    track("team_member_invited", { email: inviteEmail, source: "team_page" });
    toast.success(`Invite sent to ${inviteEmail}`);
    setInviteEmail("");
    setInviteOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Team</h1>
          <p className="text-muted-foreground text-sm mt-0.5">{users.length} members</p>
        </div>
        <Button onClick={() => setInviteOpen(true)} className="bg-indigo-600 hover:bg-indigo-700 gap-1.5">
          <UserPlus size={16} />
          Invite member
        </Button>
      </div>

      <div className="border border-border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50 border-b border-border">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Member</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Email</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground">Plan</th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground w-36">Role</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-b border-border/50 hover:bg-accent/50 transition-colors last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2.5">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">
                        {u.firstName[0]}{u.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span className="font-medium">{u.firstName} {u.lastName}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3">
                  <Badge variant={u.plan === "free" ? "outline" : "secondary"} className="capitalize">{u.plan}</Badge>
                </td>
                <td className="px-4 py-3">
                  <Select value={u.role} onValueChange={(v) => handleRoleChange(u.id, v as Role)}>
                    <SelectTrigger className="h-8 w-28 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="manager">Manager</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Invite modal */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Invite a team member</DialogTitle>
          </DialogHeader>
          <div>
            <Label htmlFor="inviteEmail">Email address</Label>
            <Input
              id="inviteEmail"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="colleague@company.io"
              className="mt-1"
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setInviteOpen(false)}>Cancel</Button>
            <Button onClick={handleInvite} className="bg-indigo-600 hover:bg-indigo-700">Send invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
