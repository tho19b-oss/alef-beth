// Abzeichen: Meilensteine aus dem Lernstand (Liste und Bedingungen: Abschnitt
// „Gamification“ im Design System). Fast alle lassen sich aus dem Zustand
// ableiten; nur Hörübungen und beste Serie brauchen eigene Zähler (state.stats).

import { state, save } from './state.js';
import { UNITS, orderedLessons } from '../data/curriculum.js';
import { TEILE } from '../data/giur.js';

const unitLessons = (id) => UNITS.find((u) => u.id === id).lessons;
const done = (id) => !!state.lessons[id];
const atMost = (value, needed) => [Math.min(value, needed), needed];

// Zeichen, deren sechs Punkte auf der Alef-Bet-Tafel alle voll sind.
const FULL_LEVEL = 6;
const fullCards = () => Object.values(state.srs).filter((c) => c.streak >= FULL_LEVEL).length;

// Giur-Wissen: Eine Frage gilt als gelernt, sobald sie eine Karte hat (wie in giur.js).
const giurLearned = (t) => t.fragen.filter((q) => state.giur.cards[q.id]).length;
const giurTotal = () => TEILE.reduce((n, t) => n + t.fragen.length, 0);
const giurAll = () => TEILE.reduce((n, t) => n + giurLearned(t), 0);
// Der Teil, dem am wenigsten fehlt.
function giurBestTeil() {
  const ready = TEILE.filter((t) => t.fragen.length);
  const best = ready.reduce((a, t) => (t.fragen.length - giurLearned(t) < a.fragen.length - giurLearned(a) ? t : a), ready[0]);
  return [giurLearned(best), best.fragen.length];
}

// Buchstaben aus geschafften Buchstaben-Lektionen: 22 Grundformen + 5 Endformen.
function letterCount() {
  return unitLessons('u1')
    .filter((l) => l.kind === 'letters' && done(l.id))
    .reduce((n, l) => n + l.newItems.length, 0);
}

// progress() liefert [erreicht, nötig]. Motiv: glyph (Hebräisch) oder icon.
// area ordnet das Abzeichen einem Lernbereich zu (Abschnitte auf der Erfolge-Seite).
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
  { id: 'lernpfad', name: 'Lernpfad komplett', desc: 'Alle Lektionen geschafft', icon: 'trophy',
    progress: () => [orderedLessons().filter((l) => done(l.id)).length, orderedLessons().length] },
  { id: 'gutes-gehoer', name: 'Gutes Gehör', desc: '250 Hörübungen richtig', icon: 'speaker', tone: 'tekhelet',
    progress: () => atMost(state.stats.listenCorrect, 250) },
  { id: 'fest-im-kopf', name: 'Fest im Kopf', desc: '10 Zeichen mit allen Punkten', icon: 'target', tone: 'minze',
    progress: () => atMost(fullCards(), 10) },
  { id: 'serie-30', name: '30 Tage Serie', desc: 'Einen Monat jeden Tag gelernt', icon: 'flame', tone: 'granat',
    progress: () => atMost(state.stats.bestStreak, 30) },
  { id: 'serie-100', name: '100 Tage Serie', desc: 'Hundert Tage in Folge gelernt', icon: 'flame', tone: 'granat',
    progress: () => atMost(state.stats.bestStreak, 100) },

  { id: 'giur-start', area: 'giur', name: 'Erste Fragen', desc: 'Eine Giur-Runde gelernt', icon: 'bulb', tone: 'minze',
    progress: () => [giurAll() ? 1 : 0, 1] },
  { id: 'giur-teil', area: 'giur', name: 'Ein Teil durch', desc: 'Alle Fragen eines Teils gelernt', icon: 'book', tone: 'tekhelet',
    progress: giurBestTeil },
  { id: 'giur-100', area: 'giur', name: '100 Fragen', desc: '100 Giur-Fragen gelernt', icon: 'bolt',
    progress: () => atMost(giurAll(), 100) },
  { id: 'giur-halb', area: 'giur', name: 'Halbe Strecke', desc: 'Die Hälfte aller Giur-Fragen', icon: 'sparkle', tone: 'granat',
    progress: () => atMost(giurAll(), Math.ceil(giurTotal() / 2)) },
  { id: 'beit-din', area: 'giur', name: 'Bereit fürs Beit Din', desc: 'Alle Giur-Fragen gelernt', icon: 'crown', tone: 'tekhelet',
    progress: () => [giurAll(), giurTotal()] },
];

function isEarned(badge) {
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
