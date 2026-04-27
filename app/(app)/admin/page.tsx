"use client";

import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/auth-store";
import { User, Role } from "@/types";
import { getUsers } from "@/lib/mock-api";
import { track } from "@/lib/pendo";
import { toast } from "sonner";

export default function AdminPage() {
  const { user } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    document.title = "TaskPilot — Admin";
    getUsers().then(setUsers);
  }, []);

  if (user?.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center h-full py-20">
        <Shield size={48} className="text-muted-foreground mb-4" />
        <h1 className="text-xl font-bold mb-2">Access denied</h1>
        <p className="text-muted-foreground text-sm">You don't have permission to view this page.</p>
      </div>
    );
  }

  const handleRoleChange = (userId: string, role: Role) => {
    setUsers(users.map((u) => (u.id === userId ? { ...u, role } : u)));
    // PENDO: team member role changed from admin
    track("team_member_role_changed", { user_id: userId, new_role: role, source: "admin" });
    toast.success("Role updated");
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Shield size={20} className="text-indigo-500" />
        <h1 className="text-2xl font-bold">Admin</h1>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Total users", value: users.length },
          { label: "Active projects", value: 5 },
          { label: "Monthly MRR", value: "$299" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="pt-4 pb-4">
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-bold mt-0.5">{s.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">User management</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 pb-3 font-medium text-muted-foreground">User</th>
                <th className="text-left py-2 pb-3 font-medium text-muted-foreground">Plan</th>
                <th className="text-left py-2 pb-3 font-medium text-muted-foreground w-32">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-b border-border/50 last:border-0">
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <Avatar className="h-7 w-7">
                        <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">
                          {u.firstName[0]}{u.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-xs">{u.firstName} {u.lastName}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">
                    <Badge variant={u.plan === "free" ? "outline" : "secondary"} className="text-xs capitalize">{u.plan}</Badge>
                  </td>
                  <td className="py-3">
                    <Select value={u.role} onValueChange={(v) => handleRoleChange(u.id, v as Role)}>
                      <SelectTrigger className="h-7 w-28 text-xs">
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
        </CardContent>
      </Card>
    </div>
  );
}
