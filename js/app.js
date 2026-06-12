// Einstieg: Hash-Router, Theme, Bottom-Navigation, Service-Worker-Registrierung.

import { state } from './state.js';
import { renderHome, renderReview, renderAlphabet, renderSettings } from './screens.js';
import { runLesson, runReview } from './lesson.js';

const app = document.getElementById('app');

function applyTheme() {
  document.documentElement.dataset.theme = state.settings.theme;
}

function updateNav(hash) {
  document.querySelectorAll('#bottomnav a').forEach((a) => {
    const r = a.dataset.route;
    const active =
      (r === 'home' && (hash === '#/' || hash === '' || hash.startsWith('#/lesson/'))) ||
      (r === 'review' && hash.startsWith('#/review')) ||
      (r === 'alphabet' && hash === '#/alphabet') ||
      (r === 'settings' && hash === '#/settings');
    a.classList.toggle('active', active);
  });
}

function route() {
  const hash = location.hash || '#/';
  const inLesson = hash.startsWith('#/lesson/') || hash === '#/review/run';
  document.body.classList.toggle('in-lesson', inLesson);
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  window.scrollTo(0, 0);
  updateNav(hash);

  if (hash.startsWith('#/lesson/')) {
    runLesson(hash.slice('#/lesson/'.length), app);
  } else if (hash === '#/review/run') {
    runReview(app);
  } else if (hash === '#/review') {
    renderReview(app);
  } else if (hash === '#/alphabet') {
    renderAlphabet(app);
  } else if (hash === '#/settings') {
    renderSettings(app);
  } else {
    renderHome(app);
  }
}

window.addEventListener('hashchange', route);
applyTheme();
route();

if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
  navigator.serviceWorker.register('sw.js').catch((e) => {
    console.warn('Service Worker konnte nicht registriert werden:', e);
  });
}
