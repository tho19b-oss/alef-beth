// Giur-Wissen: Prüfung der Antwort-Entwürfe in der App.
//
// Zu jeder Antwort kann man festhalten, ob sie stimmt („Stimmt so“, „Mit
// Änderung“, „Falsch“), und eine Anmerkung oder Korrektur notieren, etwa was der
// Rabbiner dazu gesagt hat. Der Stand lässt sich als Text oder Datei
// weitergeben und wieder laden. Das Dateiformat ist dasselbe wie beim Prüfbogen
// aus tools/giur-pruefbogen.mjs: beide Wege lassen sich mischen.

import { state, save } from './state.js';
import { esc } from './util.js';
import { icon, toast } from './ui.js';

const FORMAT = 'giur-pruefbogen-v1';

export const URTEILE = [
  ['stimmt', 'Stimmt so'],
  ['aenderung', 'Mit Änderung'],
  ['falsch', 'Falsch'],
];
const URTEIL_TEXT = { stimmt: 'stimmt so', aenderung: 'MIT ÄNDERUNG', falsch: 'FALSCH' };

const reviews = () => state.giur.reviews;
export const reviewOf = (id) => reviews()[id] || null;

// Eingabe übernehmen. Ist weder ein Urteil noch eine Notiz übrig, verschwindet
// der Eintrag ganz.
function setReview(id, patch) {
  const next = { urteil: '', notiz: '', ...reviews()[id], ...patch, am: Date.now() };
  if (!next.urteil && !next.notiz.trim()) delete reviews()[id];
  else reviews()[id] = next;
}

// ---------- Prüfung bei einer Antwort ----------

export function reviewHtml(q) {
  const r = reviewOf(q.id) || { urteil: '', notiz: '' };
  const choice = ([key, label]) => `<button class="giur-choice giur-choice--${key} text-label" type="button" data-urteil="${key}" aria-pressed="${r.urteil === key}">${label}</button>`;
  return `
    <div class="giur-review" data-id="${q.id}">
      <p class="giur-review__label text-overline">Deine Prüfung</p>
      <div class="giur-choices" role="group" aria-label="Stimmt die Antwort?">${URTEILE.map(choice).join('')}</div>
      <textarea class="ab-input giur-note text-body" rows="2" aria-label="Anmerkung oder Korrektur"
        placeholder="Anmerkung oder Korrektur, z. B. was dein Rabbiner dazu sagt">${esc(r.notiz)}</textarea>
    </div>`;
}

// Hört auf Klicks und Eingaben in allen Prüfbereichen unterhalb von root.
// onChange(id) wird nach jeder Änderung gerufen (z. B. um Zähler zu erneuern).
export function wireReview(root, onChange = () => {}) {
  let timer = null;

  root.addEventListener('click', (e) => {
    const b = e.target.closest('.giur-choice');
    if (!b || !root.contains(b)) return;
    const box = b.closest('.giur-review');
    const { id } = box.dataset;
    // Ein zweiter Klick auf die gewählte Beurteilung nimmt sie zurück.
    const next = reviewOf(id)?.urteil === b.dataset.urteil ? '' : b.dataset.urteil;
    setReview(id, { urteil: next });
    box.querySelectorAll('.giur-choice').forEach((x) =>
      x.setAttribute('aria-pressed', String(x.dataset.urteil === next)));
    save();
    onChange(id);
  });

  root.addEventListener('input', (e) => {
    const t = e.target.closest('.giur-note');
    if (!t || !root.contains(t)) return;
    const { id } = t.closest('.giur-review').dataset;
    setReview(id, { notiz: t.value });
    clearTimeout(timer);
    timer = setTimeout(() => { save(); onChange(id); }, 300);
  });

  // Beim Verlassen des Feldes sofort sichern, falls die Wartezeit noch läuft.
  root.addEventListener('focusout', (e) => {
    const t = e.target.closest?.('.giur-note');
    if (!t || !root.contains(t)) return;
    clearTimeout(timer);
    save();
    onChange(t.closest('.giur-review').dataset.id);
  });
}

// ---------- Zahlen und Weitergabe ----------

export function reviewStats(teil) {
  const rs = teil.fragen.map((q) => reviewOf(q.id)).filter(Boolean);
  const count = (u) => rs.filter((r) => r.urteil === u).length;
  return {
    beurteilt: rs.filter((r) => r.urteil).length,
    stimmt: count('stimmt'),
    aenderung: count('aenderung'),
    falsch: count('falsch'),
  };
}

function countText(teil) {
  const s = reviewStats(teil);
  return s.beurteilt ? `${s.beurteilt} von ${teil.fragen.length} beurteilt` : 'noch nichts beurteilt';
}

function reviewData(teil) {
  const antworten = {};
  for (const q of teil.fragen) {
    const r = reviewOf(q.id);
    if (r && (r.urteil || r.notiz.trim())) antworten[q.id] = { urteil: r.urteil, notiz: r.notiz.trim() };
  }
  return {
    format: FORMAT,
    teil: teil.id,
    geprueftVon: state.giur.pruefer.trim(),
    datum: new Date().toLocaleDateString('de-DE'),
    antworten,
  };
}

// Lesbarer Text zum Einfügen in Chat oder Mail (wie im Prüfbogen).
function reviewText(teil) {
  const d = reviewData(teil);
  const s = reviewStats(teil);
  const lines = [
    `Giur-Prüfbogen Teil ${teil.nr}: ${teil.title}`,
    `Geprüft von: ${d.geprueftVon || '–'}   Datum: ${d.datum}`,
    `${s.beurteilt} von ${teil.fragen.length} Fragen beurteilt (stimmt: ${s.stimmt}, mit Änderung: ${s.aenderung}, falsch: ${s.falsch})`,
    '',
  ];
  for (const q of teil.fragen) {
    const a = d.antworten[q.id];
    if (!a) continue;
    const kopf = `Frage ${q.nr} (${q.q.length > 70 ? `${q.q.slice(0, 67)}…` : q.q})`;
    lines.push(`${kopf} – ${a.urteil ? URTEIL_TEXT[a.urteil] : 'keine Beurteilung'}${a.notiz ? `: ${a.notiz}` : ''}`);
  }
  return lines.join('\n');
}

async function copyText(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }
  const ta = document.createElement('textarea');
  ta.value = text;
  document.body.append(ta);
  ta.select();
  document.execCommand('copy');
  ta.remove();
}

function downloadJson(teil) {
  const blob = new Blob([JSON.stringify(reviewData(teil), null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `Giur-Pruefbogen-${teil.id}-Ergebnis.json`;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// Eine gespeicherte Prüfung (aus der App oder aus dem Prüfbogen) übernehmen.
// Liefert die Zahl der übernommenen Fragen.
async function loadFile(teil, file) {
  const data = JSON.parse(await file.text());
  if (data.format !== FORMAT || data.teil !== teil.id) throw new Error('falsche Datei');
  let n = 0;
  for (const q of teil.fragen) {
    const a = data.antworten?.[q.id];
    if (!a) continue;
    setReview(q.id, {
      urteil: URTEILE.some(([k]) => k === a.urteil) ? a.urteil : '',
      notiz: String(a.notiz || ''),
    });
    n += 1;
  }
  if (data.geprueftVon) state.giur.pruefer = String(data.geprueftVon);
  save();
  return n;
}

// ---------- Bereich „Prüfung weitergeben“ auf der Teil-Seite ----------

export function panelHtml(teil, open = false) {
  const canShare = typeof navigator.share === 'function';
  return `
    <details class="giur-export ab-card"${open ? ' open' : ''}>
      <summary>
        <span class="text-strong">Prüfung weitergeben</span>
        <span class="giur-export__count text-caption" data-count>${countText(teil)}</span>
        <span class="giur-q__chev">${icon('chevron')}</span>
      </summary>
      <div class="giur-export__body">
        <p class="text-body">Bei jeder Antwort kannst du festhalten, ob sie stimmt, und eine Anmerkung
          notieren. Hier gibst du den Stand weiter, zum Beispiel an deinen Rabbiner oder an die
          Person, die die Antworten überarbeitet.</p>
        <label class="giur-field text-caption">Geprüft von (Name, Funktion)
          <input class="ab-input text-body" id="giur-pruefer" type="text" autocomplete="off" value="${esc(state.giur.pruefer)}">
        </label>
        <div class="giur-export__btns">
          <button class="ab-btn ab-btn--secondary text-button" type="button" data-act="text">${canShare ? 'Als Text teilen' : 'Als Text kopieren'}</button>
          <button class="ab-btn ab-btn--secondary text-button" type="button" data-act="datei">Als Datei speichern</button>
          <label class="ab-btn ab-btn--secondary text-button">Datei laden
            <input type="file" accept=".json,application/json" data-act="laden" hidden>
          </label>
        </div>
      </div>
    </details>`;
}

// onLoaded() wird gerufen, nachdem eine Datei geladen wurde (die Seite zeichnet
// sich dann neu). Rückgabe: refresh() erneuert den Zähler in der Kopfzeile.
export function wirePanel(root, teil, onLoaded) {
  const count = root.querySelector('[data-count]');

  root.querySelector('#giur-pruefer').addEventListener('input', (e) => {
    state.giur.pruefer = e.target.value;
    save();
  });

  root.querySelector('[data-act="text"]').addEventListener('click', async () => {
    const text = reviewText(teil);
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({ title: `Giur-Prüfbogen ${teil.title}`, text });
        return;
      } catch (e) {
        if (e.name === 'AbortError') return; // abgebrochen: nichts weiter tun
      }
    }
    try {
      await copyText(text);
      toast('Text kopiert – jetzt in den Chat oder die Mail einfügen.', { tone: 'success' });
    } catch {
      toast('Kopieren hat nicht geklappt. Bitte „Als Datei speichern“ nehmen.', { tone: 'error' });
    }
  });

  root.querySelector('[data-act="datei"]').addEventListener('click', () => {
    downloadJson(teil);
    toast('Datei gespeichert (meist im Ordner „Downloads“).', { tone: 'success' });
  });

  root.querySelector('[data-act="laden"]').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    e.target.value = '';
    if (!file) return;
    try {
      const n = await loadFile(teil, file);
      toast(`${n} ${n === 1 ? 'Eintrag' : 'Einträge'} geladen.`, { tone: 'success' });
      onLoaded();
    } catch {
      toast('Diese Datei passt nicht zu diesem Teil.', { tone: 'error' });
    }
  });

  return { refresh() { count.textContent = countText(teil); } };
}
