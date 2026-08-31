// Hebräische Sprachausgabe über die Web Speech API.
// Stimmen laden asynchron – deshalb auf 'voiceschanged' lauschen.

import { state } from './state.js';

let heVoice = null;

function findHebrewVoice() {
  const voices = speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('he')) ||
    voices.find((v) => /hebrew|ivrit/i.test(v.name)) ||
    null
  );
}

function refreshVoices() {
  const before = heVoice;
  heVoice = findHebrewVoice();
  // Kommt die Stimme erst nachträglich an, dürfen Screens neu rendern
  // (sonst bliebe der erste Aufruf der App stumm, obwohl Audio möglich wäre).
  if (!before && heVoice) {
    window.dispatchEvent(new CustomEvent('hebrewvoiceready'));
  }
}

if ('speechSynthesis' in window) {
  refreshVoices();
  speechSynthesis.addEventListener('voiceschanged', refreshVoices);
}

export function ttsSupported() {
  return 'speechSynthesis' in window;
}

export function hasHebrewVoice() {
  if ('speechSynthesis' in window && !heVoice) refreshVoices();
  return !!heVoice;
}

export function hebrewVoiceName() {
  return heVoice ? heVoice.name : null;
}

// Audio nutzbar = unterstützt + Stimme vorhanden + in den Einstellungen aktiv
export function audioActive() {
  return ttsSupported() && hasHebrewVoice() && state.settings.audio;
}

// Ohne hebräische Stimme wird bewusst geschwiegen: eine deutsche Stimme würde
// hebräische Buchstaben als Kauderwelsch vorlesen und mehr verwirren als helfen.
export function speak(text, { rate = 0.8 } = {}) {
  if (!text || !audioActive()) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'he-IL';
  u.voice = heVoice;
  u.rate = rate;
  speechSynthesis.speak(u);
}
