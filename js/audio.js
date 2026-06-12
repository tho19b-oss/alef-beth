// Hebräische Sprachausgabe über die Web Speech API.
// Stimmen laden asynchron – deshalb auf 'voiceschanged' lauschen.

import { state } from './state.js';

let heVoice = null;

function refreshVoices() {
  const voices = speechSynthesis.getVoices();
  heVoice =
    voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('he')) ||
    voices.find((v) => /hebrew|ivrit/i.test(v.name)) ||
    null;
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

export function speak(text, { rate = 0.8 } = {}) {
  if (!text || !ttsSupported() || !state.settings.audio) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'he-IL';
  if (heVoice) u.voice = heVoice;
  u.rate = rate;
  speechSynthesis.speak(u);
}
