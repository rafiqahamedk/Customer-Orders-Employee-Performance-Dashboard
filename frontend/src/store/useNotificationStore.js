import { create } from "zustand";
import { notificationsApi } from "../utils/api";

export const useNotificationStore = create((set, get) => ({
  notifications: [],
  loading: false,

  fetch: async () => {
    set({ loading: true });
    try {
      const notifications = await notificationsApi.getAll();
      set({ notifications, loading: false });
    } catch {
      set({ loading: false });
    }
  },

  markAllRead: async () => {
    await notificationsApi.markAllRead();
    set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) }));
  },

  markOneRead: async (id) => {
    await notificationsApi.markOneRead(id);
    set((s) => ({
      notifications: s.notifications.map((n) => n._id === id ? { ...n, read: true } : n),
    }));
  },

  unreadCount: () => get().notifications.filter((n) => !n.read).length,
}));
