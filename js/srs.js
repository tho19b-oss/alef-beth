// Vereinfachtes Spaced-Repetition-System: feste Intervallleiter statt SM-2-Ease.
// Richtig → nächste Stufe (1→3→7→14→30→90 Tage), falsch → zurück auf Start,
// Item wird nach 10 Minuten wieder fällig.

const DAY = 86400000;
const INTERVALS = [1, 3, 7, 14, 30, 90]; // Tage je Erfolgs-Stufe

export function applyResult(srsMap, itemId, correct) {
  const now = Date.now();
  const e = srsMap[itemId] || { streak: 0, due: now, seen: 0 };
  e.seen += 1;
  if (correct) {
    e.streak = Math.min(e.streak + 1, INTERVALS.length);
    e.due = now + INTERVALS[e.streak - 1] * DAY;
  } else {
    e.streak = 0;
    e.due = now + 10 * 60 * 1000;
  }
  srsMap[itemId] = e;
}

// Fällige Items, am längsten überfällige zuerst.
export function dueIds(srsMap) {
  const now = Date.now();
  return Object.keys(srsMap)
    .filter((id) => srsMap[id].due <= now)
    .sort((a, b) => srsMap[a].due - srsMap[b].due);
}

// Zeitpunkt der nächsten Fälligkeit (null, wenn noch nichts gelernt wurde).
export function nextDue(srsMap) {
  const dues = Object.values(srsMap).map((e) => e.due);
  return dues.length ? Math.min(...dues) : null;
}
