// Einstieg: Hash-Router, Theme, Bottom-Navigation, Service-Worker-Registrierung.

import { state } from './state.js';
import { renderHome, renderReview, renderAlphabet, renderSettings } from './screens.js';
import { runLesson, runReview, runFreePractice } from './lesson.js';
import { scheduleReminder } from './notify.js';
import { dueIds } from './srs.js';
import { applyTheme, applyMotion } from './theme.js';
import { replay } from './ui.js';

const app = document.getElementById('app');
// Hebräische Textstellen tragen lang="he" direkt im Markup (he() in ui.js):
// Screenreader und Browser wählen dadurch Aussprache und Schrift richtig.

const NAV_ROUTES = ['home', 'review', 'alphabet', 'settings'];

function navRoute(hash) {
  if (hash.startsWith('#/review')) return 'review';
  if (hash === '#/alphabet') return 'alphabet';
  if (hash === '#/settings') return 'settings';
  return 'home'; // auch Lektionen gehören zum Lernpfad
}

function updateNav(hash) {
  const current = navRoute(hash);
  document.querySelectorAll('#bottomnav a').forEach((a) => {
    if (a.dataset.route === current) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  // Die Pille gleitet per CSS-Übergang zum aktiven Tab.
  document.querySelector('.ab-nav__list').style.setProperty('--active', NAV_ROUTES.indexOf(current));

  // Zahl der fälligen Karten am Üben-Tab; ändert sie sich, hüpft sie kurz.
  const due = dueIds(state.srs).length;
  const badge = document.getElementById('nav-badge');
  const text = due > 0 ? String(due) : '';
  const changed = badge.textContent !== text;
  badge.textContent = text;
  badge.hidden = due === 0;
  document.getElementById('nav-due').textContent = due > 0 ? `, ${due} ${due === 1 ? 'Karte' : 'Karten'} fällig` : '';
  if (changed && due > 0) replay(badge, 'is-bump');
}

function route() {
  const hash = location.hash || '#/';
  const inLesson = hash.startsWith('#/lesson/') || hash === '#/review/run' || hash === '#/review/practice';
  document.body.classList.toggle('in-lesson', inLesson);
  document.body.classList.remove('fb-open');
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  window.scrollTo(0, 0);
  updateNav(hash);

  if (hash.startsWith('#/lesson/')) {
    runLesson(hash.slice('#/lesson/'.length), app);
  } else if (hash === '#/review/run') {
    runReview(app);
  } else if (hash === '#/review/practice') {
    runFreePractice(app);
  } else if (hash === '#/review') {
    renderReview(app);
  } else if (hash === '#/alphabet') {
    renderAlphabet(app);
  } else if (hash === '#/settings') {
    renderSettings(app);
  } else {
    renderHome(app);
  }

  // Screenreader an den Anfang des neuen Bildschirms setzen (ohne Fokusring).
  if (!inLesson) app.focus({ preventScroll: true });
}

// ---- Updates -----------------------------------------------------------
// Eine neue Fassung soll sofort sichtbar sein und nicht erst beim übernächsten
// Start. Sobald der neue Worker die Seite übernimmt (sw.js ruft skipWaiting und
// clients.claim), wird neu geladen – nur nicht mitten in einer Übung: dort
// wartet der Reload, bis die Lektion verlassen wird. Der Fortschritt ist zu dem
// Zeitpunkt längst gespeichert, lesson.js ruft save() vor dem Endscreen.
const hadController = !!navigator.serviceWorker?.controller;
let updatePending = false;
let reloading = false;

const isInLesson = () => document.body.classList.contains('in-lesson');

function applyUpdate() {
  if (reloading) return; // nicht zweimal neu laden
  reloading = true;
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  location.reload();
}

window.addEventListener('hashchange', () => {
  route();
  // Ein Update, das während der Lektion eintraf, jetzt nachholen.
  if (updatePending && !isInLesson()) applyUpdate();
});
// Bei „Automatisch“ dem Systemwechsel folgen, ohne dass die App neu geladen wird.
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (state.settings.theme === 'auto') applyTheme();
});
// Kommt die hebräische Stimme erst nachträglich, den aktuellen Screen neu zeichnen
// (Alphabet-Liste und Einstellungen zeigen dann die Hörsymbole).
window.addEventListener('hebrewvoiceready', () => {
  if (!isInLesson()) route();
});

applyTheme();
applyMotion();
route();
scheduleReminder();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Beim allerersten Besuch übernimmt der Worker eine bis dahin ungesteuerte
    // Seite. Das ist kein Update – neu laden wäre da nur störend.
    if (!hadController) return;
    if (isInLesson()) updatePending = true;
    else applyUpdate();
  });

  navigator.serviceWorker.register('sw.js').then(async (swReg) => {
    if ('periodicSync' in swReg) {
      try {
        const perm = await navigator.permissions.query({ name: 'periodic-background-sync' });
        if (perm.state === 'granted') {
          await swReg.periodicSync.register('srs-reminder', { minInterval: 24 * 60 * 60 * 1000 });
        }
      } catch (_) {
        // Periodic Background Sync nicht unterstützt – ignorieren
      }
    }
  }).catch((e) => {
    console.warn('Service Worker konnte nicht registriert werden:', e);
  });
}
