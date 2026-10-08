// Lektions-Player: baut aus einer Lektion eine Übungs-Warteschlange,
// spielt sie ab (falsche Antworten kommen ans Ende zurück), vergibt XP
// und aktualisiert SRS, Streak und Lektionsfortschritt.

import { getLesson, getItem, learnedPool, isUnlocked, ttsText } from '../data/curriculum.js';
import { renderExercise, isPassive } from './exercises.js';
import { state, save, addXp, touchStreak, completeLesson, currentStreak } from './state.js';
import { syncBadges } from './badges.js';
import { applyResult, dueIds } from './srs.js';
import { audioActive, speak } from './audio.js';
import { shuffle, sample } from './util.js';
import {
  icon, he, replay, countUp, setProgress, confetti, feedback, swap, reducedMotion, confirmDialog, sound,
} from './ui.js';

// ---------- Warteschlangen pro Lektionstyp ----------

function buildQueue(lesson) {
  switch (lesson.kind) {
    case 'letters': return buildLetters(lesson);
    case 'lookalike': return buildLookalike(lesson);
    case 'nikud': return buildNikud(lesson);
    case 'words': return buildWords(lesson);
    case 'bracha': return buildBracha(lesson);
    default: throw new Error(`Unbekannter Lektionstyp: ${lesson.kind}`);
  }
}

function srsReviewExercises(lesson, max) {
  const own = new Set([
    ...(lesson.newItems || []),
    ...(lesson.syllables || []),
    ...(lesson.reviewWords || []),
  ]);
  const due = dueIds(state.srs)
    .filter((id) => !own.has(id))
    .slice(0, max);
  return due.map((id) => reviewExercise(id, lesson.id));
}

function buildLetters(lesson) {
  const pool = learnedPool(lesson.id, 'letter');
  const q = [];
  for (const id of lesson.newItems) {
    q.push({ kind: 'intro', itemId: id });
    q.push({ kind: 'mc', dir: 'he2de', itemId: id, poolIds: pool });
  }
  q.push({ kind: 'match', itemIds: [...lesson.newItems] });
  for (const id of shuffle(lesson.newItems)) {
    q.push({ kind: 'mc', dir: 'de2he', itemId: id, poolIds: pool });
  }
  if (audioActive()) {
    for (const id of sample(lesson.newItems, 3)) {
      q.push({ kind: 'listen', itemId: id, poolIds: pool });
    }
  }
  q.push(...srsReviewExercises(lesson, 3));
  if (lesson.bonusWord) q.push(bonusCard(lesson));
  return q;
}

function bonusCard(lesson) {
  const w = getItem(lesson.bonusWord);
  const names = lesson.newItems.map((id) => getItem(id).name).join(', ');
  return {
    kind: 'info',
    tag: 'Bonus',
    icon: 'star',
    title: 'Dein erstes Wort!',
    html: `
      <div class="ab-showcase">${he(w.hebrew, 'glyph-lg')}</div>
      <p class="text-body">Du kennst jetzt <b>${names}</b> – zusammen ergeben sie
      <b>${he(w.hebrew)}</b> („${w.translit}“ – ${w.meaning}).</p>
      <p class="text-body">Die kleinen Punkte und Striche sind die Vokalzeichen (Nikud) –
      die lernst du in Einheit&nbsp;2!</p>`,
  };
}

// Eine Zeile „Zeichen · Laut → Zeichen · Laut“ für die Wissenskarten.
function eq(...parts) {
  return `<div class="ab-eq text-strong">${parts.join('')}</div>`;
}
const op = (t) => `<span class="ab-eq__op">${t}</span>`;
const out = (t) => `<span class="ab-eq__out">${t}</span>`;

function buildLookalike(lesson) {
  const q = [
    {
      kind: 'info',
      icon: 'target',
      title: 'Genau hinschauen!',
      html: `
        <p class="text-body">Manche Buchstaben sehen sich zum Verwechseln ähnlich, zum Beispiel:</p>
        <div class="ab-showcase">
          ${eq(he('ב', 'glyph-md'), op('und'), he('כ', 'glyph-md'))}
          ${eq(he('ד', 'glyph-md'), op('und'), he('ר', 'glyph-md'))}
        </div>
        <p class="text-body">In dieser Lektion trainierst du den Blick für die kleinen Unterschiede.</p>`,
    },
    {
      kind: 'info',
      title: 'Der Punkt macht den Laut',
      html: `
        <p class="text-body">Ein Punkt im Buchstaben (<b>Dagesch</b>) macht den Laut hart:</p>
        <div class="ab-showcase">
          ${eq(he('ב', 'glyph-md'), '<span>w</span>', op('→'), he('בּ', 'glyph-md'), out('b'))}
          ${eq(he('כ', 'glyph-md'), '<span>ch</span>', op('→'), he('כּ', 'glyph-md'), out('k'))}
          ${eq(he('פ', 'glyph-md'), '<span>f</span>', op('→'), he('פּ', 'glyph-md'), out('p'))}
        </div>`,
    },
    {
      kind: 'info',
      title: 'Schin oder Sin?',
      html: `
        <p class="text-body">Beim <b>Schin</b> entscheidet die Seite des Punktes:</p>
        <div class="ab-showcase">
          ${eq(he('שׁ', 'glyph-md'), '<span>Punkt rechts</span>', op('→'), out('sch'))}
          ${eq(he('שׂ', 'glyph-md'), '<span>Punkt links</span>', op('→'), out('s'))}
        </div>`,
    },
  ];
  const drills = [];
  for (const [a, b] of lesson.pairs) {
    drills.push({ kind: 'mc', dir: 'de2he', itemId: a, optionIds: [a, b] });
    drills.push({ kind: 'mc', dir: 'he2de', itemId: b, optionIds: [b, a] });
  }
  q.push(...shuffle(drills));
  return q;
}

function buildNikud(lesson) {
  const vowelPool = learnedPool(lesson.id, 'vowel');
  const sylPool = learnedPool(lesson.id, 'syllable');
  const q = [];
  if (lesson.id === 'u2l1') {
    q.push({
      kind: 'info',
      title: 'So funktioniert Nikud',
      html: `
        <p class="text-body">Hebräisch schreibt man (fast) ohne Vokale. Damit man trotzdem richtig liest,
        zeigen kleine Zeichen <b>unter</b> oder <b>über</b> dem Buchstaben den Vokal an.</p>
        <div class="ab-showcase">
          ${eq(he('מ', 'glyph-md'), op('+'), he('◌ָ', 'glyph-md'), '<span>a</span>', op('='), he('מָ', 'glyph-md'), out('ma'))}
        </div>
        <p class="text-body">Gelesen wird immer: <b>erst der Buchstabe, dann sein Vokal</b> – von rechts nach links.</p>`,
    });
  }
  for (const id of lesson.newItems) {
    q.push({ kind: 'intro', itemId: id });
    q.push({ kind: 'mc', dir: 'he2de', itemId: id, poolIds: vowelPool });
  }
  for (const id of lesson.syllables) {
    q.push({ kind: 'mc', dir: 'he2de', itemId: id, poolIds: sylPool });
  }
  if (audioActive()) {
    for (const id of sample(lesson.syllables, 2)) {
      q.push({ kind: 'listen', itemId: id, poolIds: sylPool });
    }
  }
  q.push({ kind: 'match', itemIds: sample(lesson.syllables, Math.min(4, lesson.syllables.length)) });
  q.push(...srsReviewExercises(lesson, 2));
  return q;
}

function buildWords(lesson) {
  const pool = learnedPool(lesson.id, 'word');
  const q = [];
  for (const id of lesson.newItems) {
    q.push({ kind: 'intro', itemId: id });
    q.push({ kind: 'mc', dir: 'he2de', itemId: id, poolIds: pool });
  }
  for (const id of sample(lesson.newItems, 3)) {
    q.push({ kind: 'mc', dir: 'he2de', itemId: id, poolIds: pool, field: 'meaning' });
  }
  for (const id of sample(lesson.newItems, 2)) {
    q.push({ kind: 'mc', dir: 'de2he', itemId: id, poolIds: pool, field: 'meaning' });
  }
  q.push({ kind: 'match', itemIds: [...lesson.newItems] });
  if (audioActive()) {
    for (const id of sample(lesson.newItems.filter((x) => !getItem(x).noTts), 2)) {
      q.push({ kind: 'listen', itemId: id, poolIds: pool });
    }
  }
  q.push(...srsReviewExercises(lesson, 2));
  return q;
}

function buildBracha(lesson) {
  const pool = learnedPool(lesson.id, 'word');
  const phrase = 'בָּרוּךְ אַתָּה ה׳ אֱלֹקֵינוּ מֶלֶךְ הָעוֹלָם';
  const q = [
    {
      kind: 'info',
      title: 'Der Gottesname',
      html: `
        <p class="text-body">Aus Ehrfurcht wird der Gottesname nie beiläufig ausgesprochen oder
        ausgeschrieben. Im Siddur steht er als ${he('ה׳', 'glyph-sm')} –
        beim Beten liest man „<b>Adonai</b>“, im Alltag sagt man „<b>Haschem</b>“ (der Name).</p>
        <p class="text-body">Auch „unser G’tt“ schreiben wir hier respektvoll mit ${he('ק')}:
        ${he('אֱלֹקֵינוּ', 'glyph-sm')}. Diese App spricht den Gottesnamen nicht aus.</p>`,
    },
  ];
  for (const id of lesson.newItems) {
    q.push({ kind: 'intro', itemId: id });
    q.push({ kind: 'mc', dir: 'he2de', itemId: id, poolIds: pool });
  }
  for (const id of lesson.reviewWords) {
    q.push({ kind: 'mc', dir: 'he2de', itemId: id, poolIds: pool });
  }
  q.push({
    kind: 'info',
    title: 'Die Bracha-Formel',
    html: `
      <p class="text-body">So beginnt fast jeder Segensspruch (jede <b>Bracha</b>):</p>
      <div class="ab-showcase">${he(phrase, 'hebrew-line')}</div>
      <p class="text-body"><b>Baruch ata Haschem, Elokejnu melech ha-olam …</b><br>
      „Gesegnet bist Du, Ewiger, unser G’tt, König der Welt …“</p>`,
  });
  q.push({
    kind: 'mc',
    custom: {
      hebrew: phrase,
      question: 'Wie liest man diese Zeile?',
      answerText: '<b>Baruch ata Haschem, Elokejnu melech ha-olam</b>',
    },
    options: [
      { label: 'Baruch ata Haschem, Elokejnu melech ha-olam', correct: true },
      { label: 'Schma Jisrael, Haschem Elokejnu, Haschem echad', correct: false },
      { label: 'Baruch Haschem le-olam, amen we-amen', correct: false },
    ],
  });
  return q;
}

// Wiederholungs-Übung für ein fälliges SRS-Item.
// lessonId = aktueller Kontext für den Distraktoren-Pool (null = Wiederholen-Screen).
function reviewExercise(id, lessonId = null) {
  const item = getItem(id);
  const pool = lessonId
    ? learnedPool(lessonId, item.type)
    : Object.keys(state.srs).filter((x) => getItem(x).type === item.type);

  if (item.type === 'word') {
    const r = Math.random();
    if (r < 0.34) return { kind: 'mc', dir: 'he2de', itemId: id, poolIds: pool };
    if (r < 0.67) return { kind: 'mc', dir: 'he2de', itemId: id, poolIds: pool, field: 'meaning' };
    return { kind: 'mc', dir: 'de2he', itemId: id, poolIds: pool, field: 'meaning' };
  }
  if (item.type === 'syllable') {
    if (audioActive() && Math.random() < 0.3) return { kind: 'listen', itemId: id, poolIds: pool };
    return { kind: 'mc', dir: 'he2de', itemId: id, poolIds: pool };
  }
  if (audioActive() && item.type === 'letter' && Math.random() < 0.25) {
    return { kind: 'listen', itemId: id, poolIds: pool };
  }
  return { kind: 'mc', dir: Math.random() < 0.5 ? 'he2de' : 'de2he', itemId: id, poolIds: pool };
}

// ---------- Einstiegspunkte ----------

export function runLesson(lessonId, host) {
  let lesson;
  try {
    lesson = getLesson(lessonId);
  } catch {
    location.hash = '#/';
    return;
  }
  // Auch per Adresszeile aufgerufene Lektionen respektieren den Lernpfad.
  if (!isUnlocked(lesson.id, state.lessons)) {
    location.hash = '#/';
    return;
  }
  runSession(host, buildQueue(lesson), { mode: 'lesson', lesson });
}

const REVIEW_BATCH = 12;

export function runReview(host) {
  const due = dueIds(state.srs).slice(0, REVIEW_BATCH);
  if (!due.length) {
    location.hash = '#/review';
    return;
  }
  const q = shuffle(due.map((id) => reviewExercise(id)));
  runSession(host, q, { mode: 'review' });
}

// Freies Üben, wenn nichts fällig ist: eine Runde aus dem bereits Gelernten.
export function runFreePractice(host) {
  const known = Object.keys(state.srs);
  if (!known.length) {
    location.hash = '#/review';
    return;
  }
  const q = sample(known, REVIEW_BATCH).map((id) => reviewExercise(id));
  runSession(host, q, { mode: 'practice' });
}

// ---------- Der Player ----------

// Kombo: ab so vielen richtigen Antworten in Folge erscheint die Flamme.
// Reine Anerkennung, es gibt keine Extrapunkte (siehe Gamification-Regeln).
const COMBO_FROM = 3;

function runSession(host, queue, opts) {
  let idx = 0;
  let xp = 0;
  let combo = 0;
  const failed = new Set();
  let firstTry = 0;
  let firstTryCorrect = 0;
  let listenCorrect = 0; // für das Abzeichen „Ohrenmensch“
  let sheetOpen = false;
  let sheetCtl = null;
  const exitHash = opts.mode === 'lesson' ? '#/' : '#/review';
  const what = opts.mode === 'lesson' ? 'Lektion' : 'Runde';

  host.innerHTML = `
    <div class="lesson">
      <header class="ab-lessonbar">
        <button class="ab-iconbtn" type="button" id="quit" aria-label="${what} beenden" title="Beenden">${icon('close')}</button>
        <div class="ab-progress" role="progressbar" aria-label="Fortschritt" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <div class="ab-progress__fill"></div>
        </div>
        <span class="ab-combo text-label" title="Richtig in Folge" aria-hidden="true" hidden>${icon('flame')}<span data-count></span></span>
      </header>
      <div class="lesson-stage" id="ex-area"></div>
    </div>
    <section class="ab-sheet" role="status" aria-live="polite">
      <div class="ab-sheet__inner">
        <div class="ab-sheet__head">
          <span class="ab-sheet__icon" data-sheet-icon></span>
          <h2 class="ab-sheet__title text-heading" data-sheet-title></h2>
          <span class="ab-sheet__xp text-label" data-sheet-xp hidden></span>
        </div>
        <p class="ab-sheet__detail text-body" data-sheet-detail></p>
        <div class="ab-sheet__action"><button class="ab-btn text-button" type="button" data-sheet-action>Weiter</button></div>
      </div>
    </section>`;

  const area = host.querySelector('#ex-area');
  const sheet = host.querySelector('.ab-sheet');
  const action = sheet.querySelector('[data-sheet-action]');
  const bar = host.querySelector('.ab-progress');
  const comboChip = host.querySelector('.ab-combo');

  host.querySelector('#quit').addEventListener('click', async () => {
    const quit = await confirmDialog({
      title: `${what} wirklich beenden?`,
      text: 'Der Fortschritt dieser Runde geht verloren.',
      confirm: 'Beenden',
      cancel: 'Weiter lernen',
    });
    if (quit && area.isConnected) {
      if ('speechSynthesis' in window) speechSynthesis.cancel();
      location.hash = exitHash;
    }
  });

  action.addEventListener('click', nextStep);

  function nextStep() {
    if (!sheetOpen) return; // schon unterwegs (Doppeltipp)
    // Was die Stimme noch spricht, gehört zur alten Übung.
    if ('speechSynthesis' in window) speechSynthesis.cancel();
    closeSheet();
    idx += 1;
    step();
  }

  function openSheet(opts, { reveal = false } = {}) {
    sheetCtl = feedback(sheet, opts);
    sheetOpen = true;

    // Die Leiste liegt fix über dem Inhalt. Unten Platz schaffen und – falls
    // die markierte Antwort darunter verschwindet – so weit scrollen, dass man
    // sie sieht. (Lernkarten bleiben oben stehen: dort zählt der Anfang.)
    const height = sheet.offsetHeight - 24; // 24px stecken unter dem Rand (Feder-Puffer)
    document.body.classList.add('fb-open');
    document.body.style.setProperty('--fb-space', `${height + 24}px`);
    if (reveal && area.getBoundingClientRect().bottom > window.innerHeight - height) {
      // scrollHeight erzwingt ein Layout, der zusätzliche Platz unten ist also
      // schon berücksichtigt: ans Seitenende scrollen holt die Antwort hervor.
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: reducedMotion() ? 'auto' : 'smooth',
      });
    }
  }

  function closeSheet() {
    sheetOpen = false;
    sheetCtl?.close();
    document.body.classList.remove('fb-open');
  }

  function updateCombo(correct) {
    combo = correct ? combo + 1 : 0;
    if (combo < COMBO_FROM) {
      comboChip.hidden = true;
      return;
    }
    const isNew = comboChip.hidden;
    comboChip.hidden = false;
    comboChip.querySelector('[data-count]').textContent = String(combo);
    replay(comboChip, isNew ? 'is-new' : 'is-bump');
  }

  function answered(ex, correct, detail) {
    if (!ex.retry) {
      firstTry += 1;
      if (correct) firstTryCorrect += 1;
    }
    const gain = correct ? (ex.retry ? 5 : 10) : 0;
    xp += gain;
    if (correct && ex.kind === 'listen') listenCorrect += 1;
    if (!correct) {
      if (ex.itemId) failed.add(ex.itemId);
      if (ex.kind !== 'match') queue.push({ ...ex, retry: true });
    }
    updateCombo(correct);
    // Paare finden hat seine Töne schon beim Finden gespielt.
    if (ex.kind !== 'match') {
      if (correct) sound('richtig', { step: combo - 1, flame: combo === COMBO_FROM });
      else sound('falsch');
    }
    openSheet({ tone: correct ? 'correct' : 'wrong', detail, xp: gain }, { reveal: true });

    // Die Lösung zum Mithören: Kurz nach dem Klang spricht die Stimme sie vor –
    // auch bei „Welcher Buchstabe ist …?“, wo es sonst nichts zu hören gibt.
    // Wer schon weiter ist, hört sie nicht mehr. (Für den Gottesnamen liefert
    // ttsText nichts; die Bracha-Zeile hat kein einzelnes Item.)
    if (ex.itemId) {
      const at = idx;
      setTimeout(() => {
        if (idx !== at || !sheetOpen || !area.isConnected) return;
        speak(ttsText(getItem(ex.itemId)), { from: area.querySelector('.ab-audio') });
      }, 400);
    }
  }

  // Am Rechner: 1–4 wählt eine Antwort, Enter/Leertaste geht weiter.
  function onKey(e) {
    // Die Übungsfläche gehört zu dieser Runde; ist sie aus dem Dokument
    // verschwunden, läuft die Runde nicht mehr – Listener abmelden.
    if (!area.isConnected) {
      document.removeEventListener('keydown', onKey);
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (document.querySelector('dialog[open]')) return; // Beenden-Dialog hat Vorrang
    if (sheetOpen) {
      // Liegt der Fokus auf „Weiter“, erledigt der Button das selbst –
      // sonst würde die Übung zwei Schritte auf einmal springen.
      if ((e.key === 'Enter' || e.key === ' ') && document.activeElement !== action) {
        e.preventDefault();
        nextStep();
      }
      return;
    }
    const n = Number(e.key);
    if (!Number.isInteger(n) || n < 1) return;
    const tiles = area.querySelectorAll('.ab-tile:not(:disabled)');
    if (tiles[n - 1]) {
      e.preventDefault();
      tiles[n - 1].click();
    }
  }
  document.addEventListener('keydown', onKey);

  function step() {
    if (idx >= queue.length) {
      finish();
      return;
    }
    setProgress(bar, (idx / queue.length) * 100);
    const ex = queue[idx];
    const render = (h) => {
      window.scrollTo(0, 0);
      renderExercise(ex, h, (correct, detail) => answered(ex, correct, detail));
      if (isPassive(ex)) openSheet({ tone: 'neutral' });
    };
    // Die alte Übung gleitet hinaus, während die Leiste abtaucht, dann
    // gleitet die neue herein. Lern- und Wissenskarten werden ausgeteilt
    // (ab-enter), dafür reicht ein Überblenden.
    if (idx === 0) render(area);
    else swap(area, render, { direction: isPassive(ex) ? 'fade' : 'forward', viewTransition: false });
  }

  function finish() {
    closeSheet();
    document.removeEventListener('keydown', onKey);
    setProgress(bar, 100);

    // SRS aktualisieren: jedes beteiligte Item gilt als richtig,
    // wenn es in dieser Runde nie falsch beantwortet wurde.
    // Freies Üben zählt nur negativ – sonst könnte man Karten durch
    // wiederholtes Vorab-Üben künstlich auf 90 Tage schieben.
    const itemIds = [...new Set(queue.filter((e) => e.itemId && !e.retry).map((e) => e.itemId))];
    for (const id of itemIds) {
      const correct = !failed.has(id);
      if (opts.mode === 'practice' && correct) continue;
      applyResult(state.srs, id, correct);
    }

    const accuracy = firstTry ? Math.round((firstTryCorrect / firstTry) * 100) : 100;
    const bonus = opts.mode === 'lesson' ? 20 : 10;
    const streakBefore = currentStreak();
    if (opts.mode === 'lesson') completeLesson(opts.lesson.id, accuracy);
    state.stats.listenCorrect += listenCorrect;
    addXp(xp + bonus);
    touchStreak();
    save();
    const badges = syncBadges(); // neu erreichte Abzeichen

    // Kurz den vollen, goldenen Balken zeigen, dann die Feier.
    setTimeout(() => {
      if (!area.isConnected) return;
      swap(host, (h) => renderCelebration(h, {
        opts, accuracy, gained: xp + bonus, streakBefore, streak: currentStreak(), exitHash, badges,
      }), { direction: 'fade', viewTransition: false });
    }, reducedMotion() ? 0 : 450);
  }

  step();
}

// ---------- Feier am Ende einer Runde ----------

// Zwölf Strahlen um die Mitte – Sonnenkranz hinter Krone bzw. Pokal.
const RAYS = Array.from({ length: 12 }, (_, i) => {
  const a = (i * 30 * Math.PI) / 180;
  const b = ((i * 30 + 12) * Math.PI) / 180;
  const p = (r) => `${(132 + 132 * Math.cos(r)).toFixed(1)} ${(132 + 132 * Math.sin(r)).toFixed(1)}`;
  return `<path d="M132 132 L${p(a)} L${p(b)}Z"/>`;
}).join('');

function celebrationText(mode, accuracy) {
  if (mode === 'review') {
    return accuracy >= 90 ? 'Alles wieder frisch im Gedächtnis.' : 'Was noch wackelt, kommt bald noch einmal.';
  }
  if (mode === 'practice') return 'Freies Üben verschiebt keine Termine – es hilft nur.';
  if (accuracy === 100) return 'Fehlerfrei – alles auf Anhieb richtig!';
  if (accuracy >= 90) return 'Stark – fast alles auf Anhieb richtig.';
  if (accuracy >= 60) return 'Gut gemacht! Was noch wackelt, kommt bald zur Wiederholung.';
  return 'Dranbleiben lohnt sich – die schwierigen Karten kommen bald wieder.';
}

// Ein neues Abzeichen ist die größere Nachricht (Feier-Stufe 4): Es tritt als
// Held an die Stelle von Krone bzw. Pokal – eine Feier pro Screen.
function heroHtml(opts, badges) {
  const b = badges[0];
  if (b) {
    const art = b.glyph ? he(b.glyph, 'glyph-lg') : icon(b.icon);
    return `<div class="ab-medal is-unlocking${b.tone ? ` ab-medal--${b.tone}` : ''}">`
      + `<div class="ab-medal__art"><div class="ab-medal__disc">${art}</div></div></div>`;
  }
  // Die Krone gehört zur geschafften Lektion (wie auf dem Lernpfad).
  return `<div class="ab-celebrate__trophy">${icon(opts.mode === 'lesson' ? 'crown' : 'trophy')}</div>`;
}

function renderCelebration(host, { opts, accuracy, gained, streakBefore, streak, exitHash, badges = [] }) {
  const done = opts.mode === 'lesson' ? 'Lektion geschafft!'
    : opts.mode === 'practice' ? 'Runde geschafft!'
    : 'Wiederholung geschafft!';
  const title = !badges.length ? done
    : badges.length === 1 ? 'Neues Abzeichen!' : `${badges.length} neue Abzeichen!`;
  const sub = !badges.length ? celebrationText(opts.mode, accuracy)
    : badges.length === 1 ? `<b>${badges[0].name}</b> – ${badges[0].desc}. ${done}`
    : `${badges.map((b) => `<b>${b.name}</b>`).join(' und ')}. ${done}`;

  host.innerHTML = `
    <section class="ab-celebrate" aria-labelledby="end-title">
      <div class="ab-celebrate__hero">
        <svg class="ab-celebrate__rays" viewBox="0 0 264 264" aria-hidden="true">${RAYS}</svg>
        ${heroHtml(opts, badges)}
      </div>
      <h1 class="ab-celebrate__title text-display" id="end-title">${title}</h1>
      <p class="ab-celebrate__sub text-body">${sub}</p>
      <div class="ab-results">
        <div class="ab-result">
          <div class="ab-result__head text-overline">XP</div>
          <div class="ab-result__body text-heading">${icon('bolt')}<span data-n="${gained}" data-prefix="+">+${gained}</span></div>
        </div>
        <div class="ab-result ab-result--minze">
          <div class="ab-result__head text-overline">Richtig</div>
          <div class="ab-result__body text-heading">${icon('target')}<span data-n="${accuracy}" data-suffix=" %">${accuracy} %</span></div>
        </div>
        <div class="ab-result ab-result--granat">
          <div class="ab-result__head text-overline">Serie</div>
          <div class="ab-result__body text-heading">${icon('flame')}<span data-n="${streak}" data-from="${Math.min(streakBefore, streak)}">${streak}</span></div>
        </div>
      </div>
      <div class="ab-celebrate__actions">
        <button class="ab-btn text-button" type="button" id="end-continue">Weiter</button>
        ${opts.mode === 'lesson' ? '<button class="ab-btn ab-btn--secondary text-button" type="button" id="end-again">Nochmal üben</button>' : ''}
      </div>
    </section>`;

  const cont = host.querySelector('#end-continue');
  cont.addEventListener('click', () => { location.hash = exitHash; });
  host.querySelector('#end-again')?.addEventListener('click', () => runLesson(opts.lesson.id, host));
  cont.focus({ preventScroll: true });
  window.scrollTo(0, 0);

  // Der Klang folgt derselben Abstufung und startet mit dem Screen, damit
  // seine Akkorde das Konfetti treffen. Er spielt auch bei reduzierter
  // Bewegung – Ton und Bewegung lassen sich getrennt abschalten.
  sound(badges.length ? 'abzeichen' : accuracy >= 60 ? 'lektion' : 'lektionSanft');

  // Feier-Stufe 3 (mit Abzeichen 4): Konfetti aus Krone bzw. Medaille, die
  // Zahlen zählen nacheinander hoch. Die Endwerte stehen schon im Markup – für
  // Screenreader und reduzierte Bewegung.
  if (reducedMotion()) return;
  const numbers = [...host.querySelectorAll('[data-n]')];
  numbers.forEach((n) => {
    n.textContent = `${n.dataset.prefix || ''}${n.dataset.from || 0}${n.dataset.suffix || ''}`;
  });
  // Unter 60 % Treffern bleibt es beim ermutigenden Untertitel – ohne Konfetti
  // (Design System, Celebration „Abstufung“); ein neues Abzeichen feiert immer.
  setTimeout(() => {
    const origin = host.querySelector('.ab-celebrate__trophy, .ab-medal__disc');
    if (badges.length) confetti({ origin, count: 140, spread: 360, power: 0.9 });
    else if (accuracy >= 60) confetti({ origin, count: 110, spread: 150 });
  }, badges.length ? 420 : 380);
  numbers.forEach((n, i) => {
    setTimeout(() => countUp(n, Number(n.dataset.n), {
      from: Number(n.dataset.from || 0),
      prefix: n.dataset.prefix || '',
      suffix: n.dataset.suffix || '',
      duration: 900,
    }), 520 + i * 100);
  });
}
