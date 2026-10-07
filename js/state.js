// Persistenter App-Zustand in localStorage: XP, Streak, abgeschlossene
// Lektionen, SRS-Einträge, Tagesziel, Abzeichen und Einstellungen.

import { todayStr } from './util.js';
import { hasItem } from '../data/curriculum.js';

const KEY = 'alefbeth-state-v1';
const DAY = 86400000;

// Bonus für ein erreichtes Tagesziel (Gamification-Regeln im Design System).
export const GOAL_BONUS = 20;

const DEFAULTS = {
  xp: 0,
  streak: { count: 0, lastDay: null },
  lessons: {},   // lessonId -> { score, completedAt }
  srs: {},       // itemId  -> { streak, due, seen }
  daily: { day: null, xp: 0, claimed: false }, // XP des heutigen Tages fürs Tagesziel
  history: {},   // YYYY-MM-DD -> XP an diesem Tag (letzte Wochen, für die Wochenansicht)
  stats: { listenCorrect: 0, bestStreak: 0 },
  badges: null,  // Abzeichen-ID -> Zeitpunkt; null = Stand von vor den Abzeichen
  settings: {
    audio: true,
    theme: 'auto',
    reduceMotion: false,
    dailyGoal: 100,
    notifications: { enabled: false, time: '19:00' },
  },
};

// Einträge zu Lernitems, die es nicht mehr gibt (umbenannte oder gelöschte
// Wörter/Silben), aussortieren. Sonst wirft getItem() später mitten in einer
// Übung – und die App bliebe mit leerem Bildschirm stehen.
function pruneSrs(srs) {
  const clean = {};
  for (const [id, entry] of Object.entries(srs || {})) {
    if (hasItem(id) && entry && typeof entry.due === 'number') clean[id] = entry;
  }
  return clean;
}

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const s = JSON.parse(raw);
      // Frische Kopie der Vorgaben: verschachtelte Objekte dürfen nicht mit
      // DEFAULTS geteilt werden, sonst ändert der erste Spielzug die Vorgabe.
      const d = structuredClone(DEFAULTS);
      return {
        ...d,
        ...s,
        streak: { ...d.streak, ...(s.streak || {}) },
        daily: { ...d.daily, ...(s.daily || {}) },
        history: s.history || {},
        // Ältere Stände kennen keine Bestmarke: die laufende Serie ist die beste bekannte.
        stats: { ...d.stats, bestStreak: s.streak?.count || 0, ...(s.stats || {}) },
        badges: s.badges ?? null,
        settings: {
          ...d.settings,
          ...(s.settings || {}),
          notifications: { ...d.settings.notifications, ...(s.settings?.notifications || {}) },
        },
        lessons: s.lessons || {},
        srs: pruneSrs(s.srs),
      };
    }
  } catch (e) {
    console.warn('Konnte gespeicherten Zustand nicht laden:', e);
  }
  return structuredClone(DEFAULTS);
}

export const state = load();

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch (e) {
    console.warn('Konnte Zustand nicht speichern:', e);
  }
}

// XP gutschreiben – zählt auch fürs Tagesziel und die Wochenansicht.
export function addXp(n) {
  rollDay();
  state.xp += n;
  state.daily.xp += n;
  const today = todayStr();
  state.history[today] = (state.history[today] || 0) + n;
  const oldest = todayStr(new Date(Date.now() - 35 * DAY));
  for (const day of Object.keys(state.history)) if (day < oldest) delete state.history[day];
  save();
}

// Neuer Tag: Tageszähler zurücksetzen. Ein erreichtes, aber nicht abgeholtes
// Tagesziel wird dabei still gutgeschrieben – der Bonus geht nicht verloren.
function rollDay() {
  const today = todayStr();
  if (state.daily.day === today) return;
  const d = state.daily;
  if (d.day && !d.claimed && d.xp >= state.settings.dailyGoal) state.xp += GOAL_BONUS;
  state.daily = { day: today, xp: 0, claimed: false };
}

export function todayXp() {
  return state.daily.day === todayStr() ? state.daily.xp : 0;
}

export function canClaimBonus() {
  return todayXp() >= state.settings.dailyGoal && !state.daily.claimed;
}

export function claimBonus() {
  if (!canClaimBonus()) return false;
  state.daily.claimed = true;
  state.xp += GOAL_BONUS;
  save();
  return true;
}

// Wurde an diesem Tag gelernt? Aus der Wochenstatistik oder – für Tage vor
// ihrer Einführung – aus der laufenden Serie abgeleitet.
export function learnedOn(day) {
  if ((state.history[day] || 0) > 0) return true;
  const { lastDay, count } = state.streak;
  if (!lastDay || !count) return false;
  const diff = Math.round((new Date(`${lastDay}T00:00`) - new Date(`${day}T00:00`)) / DAY);
  return diff >= 0 && diff < count;
}

// Heute gelernt? Streak fortschreiben (gestern gelernt → +1, sonst Neustart bei 1).
export function touchStreak() {
  const today = todayStr();
  if (state.streak.lastDay === today) return;
  const yesterday = todayStr(new Date(Date.now() - 86400000));
  state.streak.count = state.streak.lastDay === yesterday ? state.streak.count + 1 : 1;
  state.streak.lastDay = today;
  state.stats.bestStreak = Math.max(state.stats.bestStreak, state.streak.count);
  save();
}

// Anzeige-Streak: gestern oder heute gelernt → Zähler gilt, sonst 0.
export function currentStreak() {
  const today = todayStr();
  const yesterday = todayStr(new Date(Date.now() - 86400000));
  if (state.streak.lastDay === today || state.streak.lastDay === yesterday) {
    return state.streak.count;
  }
  return 0;
}

export function completeLesson(id, score) {
  const prev = state.lessons[id];
  state.lessons[id] = {
    score: Math.max(score, prev?.score ?? 0),
    completedAt: prev?.completedAt ?? Date.now(),
  };
  save();
}

export function resetAll() {
  localStorage.removeItem(KEY);
  location.hash = '#/';
  location.reload();
}
