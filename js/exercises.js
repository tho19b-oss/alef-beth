// Übungstypen: Lernkarte (neues Zeichen oder Wort), Wissenskarte, Multiple
// Choice (beide Richtungen), Hören & Wählen, Paare finden – gebaut aus den
// Komponenten des Design Systems (LetterCard, InfoCard, AnswerTile, PairMatch).
// renderExercise(ex, host, onAnswered) rendert eine Übung; onAnswered(correct, detailHtml)
// wird genau einmal gerufen, sobald der Nutzer geantwortet hat.

import { getItem, display, mainLabel, subLabel, ttsText, pickDistractors } from '../data/curriculum.js';
import { LETTERS } from '../data/letters.js';
import { speak, speakTapped, audioActive } from './audio.js';
import { shuffle } from './util.js';
import { icon, he, sound } from './ui.js';

// Karten ohne Abfrage (der Player zeigt sofort „Weiter“)
export function isPassive(ex) {
  return ex.kind === 'intro' || ex.kind === 'info';
}

export function renderExercise(ex, host, onAnswered) {
  host.innerHTML = '';
  switch (ex.kind) {
    case 'intro': return renderIntro(ex, host);
    case 'info': return renderInfo(ex, host);
    case 'mc': return renderMc(ex, host, onAnswered);
    case 'listen': return renderListen(ex, host, onAnswered);
    case 'match': return renderMatch(ex, host, onAnswered);
    default: throw new Error(`Unbekannter Übungstyp: ${ex.kind}`);
  }
}

// ---------- Hilfen ----------

// Schriftgröße für Hebräisch: groß als Frage, kleiner auf Kacheln.
// Ganze Wörter brauchen eine Stufe weniger als einzelne Zeichen.
function promptSize(item) {
  return item.type === 'word' ? 'glyph-lg' : 'glyph-xl';
}
function tileSize(item) {
  return item.type === 'word' ? 'hebrew-line' : 'glyph-md';
}

function audioButton(text, { big = false, label = 'Anhören' } = {}) {
  if (!text || !audioActive()) return '';
  return `<button class="ab-audio${big ? ' ab-audio--lg' : ''}" type="button" data-tts="${text}" aria-label="${label}">${icon('speaker')}</button>`;
}

function wireAudio(host) {
  host.querySelectorAll('[data-tts]').forEach((b) => b.addEventListener('click', () => speakTapped(b)));
}

// Beim Aufdecken gleich vorlesen – der Lautsprecher-Knopf sendet mit.
function autoplay(host, text) {
  if (text) speak(text, { from: host.querySelector('.ab-audio') });
}

function optLabel(item, field) {
  return field === 'meaning' ? item.meaning : mainLabel(item);
}

function optSub(item, field) {
  return field === 'meaning' ? '' : subLabel(item);
}

function optionItemsFor(ex, item, field) {
  if (ex.optionIds) return ex.optionIds.map(getItem);
  return [item, ...pickDistractors(item, ex.poolIds || [], 3, field === 'meaning' ? 'meaning' : 'main')];
}

// Antwortkachel; die Ziffer für die Tastatur zeigt components.css nur auf
// Geräten mit Maus.
function tile(i, mainHtml, sub = '') {
  return `<button class="ab-tile" type="button" data-i="${i}">`
    + `<span class="ab-tile__key text-caption" aria-hidden="true">${i + 1}</span>`
    + mainHtml
    + (sub ? `<span class="ab-tile__sub text-caption">${sub}</span>` : '')
    + '</button>';
}

// Antwort auswerten: gewählte Kachel richtig/falsch markieren, die richtige
// immer zeigen, den Rest zurücknehmen.
function wireTiles(host, options, onAnswered, detail) {
  const tiles = [...host.querySelectorAll('.ab-tile')];
  tiles.forEach((t) => t.addEventListener('click', () => {
    const o = options[+t.dataset.i];
    tiles.forEach((x) => { x.disabled = true; });
    t.classList.add(o.correct ? 'is-correct' : 'is-wrong');
    if (!o.correct) tiles[options.findIndex((x) => x.correct)].classList.add('is-correct');
    tiles.forEach((x) => { if (!x.matches('.is-correct, .is-wrong')) x.classList.add('is-dimmed'); });
    onAnswered(o.correct, o.correct ? detail : `Richtig wäre: ${detail}`);
  }));
}

// ---------- Lernkarte (neues Lernitem) ----------

const fact = (label, valueHtml) => `<div class="ab-fact"><dt>${label}</dt><dd>${valueHtml}</dd></div>`;

// Lautvariante. Mit hebräischer Stimme ein Knopf, der eine Silbe mit Kamatz
// spricht (בָ „wa“ / בָּ „ba“) – so wird der Unterschied hörbar; ohne Stimme
// eine stille Kachel.
function variant(glyph, translit, sub) {
  const lines = (tag) => `<${tag} class="glyph-md" lang="he" dir="rtl">${glyph}</${tag}>`
    + `<${tag} class="ab-variant__sound text-strong">${translit}</${tag}>`
    + `<${tag} class="ab-variant__sub text-caption">${sub}</${tag}>`;
  if (!audioActive()) return `<div class="ab-variant">${lines('div')}</div>`;
  // NFC sortiert das Kamatz vor Dagesch und Schin-Punkt, wie in den Daten.
  const syllable = `${glyph}\u05B8`.normalize('NFC');
  return `<button class="ab-variant" type="button" data-tts="${syllable}" aria-label="${translit} (${sub}) anhören">`
    + `<span class="ab-variant__spk" aria-hidden="true">${icon('speaker')}</span>${lines('span')}</button>`;
}

function renderIntro(ex, host) {
  const item = getItem(ex.itemId);
  const tts = ttsText(item);
  const word = item.type === 'word';

  const kicker = item.type === 'letter' ? 'Neuer Buchstabe'
    : item.type === 'vowel' ? 'Neues Vokalzeichen' : 'Neues Wort';
  // Wörter tragen ihre Umschrift als Namen, Zeichen ihren Namen plus Laut-Pille.
  const name = word ? item.translit : item.name;
  const pill = item.type === 'letter' ? item.translit : item.type === 'vowel' ? item.soundLabel : '';
  // Platz im Alphabet (Endformen haben keinen eigenen)
  const pos = LETTERS.findIndex((l) => l.id === item.id);
  const index = pos >= 0 ? `${pos + 1} / ${LETTERS.length}` : item.baseId ? 'Endform' : '';

  // Lautvarianten nebeneinander: Dagesch oder Schin/Sin, zum Antippen
  let variants = '';
  if (item.type === 'letter' && (item.dagesh || item.variant)) {
    const baseSound = item.translit.split('/')[0].trim();
    const cells = item.dagesh
      ? [variant(item.glyph, baseSound, 'ohne Punkt'), variant(item.dagesh.glyph, item.dagesh.translit, 'mit Punkt')]
      : [variant(item.glyph, baseSound, 'Punkt rechts'), variant(item.variant.glyph, item.variant.translit, 'Punkt links')];
    variants = `<div class="ab-variants">${cells.join('')}</div>`;
  }

  const facts = [];
  if (item.type === 'letter') {
    facts.push(fact('Laut', item.sound));
    if (item.final) {
      const f = getItem(item.final);
      facts.push(fact('Am Wortende', `${he(f.glyph, 'glyph-sm')} (${f.name})`));
    }
    if (item.baseId) {
      const b = getItem(item.baseId);
      facts.push(fact('Grundform', `${he(b.glyph, 'glyph-sm')} (${b.name})`));
    }
    if (item.mnemonic) facts.push(fact('Merkhilfe', item.mnemonic));
  } else if (item.type === 'vowel') {
    const [laut, ...rest] = item.sound.split(' – ');
    facts.push(fact('Laut', laut));
    if (rest.length) facts.push(fact('Zeichen', rest.join(' – ')));
    facts.push(fact('Beispiel', `${he(item.example, 'glyph-sm')} → „${item.exampleTranslit}“`));
  } else {
    facts.push(fact('Bedeutung', item.meaning));
  }

  const audio = audioButton(tts, { label: `${name} anhören` });
  host.innerHTML = `
    <article class="ab-card ab-lettercard ab-enter" aria-label="${kicker}: ${name}">
      <p class="ab-lettercard__kicker text-overline">${kicker}</p>
      <div class="ab-lettercard__stage${word ? ' ab-lettercard__stage--word' : ''}">
        ${index ? `<span class="ab-lettercard__index text-caption">${index}</span>` : ''}
        <span class="ab-lettercard__glyph ${promptSize(item)}" lang="he" dir="rtl">${display(item)}</span>
      </div>
      <h2 class="ab-lettercard__name text-letter-name">${name}</h2>
      ${pill ? `<div class="ab-lettercard__sound"><span class="ab-pill text-label">${pill}</span></div>` : ''}
      ${variants}
      <dl class="ab-facts text-body">${facts.join('')}</dl>
      ${audio ? `<div class="ab-lettercard__audio">${audio}</div>` : ''}
    </article>`;
  wireAudio(host);
  autoplay(host, tts);
}

// ---------- Wissenskarte ----------

function renderInfo(ex, host) {
  host.innerHTML = `
    <article class="ab-card ab-info ab-enter">
      <span class="ab-info__tag text-overline">${icon(ex.icon || 'bulb')}${ex.tag || 'Gut zu wissen'}</span>
      <h2 class="ab-info__title text-heading">${ex.title}</h2>
      ${ex.html}
    </article>`;
  wireAudio(host);
}

// ---------- Multiple Choice ----------

function mcQuestion(ex, item, field) {
  if (ex.custom) return ex.custom.question;
  if (ex.dir === 'he2de') {
    if (item.type === 'letter') return 'Wie heißt dieser Buchstabe?';
    if (item.type === 'vowel') return 'Wie heißt dieses Vokalzeichen?';
    if (item.type === 'syllable') return 'Wie liest man diese Silbe?';
    return field === 'meaning' ? 'Was bedeutet dieses Wort?' : 'Wie liest man dieses Wort?';
  }
  if (item.type === 'letter') return `Welcher Buchstabe ist „${item.name}“?`;
  if (item.type === 'vowel') return `Welches Zeichen ist „${item.name}“?`;
  return field === 'meaning'
    ? `Welches Wort bedeutet „${item.meaning}“?`
    : `Welches Wort liest man „${item.translit}“?`;
}

function renderMc(ex, host, onAnswered) {
  const item = ex.itemId ? getItem(ex.itemId) : null;
  const field = ex.field || 'main';

  let options;
  let tiles;
  if (ex.options) {
    options = shuffle(ex.options.map((o) => ({ correct: !!o.correct, label: o.label })));
    tiles = options.map((o, i) => tile(i, `<span class="text-strong">${o.label}</span>`));
  } else if (ex.dir === 'de2he') {
    options = shuffle(optionItemsFor(ex, item, field).map((it) => ({ it, correct: it.id === item.id })));
    tiles = options.map((o, i) => tile(i, he(display(o.it), tileSize(o.it))));
  } else {
    options = shuffle(optionItemsFor(ex, item, field).map((it) => ({ it, correct: it.id === item.id })));
    tiles = options.map((o, i) =>
      tile(i, `<span class="text-strong">${optLabel(o.it, field)}</span>`, optSub(o.it, field)));
  }

  let prompt;
  if (ex.custom) {
    prompt = he(ex.custom.hebrew, 'hebrew-line');
  } else if (ex.dir === 'he2de') {
    prompt = he(display(item), promptSize(item)) + audioButton(ttsText(item));
  } else {
    // Kurze Namen groß; lange Bedeutungen („der Name“ – Kürzel für …) eine Stufe kleiner.
    const label = field === 'meaning' ? item.meaning : mainLabel(item);
    prompt = `<span class="${label.length > 20 ? 'text-title' : 'text-display'}">${label}</span>`;
  }

  host.innerHTML = `
    <p class="ab-question text-question">${mcQuestion(ex, item, field)}</p>
    <div class="ab-prompt">${prompt}</div>
    <div class="ab-tiles${ex.options ? ' ab-tiles--stack' : ''}">${tiles.join('')}</div>`;
  wireAudio(host);

  const detail = ex.custom
    ? ex.custom.answerText
    : `${he(display(item), 'glyph-sm')} = ${optLabel(item, field)}${optSub(item, field) ? ` (${optSub(item, field)})` : ''}`;
  wireTiles(host, options, onAnswered, detail);
}

// ---------- Hören & Wählen ----------

function renderListen(ex, host, onAnswered) {
  const item = getItem(ex.itemId);
  const tts = ttsText(item);
  const options = shuffle(optionItemsFor(ex, item, 'main').map((it) => ({ it, correct: it.id === item.id })));

  host.innerHTML = `
    <p class="ab-question text-question">Was hörst du?</p>
    <div class="ab-prompt">${audioButton(tts, { big: true, label: 'Nochmal anhören' })}</div>
    <div class="ab-tiles">${options.map((o, i) => tile(i, he(display(o.it), tileSize(o.it)))).join('')}</div>`;
  wireAudio(host);
  autoplay(host, tts);

  wireTiles(host, options, onAnswered, `${he(display(item), 'glyph-sm')} – ${mainLabel(item)}`);
}

// ---------- Paare finden ----------

function renderMatch(ex, host, onAnswered) {
  const items = ex.itemIds.map(getItem);
  host.innerHTML = `
    <p class="ab-question text-question">Finde die Paare!</p>
    <div class="ab-pairs">
      <div class="ab-pairs__col">${shuffle(items).map((it) =>
        `<button class="ab-pair ${tileSize(it)}" type="button" lang="he" dir="rtl" data-side="l" data-id="${it.id}">${display(it)}</button>`).join('')}</div>
      <div class="ab-pairs__col">${shuffle(items).map((it) =>
        `<button class="ab-pair text-strong" type="button" data-side="r" data-id="${it.id}">${mainLabel(it)}</button>`).join('')}</div>
    </div>`;

  let sel = { l: null, r: null };
  let mistakes = 0;
  let matched = 0;
  let locked = false;

  host.querySelectorAll('.ab-pair').forEach((btn) =>
    btn.addEventListener('click', () => {
      if (locked || btn.disabled) return;
      const side = btn.dataset.side;
      if (sel[side] === btn) {
        btn.classList.remove('is-selected');
        sel[side] = null;
        return;
      }
      sel[side]?.classList.remove('is-selected');
      sel[side] = btn;
      btn.classList.add('is-selected');
      if (!(sel.l && sel.r)) {
        sound('paarTipp');
        return;
      }

      const a = sel.l;
      const b = sel.r;
      sel = { l: null, r: null };
      a.classList.remove('is-selected');
      b.classList.remove('is-selected');
      if (a.dataset.id === b.dataset.id) {
        // Paar gefunden: kurz grün aufleuchten, dann zurücktreten.
        a.disabled = true;
        b.disabled = true;
        a.classList.add('is-match');
        b.classList.add('is-match');
        // Jedes Paar einen Ton höher, das letzte schließt den Akkord. Danach
        // spricht die Stimme das Gefundene – erst jetzt: beim Antippen würde
        // sie die Lösung verraten.
        sound('paar', { k: matched, n: items.length });
        const tts = ttsText(getItem(a.dataset.id));
        setTimeout(() => { if (a.isConnected) speak(tts); }, 300);
        matched += 1;
        const last = matched === items.length;
        setTimeout(() => {
          a.classList.replace('is-match', 'is-done');
          b.classList.replace('is-match', 'is-done');
          if (last) {
            onAnswered(mistakes === 0, mistakes === 0
              ? 'Alle Paare auf Anhieb gefunden!'
              : `Alle Paare gefunden – mit ${mistakes} ${mistakes === 1 ? 'Fehlversuch' : 'Fehlversuchen'}.`);
          }
        }, 450);
      } else {
        mistakes += 1;
        locked = true;
        sound('falsch');
        a.classList.add('is-miss');
        b.classList.add('is-miss');
        setTimeout(() => {
          a.classList.remove('is-miss');
          b.classList.remove('is-miss');
          locked = false;
        }, 450);
      }
    }));
}
