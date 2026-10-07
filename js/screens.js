// Screens: Lernpfad (Home), Wiederholen, Alphabet-Tabelle, Erfolge, Einstellungen.

import { UNITS, isUnlocked, getItem, orderedLessons } from '../data/curriculum.js';
import { LETTERS } from '../data/letters.js';
import { NIKUD } from '../data/nikud.js';
import {
  state, save, currentStreak, resetAll, todayXp, canClaimBonus, claimBonus, learnedOn, GOAL_BONUS,
} from './state.js';
import { BADGES } from './badges.js';
import { scheduleReminder, parseTime, DEFAULT_TIME } from './notify.js';
import { applyTheme, applyMotion } from './theme.js';
import { dueIds, nextDue } from './srs.js';
import { speak, ttsSupported, hasHebrewVoice, hebrewVoiceName, audioActive } from './audio.js';
import { sound, soundSupported } from './sound.js';
import { activeVersion, checkForUpdate } from './version.js';
import { todayStr } from './util.js';
import {
  icon, he, countUp, replay, setProgress, ring, confetti, toast, xp as xpBurst, reducedMotion, confirmDialog,
} from './ui.js';

const num = (n) => n.toLocaleString('de-DE');

// ---------- Kopfleiste: Marke, Serie, XP ----------

// Zuletzt angezeigte Zählerstände. Kommt man aus einer Lektion zurück, zählen
// Chips und Tagesziel von dort aus hoch, statt einfach umzuspringen.
// weekToday: an welchem Tag der heutige Punkt der Serien-Woche schon gefeiert wurde.
const shown = { streak: null, xp: null, daily: null, weekToday: null };

function topbarHtml(streak) {
  // Heute schon gelernt: die Flamme flackert. Serie 0: graue Flamme.
  const flame = streak === 0 ? ' is-cold' : state.streak.lastDay === todayStr() ? ' is-lit' : '';
  const start = (key, value) => (shown[key] !== null && shown[key] < value ? shown[key] : value);
  return `
    <header class="ab-topbar">
      <div class="ab-brand text-heading"><span class="ab-brand__mark" lang="he" aria-hidden="true">א</span>Alef Beth</div>
      <div class="ab-stats">
        <span class="ab-chip ab-chip--streak${flame} text-label" id="chip-streak" title="Tage-Serie">${icon('flame')}<span class="ab-sr">Tage-Serie:</span><span data-count>${num(start('streak', streak))}</span></span>
        <span class="ab-chip ab-chip--xp text-label" id="chip-xp" title="Erfahrungspunkte">${icon('bolt')}<span class="ab-sr">Erfahrungspunkte:</span><span data-count>${num(start('xp', state.xp))}</span></span>
      </div>
    </header>`;
}

// Nur Zuwachs wird gefeiert – eine gerissene Serie springt kommentarlos zurück.
function bumpCounters(host, streak) {
  const values = { streak, xp: state.xp };
  for (const key of Object.keys(values)) {
    const before = shown[key];
    const value = values[key];
    shown[key] = value;
    if (before === null || before >= value) continue;
    const chip = host.querySelector(`#chip-${key}`);
    setTimeout(() => {
      if (!chip.isConnected) return;
      replay(chip, 'is-bump');
      countUp(chip.querySelector('[data-count]'), value, { from: before });
    }, 350);
  }
}

// ---------- Tagesziel ----------

function todayNote(value, goal) {
  if (value >= goal) {
    return state.daily.claimed
      ? `Ziel von ${goal} XP geschafft, Bonus abgeholt. Bis morgen!`
      : `Geschafft! Dein Ziel von ${goal} XP ist erreicht.`;
  }
  if (value === 0) return 'Eine Lektion bringt dich ungefähr ans Ziel.';
  return `Noch ${goal - value} XP bis zum Ziel.`;
}

// Karte „Heute“: Ring mit den XP des Tages. Gezeichnet wird der zuletzt
// gezeigte Stand; fillToday() lässt ihn danach auf den aktuellen wachsen.
function todayHtml(from, value, goal) {
  const ratio = Math.min(1, from / goal);
  // is-settled: schon vorher erreicht – Krone und Ring nicht bei jedem Besuch
  // erneut hüpfen lassen.
  const done = from >= goal ? ' is-complete is-settled' : '';
  // Über dem Ziel zählt die echte Summe, nicht die gedeckelte des Rings.
  const heading = value >= goal ? `${num(value)} XP heute` : `${value} von ${goal} XP`;
  return `
    <section class="ab-card today" aria-labelledby="today-title">
      <div class="ab-goal ab-goal--sm today__ring${done}" role="img" aria-label="Tagesziel: ${Math.min(value, goal)} von ${goal} XP">
        <svg class="ab-goal__ring" viewBox="0 0 120 120" aria-hidden="true">
          <circle class="ab-goal__track" cx="60" cy="60" r="50"/>
          <circle class="ab-goal__bar" cx="60" cy="60" r="50" pathLength="100"
                  style="stroke-dashoffset:${100 - ratio * 100};opacity:${ratio > 0 ? 1 : 0}"/>
        </svg>
        <div class="ab-goal__center" aria-hidden="true">
          <span class="ab-goal__value text-heading">${Math.min(from, goal)}</span>
          <span class="ab-goal__unit text-caption">XP</span>
          <span class="ab-goal__done">${icon('crown')}</span>
        </div>
      </div>
      <div class="today__text">
        <p class="today__kicker text-overline">Tagesziel</p>
        <h2 class="text-heading" id="today-title">${heading}</h2>
        <p class="today__note text-caption">${todayNote(value, goal)}</p>
      </div>
    </section>`;
}

function bonusHtml(hidden) {
  return `
    <div class="ab-banner ab-banner--reward" role="region" aria-label="Tagesziel erreicht" id="goal-bonus"${hidden ? ' hidden' : ''}>
      <span class="ab-banner__icon">${icon('target')}</span>
      <p class="ab-banner__text text-body">Tagesziel erreicht – <b>+${GOAL_BONUS} XP</b> Bonus</p>
      <button class="ab-btn ab-btn--gold ab-btn--sm ab-btn--shine text-label" type="button" id="claim-bonus">Abholen</button>
    </div>`;
}

// Der Ring wächst auf den neuen Stand. Wird das Ziel dabei erreicht, ploppt
// die Krone – Konfetti und Klang nur, wenn auf diesem Screen nicht schon eine
// größere Feier läuft – und danach fällt der Bonus-Banner herein.
function fillToday(home, value, goal, { celebrate }) {
  const el = home.querySelector('.today__ring');
  const banner = home.querySelector('#goal-bonus');
  setTimeout(() => {
    if (!el.isConnected) return;
    const reached = value >= goal && !el.classList.contains('is-complete');
    ring(el, value, goal, { confetti: celebrate });
    if (reached && celebrate) sound('tagesziel');
    if (banner) setTimeout(() => { banner.hidden = false; }, reducedMotion() ? 0 : 700);
  }, reducedMotion() ? 0 : 400);
}

// Bonus abholen: Funken fliegen vom Knopf zum XP-Chip, der hochzählt.
function collectBonus(home, btn) {
  if (!claimBonus()) return;
  btn.disabled = true;
  shown.xp = state.xp;
  sound('bonus');
  xpBurst(btn, GOAL_BONUS, { to: home.querySelector('#chip-xp'), total: state.xp });
  home.querySelector('.today__note').textContent = todayNote(todayXp(), state.settings.dailyGoal);
  const banner = home.querySelector('#goal-bonus');
  banner.classList.add('is-leaving');
  setTimeout(() => banner.remove(), reducedMotion() ? 0 : 320);
}

// ---------- Home / Lernpfad ----------

// Welche Lektionen beim letzten Zeichnen schon geschafft waren. Ist seitdem
// eine dazugekommen, kommt man gerade aus ihr zurück: Der Balken wächst
// sichtbar, und das Schloss der nächsten Lektion springt auf.
let shownLessons = null;
let nopeToast = null;

function stepState(l) {
  if (state.lessons[l.id]) return 'done';
  return isUnlocked(l.id, state.lessons) ? 'current' : 'locked';
}

export function renderHome(host) {
  const lessons = orderedLessons();
  const total = lessons.length;
  const doneIds = lessons.filter((l) => state.lessons[l.id]).map((l) => l.id);
  const done = doneIds.length;
  const due = dueIds(state.srs).length;
  const streak = currentStreak();

  const fresh = shownLessons ? doneIds.filter((id) => !shownLessons.has(id)) : [];
  shownLessons = new Set(doneIds);
  const shownDone = done - fresh.length;
  // Die gerade frei gewordene Lektion wird erst gesperrt gezeichnet und dann
  // vor den Augen geöffnet.
  const unlocked = fresh.length ? lessons.find((l) => stepState(l) === 'current') : null;
  const freshUnit = UNITS.find((u) =>
    u.lessons.some((l) => fresh.includes(l.id)) && u.lessons.every((l) => state.lessons[l.id]));
  const pct = (n) => Math.round((n / total) * 100);

  // Tagesziel: seit dem letzten Besuch dazugewonnene XP wachsen sichtbar nach.
  const goal = state.settings.dailyGoal;
  const daily = todayXp();
  const dailyFrom = shown.daily !== null && shown.daily < daily ? shown.daily : daily;
  shown.daily = daily;
  const crossing = dailyFrom < goal && daily >= goal;

  host.innerHTML = `
    <div class="home">
      ${topbarHtml(streak)}

      ${todayHtml(dailyFrom, daily, goal)}
      ${canClaimBonus() ? bonusHtml(crossing) : ''}

      <section class="home-meter ab-meter" aria-label="Gesamtfortschritt">
        <div class="ab-meter__head">
          <span class="text-strong">${done === total ? 'Alle Lektionen geschafft!' : 'Dein Weg durchs Alef-Bet'}</span>
          <span class="ab-meter__count text-caption"><span data-count>${shownDone}</span> / ${total}</span>
        </div>
        <div class="ab-progress ab-progress--gold ab-progress--slim" role="progressbar" aria-label="Abgeschlossene Lektionen"
             aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct(shownDone)}"><div class="ab-progress__fill" style="width:${pct(shownDone)}%"></div></div>
      </section>

      ${due > 0 ? `
        <div class="ab-banner" role="region" aria-label="Wiederholung fällig">
          <span class="ab-banner__icon">${icon('repeat')}</span>
          <p class="ab-banner__text text-body"><b>${due} ${due === 1 ? 'Karte' : 'Karten'}</b> ${due === 1 ? 'ist' : 'sind'} zur Wiederholung fällig</p>
          <button class="ab-btn ab-btn--info ab-btn--sm text-label" type="button" id="review-now">Üben</button>
        </div>` : ''}

      ${UNITS.map((u, i) => unitHtml(u, i, unlocked)).join('')}
    </div>`;

  const home = host.querySelector('.home');
  bumpCounters(home, streak);
  home.addEventListener('click', (e) => {
    if (e.target.closest('#review-now')) {
      location.hash = '#/review/run';
      return;
    }
    const claim = e.target.closest('#claim-bonus');
    if (claim) {
      collectBonus(home, claim);
      return;
    }
    const step = e.target.closest('.ab-step');
    if (!step) return;
    const node = step.querySelector('.ab-node');
    if (node.getAttribute('aria-disabled') === 'true') {
      replay(node, 'is-nope');
      nopeToast?.close();
      nopeToast = toast('Erst die vorherige Lektion abschließen', { icon: 'lock', duration: 2200 });
      return;
    }
    location.hash = `#/lesson/${node.dataset.lesson}`;
  });

  if (fresh.length) celebrateProgress(home, { done, total, unlocked, freshUnit });
  // Höchstens eine große Feier pro Screen: eine geschaffte Einheit hat Vorrang
  // vor dem Konfetti des Tagesziels.
  if (dailyFrom < daily) fillToday(home, daily, goal, { celebrate: !freshUnit });
}

// Rückkehr aus einer geschafften Lektion: Balken und Zähler wachsen, die
// Kamera fährt zur nächsten Lektion, deren Schloss aufspringt. Eine ganz
// geschaffte Einheit bekommt Konfetti und einen Toast (Feier-Stufe 4).
function celebrateProgress(home, { done, total, unlocked, freshUnit }) {
  const bar = home.querySelector('.home-meter .ab-progress');
  const calm = reducedMotion();
  setTimeout(() => {
    setProgress(bar, (done / total) * 100);
    countUp(home.querySelector('.ab-meter__count [data-count]'), done, { duration: 500 });
  }, 300);

  const step = unlocked && home.querySelector(`[data-step="${unlocked.id}"]`);
  const target = step || home.querySelector(`#unit-${freshUnit?.id}`);
  target?.scrollIntoView({ block: 'center', behavior: calm ? 'auto' : 'smooth' });

  // Das Motiv der Einheit braucht 0,55 s bis zu seinem Akkord. Es beginnt
  // deshalb so, dass der Akkord zusammen mit dem Konfetti kommt.
  if (freshUnit) {
    setTimeout(() => { if (home.isConnected) sound('einheit'); }, calm ? 0 : 100);
  }

  setTimeout(() => {
    if (!home.isConnected) return;
    if (step) {
      step.querySelector('.ab-node').classList.add('is-unlocking');
      // Bei einer geschafften Einheit klingt nur deren Motiv.
      if (!freshUnit) sound('stationFrei');
      setTimeout(() => {
        if (!step.isConnected) return;
        step.outerHTML = stepHtml(unlocked);
        replay(home.querySelector(`[data-step="${unlocked.id}"] .ab-node`), 'is-popping');
      }, calm ? 0 : 420);
    }
    if (freshUnit) {
      const n = UNITS.indexOf(freshUnit) + 1;
      confetti({ origin: step?.querySelector('.ab-node') || target, count: 90, spread: 150, power: 0.8 });
      toast(`Einheit ${n} geschafft: ${freshUnit.title}!`, { tone: 'reward', icon: 'crown' });
    }
  }, calm ? 0 : 650);
}

function unitHtml(u, i, unlocked) {
  const states = u.lessons.map(stepState);
  const allDone = states.every((s) => s === 'done');
  const locked = states[0] === 'locked';
  const mod = allDone ? ' ab-unit--done' : locked ? ' ab-unit--locked' : '';
  return `
    <section class="ab-unit${mod}">
      <header class="ab-unit__banner">
        <span class="ab-unit__glyph" lang="he" aria-hidden="true">${u.glyph}</span>
        <p class="ab-unit__kicker text-overline">Einheit ${i + 1}${allDone ? ' · geschafft' : ''}</p>
        <h2 class="ab-unit__title text-heading" id="unit-${u.id}">${u.title}</h2>
        <p class="ab-unit__desc text-body">${locked ? `Wird frei, sobald Einheit ${i} geschafft ist.` : u.desc}</p>
      </header>
      ${locked ? '' : `<ol class="ab-path" aria-labelledby="unit-${u.id}">${
        u.lessons.map((l) => stepHtml(l, l.id === unlocked?.id ? 'locked' : undefined)).join('')}</ol>`}
    </section>`;
}

// Zeichen im Knoten: einzelne Buchstaben groß, ganze Wörter kleiner.
function nodeGlyph(text) {
  const letters = (text.match(/[א-ת]/g) || []).length;
  return `<span class="${letters > 2 ? 'glyph-sm' : 'glyph-md'}" lang="he" dir="rtl">${text}</span>`;
}

function stepHtml(l, s = stepState(l)) {
  const score = state.lessons[l.id]?.score;
  const inner = s === 'done' ? icon('crown') : s === 'current' ? nodeGlyph(l.icon) : icon('lock');
  const sub = s === 'done' ? `${icon('crown')}${score} % · nochmal üben?`
    : s === 'current' ? 'Jetzt lernen' : 'Erst die vorherige Lektion abschließen';
  const label = s === 'done' ? `${l.title} – geschafft mit ${score} %, nochmal üben`
    : s === 'current' ? `${l.title} – jetzt lernen` : `${l.title} – noch gesperrt`;
  // Der Text daneben ist nur fürs Auge (und vergrößert die Tippfläche); der
  // Knopf trägt die vollständige Beschriftung.
  return `
    <li class="ab-step ab-step--${s}" data-step="${l.id}">
      <button class="ab-node ab-node--${s}" type="button" data-lesson="${l.id}" aria-label="${label}"${s === 'locked' ? ' aria-disabled="true"' : ''}>${inner}</button>
      <span class="ab-step__text" aria-hidden="true">
        <span class="ab-step__title text-strong">${l.title}</span>
        <span class="ab-step__sub text-caption">${sub}</span>
      </span>
    </li>`;
}

// ---------- Wiederholen ----------

export function renderReview(host) {
  const learned = Object.keys(state.srs).length;
  const due = dueIds(state.srs);

  let body;
  if (!learned) {
    body = `
      <div class="ab-hint">${icon('book')}<p class="text-body">Hier erscheinen deine Wiederholungen,
        sobald du die erste Lektion abgeschlossen hast. Regelmäßiges Wiederholen ist der
        Schlüssel – die App merkt sich, was bald wieder fällig ist.</p></div>
      <a class="ab-btn text-button" href="#/">Zum Lernpfad</a>`;
  } else if (!due.length) {
    const next = nextDue(state.srs);
    const when = next ? formatDue(next) : '–';
    body = `
      <section class="ab-card review-card" aria-labelledby="review-title">
        <div class="review-card__art review-card__art--done">${icon('check')}</div>
        <h2 class="text-heading" id="review-title">Alles wiederholt!</h2>
        <p class="review-card__text text-body">Du hast <b>${learned}</b> ${learned === 1 ? 'Zeichen' : 'Zeichen und Wörter'}
          im Training. Die nächsten Karten sind fällig: <b>${when}</b>.</p>
        <button class="ab-btn ab-btn--secondary text-button" type="button" id="free-practice">Trotzdem eine Runde üben</button>
      </section>
      <div class="ab-hint ab-hint--reward">${icon('sparkle')}<p class="text-body">Freies Üben schadet nichts:
        Es verschiebt keine Termine nach hinten, holt aber Wackelkandidaten zurück nach vorn.</p></div>`;
  } else {
    body = `
      <section class="ab-card review-card" aria-labelledby="review-title">
        <div class="review-card__art">${icon('repeat')}</div>
        <p class="text-numeral" aria-hidden="true">${due.length}</p>
        <h2 class="text-heading" id="review-title">${due.length === 1 ? 'Karte' : 'Karten'} fällig<span class="ab-sr">: ${due.length}</span></h2>
        <p class="review-card__text text-body">Kurz wiederholen, bevor es weitergeht – dein Gedächtnis dankt es dir.</p>
        <button class="ab-btn text-button" type="button" id="start-review">Wiederholung starten</button>
      </section>`;
  }

  host.innerHTML = `
    <div class="screen">
      <h1 class="screen__title text-title">Üben &amp; Wiederholen</h1>
      ${body}
    </div>`;
  host.querySelector('#start-review')?.addEventListener('click', () => {
    location.hash = '#/review/run';
  });
  host.querySelector('#free-practice')?.addEventListener('click', () => {
    location.hash = '#/review/practice';
  });
}

// „heute um 19:40“ / „morgen“ statt eines Datums, wenn es ganz nah liegt.
// (Falsch beantwortete Karten kommen schon nach 10 Minuten zurück – da hilft
// ein Datum ohne Uhrzeit niemandem.)
function formatDue(ts) {
  const d = new Date(ts);
  const days = Math.round((new Date(ts).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 86400000);
  if (days <= 0) return `heute um ${d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`;
  if (days === 1) return 'morgen';
  return d.toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' });
}

// ---------- Alphabet-Tabelle ----------

// Wie fest sitzt ein Zeichen? Eine Wiederholungsstufe je Punkt (1 → 3 → 7 →
// 14 → 30 → 90 Tage, siehe srs.js); ein Fehler setzt zurück.
const LEVELS = 6;
function pips(id) {
  const entry = state.srs[id];
  const level = entry ? Math.min(entry.streak, LEVELS) : 0;
  const label = entry ? `Stufe ${level} von ${LEVELS}` : 'noch nicht gelernt';
  let html = '';
  for (let i = 0; i < LEVELS; i++) html += `<span class="ab-pip${i < level ? ' is-on' : ''}"></span>`;
  return `<span class="ab-pips" role="img" aria-label="${label}">${html}</span>`;
}

export function renderAlphabet(host) {
  // Ohne hebräische Stimme wären die Zeilen tote Knöpfe – dann als Liste zeigen.
  const canSpeak = audioActive();
  const tag = canSpeak ? 'button' : 'div';
  const row = (id, tts, glyph, name, sub) => `
    <${tag} class="ab-alpha"${canSpeak ? ` type="button" data-tts="${tts}" aria-label="${name} anhören"` : ''}>
      <span class="ab-alpha__glyph">${he(glyph, 'glyph-md')}</span>
      <span class="ab-alpha__text"><span class="text-strong">${name}</span><span class="ab-alpha__sub text-caption">${sub}</span></span>
      ${pips(id)}
      ${canSpeak ? `<span class="ab-alpha__spk">${icon('speaker')}</span>` : ''}
    </${tag}>`;

  const letterRows = LETTERS.map((l) => {
    let glyphs = l.glyph;
    if (l.dagesh) glyphs += ` ${l.dagesh.glyph}`;
    if (l.variant) glyphs += ` ${l.variant.glyph}`;
    const finalNote = l.final ? ` · Ende: ${he(getItem(l.final).glyph)}` : '';
    return row(l.id, l.ttsWord, glyphs, l.name, `${l.translit}${finalNote}`);
  }).join('');

  const nikudRows = NIKUD.map((v) => row(
    v.id, v.example, v.display, v.name,
    `${v.soundLabel} – Beispiel: ${he(v.example)} „${v.exampleTranslit}“`,
  )).join('');

  host.innerHTML = `
    <div class="screen">
      <h1 class="screen__title text-title">Das Alef-Bet</h1>
      <div class="ab-hint">${icon('book')}<p class="text-body">Zum Nachschlagen – gelesen wird von rechts
        nach links.${canSpeak ? ' Tippe eine Zeile an, um den Namen zu hören.' : ''} Die Punkte zeigen,
        wie fest ein Zeichen sitzt: Jede gelungene Wiederholung füllt einen mehr.</p></div>
      <div class="ab-alphalist">${letterRows}</div>
      <h2 class="screen__section text-heading">Nikud – die Vokalzeichen</h2>
      <div class="ab-alphalist">${nikudRows}</div>
    </div>`;

  host.querySelectorAll('[data-tts]').forEach((b) =>
    b.addEventListener('click', () => speak(b.dataset.tts, { from: b })));
}

// ---------- Erfolge: Serie, Abzeichen, Gesamtzahlen ----------

// Die sieben Tage der laufenden Woche, Montag zuerst.
function thisWeek() {
  const today = new Date();
  const monday = new Date(today.getFullYear(), today.getMonth(), today.getDate() - ((today.getDay() + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i));
}

function streakNote(streak, learnedToday) {
  if (learnedToday) return 'Heute geschafft – bis morgen!';
  if (streak > 0) return 'Noch eine Lektion heute, dann hält deine Serie.';
  return 'Lerne heute eine Lektion – dann beginnt eine neue Serie.';
}

function medalHtml(b) {
  const earned = !!state.badges?.[b.id];
  const [value, needed] = b.progress();
  const art = b.glyph ? he(b.glyph, 'glyph-md') : icon(b.icon);
  const way = !earned && needed > 1; // Weg dorthin zeigen, wo es mehr als einen Schritt gibt
  return `
    <li class="ab-medal${b.tone ? ` ab-medal--${b.tone}` : ''}${earned ? '' : ' is-locked'}">
      <div class="ab-medal__art">
        <div class="ab-medal__disc">${art}</div>
        ${earned ? '' : `<span class="ab-medal__lock">${icon('lock')}</span>`}
      </div>
      <span class="ab-medal__name text-strong">${b.name}${earned ? '' : '<span class="ab-sr"> (noch nicht erreicht)</span>'}</span>
      <span class="ab-medal__desc text-caption">${b.desc}${way ? ` · ${num(value)} / ${num(needed)}` : ''}</span>
      ${way ? `<span class="ab-medal__bar" aria-hidden="true"><i style="--value: ${Math.round((value / needed) * 100)}%"></i></span>` : ''}
    </li>`;
}

export function renderAchievements(host) {
  const streak = currentStreak();
  const today = todayStr();
  const learnedToday = state.streak.lastDay === today;
  // Der heutige Punkt ploppt einmal pro Tag, sobald heute gelernt wurde.
  const popToday = learnedToday && shown.weekToday !== today;
  if (learnedToday) shown.weekToday = today;

  const now = new Date();
  const days = thisWeek().map((d) => {
    const key = todayStr(d);
    const isToday = key === today;
    const done = learnedOn(key);
    const name = d.toLocaleDateString('de-DE', { weekday: 'short' }).replace('.', '');
    const long = d.toLocaleDateString('de-DE', { weekday: 'long' });
    const status = done ? 'gelernt' : isToday ? 'heute, noch offen' : d > now ? 'kommt noch' : 'nicht gelernt';
    const cls = `ab-day${done ? ' is-done' : ''}${isToday ? ' is-today' : ''}${isToday && popToday ? ' is-new' : ''}`;
    return `<li class="${cls}" aria-label="${long}: ${status}"><span class="ab-day__dot">${done ? icon('check') : ''}</span>`
      + `<span class="ab-day__name text-caption" aria-hidden="true">${name}</span></li>`;
  }).join('');

  const earned = BADGES.filter((b) => state.badges?.[b.id]).length;
  const best = state.stats.bestStreak;
  const lessonsDone = Object.keys(state.lessons).length;
  const cards = Object.keys(state.srs).length;

  host.innerHTML = `
    <div class="screen">
      <h1 class="screen__title text-title">Erfolge</h1>

      <article class="ab-card ab-streak${streak ? '' : ' is-cold'}" aria-labelledby="streak-title">
        <div class="ab-streak__hero">
          <span class="ab-streak__flame">${icon('flame')}</span>
          <div>
            <span class="text-numeral" aria-hidden="true">${streak}</span>
            <p class="ab-streak__label text-strong" id="streak-title"><span class="ab-sr">${streak} </span>${streak === 1 ? 'Tag' : 'Tage'} in Folge</p>
          </div>
        </div>
        <ol class="ab-week" aria-label="Diese Woche">${days}</ol>
        <p class="ab-streak__note text-body">${streakNote(streak, learnedToday)}</p>
      </article>

      <h2 class="screen__section text-heading">Abzeichen <span class="screen__count text-caption">${earned} von ${BADGES.length}</span></h2>
      <ul class="ab-medals">${BADGES.map(medalHtml).join('')}</ul>

      <h2 class="screen__section text-heading">Insgesamt</h2>
      <div class="stats" role="list">
        <span class="ab-chip ab-chip--xp text-label" role="listitem">${icon('bolt')}${num(state.xp)} XP</span>
        <span class="ab-chip ab-chip--streak${best ? '' : ' is-cold'} text-label" role="listitem">${icon('flame')}Beste Serie: ${best} ${best === 1 ? 'Tag' : 'Tage'}</span>
        <span class="ab-chip stats__lessons text-label" role="listitem">${icon('crown')}${lessonsDone} von ${orderedLessons().length} Lektionen</span>
        <span class="ab-chip ab-chip--due text-label" role="listitem">${icon('repeat')}${cards} ${cards === 1 ? 'Karte' : 'Karten'} im Training</span>
      </div>
    </div>`;

  if (popToday) {
    replay(host.querySelector('.ab-streak'), 'is-extended');
    sound('serie');
  }
}

// ---------- Einstellungen ----------

const switchHtml = (id, on, disabled = false) => `
  <span class="ab-switch">
    <input type="checkbox" id="${id}"${on ? ' checked' : ''}${disabled ? ' disabled' : ''}>
    <span class="ab-switch__track"></span><span class="ab-switch__knob">${icon('check')}</span>
  </span>`;

const settingText = (forId, title, desc = '') => `
  <label class="ab-setting__text" for="${forId}"><span class="text-strong">${title}</span>${
    desc ? `<span class="ab-setting__desc text-caption">${desc}</span>` : ''}</label>`;

export function renderSettings(host) {
  const voiceOk = ttsSupported() && hasHebrewVoice();
  let voiceLine;
  if (!ttsSupported()) {
    voiceLine = 'Dieser Browser unterstützt keine Sprachausgabe.';
  } else if (voiceOk) {
    voiceLine = `Hebräische Stimme aktiv: <b>${hebrewVoiceName()}</b>`;
  } else {
    voiceLine = `Keine hebräische Stimme gefunden – die App bleibt deshalb stumm,
      statt Hebräisch mit deutscher Stimme vorzulesen. Tipp: Microsoft Edge bringt
      hebräische Online-Stimmen mit – oder installiere unter Windows
      „Einstellungen → Zeit und Sprache → Sprache“ das hebräische Sprachpaket.
      Alles andere funktioniert auch ohne Audio.`;
  }

  // Wünscht das System schon weniger Bewegung, gilt das ohnehin – der Schalter
  // zeigt es dann nur an.
  const systemCalm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const notif = state.settings.notifications;
  const notifSupported = 'Notification' in window;
  // Effektiv aktiv nur, wenn eingeschaltet UND der Browser die Erlaubnis erteilt hat.
  const notifOn = notif.enabled && notifSupported && Notification.permission === 'granted';

  const NOTIF_BLOCKED_MSG = 'Benachrichtigungen sind für diese Seite im Browser blockiert. '
    + 'Öffne die Website-Einstellungen (Schloss- bzw. Info-Symbol links in der Adressleiste) → '
    + '„Benachrichtigungen“ → „Zulassen“ und lade die Seite neu.';

  function notifHintText() {
    if (!notifSupported) {
      return 'Benachrichtigungen sind hier nicht verfügbar – meist, weil die Seite in einem '
        + 'In-App-Browser läuft (z. B. aus einem Chat oder einer Mail geöffnet). Öffne sie direkt '
        + 'in Chrome (Menü ⋮ → „In Chrome öffnen“), dann Menü ⋮ → „App installieren“. '
        + 'In der installierten App lässt sich die Erinnerung aktivieren.';
    }
    if (Notification.permission === 'denied') return NOTIF_BLOCKED_MSG;
    if (state.settings.notifications.enabled && Notification.permission === 'granted') {
      return 'Erinnerung aktiv – funktioniert, solange der Browser bzw. die App im Hintergrund geöffnet ist.';
    }
    return 'Aktiviere die Erinnerung, um täglich zur eingestellten Uhrzeit benachrichtigt zu werden.';
  }

  // Tagesziele in XP: eine Lektion oder Übungsrunde bringt etwa 100.
  const GOALS = [[50, 'Locker'], [100, 'Normal'], [200, 'Ehrgeizig']];

  host.innerHTML = `
    <div class="screen">
      <h1 class="screen__title text-title">Einstellungen</h1>

      <div class="ab-settings">
        <div class="ab-setting">
          ${settingText('set-goal', 'Tagesziel', 'Lektion ≈ 100 XP')}
          <span class="ab-select"><select class="ab-input text-strong" id="set-goal">${GOALS.map(([xp, name]) =>
            `<option value="${xp}" ${state.settings.dailyGoal === xp ? 'selected' : ''}>${name} · ${xp} XP</option>`).join('')}
          </select></span>
        </div>
        <div class="ab-setting">
          ${settingText('set-audio', 'Sprachausgabe', 'Hebräisch vorlesen')}
          ${switchHtml('set-audio', state.settings.audio, !voiceOk)}
        </div>
        <div class="ab-setting">
          ${settingText('set-sounds', 'Soundeffekte', 'Töne bei Antworten und Feiern')}
          ${switchHtml('set-sounds', soundSupported() && state.settings.sounds, !soundSupported())}
        </div>
        <div class="ab-setting">
          ${settingText('set-theme', 'Erscheinungsbild')}
          <span class="ab-select"><select class="ab-input text-strong" id="set-theme">
            <option value="auto" ${state.settings.theme === 'auto' ? 'selected' : ''}>Automatisch</option>
            <option value="light" ${state.settings.theme === 'light' ? 'selected' : ''}>Hell</option>
            <option value="dark" ${state.settings.theme === 'dark' ? 'selected' : ''}>Dunkel</option>
          </select></span>
        </div>
        <div class="ab-setting">
          ${settingText('set-motion', 'Bewegung reduzieren', systemCalm ? 'Vom System vorgegeben' : 'Keine Sprünge, kein Konfetti')}
          ${switchHtml('set-motion', systemCalm || state.settings.reduceMotion, systemCalm)}
        </div>
      </div>

      <div class="ab-hint ab-hint--info">${icon('speaker')}<p class="text-body">${voiceLine}</p></div>

      <h2 class="screen__section text-heading">Benachrichtigungen</h2>
      <div class="ab-settings">
        <div class="ab-setting">
          ${settingText('set-notif', 'Tägliche Erinnerung')}
          ${switchHtml('set-notif', notifOn, !notifSupported)}
        </div>
        <div class="ab-setting" id="notif-time-row" ${notifOn ? '' : 'hidden'}>
          ${settingText('set-notif-time', 'Erinnerungszeit')}
          <input class="ab-input text-strong" type="time" id="set-notif-time" value="${notif.time}">
        </div>
      </div>
      <div class="ab-hint">${icon('bell')}<p class="text-body" id="notif-hint">${notifHintText()}</p></div>

      <h2 class="screen__section text-heading">Daten</h2>
      <div class="ab-hint">${icon('book')}<p class="text-body">XP, Serie und Abzeichen stehen unter
        „Erfolge“. Alles bleibt auf diesem Gerät.</p></div>
      <button class="ab-btn ab-btn--ghost ab-btn--danger text-button" type="button" id="set-reset">Allen Fortschritt löschen</button>

      <h2 class="screen__section text-heading">Version</h2>
      <div class="ab-settings">
        <div class="ab-setting">
          <span class="ab-setting__text"><span class="text-strong">Installierte Fassung</span></span>
          <span class="ab-version text-code" id="app-version">wird geprüft …</span>
        </div>
      </div>
      <button class="ab-btn ab-btn--secondary text-button" type="button" id="check-update">Nach Update suchen</button>
      <div class="ab-hint">${icon('sparkle')}<p class="text-body" id="update-status">Prüft, ob auf dem Server
        eine neuere Fassung liegt. Die App braucht dafür kurz Internet.</p></div>

      <h2 class="screen__section text-heading">Über diese App</h2>
      <section class="ab-card about">
        <p class="text-body"><b>Alef Beth</b> – Hebräisch lesen lernen: vom Alphabet über die
          Vokalzeichen bis zu Wörtern aus Siddur und Alltag. Funktioniert offline und lässt
          sich am Handy „Zum Startbildschirm hinzufügen“.</p>
        <p class="text-body">Dein Fortschritt bleibt auf diesem Gerät – es gibt kein Konto, und
          es werden keine Daten übertragen.</p>
        <p class="text-body">Viel Erfolg auf deinem Weg – ${he('בְּהַצְלָחָה', 'glyph-sm')}!</p>
      </section>
    </div>`;

  renderVersion(host);

  host.querySelector('#set-goal').addEventListener('change', (e) => {
    state.settings.dailyGoal = Number(e.target.value);
    save();
    shown.daily = null; // neues Ziel: Ring auf der Startseite ohne Nachwachsen zeichnen
  });
  host.querySelector('#set-audio').addEventListener('change', (e) => {
    state.settings.audio = e.target.checked;
    save();
  });
  host.querySelector('#set-sounds').addEventListener('change', (e) => {
    state.settings.sounds = e.target.checked;
    save();
    // Hörprobe beim Einschalten: So klingt eine richtige Antwort.
    if (e.target.checked) sound('richtig');
  });
  host.querySelector('#set-theme').addEventListener('change', (e) => {
    state.settings.theme = e.target.value;
    save();
    applyTheme();
  });
  host.querySelector('#set-motion').addEventListener('change', (e) => {
    state.settings.reduceMotion = e.target.checked;
    save();
    applyMotion();
  });

  const notifToggle = host.querySelector('#set-notif');
  const notifTimeRow = host.querySelector('#notif-time-row');
  const notifHint = host.querySelector('#notif-hint');

  notifToggle?.addEventListener('change', async (e) => {
    if (e.target.checked) {
      // Nur im Zustand 'default' zeigt der Browser den Erlaubnis-Dialog. Bei 'denied'
      // liefert requestPermission() sofort 'denied' zurück, ohne erneut zu fragen.
      let perm = Notification.permission;
      if (perm === 'default') perm = await Notification.requestPermission();
      if (perm !== 'granted') {
        e.target.checked = false;
        state.settings.notifications.enabled = false;
        notifTimeRow.hidden = true;
        save();
        notifHint.textContent = perm === 'denied'
          ? NOTIF_BLOCKED_MSG
          : 'Berechtigung nicht erteilt. Tippe erneut und wähle „Zulassen“.';
        return;
      }
      state.settings.notifications.enabled = true;
      notifTimeRow.hidden = false;
      notifHint.textContent = 'Erinnerung aktiv – funktioniert, solange der Browser bzw. die App im Hintergrund geöffnet ist.';
      toast(`Erinnerung aktiv – täglich um ${state.settings.notifications.time} Uhr`, { tone: 'success', icon: 'bell' });
    } else {
      state.settings.notifications.enabled = false;
      notifTimeRow.hidden = true;
      notifHint.textContent = 'Aktiviere die Erinnerung, um täglich zur eingestellten Uhrzeit benachrichtigt zu werden.';
    }
    save();
    scheduleReminder();
  });

  host.querySelector('#set-notif-time')?.addEventListener('change', (e) => {
    // Ein geleertes Zeitfeld nicht übernehmen, sondern auf den Standard zurückfallen.
    const parsed = parseTime(e.target.value);
    state.settings.notifications.time = parsed ? e.target.value : DEFAULT_TIME;
    if (!parsed) e.target.value = DEFAULT_TIME;
    save();
    scheduleReminder();
  });

  host.querySelector('#set-reset').addEventListener('click', async () => {
    const ok = await confirmDialog({
      art: 'close',
      title: 'Allen Fortschritt löschen?',
      text: 'XP, Serie, Lektionen und alle Karten sind danach weg. Das lässt sich nicht rückgängig machen.',
      confirm: 'Endgültig löschen',
      cancel: 'Behalten',
      danger: true,
    });
    if (ok) resetAll();
  });
}

// Versionszeile füllen und den Update-Knopf verdrahten.
async function renderVersion(host) {
  const tag = host.querySelector('#app-version');
  const btn = host.querySelector('#check-update');
  const status = host.querySelector('#update-status');

  const version = await activeVersion();
  if (!tag.isConnected) return; // Screen inzwischen gewechselt
  if (version) {
    tag.textContent = version;
  } else {
    // Kein Service Worker aktiv: beim allerersten Aufruf normal, danach ein
    // Zeichen dafür, dass die App nicht offline-fähig läuft.
    tag.textContent = 'noch nicht offline';
    tag.classList.add('is-muted');
  }

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    status.textContent = 'Suche …';
    const result = await checkForUpdate();
    if (!btn.isConnected) return;
    btn.disabled = false;
    if (result === 'update') {
      // app.js lädt neu, sobald der neue Service Worker übernommen hat.
      status.textContent = 'Neue Version gefunden – sie wird geladen, die App startet gleich neu.';
    } else if (result === 'aktuell') {
      status.textContent = `Alles aktuell – ${version || 'die installierte Fassung'} ist die neueste.`;
    } else {
      status.textContent = 'Konnte nicht nachsehen – keine Internetverbindung oder der '
        + 'Server ist gerade nicht erreichbar.';
    }
  });
}
