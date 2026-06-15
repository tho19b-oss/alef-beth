// Übungstypen: Intro-/Info-Karten, Multiple Choice (beide Richtungen),
// Hören & Wählen, Paare zuordnen.
// renderExercise(ex, host, onAnswered) rendert eine Übung; onAnswered(correct, detailHtml)
// wird genau einmal gerufen, sobald der Nutzer geantwortet hat.

import { getItem, display, mainLabel, subLabel, ttsText, pickDistractors } from '../data/curriculum.js';
import { speak, audioActive } from './audio.js';
import { shuffle } from './util.js';

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

function ttsButton(text, big = false) {
  if (!text || !audioActive()) return '';
  return `<button class="tts-btn${big ? ' big' : ''}" data-tts="${text}" aria-label="Anhören">🔊</button>`;
}

function wireTts(host) {
  host.querySelectorAll('[data-tts]').forEach((b) =>
    b.addEventListener('click', () => speak(b.dataset.tts)));
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

// ---------- Intro-Karte (neues Lernitem) ----------

function introRow(label, valueHtml) {
  return `<div class="intro-row"><span class="ir-label">${label}</span><span class="ir-val">${valueHtml}</span></div>`;
}

function variantTile(glyph, sound, sub) {
  return `<div class="vtile"><div class="he vtile-glyph">${glyph}</div>`
    + `<div class="vtile-snd">${sound}</div><div class="vtile-sub">${sub}</div></div>`;
}

function renderIntro(ex, host) {
  const item = getItem(ex.itemId);
  const tts = ttsText(item);

  const heading = item.type === 'letter' ? 'Neuer Buchstabe'
    : item.type === 'vowel' ? 'Neues Vokalzeichen' : 'Neues Wort';

  // Kopf: Name + Umschrift-Pille (Wörter tragen ihren Text in den Zeilen)
  const nameHtml = item.type === 'word' ? '' : `<div class="intro-name">${mainLabel(item)}</div>`;
  const pill = item.type === 'letter' ? item.translit
    : item.type === 'vowel' ? item.soundLabel : '';
  const pillHtml = pill ? `<div class="intro-pill">${pill}</div>` : '';

  // Kachel-Vergleich: nur Buchstaben mit Lautvarianten (Dagesch oder Sin/Schin)
  let tiles = '';
  if (item.type === 'letter' && (item.dagesh || item.variant)) {
    const baseSound = item.translit.split('/')[0].trim();
    const cells = item.dagesh
      ? [variantTile(item.glyph, baseSound, 'ohne Punkt'),
         variantTile(item.dagesh.glyph, item.dagesh.translit, 'mit Punkt')]
      : [variantTile(item.glyph, baseSound, 'Punkt rechts'),
         variantTile(item.variant.glyph, item.variant.translit, 'Punkt links')];
    tiles = `<div class="vtiles">${cells.join('')}</div>`;
  }

  // Strukturierte, beschriftete Zeilen
  const rows = [];
  if (item.type === 'letter') {
    rows.push(introRow('Laut', item.sound));
    if (item.final) {
      const f = getItem(item.final);
      rows.push(introRow('Am Wortende', `<span class="he">${f.glyph}</span> (${f.name})`));
    }
    if (item.baseId) {
      const b = getItem(item.baseId);
      rows.push(introRow('Grundform', `<span class="he">${b.glyph}</span> (${b.name})`));
    }
    if (item.mnemonic) rows.push(introRow('Merkhilfe', item.mnemonic));
  } else if (item.type === 'vowel') {
    const [laut, ...rest] = item.sound.split(' – ');
    rows.push(introRow('Laut', laut));
    if (rest.length) rows.push(introRow('Zeichen', rest.join(' – ')));
    rows.push(introRow('Beispiel', `<span class="he">${item.example}</span> → „${item.exampleTranslit}“`));
  } else {
    rows.push(introRow('Aussprache', item.translit));
    rows.push(introRow('Bedeutung', item.meaning));
  }

  host.innerHTML = `
    <p class="ex-q">${heading}</p>
    <div class="introcard">
      <div class="he ${item.type === 'word' ? 'glyph-lg' : 'glyph-xl'}">${display(item)}</div>
      ${nameHtml}
      ${pillHtml}
      ${tiles}
      <div class="intro-rows">${rows.join('')}</div>
      ${ttsButton(tts)}
    </div>`;
  wireTts(host);
  if (tts) speak(tts);
}

// ---------- Info-Karte ----------

function renderInfo(ex, host) {
  host.innerHTML = `
    <p class="ex-q">${ex.title}</p>
    <div class="infocard">${ex.html}</div>`;
  wireTts(host);
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
  let optionsHtml;
  if (ex.options) {
    options = shuffle(ex.options.map((o) => ({ correct: !!o.correct, label: o.label })));
    optionsHtml = options.map((o, i) =>
      `<button class="option" data-i="${i}"><span class="opt-main">${o.label}</span></button>`);
  } else if (ex.dir === 'de2he') {
    options = shuffle(optionItemsFor(ex, item, field).map((it) => ({ it, correct: it.id === item.id })));
    optionsHtml = options.map((o, i) =>
      `<button class="option" data-i="${i}"><span class="opt-main he glyph-md">${display(o.it)}</span></button>`);
  } else {
    options = shuffle(optionItemsFor(ex, item, field).map((it) => ({ it, correct: it.id === item.id })));
    optionsHtml = options.map((o, i) => `
      <button class="option" data-i="${i}">
        <span class="opt-main">${optLabel(o.it, field)}</span>
        ${optSub(o.it, field) ? `<span class="opt-sub">${optSub(o.it, field)}</span>` : ''}
      </button>`);
  }

  let promptHtml = '';
  if (ex.custom) {
    promptHtml = `<div class="he glyph-md">${ex.custom.hebrew}</div>`;
  } else if (ex.dir === 'he2de') {
    const tts = ttsText(item);
    promptHtml = `
      <div class="he ${item.type === 'word' ? 'glyph-lg' : 'glyph-xl'}">${display(item)}</div>
      ${ttsButton(tts)}`;
  } else {
    promptHtml = `<div class="prompt-label">${field === 'meaning' ? item.meaning : mainLabel(item)}</div>`;
  }

  host.innerHTML = `
    <p class="ex-q">${mcQuestion(ex, item, field)}</p>
    <div class="ex-prompt">${promptHtml}</div>
    <div class="options${ex.options ? ' single-col' : ''}">${optionsHtml.join('')}</div>`;
  wireTts(host);

  const detail = ex.custom
    ? ex.custom.answerText
    : `<span class="he">${display(item)}</span> = ${optLabel(item, field)}${optSub(item, field) ? ` (${optSub(item, field)})` : ''}`;

  host.querySelectorAll('.option').forEach((btn) =>
    btn.addEventListener('click', () => {
      const o = options[+btn.dataset.i];
      host.querySelectorAll('.option').forEach((b) => { b.disabled = true; });
      btn.classList.add(o.correct ? 'correct' : 'wrong');
      if (!o.correct) {
        const ci = options.findIndex((x) => x.correct);
        host.querySelector(`[data-i="${ci}"]`).classList.add('correct');
      }
      onAnswered(o.correct, detail);
    }));
}

// ---------- Hören & Wählen ----------

function renderListen(ex, host, onAnswered) {
  const item = getItem(ex.itemId);
  const tts = ttsText(item);
  const options = shuffle(optionItemsFor(ex, item, 'main').map((it) => ({ it, correct: it.id === item.id })));

  host.innerHTML = `
    <p class="ex-q">Was hörst du?</p>
    <div class="ex-prompt">${ttsButton(tts, true)}</div>
    <div class="options">${options.map((o, i) =>
      `<button class="option" data-i="${i}"><span class="opt-main he glyph-md">${display(o.it)}</span></button>`).join('')}
    </div>`;
  wireTts(host);
  speak(tts);

  const detail = `<span class="he">${display(item)}</span> – ${mainLabel(item)}`;
  host.querySelectorAll('.option').forEach((btn) =>
    btn.addEventListener('click', () => {
      const o = options[+btn.dataset.i];
      host.querySelectorAll('.option').forEach((b) => { b.disabled = true; });
      btn.classList.add(o.correct ? 'correct' : 'wrong');
      if (!o.correct) {
        const ci = options.findIndex((x) => x.correct);
        host.querySelector(`[data-i="${ci}"]`).classList.add('correct');
      }
      onAnswered(o.correct, detail);
    }));
}

// ---------- Paare zuordnen ----------

function renderMatch(ex, host, onAnswered) {
  const items = ex.itemIds.map(getItem);
  const left = shuffle(items);   // hebräische Seite
  const right = shuffle(items);  // Umschrift/Name

  host.innerHTML = `
    <p class="ex-q">Finde die Paare!</p>
    <div class="matchgrid">
      <div class="matchcol">${left.map((it) =>
        `<button class="matchbtn he glyph-md" data-side="l" data-id="${it.id}">${display(it)}</button>`).join('')}
      </div>
      <div class="matchcol">${right.map((it) =>
        `<button class="matchbtn" data-side="r" data-id="${it.id}">${mainLabel(it)}</button>`).join('')}
      </div>
    </div>`;

  let selL = null;
  let selR = null;
  let mistakes = 0;
  let matchedCount = 0;
  let locked = false;

  host.querySelectorAll('.matchbtn').forEach((btn) =>
    btn.addEventListener('click', () => {
      if (locked || btn.classList.contains('matched')) return;
      const side = btn.dataset.side;
      const prev = side === 'l' ? selL : selR;
      if (prev) prev.classList.remove('sel');
      if (prev === btn) {
        if (side === 'l') selL = null; else selR = null;
        return;
      }
      btn.classList.add('sel');
      if (side === 'l') selL = btn; else selR = btn;

      if (selL && selR) {
        const a = selL;
        const b = selR;
        selL = null;
        selR = null;
        if (a.dataset.id === b.dataset.id) {
          a.classList.remove('sel'); b.classList.remove('sel');
          a.classList.add('matched'); b.classList.add('matched');
          matchedCount += 1;
          if (matchedCount === items.length) {
            onAnswered(mistakes === 0, mistakes === 0
              ? 'Alle Paare auf Anhieb gefunden!'
              : `Alle Paare gefunden – mit ${mistakes} ${mistakes === 1 ? 'Fehlversuch' : 'Fehlversuchen'}.`);
          }
        } else {
          mistakes += 1;
          locked = true;
          a.classList.remove('sel'); b.classList.remove('sel');
          a.classList.add('bad'); b.classList.add('bad');
          setTimeout(() => {
            a.classList.remove('bad'); b.classList.remove('bad');
            locked = false;
          }, 400);
        }
      }
    }));
}
