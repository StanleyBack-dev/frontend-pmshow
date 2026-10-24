// PM SHOW service worker: only Web Push. No caching — every page needs the
// server and a session, so there is nothing useful to serve offline.
/* global self */

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

// Payload sent by the API: { title, body, url, tag }.
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
      data: { url: data.url || "/notificacoes" },
    }),
  );
});

// Opens the notice in an app window that is already open, or a new one.
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = new URL(
    event.notification.data?.url || "/notificacoes",
    self.location.origin,
  );
  if (target.origin !== self.location.origin) return;
  event.waitUntil(
    self.clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((windows) => {
        const open = windows.find(
          (client) => new URL(client.url).origin === target.origin,
        );
        if (open) {
          return open.focus().then((client) => client.navigate(target.href));
        }
        return self.clients.openWindow(target.href);
      }),
  );
});
