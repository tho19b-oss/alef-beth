// Einstieg: Hash-Router, Theme, Bottom-Navigation, Service-Worker-Registrierung.

import { state } from './state.js';
import { renderHome, renderReview, renderAlphabet, renderSettings } from './screens.js';
import { runLesson, runReview, runFreePractice } from './lesson.js';
import { scheduleReminder } from './notify.js';
import { dueIds } from './srs.js';
import { applyTheme } from './theme.js';

const app = document.getElementById('app');

// Hebräische Textstellen als solche auszeichnen: Screenreader und Browser
// wählen dadurch die richtige Aussprache bzw. Schrift. Die Screens erzeugen
// ihr Markup an vielen Stellen – ein Observer trifft sie alle.
function tagHebrew(root) {
  if (root.classList?.contains('he') && !root.lang) root.lang = 'he';
  root.querySelectorAll?.('.he:not([lang])').forEach((el) => { el.lang = 'he'; });
}
new MutationObserver((records) => {
  for (const r of records) {
    for (const node of r.addedNodes) {
      if (node.nodeType === 1) tagHebrew(node);
    }
  }
}).observe(app, { childList: true, subtree: true });

function updateNav(hash) {
  document.querySelectorAll('#bottomnav a').forEach((a) => {
    const r = a.dataset.route;
    const active =
      (r === 'home' && (hash === '#/' || hash === '' || hash.startsWith('#/lesson/'))) ||
      (r === 'review' && hash.startsWith('#/review')) ||
      (r === 'alphabet' && hash === '#/alphabet') ||
      (r === 'settings' && hash === '#/settings');
    a.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  const due = dueIds(state.srs).length;
  const badge = document.getElementById('nav-badge');
  if (badge) {
    badge.textContent = due > 0 ? String(due) : '';
    badge.setAttribute('aria-label', `${due} Karten fällig`);
    badge.hidden = due === 0;
  }
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

window.addEventListener('hashchange', route);
// Bei „Automatisch“ dem Systemwechsel folgen, ohne dass die App neu geladen wird.
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (state.settings.theme === 'auto') applyTheme();
});
// Kommt die hebräische Stimme erst nachträglich, den aktuellen Screen neu zeichnen
// (Alphabet-Liste und Einstellungen zeigen dann die Hörsymbole).
window.addEventListener('hebrewvoiceready', () => {
  if (!document.body.classList.contains('in-lesson')) route();
});

applyTheme();
route();
scheduleReminder();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').then(async (swReg) => {
    // Neue Version im Hintergrund gefunden → beim nächsten Start greift sie.
    swReg.addEventListener('updatefound', () => {
      const sw = swReg.installing;
      sw?.addEventListener('statechange', () => {
        if (sw.state === 'installed' && navigator.serviceWorker.controller) {
          showUpdateHint();
        }
      });
    });
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

// Dezenter Hinweis statt eines erzwungenen Reloads – niemand soll mitten in
// einer Übung aus der Lektion geworfen werden.
function showUpdateHint() {
  if (document.getElementById('update-hint')) return;
  const bar = document.createElement('div');
  bar.id = 'update-hint';
  bar.className = 'update-hint';
  bar.innerHTML = '<span>Neue Version verfügbar.</span><button type="button">Neu laden</button>';
  bar.querySelector('button').addEventListener('click', () => location.reload());
  document.body.appendChild(bar);
}
