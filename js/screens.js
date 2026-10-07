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
import { icon, countUp, replay } from './ui.js';

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

export function renderHome(host) {
  const due = dueIds(state.srs).length;
  const total = orderedLessons().length;
  const done = orderedLessons().filter((l) => state.lessons[l.id]).length;
  const pct = Math.round((done / total) * 100);
  const streak = currentStreak();

  host.innerHTML = `
    ${topbarHtml(streak)}

    <div class="progress-card">
      <div class="pc-head">
        <span class="pc-label">${done === total ? 'Alle Lektionen geschafft! 🎉' : 'Dein Weg durchs Alef-Bet'}</span>
        <span class="pc-count">${done} / ${total}</span>
      </div>
      <div class="pc-bar" role="progressbar" aria-label="Abgeschlossene Lektionen"
           aria-valuemin="0" aria-valuemax="100" aria-valuenow="${pct}"><i style="width:${pct}%"></i></div>
    </div>

    ${due > 0 ? `
      <div class="banner">
        <span><b>${due}</b> ${due === 1 ? 'Karte ist' : 'Karten sind'} zur Wiederholung fällig</span>
        <button id="review-now">Üben</button>
      </div>` : ''}
    ${UNITS.map(unitHtml).join('')}`;

  bumpCounters(host, streak);
  host.querySelector('#review-now')?.addEventListener('click', () => {
    location.hash = '#/review/run';
  });
  host.querySelectorAll('[data-lesson]').forEach((btn) =>
    btn.addEventListener('click', () => {
      location.hash = `#/lesson/${btn.dataset.lesson}`;
    }));
}

function unitHtml(u) {
  return `
    <section class="unit">
      <div class="unit-head"><h2>${u.title}</h2><p>${u.desc}</p></div>
      <div class="path">${u.lessons.map(nodeHtml).join('')}</div>
    </section>`;
}

function nodeHtml(l) {
  const done = !!state.lessons[l.id];
  const unlocked = isUnlocked(l.id, state.lessons);
  const cls = done ? 'done' : unlocked ? 'open' : 'locked';
  const circle = done ? '✓' : unlocked ? `<span class="he">${l.icon}</span>` : '🔒';
  const sub = done
    ? `👑 ${state.lessons[l.id].score} % – nochmal üben?`
    : unlocked ? 'Jetzt lernen' : 'Erst die vorherige Lektion abschließen';
  return `
    <button class="node ${cls}" data-lesson="${l.id}" ${unlocked ? '' : 'disabled'}>
      <span class="node-circle">${circle}</span>
      <span class="node-info">
        <span class="node-title">${l.title}</span><br>
        <span class="node-sub">${sub}</span>
      </span>
    </button>`;
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
