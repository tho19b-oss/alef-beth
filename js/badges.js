// Abzeichen: Meilensteine aus dem Lernstand (Liste und Bedingungen: Abschnitt
// „Gamification“ im Design System). Fast alle lassen sich aus dem Zustand
// ableiten; nur Hörübungen und beste Serie brauchen eigene Zähler (state.stats).

import { state, save } from './state.js';
import { UNITS } from '../data/curriculum.js';

const unitLessons = (id) => UNITS.find((u) => u.id === id).lessons;
const done = (id) => !!state.lessons[id];

// Buchstaben aus geschafften Buchstaben-Lektionen: 22 Grundformen + 5 Endformen.
function letterCount() {
  return unitLessons('u1')
    .filter((l) => l.kind === 'letters' && done(l.id))
    .reduce((n, l) => n + l.newItems.length, 0);
}

// progress() liefert [erreicht, nötig]. Motiv: glyph (Hebräisch) oder icon.
export const BADGES = [
  { id: 'erster-buchstabe', name: 'Erster Buchstabe', desc: 'Lektion 1 geschafft', glyph: 'א',
    progress: () => [done('u1l1') ? 1 : 0, 1] },
  { id: 'fehlerfrei', name: 'Fehlerfrei', desc: 'Eine Lektion mit 100 %', icon: 'check', tone: 'minze',
    progress: () => [Object.values(state.lessons).some((l) => l.score === 100) ? 1 : 0, 1] },
  { id: 'serie-7', name: '7 Tage Serie', desc: 'Sieben Tage in Folge gelernt', icon: 'flame', tone: 'granat',
    progress: () => [Math.min(state.stats.bestStreak, 7), 7] },
  { id: 'ohrenmensch', name: 'Ohrenmensch', desc: '50 Hörübungen richtig', icon: 'speaker', tone: 'tekhelet',
    progress: () => [Math.min(state.stats.listenCorrect, 50), 50] },
  { id: 'alef-bet', name: 'Alef-Bet komplett', desc: 'Alle 27 Buchstabenformen', icon: 'crown',
    progress: () => [letterCount(), 27] },
  { id: 'nikud-profi', name: 'Nikud-Profi', desc: 'Einheit 2 geschafft', glyph: 'בָּ', tone: 'tekhelet',
    progress: () => [unitLessons('u2').filter((l) => done(l.id)).length, unitLessons('u2').length] },
  { id: 'erste-bracha', name: 'Erste Bracha', desc: 'Die Bracha-Formel gelesen', icon: 'star',
    progress: () => [done('u3l5') ? 1 : 0, 1] },
];

export function isEarned(badge) {
  const [value, needed] = badge.progress();
  return value >= needed;
}

// Neu erreichte Abzeichen eintragen und zurückgeben. Beim ersten Start nach
// dem Update (badges === null) wird das bisher Erreichte still übernommen,
// statt alles auf einmal zu feiern.
export function syncBadges() {
  const firstRun = state.badges === null;
  if (firstRun) state.badges = {};
  const fresh = [];
  for (const b of BADGES) {
    if (state.badges[b.id] || !isEarned(b)) continue;
    state.badges[b.id] = Date.now();
    fresh.push(b);
  }
  if (firstRun || fresh.length) save();
  return firstRun ? [] : fresh;
}
