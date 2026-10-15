// Firebase Cloud Messaging Background Service Worker for BrewBook
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', (event) => {
  if (event.data) {
    try {
      const data = event.data.json();
      const notificationTitle = data.notification?.title || data.title || 'BrewBook Alert ☕';
      const notificationOptions = {
        body: data.notification?.body || data.body || 'New coffee recipes and barista leaderboard updates!',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        data: {
          url: data.data?.url || data.url || '/'
        }
      };
      event.waitUntil(self.registration.showNotification(notificationTitle, notificationOptions));
    } catch (e) {
      const text = event.data.text();
      event.waitUntil(self.registration.showNotification('BrewBook ☕', { body: text }));
    }
  }
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.url || '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (let client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});
