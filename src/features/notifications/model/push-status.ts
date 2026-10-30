"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useInstallState } from "@/features/install/model/install-store";
import {
  pushClient,
  pushSupport,
} from "@/features/notifications/api/push.client";

export type PushStatus = "loading" | "on" | "off" | "denied";

// One status for the whole page (settings card, sign-in invites): turning
// push on in one place updates the others.
let status: PushStatus = "loading";
let checking = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function setPushStatus(next: PushStatus) {
  status = next;
  for (const listener of listeners) listener();
}

function check() {
  if (checking || status !== "loading") return;
  checking = true;
  pushClient
    .current()
    .then((subscription) => {
      if (Notification.permission === "denied") setPushStatus("denied");
      else setPushStatus(subscription ? "on" : "off");
    })
    .catch(() => setPushStatus("off"))
    .finally(() => {
      checking = false;
    });
}

/**
 * Whether this device can receive push and whether it does: "on" (this
 * browser is subscribed), "off" (not yet) or "denied" (blocked in the
 * browser or system settings).
 */
export function usePushStatus() {
  const { ready, installed, ios } = useInstallState();
  const support = ready ? pushSupport(installed, ios) : null;
  const current = useSyncExternalStore(
    subscribe,
    () => status,
    () => "loading" as const,
  );

  useEffect(() => {
    if (support === "supported") check();
  }, [support]);

  return { support, status: current, setStatus: setPushStatus };
}

// "Agora não" on the invite: asked again after a week, on this browser.
const DISMISSED_KEY = "pms:push-invite-dismissed-at";
const ASK_AGAIN_MS = 7 * 24 * 60 * 60 * 1000;

function wasPushInviteDismissed(): boolean {
  try {
    const at = Number(window.localStorage.getItem(DISMISSED_KEY));
    return at > 0 && Date.now() - at < ASK_AGAIN_MS;
  } catch {
    return false;
  }
}

export function dismissPushInvite(): void {
  try {
    window.localStorage.setItem(DISMISSED_KEY, String(Date.now()));
  } catch {
    // Storage blocked: the invite just shows again next time.
  }
  for (const listener of listeners) listener();
}

/** Read on the client only: the server render never shows the invite. */
export function usePushInviteDismissed(): boolean {
  return useSyncExternalStore(subscribe, wasPushInviteDismissed, () => true);
}

/**
 * Whether the notifications invite is (or may soon be) on screen: the agenda
 * invite waits for it, one card at a time.
 */
export function usePushInvitePending(): boolean {
  const { support, status } = usePushStatus();
  const dismissed = usePushInviteDismissed();
  if (support === null) return true; // not known yet
  if (support !== "supported") return false;
  if (status === "loading") return true;
  return status !== "on" && !dismissed;
}
