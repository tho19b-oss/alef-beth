// Giur-Wissen: Fragen aus dem Prüfungskatalog fürs Beit Din, geordnet nach den
// 18 Teilen des Katalogs. Die Fragen eines Teils stehen in data/giur/<teil>.js
// (Aufbau der Einträge: siehe Kopf von data/giur/kaschrut.js).
//
// Einen weiteren Teil aufnehmen: Datei anlegen, hier importieren und bei
// `fragen` des Teils eintragen. Karten und Fortschritt hängen an den Frage-IDs.

import { KASCHRUT } from './giur/kaschrut.js';
import { SCHABBAT } from './giur/schabbat.js';

// geplant = Zahl der Fragen im Katalog. Teile ohne `fragen` sind noch nicht
// aufbereitet und erscheinen in der Liste als „kommt später“.
const TEILE_ROH = [
  { id: 'kaschrut', title: 'Kaschrut', desc: 'Speisegesetze: erlaubte Tiere, Schlachten, Milch und Fleisch', geplant: 43, fragen: KASCHRUT },
  { id: 'schabbat', title: 'Schabbat', desc: 'Kerzen, Kiddusch, Verbote und Hawdala', geplant: 87, fragen: SCHABBAT },
  { id: 'feste', title: 'Feste (allgemein)', desc: 'Was an allen Feiertagen gilt', geplant: 18 },
  { id: 'jamim-noraim', title: 'Jamim Nora-im', desc: 'Rosch Haschana und Jom Kippur', geplant: 29 },
  { id: 'sukkot', title: 'Sukkot', desc: 'Sukka, Feststrauß, Simchat Tora', geplant: 17 },
  { id: 'chanuka', title: 'Chanuka', desc: 'Lichterfest', geplant: 14 },
  { id: 'purim', title: 'Purim', desc: 'Megilla, Mischloach Manot, Seudat Purim', geplant: 10 },
  { id: 'pessach', title: 'Pessach', desc: 'Seder, Chamez, Omer', geplant: 47 },
  { id: 'schawuot', title: 'Schawuot', desc: 'Zehn Gebote und Gebräuche', geplant: 11 },
  { id: 'kalender', title: 'Der jüdische Kalender', desc: 'Monate, Feste, Fastentage', geplant: 36 },
  { id: 'ethik', title: 'Ethik', desc: 'Begriffe und Grundfragen des Glaubens', geplant: 9, zusatz: 'dazu über 40 Begriffe' },
  { id: 'leben', title: 'Jüdisches Leben', desc: 'Zizit, Tefillin, Lebenszyklus, Übertritt', geplant: 79 },
  { id: 'geschichte', title: 'Jüdische Geschichte', desc: 'Patriarchen, Könige, Tempel', geplant: 14 },
  { id: 'lehren', title: 'Jüdische Lehren', desc: 'Tora, Mizwot, Gelehrte', geplant: 24 },
  { id: 'synagoge', title: 'Synagoge', desc: 'Toralesung und Begriffe', geplant: 12 },
  { id: 'tefilla', title: 'Tefilla', desc: 'Gebete und Minjan', geplant: 20 },
  { id: 'brachot', title: 'Brachot', desc: 'Segenssprüche und Tischgebet', geplant: 13 },
  { id: 'taharat', title: 'Taharat Hamischpacha', desc: 'Familienreinheit', geplant: 9 },
];

// Fehlende Angaben auffüllen: ohne type gilt 'erklaeren', ohne status 'entwurf'.
export const TEILE = TEILE_ROH.map((t, i) => ({
  ...t,
  nr: i + 1,
  fragen: (t.fragen || []).map((q) => ({ type: 'erklaeren', status: 'entwurf', ...q, teil: t.id })),
}));

const BY_ID = new Map(TEILE.flatMap((t) => t.fragen.map((q) => [q.id, q])));

export function getTeil(id) {
  return TEILE.find((t) => t.id === id) || null;
}

export function getQuestion(id) {
  return BY_ID.get(id) || null;
}

// Gibt es diese Frage (noch)? Für gespeicherte Fortschritte aus einer älteren
// Datenfassung.
export function hasQuestion(id) {
  return BY_ID.has(id);
}

export const TYPE_LABEL = {
  erklaeren: 'Erklären',
  fakt: 'Fakt',
  persoenlich: 'Persönlich',
};

export const STATUS_LABEL = {
  entwurf: 'Entwurf',
  geprueft: 'Geprüft',
};
