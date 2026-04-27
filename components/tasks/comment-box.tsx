"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Task } from "@/types";
import { useTasksStore } from "@/store/tasks-store";
import { useAuthStore } from "@/store/auth-store";
import { SEED_USERS } from "@/lib/seed";
import { track } from "@/lib/pendo";
import { formatDistanceToNow } from "date-fns";

interface Props {
  task: Task;
}

export function CommentBox({ task }: Props) {
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { addComment } = useTasksStore();
  const { user } = useAuthStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim() || !user) return;
    setSubmitting(true);
    await addComment(task.id, user.id, body.trim());
    // PENDO: task commented
    track("task_commented", { task_id: task.id, project_id: task.projectId });
    setBody("");
    setSubmitting(false);
  };

  return (
    <div>
      <h3 className="font-semibold text-sm mb-3">Comments ({task.comments.length})</h3>
      <div className="space-y-3 mb-4">
        {task.comments.map((c) => {
          const author = SEED_USERS.find((u) => u.id === c.userId);
          return (
            <div key={c.id} className="flex gap-2.5">
              <Avatar className="h-7 w-7 flex-shrink-0">
                <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">
                  {author ? `${author.firstName[0]}${author.lastName[0]}` : "?"}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 bg-muted/40 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-medium">{author?.firstName} {author?.lastName}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(c.at), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm">{c.body}</p>
              </div>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2.5">
        <Avatar className="h-7 w-7 flex-shrink-0">
          <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700">
            {user ? `${user.firstName[0]}${user.lastName[0]}` : "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Add a comment…"
            className="resize-none text-sm"
            rows={2}
          />
          <div className="flex justify-end mt-1.5">
            <Button type="submit" size="sm" className="bg-indigo-600 hover:bg-indigo-700 h-7 px-3 text-xs" disabled={!body.trim() || submitting}>
              {submitting ? "Posting…" : "Post"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
