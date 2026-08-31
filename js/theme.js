// Erscheinungsbild anwenden: data-theme setzen und die Farbe der Browser-
// bzw. Statusleiste mitziehen.

import { state } from './state.js';

const COLORS = { light: '#f3e9d2', dark: '#1c1814' };

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
