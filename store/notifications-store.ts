import { create } from "zustand";
import { Notification } from "@/types";
import * as api from "@/lib/mock-api";

interface NotificationsState {
  notifications: Notification[];
  unreadCount: number;
  load: (userId: string) => Promise<void>;
  markRead: (id: string) => Promise<void>;
  markAllRead: (userId: string) => Promise<void>;
}

export const useNotificationsStore = create<NotificationsState>((set, get) => ({
  notifications: [],
  unreadCount: 0,

  load: async (userId: string) => {
    const notifications = await api.getNotifications(userId);
    set({ notifications, unreadCount: notifications.filter((n) => !n.read).length });
  },

  markRead: async (id: string) => {
    await api.markNotificationRead(id);
    const updated = get().notifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    set({ notifications: updated, unreadCount: updated.filter((n) => !n.read).length });
  },

  markAllRead: async (userId: string) => {
    await api.markAllNotificationsRead(userId);
    const updated = get().notifications.map((n) => (n.userId === userId ? { ...n, read: true } : n));
    set({ notifications: updated, unreadCount: 0 });
  },
}));
