// Screens: Lernpfad (Home), Wiederholen, Alphabet-Tabelle, Einstellungen.

import { UNITS, isUnlocked, getItem, orderedLessons } from '../data/curriculum.js';
import { LETTERS } from '../data/letters.js';
import { NIKUD } from '../data/nikud.js';
import { state, save, currentStreak, resetAll } from './state.js';
import { scheduleReminder, parseTime, DEFAULT_TIME } from './notify.js';
import { applyTheme } from './theme.js';
import { dueIds, nextDue } from './srs.js';
import { speak, ttsSupported, hasHebrewVoice, hebrewVoiceName, audioActive } from './audio.js';
import { activeVersion, checkForUpdate } from './version.js';
import { todayStr } from './util.js';
import { icon, countUp, replay, setProgress, confetti, toast, reducedMotion } from './ui.js';

const num = (n) => n.toLocaleString('de-DE');

// ---------- Kopfleiste: Marke, Serie, XP ----------

// Zuletzt angezeigte Zählerstände. Kommt man aus einer Lektion zurück, zählen
// die Chips von dort aus hoch, statt einfach umzuspringen.
const shown = { streak: null, xp: null };

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

  host.innerHTML = `
    <div class="home">
      ${topbarHtml(streak)}

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

  setTimeout(() => {
    if (!home.isConnected) return;
    if (step) {
      step.querySelector('.ab-node').classList.add('is-unlocking');
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
      <div class="hint">Hier erscheinen deine Wiederholungen, sobald du die erste
      Lektion abgeschlossen hast. Regelmäßiges Wiederholen ist der Schlüssel –
      die App merkt sich, was bald wieder fällig ist.</div>`;
  } else if (!due.length) {
    const next = nextDue(state.srs);
    const when = next ? formatDue(next) : '–';
    body = `
      <div class="endscreen" style="padding-top:6vh">
        <div class="end-emoji" aria-hidden="true">🌟</div>
        <h1>Alles wiederholt!</h1>
        <p>Du hast <b>${learned}</b> ${learned === 1 ? 'Zeichen' : 'Zeichen und Wörter'} im Training.<br>
        Die nächsten Karten sind fällig: <b>${when}</b>.</p>
        <button class="btn secondary" id="free-practice">Trotzdem eine Runde üben</button>
        <p class="hint" style="margin-top:14px">Freies Üben schadet nichts: Es verschiebt
        keine Termine nach hinten, holt aber Wackelkandidaten zurück nach vorn.</p>
      </div>`;
  } else {
    body = `
      <div class="endscreen" style="padding-top:6vh">
        <div class="end-emoji" aria-hidden="true">🔁</div>
        <h1>${due.length} ${due.length === 1 ? 'Karte' : 'Karten'} fällig</h1>
        <p>Kurz wiederholen, bevor es weitergeht – dein Gedächtnis dankt es dir.</p>
        <button class="btn" id="start-review">Wiederholung starten</button>
      </div>`;
  }

  host.innerHTML = `<h1>Üben &amp; Wiederholen</h1>${body}`;
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

export function renderAlphabet(host) {
  // Ohne hebräische Stimme wären die Zeilen tote Knöpfe – dann als Liste zeigen.
  const canSpeak = audioActive();
  const tag = canSpeak ? 'button' : 'div';
  const speaker = canSpeak ? '<span class="a-spk" aria-hidden="true">🔊</span>' : '';
  const row = (tts, glyph, name, sub) => `
    <${tag} class="alpharow"${canSpeak ? ` data-tts="${tts}" aria-label="${name} anhören"` : ''}>
      <span class="a-glyph he">${glyph}</span>
      <span><span class="a-name">${name}</span><br>
      <span class="a-sub">${sub}</span></span>
      ${speaker}
    </${tag}>`;

  const letterRows = LETTERS.map((l) => {
    let glyphs = l.glyph;
    if (l.dagesh) glyphs += ` ${l.dagesh.glyph}`;
    if (l.variant) glyphs += ` ${l.variant.glyph}`;
    const finalNote = l.final ? ` · Ende: ${getItem(l.final).glyph}` : '';
    return row(l.ttsWord, glyphs, l.name, `${l.translit}${finalNote}`);
  }).join('');

  const nikudRows = NIKUD.map((v) => row(
    v.example, v.display, v.name,
    `${v.soundLabel} – Beispiel: <span class="he">${v.example}</span> „${v.exampleTranslit}“`,
  )).join('');

  host.innerHTML = `
    <h1>Das Alef-Bet</h1>
    <p class="hint">Zum Nachschlagen – gelesen wird von rechts nach links.${
      canSpeak ? ' Tippe eine Zeile an, um den Namen zu hören.' : ''}</p>
    ${letterRows}
    <h2>Nikud – die Vokalzeichen</h2>
    ${nikudRows}`;

  host.querySelectorAll('[data-tts]').forEach((b) =>
    b.addEventListener('click', () => speak(b.dataset.tts)));
}

// ---------- Einstellungen ----------

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

  host.innerHTML = `
    <h1>Einstellungen</h1>

    <div class="setting-row">
      <label for="set-audio">Sprachausgabe (Hebräisch vorlesen)</label>
      <span class="switch">
        <input type="checkbox" id="set-audio" ${state.settings.audio ? 'checked' : ''}
          ${voiceOk ? '' : 'disabled'}>
        <span class="slider"></span>
      </span>
    </div>

    <div class="setting-row">
      <label for="set-theme">Erscheinungsbild</label>
      <select id="set-theme">
        <option value="auto" ${state.settings.theme === 'auto' ? 'selected' : ''}>Automatisch</option>
        <option value="light" ${state.settings.theme === 'light' ? 'selected' : ''}>Hell</option>
        <option value="dark" ${state.settings.theme === 'dark' ? 'selected' : ''}>Dunkel</option>
      </select>
    </div>

    <div class="hint">🔊 ${voiceLine}</div>

    <h2>Benachrichtigungen</h2>

    <div class="setting-row">
      <label for="set-notif">Tägliche Erinnerung</label>
      <span class="switch">
        <input type="checkbox" id="set-notif" ${notifOn ? 'checked' : ''} ${notifSupported ? '' : 'disabled'}>
        <span class="slider"></span>
      </span>
    </div>

    <div class="setting-row" id="notif-time-row" ${notifOn ? '' : 'hidden'}>
      <label for="set-notif-time">Erinnerungszeit</label>
      <input type="time" id="set-notif-time" value="${notif.time}">
    </div>

    <div class="hint" id="notif-hint">${notifHintText()}</div>

    <h2>Fortschritt</h2>
    <div class="setting-row">
      <span>⚡ ${state.xp} XP · 🔥 ${currentStreak()} Tage-Serie ·
      ${Object.keys(state.lessons).length} von ${orderedLessons().length} Lektionen ·
      ${Object.keys(state.srs).length} Karten im Training</span>
    </div>
    <button class="btn danger" id="set-reset">Allen Fortschritt löschen</button>

    <h2>Version</h2>
    <div class="setting-row">
      <span>Installierte Fassung</span>
      <span class="version-tag" id="app-version">wird geprüft …</span>
    </div>
    <button class="btn secondary" id="check-update">Nach Update suchen</button>
    <div class="hint" id="update-status">Prüft, ob auf dem Server eine neuere
      Fassung liegt. Die App braucht dafür kurz Internet.</div>

    <h2>Über diese App</h2>
    <div class="hint">
      <b>Alef Beth</b> – Hebräisch lesen lernen: vom Alphabet über die Vokalzeichen
      bis zu Wörtern aus Siddur und Alltag. Funktioniert offline und lässt sich am
      Handy „Zum Startbildschirm hinzufügen“.<br><br>
      Dein Fortschritt bleibt auf diesem Gerät – es gibt kein Konto, und es werden
      keine Daten übertragen.<br><br>
      Viel Erfolg auf deinem Weg – <span class="he">בְּהַצְלָחָה</span>!
    </div>`;

  renderVersion(host);

  host.querySelector('#set-audio').addEventListener('change', (e) => {
    state.settings.audio = e.target.checked;
    save();
  });
  host.querySelector('#set-theme').addEventListener('change', (e) => {
    state.settings.theme = e.target.value;
    save();
    applyTheme();
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

  host.querySelector('#set-reset').addEventListener('click', () => {
    if (confirm('Wirklich den gesamten Lernfortschritt löschen? Das lässt sich nicht rückgängig machen.')) {
      resetAll();
    }
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
    tag.classList.add('muted');
  }

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    status.textContent = 'Suche …';
    const result = await checkForUpdate();
    if (!btn.isConnected) return;
    btn.disabled = false;
    if (result === 'update') {
      status.textContent = 'Neue Version gefunden – sie wird geladen. Gleich erscheint '
        + 'unten der Hinweis „Neue Version verfügbar“ zum Neuladen.';
    } else if (result === 'aktuell') {
      status.textContent = `Alles aktuell – ${version || 'die installierte Fassung'} ist die neueste.`;
    } else {
      status.textContent = 'Konnte nicht nachsehen – keine Internetverbindung oder der '
        + 'Server ist gerade nicht erreichbar.';
    }
  });
}
