// Versionsanzeige: Die Nummer steht ausschließlich in sw.js (VERSION). Die
// Seite fragt sie beim Service Worker ab, der sie gerade ausliefert – so zeigt
// die App wirklich die Fassung an, die läuft, und nicht eine zweite Konstante,
// die beim Hochzählen vergessen werden kann.

function withTimeout(promise, ms, fallback = null) {
  return Promise.race([promise, new Promise((r) => setTimeout(() => r(fallback), ms))]);
}

// Antwortet der Worker nicht (kein SW, alte Fassung ohne GET_VERSION),
// liefert die Funktion null statt hängen zu bleiben.
export async function activeVersion({ timeoutMs = 3000 } = {}) {
  if (!('serviceWorker' in navigator)) return null;

  // Nicht auf controller verlassen: direkt nach dem allerersten Laden hat der
  // Worker die Seite noch nicht übernommen, controller wäre dann null, obwohl
  // gleich darauf aus seinem Cache ausgeliefert wird. registration.active
  // steht, sobald er aktiviert ist.
  const reg = await withTimeout(navigator.serviceWorker.ready, timeoutMs);
  const sw = reg?.active || navigator.serviceWorker.controller;
  if (!sw) return null;

  return withTimeout(new Promise((resolve) => {
    const channel = new MessageChannel();
    channel.port1.onmessage = (e) => resolve(e.data?.version ?? null);
    try {
      sw.postMessage({ type: 'GET_VERSION' }, [channel.port2]);
    } catch (_) {
      resolve(null);
    }
  }), timeoutMs);
}

// Beim Server nachsehen, ob eine neuere Fassung bereitliegt.
// Rückgabe: 'aktuell' | 'update' | 'nicht-moeglich'
export async function checkForUpdate() {
  if (!('serviceWorker' in navigator)) return 'nicht-moeglich';
  const reg = await navigator.serviceWorker.getRegistration();
  if (!reg) return 'nicht-moeglich';
  try {
    await reg.update();
  } catch (_) {
    return 'nicht-moeglich'; // offline oder Server nicht erreichbar
  }
  // Ein neuer Worker taucht als installing bzw. waiting auf. app.js lauscht
  // ohnehin auf 'updatefound' und blendet dann den Neu-laden-Hinweis ein.
  return reg.installing || reg.waiting ? 'update' : 'aktuell';
}
