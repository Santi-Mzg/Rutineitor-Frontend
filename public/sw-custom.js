import { precacheAndRoute, cleanupOutdatedCaches} from 'workbox-precaching'
import { clientsClaim } from 'workbox-core'


// ------------------- Precaching and Cleanup Outdated Caches-------------------
cleanupOutdatedCaches();
precacheAndRoute(self.__WB_MANIFEST || []);

// ------------------- Auto Update Behavior -------------------

self.skipWaiting()
clientsClaim()

// ------------------- Push Notifications -------------------

self.addEventListener('push', (event) => {
  console.log('Push recibido:', event);

  const data = event.data?.json() || {
    title: 'Rutineitor',
    body: '¡Tienes una nueva rutina!',
    icon: '/pwa-192x192.png',
  };

  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: data.icon,
      badge: data.icon,
    })
  );
});

// ------------------- Click en la notificación -------------------
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        clientList[0].focus();
      } else {
        clients.openWindow('/Rutineitor/#/workout');
      }
    })
  );
});
