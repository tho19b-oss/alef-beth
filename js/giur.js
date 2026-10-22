// Giur-Wissen: Übersicht der Prüfungsteile, ein Teil mit seinen Fragen und die
// Karten-Runde (Frage → Antwort aufdecken → „Gewusst“ oder „Nochmal“).
//
// Die Karten laufen durch dieselbe Wiederholungsleiter wie die Hebräisch-Karten
// (srs.js), liegen aber in state.giur.cards – so mischt sich „Wie viele Tage
// Sukkot?“ nie in die Alef-Bet-Wiederholung.

import { TEILE, getTeil, getQuestion, TYPE_LABEL, STATUS_LABEL } from '../data/giur.js';
import { state, save, addXp, touchStreak, currentStreak } from './state.js';
import { applyResult, dueIds } from './srs.js';
import { sample, esc } from './util.js';
import { topbarHtml, bumpCounters, modeSwitchHtml, pipsHtml, greetingHtml, bindGreeting } from './screens.js';
import { renderCelebration } from './lesson.js';
import { syncBadges } from './badges.js';
import {
  reviewHtml, wireReview, reviewOf, panelHtml, wirePanel,
} from './giur-pruefung.js';
import {
  icon, he, replay, setProgress, confirmDialog, sound, reducedMotion,
} from './ui.js';

const ROUND = 10;      // Karten pro Runde
const MAX_DUE = 7;     // so viele fällige Karten höchstens vorab, damit auch Neues drankommt
const COMBO_FROM = 3;  // wie in den Lektionen: ab so vielen Treffern in Folge erscheint die Flamme
const MAX_RETRY = 2;   // eine nicht gewusste Karte kommt höchstens zweimal zurück

const MARKED_ROUND = 20; // so viele markierte Karten höchstens in einer Runde
const MARKED = 'markiert'; // Pseudo-Teil in der Adresse: #/giur/markiert/run

const cards = () => state.giur.cards;

// ---------- Markieren zum Wiederholen ----------

const marked = () => state.giur.marked;
const isMarked = (id) => Boolean(marked()[id]);
const markedIds = () => Object.keys(marked()).filter((id) => getQuestion(id));

function toggleMark(id) {
  if (isMarked(id)) delete marked()[id];
  else marked()[id] = Date.now();
  save();
  return isMarked(id);
}

// Lesezeichen (gibt es im Design System noch nicht, deshalb hier als Pfad).
const BOOKMARK = '<svg class="ab-icon" viewBox="0 0 24 24" focusable="false" aria-hidden="true">'
  + '<path d="M7 3.5h10a1.5 1.5 0 0 1 1.5 1.5v15.2a.6.6 0 0 1-1 .5L12 16.6l-5.5 4.1a.6.6 0 0 1-1-.5V5A1.5 1.5 0 0 1 7 3.5z" '
  + 'stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/></svg>';

function markBtnHtml(id, extra = '') {
  const on = isMarked(id);
  return `<button class="giur-mark${extra}" type="button" data-mark="${id}" aria-pressed="${on}"
    aria-label="Zum Wiederholen markieren" title="${on ? 'Markierung entfernen' : 'Zum Wiederholen markieren'}">${BOOKMARK}</button>`;
}

// Ein Klick auf ein Lesezeichen in scope schaltet die Markierung um.
function wireMarks(scope, onChange) {
  scope.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-mark]');
    if (!btn) return;
    e.preventDefault(); // in <summary> soll der Klick die Antwort nicht aufklappen
    e.stopPropagation();
    const on = toggleMark(btn.dataset.mark);
    btn.setAttribute('aria-pressed', String(on));
    btn.title = on ? 'Markierung entfernen' : 'Zum Wiederholen markieren';
    replay(btn, 'is-bump');
    onChange?.(on);
  });
}

// ---------- Zahlen zu einem Teil ----------

function teilStats(teil) {
  const ids = teil.fragen.map((q) => q.id);
  const learned = ids.filter((id) => cards()[id]).length;
  const due = dueIds(cards()).filter((id) => getQuestion(id)?.teil === teil.id).length;
  return { total: ids.length, learned, due };
}

// Welche Karten kommen in die nächste Runde? Fällige zuerst (höchstens
// MAX_DUE), dann neue in Katalogreihenfolge. Ist nichts fällig und nichts neu,
// gibt es freies Üben aus dem schon Gelernten.
function buildRound(teil) {
  const mine = teil.fragen.map((q) => q.id);
  const due = dueIds(cards()).filter((id) => getQuestion(id)?.teil === teil.id);
  const fresh = mine.filter((id) => !cards()[id]);
  const ids = [
    ...due.slice(0, MAX_DUE),
    ...fresh,
    ...due.slice(MAX_DUE),
  ].slice(0, ROUND);
  if (ids.length) return { ids, mode: 'learn' };
  return { ids: sample(mine, Math.min(ROUND, mine.length)), mode: 'practice' };
}

// ---------- Antwort anzeigen (Karte und Fragenliste teilen sich das) ----------

function statusPill(q) {
  return `<span class="giur-status giur-status--${q.status} text-label">${STATUS_LABEL[q.status]}</span>`;
}

function hebrewBlock(h) {
  return `
    <div class="giur-hebrew">
      <p class="giur-hebrew__label text-caption">${esc(h.label)}</p>
      <div class="ab-showcase">${he(esc(h.text), 'hebrew-line')}</div>
      ${h.translit ? `<p class="giur-hebrew__translit text-caption">${esc(h.translit)}</p>` : ''}
      ${h.de ? `<p class="giur-hebrew__de text-caption">${esc(h.de)}</p>` : ''}
    </div>`;
}

function answerHtml(q) {
  const own = q.type === 'persoenlich';
  return `
    <div class="giur-answer">
      <p class="giur-answer__label text-overline">${own ? 'Worauf es ankommt' : 'Antwort'}</p>
      <p class="text-body giur-answer__kurz">${esc(q.kurz)}</p>
      ${q.punkte?.length ? `<ul class="giur-points text-body">${q.punkte.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
      ${(q.hebrew || []).map(hebrewBlock).join('')}
      ${q.quelle ? `<p class="giur-source text-caption">Quelle: ${esc(q.quelle)}</p>` : ''}
      ${q.check ? `<div class="ab-hint ab-hint--info">${icon('bulb')}<p class="text-body"><b>Beim Lehrer klären:</b> ${esc(q.check)}</p></div>` : ''}
      ${q.status === 'entwurf' ? '<p class="giur-draftnote text-caption">Entwurf – noch nicht von einem Rabbiner oder Lehrer geprüft.</p>' : ''}
      ${reviewHtml(q)}
    </div>`;
}

function subList(q) {
  if (!q.sub?.length) return '';
  return `<ol class="giur-sub text-body" type="a">${q.sub.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>`;
}

// Unterfragen in einer Zeile, für die zugeklappte Fragenliste.
function subLine(q) {
  if (!q.sub?.length) return '';
  return `<span class="giur-q__subs text-caption">${(q.sub.length === 1 ? [esc(q.sub[0])] : q.sub.map((s, i) => `${String.fromCharCode(97 + i)}. ${esc(s)}`)).join(' · ')}</span>`;
}

// ---------- Übersicht: die 18 Teile ----------

function markedTileHtml() {
  const ids = markedIds();
  if (!ids.length) return '';
  const teile = new Set(ids.map((id) => getQuestion(id).teil)).size;
  return `
    <button class="ab-alpha giur-marked" type="button" id="giur-marked">
      <span class="ab-alpha__glyph">${BOOKMARK}</span>
      <span class="ab-alpha__text"><span class="text-strong">Markierte Fragen</span>
        <span class="ab-alpha__sub text-caption">${ids.length} ${ids.length === 1 ? 'Karte' : 'Karten'} aus ${teile} ${teile === 1 ? 'Teil' : 'Teilen'}</span></span>
      <span class="giur-chevron">${icon('chevron')}</span>
    </button>`;
}

export function renderGiur(host) {
  const streak = currentStreak();
  const ready = TEILE.filter((t) => t.fragen.length);
  const available = ready.reduce((n, t) => n + t.fragen.length, 0);
  const catalog = TEILE.reduce((n, t) => n + t.geplant, 0);
  const learned = ready.reduce((n, t) => n + teilStats(t).learned, 0);
  const pct = available ? Math.round((learned / available) * 100) : 0;

  const row = (t) => {
    if (!t.fragen.length) {
      return `
        <li><div class="ab-alpha giur-soon" aria-disabled="true">
          <span class="ab-alpha__glyph"><span class="text-title">${t.nr}</span></span>
          <span class="ab-alpha__text"><span class="text-strong">${esc(t.title)}</span>
            <span class="ab-alpha__sub text-caption">Kommt später · ${t.geplant} ${t.geplant === 1 ? 'Frage' : 'Fragen'}${t.zusatz ? `, ${t.zusatz}` : ''}</span></span>
        </div></li>`;
    }
    const s = teilStats(t);
    return `
      <li><button class="ab-alpha" type="button" data-teil="${t.id}">
        <span class="ab-alpha__glyph"><span class="text-title">${t.nr}</span></span>
        <span class="ab-alpha__text"><span class="text-strong">${esc(t.title)}</span>
          <span class="ab-alpha__sub text-caption">${s.learned} von ${s.total} gelernt</span></span>
        ${s.due ? `<span class="ab-chip ab-chip--due text-label" title="Fällig">${icon('repeat')}<span class="ab-sr">Fällig:</span>${s.due}</span>` : ''}
        <span class="giur-chevron">${icon('chevron')}</span>
      </button></li>`;
  };

  host.innerHTML = `
    <div class="giur">
      ${topbarHtml(streak)}
      ${greetingHtml()}
      ${modeSwitchHtml('giur')}

      <div class="ab-hint ab-hint--info">${icon('book')}<p class="text-body"><b>Fragen fürs Beit Din.</b>
        Antworten mit dem Status „Entwurf“ sind noch nicht von deinem Rabbiner oder Lehrer geprüft –
        maßgeblich ist immer, was dort gelehrt wird.</p></div>

      <section class="home-meter ab-meter" aria-label="Fortschritt Giur-Wissen">
        <div class="ab-meter__head">
          <span class="text-strong">${learned === available && available ? 'Alles einmal gelernt!' : 'Schon gelernt'}</span>
          <span class="ab-meter__count text-caption">${learned} / ${available}</span>
        </div>
        <div class="ab-progress ab-progress--gold ab-progress--slim" role="progressbar" aria-label="Gelernte Fragen"
             aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><div class="ab-progress__fill" style="width:${pct}%"></div></div>
        <p class="giur-meter__note text-caption">${available < catalog
          ? `${available} von ${catalog} Fragen des Katalogs sind aufbereitet, weitere Teile folgen.`
          : `Alle ${catalog} Fragen des Katalogs sind aufbereitet.`}</p>
      </section>

      ${markedTileHtml()}

      <ol class="giur-teile" aria-label="Teile des Prüfungskatalogs">${TEILE.map(row).join('')}</ol>
    </div>`;

  bumpCounters(host.querySelector('.giur'), streak);
  bindGreeting(host);
  host.querySelector('#giur-marked')?.addEventListener('click', () => {
    location.hash = `#/giur/${MARKED}/run`;
  });
  host.querySelectorAll('[data-teil]').forEach((b) =>
    b.addEventListener('click', () => { location.hash = `#/giur/${b.dataset.teil}`; }));
}

// ---------- Ein Teil: Kennzahlen, Start und alle Fragen zum Nachlesen ----------

export function renderGiurTeil(host, teilId, { openPanel = false } = {}) {
  const teil = getTeil(teilId);
  if (!teil || !teil.fragen.length) {
    location.hash = '#/giur';
    return;
  }
  const s = teilStats(teil);
  const round = buildRound(teil);
  const pct = Math.round((s.learned / s.total) * 100);
  const cta = round.mode === 'practice' ? 'Trotzdem eine Runde üben'
    : s.due ? 'Wiederholung starten' : s.learned ? 'Nächste Runde' : 'Runde starten';
  const note = round.mode === 'practice'
    ? 'Alles gelernt und nichts fällig. Freies Üben verschiebt keine Termine, hilft aber trotzdem.'
    : `${round.ids.length} ${round.ids.length === 1 ? 'Karte' : 'Karten'} in dieser Runde${s.due ? `, davon ${Math.min(s.due, MAX_DUE)} zur Wiederholung` : ''}.`;

  const allDraft = teil.fragen.every((q) => q.status === 'entwurf');

  const item = (q) => `
    <details class="giur-q" data-urteil="${reviewOf(q.id)?.urteil || ''}">
      <summary>
        <span class="giur-q__nr text-label">${q.nr}</span>
        <span class="giur-q__text text-strong">${esc(q.q)}${subLine(q)}</span>
        ${markBtnHtml(q.id)}
        <span class="giur-q__chev">${icon('chevron')}</span>
      </summary>
      <div class="giur-q__body">
        <div class="giur-tags">
          <span class="giur-type text-label">${TYPE_LABEL[q.type]}</span>${statusPill(q)}${pipsHtml(cards()[q.id])}
        </div>
        ${answerHtml(q)}
      </div>
    </details>`;

  host.innerHTML = `
    <div class="screen giur-screen">
      <a class="giur-back text-label" href="#/giur">${icon('chevron')}Alle Teile</a>
      <h1 class="screen__title text-title">${teil.nr}. ${esc(teil.title)}</h1>
      <p class="giur-desc text-body">${esc(teil.desc)}</p>

      <section class="ab-card review-card" aria-labelledby="giur-start">
        <p class="text-numeral" aria-hidden="true">${s.learned}<span class="giur-of text-heading"> / ${s.total}</span></p>
        <h2 class="text-heading" id="giur-start">Fragen gelernt<span class="ab-sr">: ${s.learned} von ${s.total}</span></h2>
        <div class="ab-progress ab-progress--gold ab-progress--slim giur-card-progress" role="progressbar" aria-label="Gelernt"
             aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><div class="ab-progress__fill" style="width:${pct}%"></div></div>
        <p class="review-card__text text-body">${note}</p>
        <button class="ab-btn text-button" type="button" id="giur-run">${cta}</button>
      </section>

      ${panelHtml(teil, openPanel)}

      <h2 class="screen__section text-heading">Alle Fragen</h2>
      <p class="giur-desc text-caption">Zum Nachlesen: Tippe eine Frage an, um ${allDraft ? 'den Antwort-Entwurf' : 'die Antwort'} zu sehen.</p>
      <div class="giur-list">${teil.fragen.map(item).join('')}</div>
    </div>`;

  host.querySelector('#giur-run').addEventListener('click', () => {
    location.hash = `#/giur/${teil.id}/run`;
  });

  wireMarks(host.querySelector('.giur-list'));

  // Prüfung: Änderungen färben die Nummer der Frage und erneuern den Zähler.
  const panel = wirePanel(host.querySelector('.giur-export'), teil,
    () => renderGiurTeil(host, teil.id, { openPanel: true }));
  wireReview(host.querySelector('.giur-list'), (id) => {
    const item = host.querySelector(`.giur-review[data-id="${id}"]`)?.closest('.giur-q');
    if (item) item.dataset.urteil = reviewOf(id)?.urteil || '';
    panel.refresh();
  });
}

// ---------- Die Karten-Runde ----------

// Markierte Fragen über alle Teile, gemischt. Die Runde gilt als freies Üben:
// Gewusstes verschiebt keine Termine, Nichtgewusstes holt die Karte zurück.
function markedRound() {
  const all = markedIds();
  return { ids: sample(all, Math.min(MARKED_ROUND, all.length)), mode: 'practice' };
}

export function runGiurRound(teilId, host) {
  const isMarkedRun = teilId === MARKED;
  const teil = isMarkedRun ? null : getTeil(teilId);
  const { ids, mode } = isMarkedRun ? markedRound() : teil?.fragen.length ? buildRound(teil) : { ids: [] };
  if (!ids.length) {
    location.hash = '#/giur';
    return;
  }
  const queue = ids.map((id) => ({ id, retry: 0 }));
  const exitHash = isMarkedRun ? '#/giur' : `#/giur/${teil.id}`;

  let idx = 0;
  let xp = 0;
  let combo = 0;
  let firstTry = 0;
  let firstTryCorrect = 0;
  let revealed = false;
  const failed = new Set();

  host.innerHTML = `
    <div class="lesson giur-round">
      <header class="ab-lessonbar">
        <button class="ab-iconbtn" type="button" id="quit" aria-label="Runde beenden" title="Beenden">${icon('close')}</button>
        <div class="ab-progress" role="progressbar" aria-label="Fortschritt" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">
          <div class="ab-progress__fill"></div>
        </div>
        <span class="ab-combo text-label" title="Gewusst in Folge" aria-hidden="true" hidden>${icon('flame')}<span data-count></span></span>
      </header>
      <div class="lesson-stage" id="card-area" aria-live="polite"></div>
      <div class="giur-bar" id="card-bar"></div>
    </div>`;

  const area = host.querySelector('#card-area');
  const bar = host.querySelector('#card-bar');
  const progress = host.querySelector('.ab-progress');
  const comboChip = host.querySelector('.ab-combo');
  wireMarks(area);
  wireReview(area); // Die Prüfung gehört zur aufgedeckten Antwort; die Karten wechseln nur den Inhalt.

  host.querySelector('#quit').addEventListener('click', async () => {
    const quit = await confirmDialog({
      title: 'Runde wirklich beenden?',
      text: 'Der Fortschritt dieser Runde geht verloren.',
      confirm: 'Beenden',
      cancel: 'Weiter lernen',
    });
    if (quit && area.isConnected) location.hash = exitHash;
  });

  function updateCombo(known) {
    combo = known ? combo + 1 : 0;
    if (combo < COMBO_FROM) {
      comboChip.hidden = true;
      return;
    }
    const isNew = comboChip.hidden;
    comboChip.hidden = false;
    comboChip.querySelector('[data-count]').textContent = String(combo);
    replay(comboChip, isNew ? 'is-new' : 'is-bump');
  }

  function showBar() {
    if (!revealed) {
      bar.innerHTML = '<button class="ab-btn text-button" type="button" data-act="reveal">Antwort zeigen</button>';
    } else {
      bar.innerHTML = `
        <div class="giur-bar__pair">
          <button class="ab-btn ab-btn--secondary text-button" type="button" data-act="again">Nochmal</button>
          <button class="ab-btn ab-btn--success text-button" type="button" data-act="known">Gewusst</button>
        </div>`;
    }
  }

  bar.addEventListener('click', (e) => {
    const act = e.target.closest('[data-act]')?.dataset.act;
    if (act === 'reveal') reveal();
    else if (act === 'again') rate(false);
    else if (act === 'known') rate(true);
  });

  // Am Rechner: Enter oder Leertaste deckt auf, danach 1 = Nochmal, 2 = Gewusst;
  // M markiert die Karte zum Wiederholen.
  function onKey(e) {
    if (!area.isConnected) {
      document.removeEventListener('keydown', onKey);
      return;
    }
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (e.target.closest?.('textarea, input')) return; // Tippen in der Notiz bewertet nichts
    if (document.querySelector('dialog[open]')) return;
    // Liegt der Fokus auf einem Knopf, löst Enter/Leertaste diesen selbst aus.
    if (!revealed && (e.key === 'Enter' || e.key === ' ') && !document.activeElement?.closest('button')) {
      e.preventDefault();
      reveal();
    } else if (revealed && e.key === '1') {
      rate(false);
    } else if (revealed && e.key === '2') {
      rate(true);
    } else if (e.key === 'm' || e.key === 'M') {
      area.querySelector('[data-mark]')?.click();
    }
  }
  document.addEventListener('keydown', onKey);

  function reveal() {
    if (revealed) return;
    revealed = true;
    const ans = area.querySelector('.giur-card__answer');
    ans.hidden = false;
    area.querySelector('.giur-card__prompt').hidden = true;
    showBar();
    // Lange Antworten reichen unter die Knopfleiste: so weit scrollen, dass die
    // Antwort hineinpasst – aber nie über ihren Anfang hinaus.
    const r = ans.getBoundingClientRect();
    const overflow = r.bottom - (window.innerHeight - bar.offsetHeight) + 16;
    const top = Math.max(0, Math.min(overflow, r.top - 72));
    if (top > 0) window.scrollBy({ top, behavior: reducedMotion() ? 'auto' : 'smooth' });
    // Der Fokus bleibt bei der Antwort (Screenreader lesen sie als Nächstes) und
    // nicht auf „Gewusst“ – ein zweites Enter soll nichts bewerten.
    ans.focus({ preventScroll: true });
  }

  function rate(known) {
    if (!revealed) return;
    const ex = queue[idx];
    if (!ex.retry) {
      firstTry += 1;
      if (known) firstTryCorrect += 1;
    }
    xp += known ? (ex.retry ? 5 : 10) : 0;
    if (!known) {
      failed.add(ex.id);
      if (ex.retry < MAX_RETRY) queue.push({ id: ex.id, retry: ex.retry + 1 });
    }
    updateCombo(known);
    if (known) sound('richtig', { step: combo - 1, flame: combo === COMBO_FROM });
    else sound('falsch');
    idx += 1;
    step();
  }

  function step() {
    if (idx >= queue.length) {
      finish();
      return;
    }
    revealed = false;
    setProgress(progress, (idx / queue.length) * 100);
    const { id, retry } = queue[idx];
    const q = getQuestion(id);
    window.scrollTo(0, 0);
    area.innerHTML = `
      <article class="ab-card giur-card ab-enter">
        <div class="giur-tags">
          <span class="ab-info__tag text-overline">${icon('book')}${esc(getTeil(q.teil).title)} · Frage ${q.nr}</span>
          <span class="giur-type text-label">${TYPE_LABEL[q.type]}</span>${statusPill(q)}
          ${markBtnHtml(q.id, ' giur-mark--card')}
        </div>
        ${retry ? '<p class="giur-again text-caption">Noch einmal – diese Karte war eben nicht sicher.</p>' : ''}
        <h2 class="giur-card__q text-heading">${esc(q.q)}</h2>
        ${subList(q)}
        <p class="giur-card__prompt text-caption">${q.type === 'persoenlich'
    ? 'Überlege dir deine eigene Antwort, dann decke auf.'
    : 'Antworte laut oder im Kopf, dann decke auf.'}</p>
        <div class="giur-card__answer" tabindex="-1" hidden>${answerHtml(q)}</div>
      </article>`;
    showBar();
  }

  function finish() {
    document.removeEventListener('keydown', onKey);
    setProgress(progress, 100);

    // Ein Treffer gilt nur, wenn die Karte in dieser Runde nie „Nochmal“ war.
    // Freies Üben zählt – wie bei den Hebräisch-Karten – nur negativ.
    for (const id of new Set(ids)) {
      const known = !failed.has(id);
      if (mode === 'practice' && known) continue;
      applyResult(cards(), id, known);
    }

    const accuracy = firstTry ? Math.round((firstTryCorrect / firstTry) * 100) : 100;
    const bonus = 10;
    const streakBefore = currentStreak();
    addXp(xp + bonus);
    touchStreak();
    save();
    const badges = syncBadges(); // neu erreichte Abzeichen

    setTimeout(() => {
      if (!area.isConnected) return;
      renderCelebration(host, {
        opts: { mode: 'giur' }, accuracy, gained: xp + bonus, streakBefore, streak: currentStreak(), exitHash, badges,
      });
    }, reducedMotion() ? 0 : 450);
  }

  step();
}
