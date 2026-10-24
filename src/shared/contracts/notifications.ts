import type { NotificationType } from "@/shared/graphql/schema-enums";

export type { NotificationType };

export type AppNotification = {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  /** App path, e.g. /agenda/<id>. */
  link: string | null;
  readAt: string | null;
  createdAt: string;
};

export type NotificationPage = {
  items: AppNotification[];
  total: number;
  page: number;
  totalPages: number;
};

/** PushSubscription keys as the browser serializes them. */
export type PushSubscriptionInput = {
  endpoint: string;
  p256dh: string;
  auth: string;
};

export type NotificationPreference = {
  type: NotificationType;
  emailEnabled: boolean;
};
