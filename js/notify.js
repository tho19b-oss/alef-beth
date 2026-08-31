// Tägliche Lern-Erinnerung via Service-Worker-Notification.
// Wird bei App-Start und nach Einstellungsänderungen neu geplant.

import { state } from './state.js';

let _timeout = null;

export const DEFAULT_TIME = '19:00';

// "HH:MM" → { h, m }, oder null bei Unsinn. Ein leeres Zeitfeld (der Nutzer kann
// die Eingabe löschen) ergäbe sonst NaN → setTimeout(NaN) feuert sofort und
// die Erinnerung würde sich in einer Endlosschleife selbst neu planen.
export function parseTime(value) {
  const m = /^(\d{1,2}):(\d{2})$/.exec(String(value ?? '').trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) return null;
  return { h, m: min };
}

export function scheduleReminder() {
  clearTimeout(_timeout);
  _timeout = null;

  const notif = state.settings?.notifications;
  if (!notif?.enabled) return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  if (!('serviceWorker' in navigator)) return;

  const time = parseTime(notif.time) || parseTime(DEFAULT_TIME);
  const now = new Date();
  const target = new Date(now);
  target.setHours(time.h, time.m, 0, 0);
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
