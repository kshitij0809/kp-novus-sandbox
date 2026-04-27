"use client";

import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { useNotificationsStore } from "@/store/notifications-store";
import { useAuthStore } from "@/store/auth-store";
import { track } from "@/lib/pendo";
import { formatDistanceToNow } from "date-fns";

export function NotificationsBell() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotificationsStore();
  const { user } = useAuthStore();

  const handleOpen = () => {
    // PENDO: notifications panel opened
    track("notifications_opened", { unread_count: unreadCount });
  };

  const handleMarkAllRead = () => {
    if (!user) return;
    // PENDO: all notifications marked read
    track("notifications_marked_all_read");
    markAllRead(user.id);
  };

  const handleNotificationClick = (id: string) => {
    // PENDO: notification clicked
    track("notification_clicked", { notification_id: id });
    markRead(id);
  };

  return (
    <Popover onOpenChange={(open) => open && handleOpen()}>
      <PopoverTrigger className="relative inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors">
        <Bell size={16} />
        {unreadCount > 0 && (
          <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-xs bg-indigo-500 text-white border-0 pointer-events-none">
            {unreadCount}
          </Badge>
        )}
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="font-semibold text-sm">Notifications</span>
          {unreadCount > 0 && (
            <button onClick={handleMarkAllRead} className="text-xs text-indigo-600 hover:underline">
              Mark all read
            </button>
          )}
        </div>
        <div className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">No notifications</p>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                onClick={() => handleNotificationClick(n.id)}
                className={`w-full text-left px-4 py-3 border-b border-border/50 hover:bg-accent transition-colors ${!n.read ? "bg-indigo-50/50 dark:bg-indigo-500/5" : ""}`}
              >
                <div className="flex items-start gap-2">
                  {!n.read && <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0" />}
                  <div className={!n.read ? "" : "ml-3.5"}>
                    <p className="text-sm">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
