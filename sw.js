// Service Worker: App-Shell vorab cachen (cache-first), damit die App offline läuft.
// Bei Änderungen VERSION hochzählen – alte Caches werden beim Aktivieren gelöscht.

const VERSION = 'v2';
const CACHE = `alefbeth-${VERSION}`;

const ASSETS = [
  '.',
  'index.html',
  'manifest.webmanifest',
  'css/style.css',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'js/app.js',
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
