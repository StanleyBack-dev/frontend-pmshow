"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCheck } from "lucide-react";
import { Button, cn } from "@/design-system";
import { notificationsClient } from "@/features/notifications/api/notifications.client";
import { formatWhen } from "@/features/notifications/model/notification-labels";
import type { AppNotification } from "@/shared/contracts/notifications";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

// Opening a notification marks it read and goes to what it is about.
export function NotificationList({
  notifications,
  now,
}: {
  notifications: AppNotification[];
  /** Request time from the server, so "há 5 min" is stable on render. */
  now: string;
}) {
  const router = useRouter();
  const { showError } = useToast();
  const [pending, setPending] = useState(false);
  const reference = new Date(now);
  const unread = notifications.some((item) => !item.readAt);

  async function open(item: AppNotification) {
    if (!item.readAt) {
      await notificationsClient.markRead(item.id).catch(() => undefined);
    }
    if (item.link) router.push(item.link);
    router.refresh();
  }

  async function markAll() {
    setPending(true);
    try {
      await notificationsClient.markAllRead();
      router.refresh();
    } catch (cause) {
      showError(
        cause instanceof ApiClientError ? cause.message : "Não foi possível.",
      );
    }
    setPending(false);
  }

  return (
    <div className="space-y-3">
      {unread && (
        <div className="flex justify-end">
          <Button
            variant="ghost"
            size="sm"
            icon={<CheckCheck className="size-4" />}
            loading={pending}
            onClick={markAll}
          >
            Marcar todas como lidas
          </Button>
        </div>
      )}
      <ul className="divide-y divide-border rounded-lg border border-border">
        {notifications.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => void open(item)}
              className={cn(
                "flex w-full gap-3 px-3 py-3 text-left text-sm transition-colors hover:bg-surface-muted",
                !item.readAt && "bg-accent-soft/40",
              )}
            >
              <span
                aria-hidden
                className={cn(
                  "mt-1.5 size-2 shrink-0 rounded-full",
                  item.readAt ? "bg-transparent" : "bg-accent",
                )}
              />
              <span className="min-w-0 flex-1">
                <span
                  className={cn(
                    "block text-fg",
                    !item.readAt && "font-semibold",
                  )}
                >
                  {item.title}
                </span>
                {item.body && (
                  <span className="block text-muted first-letter:uppercase">
                    {item.body}
                  </span>
                )}
              </span>
              <span className="shrink-0 text-xs text-soft">
                {formatWhen(item.createdAt, reference)}
              </span>
              {!item.readAt && <span className="sr-only">(não lida)</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
