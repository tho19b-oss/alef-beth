// Hebräische Stimme. Erste Wahl sind aufgenommene Clips (audio/he/, erzeugt
// mit der Stimmen-Werkstatt in tools/stimme/). Fehlt ein Clip, spricht die
// Stimme des Geräts über die Web Speech API; ohne beides bleibt die App stumm.

import { state } from './state.js';

// ---------- Clips ----------

const CLIP_DIR = 'audio/he/';

// Die Liste kommt vor allem anderen: Lektionen planen ihre Hör-Übungen danach,
// ob es eine Stimme gibt. Hängt das Netz, wartet die App höchstens 2 s.
async function loadClipList() {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 2000);
  try {
    const res = await fetch(`${CLIP_DIR}index.json`, { signal: ctrl.signal });
    if (!res.ok) return null;
    const list = await res.json();
    return list && list.clips ? list : null;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

const clipList = await loadClipList();
const clips = new Map(Object.entries(clipList?.clips || {}).map(([text, file]) => [text.normalize('NFC'), file]));

// ---------- Stimme des Geräts ----------
// Stimmen laden asynchron – deshalb auf 'voiceschanged' lauschen.

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
  if (!before && heVoice && !clips.size) {
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

function hasHebrewVoice() {
  if ('speechSynthesis' in window && !heVoice) refreshVoices();
  return !!heVoice;
}

// Es gibt eine hebräische Stimme: Clips oder die des Geräts.
export function voiceAvailable() {
  return clips.size > 0 || (ttsSupported() && hasHebrewVoice());
}

// Audio nutzbar = Stimme vorhanden + in den Einstellungen aktiv
export function audioActive() {
  return voiceAvailable() && state.settings.audio;
}

// Für die Einstellungen: welche Stimme spricht und woher sie kommt.
export function voiceInfo() {
  if (clips.size) return { clips: true, name: clipList.stimme || 'Aufnahme', herkunft: clipList.herkunft || '' };
  if (ttsSupported() && hasHebrewVoice()) return { clips: false, name: heVoice.name };
  return null;
}

// ---------- Sprechen ----------

const NORMAL_RATE = 0.8; // Gerätestimme
const SLOW_RATE = 0.5;
// Clips klingen im natürlichen Tempo; langsam mit gleicher Tonhöhe.
const CLIP_SLOW_RATE = 0.7;
// So lange nach dem letzten Abspielen gilt ein Tippen als „nochmal“.
const AGAIN_MS = 4000;

// 12 ms Stille: entsperrt das Audio-Element unter iOS (siehe unlock).
const SILENCE = 'data:audio/wav;base64,UklGRogAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YWQAAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA';

let player = null;
let seq = 0; // zählt jede Äußerung – eine überholte spielt nicht mehr nach
let ending = null; // löscht die Anzeige der laufenden Äußerung
const urls = new Map(); // Datei → Promise der Blob-URL

function endCurrent() {
  if (ending) ending();
  ending = null;
}

// Ein einziges Element für alle Clips: iOS gibt es nach der ersten Berührung
// frei, danach dürfen auch Clips ohne Tippen spielen (Lernkarte, Lösung).
function getPlayer() {
  if (!player) {
    player = new Audio();
    // Ein 'ended' des Vorgängers kann noch eintreffen, wenn schon der nächste
    // Clip lädt – dann ist player.ended falsch und die Anzeige bleibt.
    player.addEventListener('ended', () => { if (player.ended) endCurrent(); });
    player.addEventListener('error', endCurrent);
  }
  return player;
}

function unlock() {
  removeEventListener('pointerdown', unlock, true);
  removeEventListener('keydown', unlock, true);
  const p = getPlayer();
  if (!p.paused) return; // spielt schon (Desktop erlaubt das auch ohne Tippen)
  p.src = SILENCE;
  p.play().catch(() => {});
}

if (clips.size) {
  addEventListener('pointerdown', unlock, true);
  addEventListener('keydown', unlock, true);
}

// Clips als Blob-URL abspielen: Safari spielt Audio aus dem Cache des Service
// Workers sonst nicht zuverlässig, weil es Teilstücke (Range) anfragt.
function clipUrl(file) {
  let url = urls.get(file);
  if (!url) {
    url = fetch(CLIP_DIR + file)
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.blob();
      })
      .then((blob) => URL.createObjectURL(blob));
    url.catch(() => urls.delete(file));
    urls.set(file, url);
  }
  return url;
}

// Zeigt an einem Element, dass es gerade spricht (is-playing). Ein abgebrochener
// Vorgänger meldet sein Ende oft erst später – die Marke sorgt dafür, dass er
// die Anzeige des neuen Durchgangs nicht löscht.
function showPlaying(from) {
  if (!from) return () => {};
  from.spokenAt = Date.now();
  const mark = (from.speakMark = (from.speakMark || 0) + 1);
  const stop = () => { if (from.speakMark === mark) from.classList.remove('is-playing'); };
  from.classList.add('is-playing');
  setTimeout(stop, 8000); // falls ein Browser das Ende verschluckt
  return stop;
}

function speakDevice(text, slow, stop) {
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'he-IL';
  u.voice = heVoice;
  u.rate = slow ? SLOW_RATE : NORMAL_RATE;
  u.addEventListener('end', stop);
  u.addEventListener('error', stop);
  speechSynthesis.speak(u);
}

async function playClip(file, text, slow, my, stop) {
  let url = null;
  try {
    url = await clipUrl(file);
  } catch {
    // Clip nicht ladbar (offline und nie gecacht) – dann die Gerätestimme.
  }
  if (my !== seq) return; // inzwischen überholt oder abgebrochen
  if (!url) {
    if (ttsSupported() && hasHebrewVoice()) speakDevice(text, slow, stop);
    else stop();
    return;
  }
  const p = getPlayer();
  p.src = url;
  // Ein neuer src setzt das Tempo zurück – deshalb erst danach setzen.
  p.preservesPitch = true;
  p.defaultPlaybackRate = p.playbackRate = slow ? CLIP_SLOW_RATE : 1;
  p.play().catch(() => { if (my === seq) endCurrent(); });
}

// Bricht ab, was gerade gesprochen wird (Clip oder Gerätestimme).
export function stopSpeech() {
  seq += 1;
  endCurrent();
  if (player && !player.paused) player.pause();
  if ('speechSynthesis' in window) speechSynthesis.cancel();
}

// Ohne hebräische Stimme wird bewusst geschwiegen: eine deutsche Stimme würde
// hebräische Buchstaben als Kauderwelsch vorlesen und mehr verwirren als helfen.
// from: Element, das während des Sprechens „sendet“ (Klasse is-playing).
// slow: langsamer, für „nochmal“.
export function speak(text, { slow = false, from = null } = {}) {
  if (!text || !audioActive()) return;
  stopSpeech();
  const my = seq;
  ending = showPlaying(from);
  const file = clips.get(text.normalize('NFC'));
  if (file) playClip(file, text, slow, my, ending);
  else if (ttsSupported() && hasHebrewVoice()) speakDevice(text, slow, ending);
  else endCurrent();
}

// Ein Hören-Knopf wurde angetippt. Kam sein Wort eben erst (auch automatisch
// beim Aufdecken), hat man es wohl nicht verstanden – dann klingt es langsamer.
export function speakTapped(btn) {
  const again = Date.now() - (btn.spokenAt || 0) < AGAIN_MS;
  speak(btn.dataset.tts, { from: btn, slow: again });
}
