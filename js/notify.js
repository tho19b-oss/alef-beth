// Tägliche Lern-Erinnerung via Service-Worker-Notification.
// Wird bei App-Start und nach Einstellungsänderungen neu geplant.

import { state } from './state.js';

let _timeout = null;

export function scheduleReminder() {
  clearTimeout(_timeout);
  _timeout = null;

  const notif = state.settings?.notifications;
  if (!notif?.enabled) return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  if (!('serviceWorker' in navigator)) return;

  const [h, m] = notif.time.split(':').map(Number);
  const now = new Date();
  const target = new Date(now);
  target.setHours(h, m, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1); // bereits vorbei → morgen

  _timeout = setTimeout(async () => {
    try {
      const sw = await navigator.serviceWorker.ready;
      sw.active?.postMessage({ type: 'SHOW_REMINDER' });
    } catch (e) {
      console.warn('Erinnerung konnte nicht gesendet werden:', e);
    }
    scheduleReminder(); // für nächsten Tag neu planen
  }, target - now);
}
