// PM SHOW service worker: only Web Push. No caching — every page needs the
// server and a session, so there is nothing useful to serve offline.
/* global self */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Payload sent by the API: { title, body, url, tag, actions?, eventId? }.
// Buttons show where the browser supports them (Chrome, Edge, Firefox); on
// Safari a tap opens the page as before.
self.addEventListener("push", (event) => {
  if (!event.data) return;
  let data;
  try {
    data = event.data.json();
  } catch {
    data = { title: "PM SHOW", body: event.data.text() };
  }
  event.waitUntil(
    self.registration.showNotification(data.title || "PM SHOW", {
      body: data.body || "",
      icon: "/pwa-icon/192",
      badge: "/pwa-icon/192",
      tag: data.tag,
      renotify: Boolean(data.tag),
      lang: "pt-BR",
      actions: Array.isArray(data.actions) ? data.actions.slice(0, 2) : [],
      data: { url: data.url || "/notificacoes", eventId: data.eventId },
    }),
  );
});

// "Estou ciente" straight from the notification: the session cookie of this
// device goes with the request (the app's BFF refreshes it when needed).
async function acknowledge(notification) {
  const { eventId, url } = notification.data || {};
  try {
    const response = await fetch(`/api/events/${eventId}/roster/ack`, {
      method: "POST",
      credentials: "same-origin",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ answer: "CIENTE", note: null }),
    });
    if (!response.ok) throw new Error(String(response.status));
    await self.registration.showNotification("Ciência confirmada", {
      body: notification.title,
      icon: "/pwa-icon/192",
      badge: "/pwa-icon/192",
      tag: notification.tag,
      lang: "pt-BR",
      data: { url },
    });
  } catch {
    // Signed out or offline: open the event to answer there.
    await openPage(url);
  }
}

// Opens a page in an app window that is already open, or a new one.
function openPage(url) {
  const target = new URL(url || "/notificacoes", self.location.origin);
  if (target.origin !== self.location.origin) return Promise.resolve();
  return self.clients
    .matchAll({ type: "window", includeUncontrolled: true })
    .then((windows) => {
      const open = windows.find(
        (client) => new URL(client.url).origin === target.origin,
      );
      if (open) {
        return open.focus().then((client) => client.navigate(target.href));
      }
      return self.clients.openWindow(target.href);
    });
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "ack" && event.notification.data?.eventId) {
    event.waitUntil(acknowledge(event.notification));
    return;
  }
  // "Ver evento" or a tap on the notification itself.
  event.waitUntil(openPage(event.notification.data?.url));
});
