"use client";

import { useState, useEffect } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { User } from "@/types";
import { getUsers } from "@/lib/mock-api";
import { track } from "@/lib/pendo";

interface Props {
  assigneeId: string | null;
  onAssign: (userId: string | null) => void;
}

export function TaskAssignDropdown({ assigneeId, onAssign }: Props) {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  const assignee = users.find((u) => u.id === assigneeId);
  const initials = assignee ? `${assignee.firstName[0]}${assignee.lastName[0]}` : null;

  const handleAssign = (userId: string | null) => {
    if (userId) {
      // PENDO: task assigned
      track("task_assigned", { user_id: userId });
    } else {
      // PENDO: task unassigned
      track("task_unassigned", { previous_assignee: assigneeId });
    }
    onAssign(userId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center gap-2 h-8 px-2 rounded-md text-sm hover:bg-accent transition-colors">
        {assignee ? (
          <>
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">{initials}</AvatarFallback>
            </Avatar>
            <span className="text-xs">{assignee.firstName}</span>
          </>
        ) : (
          <>
            <UserPlus size={14} />
            <span className="text-xs text-muted-foreground">Assign</span>
          </>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleAssign(null)}>Unassign</DropdownMenuItem>
        {users.map((u) => (
          <DropdownMenuItem key={u.id} onClick={() => handleAssign(u.id)} className="gap-2">
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">
                {u.firstName[0]}{u.lastName[0]}
              </AvatarFallback>
            </Avatar>
            {u.firstName} {u.lastName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
