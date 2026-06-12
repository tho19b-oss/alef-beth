// Lektions-Player: baut aus einer Lektion eine Übungs-Warteschlange,
// spielt sie ab (falsche Antworten kommen ans Ende zurück), vergibt XP
// und aktualisiert SRS, Streak und Lektionsfortschritt.

import { getLesson, getItem, learnedPool } from '../data/curriculum.js';
import { renderExercise, isPassive } from './exercises.js';
import { state, save, addXp, touchStreak, completeLesson, currentStreak } from './state.js';
import { applyResult, dueIds } from './srs.js';
import { audioActive } from './audio.js';
import { shuffle, sample } from './util.js';

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
    title: 'Dein erstes Wort! 🎉',
    html: `
      <div class="bigword he glyph-lg">${w.hebrew}</div>
      <p>Du kennst jetzt <b>${names}</b> – zusammen ergeben sie
      <b>${w.hebrew}</b> („${w.translit}“ – ${w.meaning}).</p>
      <p>Die kleinen Punkte und Striche sind die Vokalzeichen (Nikud) –
      die lernst du in Einheit&nbsp;2!</p>`,
  };
}

function buildLookalike(lesson) {
  const q = [
    {
      kind: 'info',
      title: 'Genau hinschauen! 👀',
      html: `
        <p>Manche Buchstaben sehen sich zum Verwechseln ähnlich –
        zum Beispiel <span class="he glyph-md">ב</span> und <span class="he glyph-md">כ</span>
        oder <span class="he glyph-md">ד</span> und <span class="he glyph-md">ר</span>.</p>
        <p>In dieser Lektion trainierst du den Blick für die kleinen Unterschiede.</p>`,
    },
    {
      kind: 'info',
      title: 'Der Punkt macht den Laut',
      html: `
        <p>Ein Punkt im Buchstaben (<b>Dagesch</b>) macht den Laut hart:</p>
        <p class="bigword"><span class="he glyph-md">ב</span> = w → <span class="he glyph-md">בּ</span> = b<br>
        <span class="he glyph-md">כ</span> = ch → <span class="he glyph-md">כּ</span> = k<br>
        <span class="he glyph-md">פ</span> = f → <span class="he glyph-md">פּ</span> = p</p>`,
    },
    {
      kind: 'info',
      title: 'Schin oder Sin?',
      html: `
        <p>Beim <b>Schin</b> entscheidet die Seite des Punktes:</p>
        <p class="bigword"><span class="he glyph-md">שׁ</span> Punkt rechts = <b>sch</b> &nbsp;·&nbsp;
        <span class="he glyph-md">שׂ</span> Punkt links = <b>s</b></p>`,
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
        <p>Hebräisch schreibt man (fast) ohne Vokale. Damit man trotzdem richtig liest,
        zeigen kleine Zeichen <b>unter</b> oder <b>über</b> dem Buchstaben den Vokal an.</p>
        <p class="bigword"><span class="he glyph-md">מ</span> + <b>ָ</b> (a) = <span class="he glyph-md">מָ</span> → „ma“</p>
        <p>Gelesen wird immer: <b>erst der Buchstabe, dann sein Vokal</b> – von rechts nach links.</p>`,
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
        <p>Aus Ehrfurcht wird der Gottesname nie beiläufig ausgesprochen oder
        ausgeschrieben. Im Siddur steht er als <span class="he glyph-md">ה׳</span> –
        beim Beten liest man „<b>Adonai</b>“, im Alltag sagt man „<b>Haschem</b>“ (der Name).</p>
        <p>Auch „unser G’tt“ schreiben wir hier respektvoll mit ק:
        <span class="he glyph-md">אֱלֹקֵינוּ</span>. Diese App spricht den Gottesnamen nicht aus.</p>`,
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
      <p>So beginnt fast jeder Segensspruch (jede <b>Bracha</b>):</p>
      <div class="bigword he glyph-md">${phrase}</div>
      <p><b>Baruch ata Haschem, Elokejnu melech ha-olam …</b><br>
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
  runSession(host, buildQueue(lesson), { mode: 'lesson', lesson });
}

export function runReview(host) {
  const due = dueIds(state.srs).slice(0, 12);
  if (!due.length) {
    location.hash = '#/review';
    return;
  }
  const q = shuffle(due.map((id) => reviewExercise(id)));
  runSession(host, q, { mode: 'review' });
}

// ---------- Der Player ----------

function runSession(host, queue, opts) {
  let idx = 0;
  let xp = 0;
  const failed = new Set();
  let firstTry = 0;
  let firstTryCorrect = 0;

  host.innerHTML = `
    <div class="lesson-top">
      <button class="quit-x" aria-label="Lektion beenden">✕</button>
      <div class="pbar"><div class="pbar-fill"></div></div>
    </div>
    <div id="ex-area"></div>
    <div class="feedback" hidden>
      <div class="feedback-inner">
        <div class="fb-title"></div>
        <div class="fb-detail"></div>
        <button class="btn fb-continue">Weiter</button>
      </div>
    </div>`;

  const area = host.querySelector('#ex-area');
  const fb = host.querySelector('.feedback');
  const fbTitle = fb.querySelector('.fb-title');
  const fbDetail = fb.querySelector('.fb-detail');
  const fbBtn = fb.querySelector('.fb-continue');
  const pbarFill = host.querySelector('.pbar-fill');

  host.querySelector('.quit-x').addEventListener('click', () => {
    if (confirm('Lektion wirklich beenden? Der Fortschritt dieser Runde geht verloren.')) {
      if ('speechSynthesis' in window) speechSynthesis.cancel();
      location.hash = opts.mode === 'review' ? '#/review' : '#/';
    }
  });

  fbBtn.addEventListener('click', () => {
    fb.hidden = true;
    idx += 1;
    step();
  });

  function showFeedback(correct, detail) {
    fb.classList.remove('good', 'bad');
    if (correct === null) {
      fbTitle.textContent = '';
      fbDetail.innerHTML = '';
    } else if (correct) {
      fb.classList.add('good');
      fbTitle.textContent = 'Richtig! ✓';
      fbDetail.innerHTML = detail || '';
    } else {
      fb.classList.add('bad');
      fbTitle.textContent = 'Nicht ganz.';
      fbDetail.innerHTML = detail ? `Richtig wäre: ${detail}` : '';
    }
    fb.hidden = false;
    fbBtn.focus();
  }

  function step() {
    if (idx >= queue.length) {
      finish();
      return;
    }
    pbarFill.style.width = `${Math.round((idx / queue.length) * 100)}%`;
    const ex = queue[idx];
    renderExercise(ex, area, (correct, detail) => {
      if (!ex.retry) {
        firstTry += 1;
        if (correct) firstTryCorrect += 1;
      }
      if (correct) {
        xp += ex.retry ? 5 : 10;
      } else {
        if (ex.itemId) failed.add(ex.itemId);
        if (ex.kind !== 'match') queue.push({ ...ex, retry: true });
      }
      showFeedback(correct, detail);
    });
    if (isPassive(ex)) showFeedback(null, '');
  }

  function finish() {
    pbarFill.style.width = '100%';

    // SRS aktualisieren: jedes beteiligte Item gilt als richtig,
    // wenn es in dieser Runde nie falsch beantwortet wurde.
    const itemIds = [...new Set(queue.filter((e) => e.itemId && !e.retry).map((e) => e.itemId))];
    for (const id of itemIds) applyResult(state.srs, id, !failed.has(id));

    const accuracy = firstTry ? Math.round((firstTryCorrect / firstTry) * 100) : 100;
    const bonus = opts.mode === 'lesson' ? 20 : 10;
    if (opts.mode === 'lesson') completeLesson(opts.lesson.id, accuracy);
    addXp(xp + bonus);
    touchStreak();
    save();

    host.innerHTML = `
      <div class="endscreen">
        <div class="end-emoji">${accuracy >= 90 ? '🎉' : accuracy >= 60 ? '👏' : '💪'}</div>
        <h1>${opts.mode === 'lesson' ? 'Lektion geschafft!' : 'Wiederholung geschafft!'}</h1>
        <div class="end-stats">
          <div class="end-stat"><div class="v">+${xp + bonus}</div><div class="k">XP</div></div>
          <div class="end-stat"><div class="v">${accuracy} %</div><div class="k">richtig</div></div>
          <div class="end-stat"><div class="v">🔥 ${currentStreak()}</div><div class="k">Tage-Serie</div></div>
        </div>
        <button class="btn" id="end-continue">Weiter</button>
      </div>`;
    host.querySelector('#end-continue').addEventListener('click', () => {
      location.hash = opts.mode === 'review' ? '#/review' : '#/';
    });
  }

  step();
}
