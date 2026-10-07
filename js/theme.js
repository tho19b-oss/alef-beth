// Erscheinungsbild anwenden: data-theme setzen und die Farbe der Browser-
// bzw. Statusleiste mitziehen; dazu der Schalter für weniger Bewegung.

import { state } from './state.js';

// Papierfarbe (--paper) aus tokens.css, hell und dunkel.
const COLORS = { light: '#fcf7ef', dark: '#15110d' };

export function prefersDark() {
  return matchMedia('(prefers-color-scheme: dark)').matches;
}

export function applyTheme() {
  const choice = state.settings.theme;
  document.documentElement.dataset.theme = choice;

  // Die <meta name="theme-color">-Tags in index.html folgen nur der
  // Systemeinstellung – bei manueller Wahl passte die Leistenfarbe sonst nicht.
  const dark = choice === 'dark' || (choice === 'auto' && prefersDark());
  let meta = document.querySelector('meta[name="theme-color"]:not([media])');
  if (!meta) {
    meta = document.createElement('meta');
    meta.name = 'theme-color';
    document.head.appendChild(meta);
  }
  meta.content = dark ? COLORS.dark : COLORS.light;
}

// „Bewegung reduzieren“: html[data-motion="reduced"] schaltet in components.css
// alle Animationen auf ihren Endzustand, die Helfer lassen Konfetti und
// Funken weg. Die Systemeinstellung wirkt unabhängig davon immer.
export function applyMotion() {
  if (state.settings.reduceMotion) document.documentElement.dataset.motion = 'reduced';
  else delete document.documentElement.dataset.motion;
}
