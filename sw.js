// Service Worker: App-Shell vorab cachen (cache-first), damit die App offline läuft.
// Bei Änderungen VERSION erhöhen (Haupt.Neben.Korrektur, Regeln im README) –
// alte Caches werden beim Aktivieren gelöscht.

const VERSION = '1.14.1';
const CACHE = `alefbeth-${VERSION}`;
// Eigener, versionsunabhängiger Cache für die Erinnerungs-Einstellung: Der
// Worker kann localStorage nicht lesen, die Seite spiegelt sie deshalb hierher.
const REMINDER_CACHE = 'alefbeth-reminder';
const REMINDER_KEY = 'reminder-config';
// So lange nach der eingestellten Uhrzeit darf die Erinnerung noch kommen.
// Später (Handy schlief, Browser hat den Worker spät geweckt) lieber gar nicht
// als irgendwann am Abend.
const REMINDER_LATE_MS = 60 * 60 * 1000;

const ASSETS = [
  '.',
  'index.html',
  'manifest.webmanifest',
  'css/tokens.css',
  'css/components.css',
  'css/style.css',
  'fonts/rubik-latin.woff2',
  'fonts/frankruhllibre-hebrew.woff2',
  'fonts/frankruhllibre-latin.woff2',
  'icons/icon-v2.svg',
  'icons/icon-192-v2.png',
  'icons/icon-512-v2.png',
  'icons/icon-maskable-512-v2.png',
  'icons/apple-touch-icon-v2.png',
  'js/alefbeth.js',
  'js/ui.js',
  'js/app.js',
  'js/notify.js',
  'js/theme.js',
  'js/util.js',
  'js/version.js',
  'js/state.js',
  'js/badges.js',
  'js/srs.js',
  'js/audio.js',
  'js/exercises.js',
  'js/lesson.js',
  'js/screens.js',
  'js/kalender.js',
  'js/giur.js',
  'js/giur-pruefung.js',
  'js/rangliste.js',
  'js/konto.js',
  'data/letters.js',
  'data/nikud.js',
  'data/words.js',
  'data/greetings.js',
  'data/curriculum.js',
  'data/giur.js',
  'data/giur/kaschrut.js',
  'data/giur/schabbat.js',
  'data/giur/feste.js',
  'data/giur/jamim-noraim.js',
  'data/giur/sukkot.js',
  'data/giur/chanuka.js',
  'data/giur/purim.js',
  'data/giur/pessach.js',
  'data/giur/schawuot.js',
  'data/giur/kalender.js',
  'data/giur/ethik.js',
  'data/giur/leben.js',
  'data/giur/geschichte.js',
  'data/giur/lehren.js',
  'data/giur/synagoge.js',
  'data/giur/tefilla.js',
  'data/giur/brachot.js',
  'data/giur/taharat.js',
];

// Die hebräische Stimme: Liste und Clips (audio/he/). Fehlt etwas, kommt das
// Update trotzdem – an der Stelle spricht dann eben die Stimme des Geräts.
async function cacheVoice(cache) {
  try {
    const res = await fetch('audio/he/index.json', { cache: 'no-cache' });
    if (!res.ok) return;
    const list = await res.clone().json();
    await cache.put('audio/he/index.json', res);
    await Promise.all(Object.values(list.clips || {})
      .map((file) => cache.add(`audio/he/${file}`).catch(() => {})));
  } catch {
    // ohne Netz oder ohne Liste gibt es nichts zu cachen
  }
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE)
      .then((cache) => cache.addAll(ASSETS).then(() => cacheVoice(cache)))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && k !== REMINDER_CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  // Lern-Erinnerung: Die Seite spiegelt ihre Einstellung ({ enabled, time }) …
  if (event.data?.type === 'SET_REMINDER') {
    event.waitUntil(saveReminderConfig(event.data.enabled, event.data.time));
  }
  // … und meldet, wenn die Uhrzeit erreicht ist. Ob wirklich eine kommt,
  // entscheidet maybeShowReminder (Zeitfenster, höchstens einmal am Tag).
  if (event.data?.type === 'SHOW_REMINDER') {
    event.waitUntil(maybeShowReminder());
  }
  // Versionsabfrage für die Einstellungen. VERSION lebt nur hier – so kann die
  // Anzeige nicht von der tatsächlich ausgelieferten Fassung abweichen.
  if (event.data?.type === 'GET_VERSION') {
    event.ports[0]?.postMessage({ version: VERSION });
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

// Periodic Background Sync (Chrome Android / installierte PWA): Chrome weckt den
// Worker, wann es will – nicht zur eingestellten Uhrzeit. Deshalb hier nur
// nachsehen, ob die Erinnerung gerade fällig ist, statt blind eine zu zeigen.
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'srs-reminder') event.waitUntil(maybeShowReminder());
});

async function readReminderConfig() {
  try {
    const res = await (await caches.open(REMINDER_CACHE)).match(REMINDER_KEY);
    return res ? await res.json() : null;
  } catch {
    return null;
  }
}

async function writeReminderConfig(config) {
  const cache = await caches.open(REMINDER_CACHE);
  await cache.put(REMINDER_KEY, new Response(JSON.stringify(config), {
    headers: { 'Content-Type': 'application/json' },
  }));
}

async function saveReminderConfig(enabled, time) {
  const prev = (await readReminderConfig()) || {};
  await writeReminderConfig({ ...prev, enabled: !!enabled, time: String(time || '') });
}

// Lokales Datum als "JJJJ-MM-TT" – Schlüssel für „heute schon erinnert“.
function dayKey(d) {
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

async function maybeShowReminder() {
  const config = await readReminderConfig();
  if (!config?.enabled) return;
  const m = /^(\d{1,2}):(\d{2})$/.exec(config.time || '');
  if (!m) return;

  const now = new Date();
  const target = new Date(now);
  target.setHours(Number(m[1]), Number(m[2]), 0, 0);
  const late = now - target;
  if (late < 0 || late > REMINDER_LATE_MS) return;   // zu früh oder zu spät
  const today = dayKey(now);
  if (config.lastShown === today) return;           // heute schon erinnert

  await writeReminderConfig({ ...config, lastShown: today });
  await self.registration.showNotification('Alef Beth – Zeit zum Lernen! 📖', {
    body: 'Deine Hebräisch-Übungen warten auf dich.',
    icon: 'icons/icon-192.png',
    badge: 'icons/icon-192.png',
    tag: 'daily-reminder',
  });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || !request.url.startsWith(self.location.origin)) return;
  // Die Werkzeuge gehören nicht zur App und sollen nie veraltet aus dem Cache kommen.
  if (request.url.startsWith(new URL('tools/', self.registration.scope).href)) return;
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
