import { apiRequest } from "@/shared/lib/api-client";
import type {
  NotificationPreference,
  NotificationType,
} from "@/shared/contracts/notifications";

export const notificationsClient = {
  unreadCount: () =>
    apiRequest<{ count: number }>("/notifications/unread-count"),

  markRead: (id: string) =>
    apiRequest<{ ok: true }>(`/notifications/${id}/read`, { method: "POST" }),

  markAllRead: () =>
    apiRequest<{ marked: number }>("/notifications/read-all", {
      method: "POST",
    }),

  setPreference: (type: NotificationType, emailEnabled: boolean) =>
    apiRequest<NotificationPreference>("/notifications/preferences", {
      method: "PUT",
      body: JSON.stringify({ type, emailEnabled }),
    }),
};
