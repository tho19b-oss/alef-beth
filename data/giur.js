// Giur-Wissen: Fragen aus dem Prüfungskatalog fürs Beit Din, geordnet nach den
// 18 Teilen des Katalogs. Die Fragen eines Teils stehen in data/giur/<teil>.js
// (Aufbau der Einträge: siehe Kopf von data/giur/kaschrut.js).
//
// Einen weiteren Teil aufnehmen: Datei anlegen, hier importieren und bei
// `fragen` des Teils eintragen. Karten und Fortschritt hängen an den Frage-IDs.

import { KASCHRUT } from './giur/kaschrut.js';
import { SCHABBAT } from './giur/schabbat.js';
import { FESTE } from './giur/feste.js';
import { JAMIM_NORAIM } from './giur/jamim-noraim.js';
import { SUKKOT } from './giur/sukkot.js';
import { CHANUKA } from './giur/chanuka.js';
import { PURIM } from './giur/purim.js';
import { PESSACH } from './giur/pessach.js';
import { SCHAWUOT } from './giur/schawuot.js';
import { KALENDER } from './giur/kalender.js';
import { ETHIK } from './giur/ethik.js';
import { LEBEN } from './giur/leben.js';
import { GESCHICHTE } from './giur/geschichte.js';
import { LEHREN } from './giur/lehren.js';
import { SYNAGOGE } from './giur/synagoge.js';
import { TEFILLA } from './giur/tefilla.js';
import { BRACHOT } from './giur/brachot.js';
import { TAHARAT } from './giur/taharat.js';

// geplant = Zahl der Fragen im Katalog. Teile ohne `fragen` sind noch nicht
// aufbereitet und erscheinen in der Liste als „kommt später“.
const TEILE_ROH = [
  { id: 'kaschrut', title: 'Kaschrut', desc: 'Speisegesetze: erlaubte Tiere, Schlachten, Milch und Fleisch', geplant: 43, fragen: KASCHRUT },
  { id: 'schabbat', title: 'Schabbat', desc: 'Kerzen, Kiddusch, Verbote und Hawdala', geplant: 87, fragen: SCHABBAT },
  { id: 'feste', title: 'Feste (allgemein)', desc: 'Was an allen Feiertagen gilt', geplant: 18, fragen: FESTE },
  { id: 'jamim-noraim', title: 'Jamim Nora-im', desc: 'Rosch Haschana und Jom Kippur', geplant: 29, fragen: JAMIM_NORAIM },
  { id: 'sukkot', title: 'Sukkot', desc: 'Sukka, Feststrauß, Simchat Tora', geplant: 17, fragen: SUKKOT },
  { id: 'chanuka', title: 'Chanuka', desc: 'Lichterfest', geplant: 14, fragen: CHANUKA },
  { id: 'purim', title: 'Purim', desc: 'Megilla, Mischloach Manot, Seudat Purim', geplant: 10, fragen: PURIM },
  { id: 'pessach', title: 'Pessach', desc: 'Seder, Chamez, Omer', geplant: 47, fragen: PESSACH },
  { id: 'schawuot', title: 'Schawuot', desc: 'Zehn Gebote und Gebräuche', geplant: 11, fragen: SCHAWUOT },
  { id: 'kalender', title: 'Der jüdische Kalender', desc: 'Monate, Feste, Fastentage', geplant: 36, fragen: KALENDER },
  { id: 'ethik', title: 'Ethik', desc: 'Begriffe und Grundfragen des Glaubens', geplant: 51, fragen: ETHIK },
  { id: 'leben', title: 'Jüdisches Leben', desc: 'Zizit, Tefillin, Lebenszyklus, Übertritt', geplant: 79, fragen: LEBEN },
  { id: 'geschichte', title: 'Jüdische Geschichte', desc: 'Patriarchen, Könige, Tempel', geplant: 14, fragen: GESCHICHTE },
  { id: 'lehren', title: 'Jüdische Lehren', desc: 'Tora, Mizwot, Gelehrte', geplant: 24, fragen: LEHREN },
  { id: 'synagoge', title: 'Synagoge', desc: 'Toralesung und Begriffe', geplant: 12, fragen: SYNAGOGE },
  { id: 'tefilla', title: 'Tefilla', desc: 'Gebete und Minjan', geplant: 20, fragen: TEFILLA },
  { id: 'brachot', title: 'Brachot', desc: 'Segenssprüche und Tischgebet', geplant: 13, fragen: BRACHOT },
  { id: 'taharat', title: 'Taharat Hamischpacha', desc: 'Familienreinheit', geplant: 9, fragen: TAHARAT },
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
