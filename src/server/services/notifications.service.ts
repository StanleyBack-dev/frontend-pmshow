import "server-only";
import { backendGraphql } from "@/server/graphql/client";
import {
  markAllNotificationsReadDocument,
  markNotificationReadDocument,
  myNotificationsDocument,
  notificationPreferencesDocument,
  setNotificationPreferenceDocument,
  unreadNotificationsCountDocument,
} from "@/server/graphql/operations/notifications.operations";
import type {
  NotificationPage,
  NotificationPreference,
  NotificationType,
} from "@/shared/contracts/notifications";

export const notificationsService = {
  async list(
    token: string,
    unreadOnly: boolean,
    page: number,
  ): Promise<NotificationPage> {
    const { myNotifications } = await backendGraphql(myNotificationsDocument, {
      token,
      variables: { unreadOnly, page: { page, limit: 20 } },
    });
    return myNotifications;
  },

  async unreadCount(token: string): Promise<number> {
    const { unreadNotificationsCount } = await backendGraphql(
      unreadNotificationsCountDocument,
      { token },
    );
    return unreadNotificationsCount;
  },

  async markRead(token: string, id: string): Promise<void> {
    await backendGraphql(markNotificationReadDocument, {
      token,
      variables: { id },
    });
  },

  async markAllRead(token: string): Promise<number> {
    const { markAllNotificationsRead } = await backendGraphql(
      markAllNotificationsReadDocument,
      { token },
    );
    return markAllNotificationsRead;
  },

  async preferences(token: string): Promise<NotificationPreference[]> {
    const { myNotificationPreferences } = await backendGraphql(
      notificationPreferencesDocument,
      { token },
    );
    return myNotificationPreferences;
  },

  async setPreference(
    token: string,
    type: NotificationType,
    emailEnabled: boolean,
  ): Promise<NotificationPreference> {
    const { setNotificationPreference } = await backendGraphql(
      setNotificationPreferenceDocument,
      { token, variables: { type, emailEnabled } },
    );
    return setNotificationPreference;
  },
};
