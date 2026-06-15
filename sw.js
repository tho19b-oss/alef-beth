// Service Worker: App-Shell vorab cachen (cache-first), damit die App offline läuft.
// Bei Änderungen VERSION hochzählen – alte Caches werden beim Aktivieren gelöscht.

const VERSION = 'v8';
const CACHE = `alefbeth-${VERSION}`;

const ASSETS = [
  '.',
  'index.html',
  'manifest.webmanifest',
  'css/style.css',
  'fonts/frankruhllibre-hebrew.woff2',
  'fonts/frankruhllibre-latin.woff2',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'js/app.js',
  'js/notify.js',
  'js/util.js',
  'js/state.js',
  'js/srs.js',
  'js/audio.js',
  'js/exercises.js',
  'js/lesson.js',
  'js/screens.js',
  'data/letters.js',
  'data/nikud.js',
  'data/words.js',
  'data/curriculum.js',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Lern-Erinnerung: Seite schickt { type: 'SHOW_REMINDER' }, SW zeigt Notification.
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SHOW_REMINDER') {
    event.waitUntil(
      self.registration.showNotification('Alef Beth – Zeit zum Lernen! 📖', {
        body: 'Deine Hebräisch-Übungen warten auf dich.',
        icon: 'icons/icon-192.png',
        badge: 'icons/icon-192.png',
        tag: 'daily-reminder',
        renotify: false,
      })
    );
  }
});

// Tap auf Notification → App in den Vordergrund holen oder öffnen.
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
      }
      return self.clients.openWindow(self.registration.scope);
    })
  );
});

// Periodic Background Sync (Chrome Android / installierte PWA): tägliche Erinnerung.
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'srs-reminder') {
    event.waitUntil(
      self.registration.showNotification('Alef Beth – Zeit zum Lernen! 📖', {
        body: 'Deine Hebräisch-Übungen warten auf dich.',
        icon: 'icons/icon-192.png',
        badge: 'icons/icon-192.png',
        tag: 'daily-reminder',
      })
    );
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) return;
  event.respondWith(
    caches.match(request, { ignoreSearch: true }).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((resp) => {
        if (resp.ok) {
          const copy = resp.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return resp;
      }).catch(() => {
        // Offline-Fallback für Navigationen: App-Shell
        if (request.mode === 'navigate') return caches.match('index.html');
        return Response.error();
      });
    })
  );
});
