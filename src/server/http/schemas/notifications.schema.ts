import "server-only";
import { z } from "zod";
import { enumLike } from "@/server/http/schemas/fields";
import type { NotificationType } from "@/shared/contracts/notifications";

export const notificationPreferenceSchema = z.object({
  type: enumLike<NotificationType>(),
  emailEnabled: z.boolean(),
});

/** PushSubscription.toJSON() from the browser. */
export const pushSubscriptionSchema = z.object({
  endpoint: z.url({ protocol: /^https$/ }).max(1000),
  keys: z.object({
    p256dh: z.string().min(20).max(200),
    auth: z.string().min(8).max(100),
  }),
});

export const pushEndpointSchema = z.object({
  endpoint: z.string().min(1).max(1000),
});
