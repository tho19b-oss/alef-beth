// Persistenter App-Zustand in localStorage: XP, Streak, abgeschlossene
// Lektionen, SRS-Einträge und Einstellungen.

import { todayStr } from './util.js';
import { hasItem } from '../data/curriculum.js';

const KEY = 'alefbeth-state-v1';

const DEFAULTS = {
  xp: 0,
  streak: { count: 0, lastDay: null },
  lessons: {},   // lessonId -> { score, completedAt }
  srs: {},       // itemId  -> { streak, due, seen }
  settings: {
    audio: true,
    theme: 'auto',
    reduceMotion: false,
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
      return {
        ...DEFAULTS,
        ...s,
        streak: { ...DEFAULTS.streak, ...(s.streak || {}) },
        settings: {
          ...DEFAULTS.settings,
          ...(s.settings || {}),
          notifications: { ...DEFAULTS.settings.notifications, ...(s.settings?.notifications || {}) },
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

export function addXp(n) {
  state.xp += n;
  save();
}

// Heute gelernt? Streak fortschreiben (gestern gelernt → +1, sonst Neustart bei 1).
export function touchStreak() {
  const today = todayStr();
  if (state.streak.lastDay === today) return;
  const yesterday = todayStr(new Date(Date.now() - 86400000));
  state.streak.count = state.streak.lastDay === yesterday ? state.streak.count + 1 : 1;
  state.streak.lastDay = today;
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
