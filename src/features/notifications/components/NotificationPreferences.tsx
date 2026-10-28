"use client";

import { useState } from "react";
import { notificationsClient } from "@/features/notifications/api/notifications.client";
import { NOTIFICATION_TYPE_LABELS } from "@/features/notifications/model/notification-labels";
import type { NotificationPreference } from "@/shared/contracts/notifications";
import { ApiClientError } from "@/shared/lib/api-client";
import { useToast } from "@/shared/toast/useToast";

// Which notices also go by e-mail. In the app they always show up.
export function NotificationPreferences({
  initial,
}: {
  initial: NotificationPreference[];
}) {
  const [preferences, setPreferences] = useState(initial);
  const { showError } = useToast();

  async function toggle(preference: NotificationPreference) {
    const emailEnabled = !preference.emailEnabled;
    const apply = (value: boolean) =>
      setPreferences((current) =>
        current.map((item) =>
          item.type === preference.type
            ? { ...item, emailEnabled: value }
            : item,
        ),
      );
    apply(emailEnabled);
    try {
      await notificationsClient.setPreference(preference.type, emailEnabled);
    } catch (cause) {
      apply(!emailEnabled);
      showError(
        cause instanceof ApiClientError ? cause.message : "Não foi possível.",
      );
    }
  }

  return (
    <div className="space-y-3">
      <ul className="divide-y divide-border">
        {preferences.map((preference) => {
          const meta = NOTIFICATION_TYPE_LABELS[preference.type];
          const id = `pref-${preference.type}`;
          return (
            <li key={preference.type} className="flex items-start gap-3 py-2.5">
              <label
                htmlFor={id}
                className="min-w-0 flex-1 cursor-pointer text-sm"
              >
                <span className="block font-medium text-fg">{meta.label}</span>
                <span className="block text-xs text-soft">
                  {meta.description}
                </span>
              </label>
              <input
                id={id}
                type="checkbox"
                className="mt-1 size-4 accent-[var(--accent)]"
                checked={preference.emailEnabled}
                onChange={() => void toggle(preference)}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
