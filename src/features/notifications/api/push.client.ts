import { apiRequest } from "@/shared/lib/api-client";

// Browser side of Web Push: service worker registration, the PushManager
// subscription and its registration in the API (through the BFF).

const SW_URL = "/sw.js";

export type PushSupport = "supported" | "unsupported" | "needs-install";

/** Whether this browser can receive push (iPhone only as installed app). */
export function pushSupport(installed: boolean, ios: boolean): PushSupport {
  if (typeof window === "undefined") return "unsupported";
  const capable =
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window;
  if (capable) return "supported";
  return ios && !installed ? "needs-install" : "unsupported";
}

function base64UrlToBytes(value: string): Uint8Array<ArrayBuffer> {
  const padded = (value + "=".repeat((4 - (value.length % 4)) % 4))
    .replace(/-/g, "+")
    .replace(/_/g, "/");
  const raw = window.atob(padded);
  const bytes = new Uint8Array(new ArrayBuffer(raw.length));
  for (let index = 0; index < raw.length; index++) {
    bytes[index] = raw.charCodeAt(index);
  }
  return bytes;
}

async function registration(): Promise<ServiceWorkerRegistration> {
  await navigator.serviceWorker.register(SW_URL, {
    scope: "/",
    updateViaCache: "none",
  });
  return navigator.serviceWorker.ready;
}

export const pushClient = {
  /** The subscription of this device, if push is on here. */
  async current(): Promise<PushSubscription | null> {
    const existing = await navigator.serviceWorker.getRegistration("/");
    return (await existing?.pushManager.getSubscription()) ?? null;
  },

  /**
   * Asks for permission, subscribes this device and registers it in the API.
   * Returns false when the user denied the permission.
   */
  async enable(): Promise<boolean> {
    const { key } = await apiRequest<{ key: string | null }>("/push/key");
    if (!key) throw new Error("push-disabled");
    if ((await Notification.requestPermission()) !== "granted") return false;
    const worker = await registration();
    const subscription =
      (await worker.pushManager.getSubscription()) ??
      (await worker.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: base64UrlToBytes(key),
      }));
    await apiRequest("/push/subscribe", {
      method: "POST",
      body: JSON.stringify(subscription.toJSON()),
    });
    return true;
  },

  async disable(): Promise<void> {
    const subscription = await pushClient.current();
    if (!subscription) return;
    await apiRequest("/push/unsubscribe", {
      method: "POST",
      body: JSON.stringify({ endpoint: subscription.endpoint }),
    }).catch(() => undefined);
    await subscription.unsubscribe();
  },

  test: () => apiRequest<{ devices: number }>("/push/test", { method: "POST" }),
};
