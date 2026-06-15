// Screens: Lernpfad (Home), Wiederholen, Alphabet-Tabelle, Einstellungen.

import { UNITS, isUnlocked, getItem } from '../data/curriculum.js';
import { LETTERS } from '../data/letters.js';
import { NIKUD } from '../data/nikud.js';
import { state, save, currentStreak, resetAll } from './state.js';
import { scheduleReminder } from './notify.js';
import { dueIds, nextDue } from './srs.js';
import { speak, ttsSupported, hasHebrewVoice, hebrewVoiceName, audioActive } from './audio.js';

// ---------- Home / Lernpfad ----------

export function renderHome(host) {
  const due = dueIds(state.srs).length;
  host.innerHTML = `
    <header class="topbar">
      <div class="brand"><span class="logo he">א</span> Alef Beth</div>
      <div class="stats">
        <span class="statchip" title="Tage-Serie">🔥 ${currentStreak()}</span>
        <span class="statchip" title="Erfahrungspunkte">⚡ ${state.xp}</span>
      </div>
    </header>
    ${due > 0 ? `
      <div class="banner">
        <span><b>${due}</b> ${due === 1 ? 'Karte ist' : 'Karten sind'} zur Wiederholung fällig</span>
        <button id="review-now">Üben</button>
      </div>` : ''}
    ${UNITS.map(unitHtml).join('')}`;

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
    const when = next
      ? new Date(next).toLocaleString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })
      : '–';
    body = `
      <div class="endscreen" style="padding-top:6vh">
        <div class="end-emoji">🌟</div>
        <h1>Alles wiederholt!</h1>
        <p>Du hast <b>${learned}</b> Zeichen und Wörter im Training.<br>
        Die nächsten Karten sind fällig: <b>${when}</b>.</p>
      </div>`;
  } else {
    body = `
      <div class="endscreen" style="padding-top:6vh">
        <div class="end-emoji">🔁</div>
        <h1>${due.length} ${due.length === 1 ? 'Karte' : 'Karten'} fällig</h1>
        <p>Kurz wiederholen, bevor es weitergeht – dein Gedächtnis dankt es dir.</p>
        <button class="btn" id="start-review">Wiederholung starten</button>
      </div>`;
  }

  host.innerHTML = `<h1>Üben &amp; Wiederholen</h1>${body}`;
  host.querySelector('#start-review')?.addEventListener('click', () => {
    location.hash = '#/review/run';
  });
}

// ---------- Alphabet-Tabelle ----------

export function renderAlphabet(host) {
  const speaker = audioActive() ? '<span class="a-spk">🔊</span>' : '';

  const letterRows = LETTERS.map((l) => {
    let glyphs = l.glyph;
    if (l.dagesh) glyphs += ` ${l.dagesh.glyph}`;
    if (l.variant) glyphs += ` ${l.variant.glyph}`;
    const finalNote = l.final ? ` · Ende: ${getItem(l.final).glyph}` : '';
    return `
      <button class="alpharow" data-tts="${l.ttsWord}">
        <span class="a-glyph he">${glyphs}</span>
        <span><span class="a-name">${l.name}</span><br>
        <span class="a-sub">${l.translit}${finalNote}</span></span>
        ${speaker}
      </button>`;
  }).join('');

  const nikudRows = NIKUD.map((v) => `
    <button class="alpharow" data-tts="${v.example}">
      <span class="a-glyph he">${v.display}</span>
      <span><span class="a-name">${v.name}</span><br>
      <span class="a-sub">${v.soundLabel} – Beispiel: <span class="he">${v.example}</span> „${v.exampleTranslit}"</span></span>
      ${speaker}
    </button>`).join('');

  host.innerHTML = `
    <h1>Das Alef-Bet</h1>
    <p class="hint">Zum Nachschlagen – tippe eine Zeile an, um den Namen zu hören.
    Gelesen wird von rechts nach links.</p>
    ${letterRows}
    <h2>Nikud – die Vokalzeichen</h2>
    ${nikudRows}`;

  host.querySelectorAll('[data-tts]').forEach((b) =>
    b.addEventListener('click', () => speak(b.dataset.tts)));
}

// ---------- Einstellungen ----------

export function renderSettings(host) {
  let voiceLine;
  if (!ttsSupported()) {
    voiceLine = 'Dieser Browser unterstützt keine Sprachausgabe.';
  } else if (hasHebrewVoice()) {
    voiceLine = `Hebräische Stimme aktiv: <b>${hebrewVoiceName()}</b>`;
  } else {
    voiceLine = `Keine hebräische Stimme gefunden. Tipp: Microsoft Edge bringt
      hebräische Online-Stimmen mit – oder installiere unter Windows
      „Einstellungen → Zeit und Sprache → Sprache" das hebräische Sprachpaket.
      Die App funktioniert auch ohne Audio.`;
  }

  const notif = state.settings.notifications;
  const notifSupported = 'Notification' in window;

  host.innerHTML = `
    <h1>Einstellungen</h1>

    <div class="setting-row">
      <label for="set-audio">Sprachausgabe (Hebräisch vorlesen)</label>
      <span class="switch">
        <input type="checkbox" id="set-audio" ${state.settings.audio ? 'checked' : ''}>
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
        <input type="checkbox" id="set-notif" ${notif.enabled ? 'checked' : ''} ${notifSupported ? '' : 'disabled'}>
        <span class="slider"></span>
      </span>
    </div>

    <div class="setting-row" id="notif-time-row" ${notif.enabled ? '' : 'hidden'}>
      <label for="set-notif-time">Erinnerungszeit</label>
      <input type="time" id="set-notif-time" value="${notif.time}">
    </div>

    <div class="hint" id="notif-hint">${
      !notifSupported
        ? 'Dein Browser unterstützt leider keine Benachrichtigungen.'
        : notif.enabled
          ? 'Erinnerung aktiv – funktioniert, solange der Browser geöffnet ist.'
          : 'Aktiviere die Erinnerung, um täglich zur eingestellten Uhrzeit benachrichtigt zu werden.'
    }</div>

    <h2>Fortschritt</h2>
    <div class="setting-row">
      <span>⚡ ${state.xp} XP · 🔥 ${currentStreak()} Tage-Serie ·
      ${Object.keys(state.lessons).length} Lektionen abgeschlossen</span>
    </div>
    <button class="btn danger" id="set-reset">Allen Fortschritt löschen</button>

    <h2>Über diese App</h2>
    <div class="hint">
      <b>Alef Beth</b> – Hebräisch lesen lernen: vom Alphabet über die Vokalzeichen
      bis zu Wörtern aus Siddur und Alltag. Funktioniert offline und lässt sich am
      Handy „Zum Startbildschirm hinzufügen".<br><br>
      Viel Erfolg auf deinem Weg – <span class="he">בְּהַצְלָחָה</span>!
    </div>`;

  host.querySelector('#set-audio').addEventListener('change', (e) => {
    state.settings.audio = e.target.checked;
    save();
  });
  host.querySelector('#set-theme').addEventListener('change', (e) => {
    state.settings.theme = e.target.value;
    save();
    document.documentElement.dataset.theme = state.settings.theme;
  });

  const notifToggle = host.querySelector('#set-notif');
  const notifTimeRow = host.querySelector('#notif-time-row');
  const notifHint = host.querySelector('#notif-hint');

  notifToggle?.addEventListener('change', async (e) => {
    if (e.target.checked) {
      const perm = await Notification.requestPermission();
      if (perm !== 'granted') {
        e.target.checked = false;
        notifHint.textContent = 'Berechtigung verweigert – bitte in den Browser-Einstellungen erlauben.';
        return;
      }
      state.settings.notifications.enabled = true;
      notifTimeRow.hidden = false;
      notifHint.textContent = 'Erinnerung aktiv – funktioniert, solange der Browser geöffnet ist.';
    } else {
      state.settings.notifications.enabled = false;
      notifTimeRow.hidden = true;
      notifHint.textContent = 'Aktiviere die Erinnerung, um täglich zur eingestellten Uhrzeit benachrichtigt zu werden.';
    }
    save();
    scheduleReminder();
  });

  host.querySelector('#set-notif-time')?.addEventListener('change', (e) => {
    state.settings.notifications.time = e.target.value;
    save();
    scheduleReminder();
  });

  host.querySelector('#set-reset').addEventListener('click', () => {
    if (confirm('Wirklich den gesamten Lernfortschritt löschen? Das lässt sich nicht rückgängig machen.')) {
      resetAll();
    }
  });
}
