// Rangliste: Gruppen mit Einladungscode, sortiert nach den XP dieser Woche.
// Die Daten liegen bei Supabase (Projekt „alef-beth“, Frankfurt), das SQL dazu
// in supabase/rangliste.sql. Die App ruft dort nur Funktionen auf (rpc); an
// die Tabellen selbst kommt sie nicht heran.
//
// Ein Gerät ist ein Spieler: Zufalls-ID plus Geheimnis, das nur dieses Gerät
// kennt (der Server speichert davon nur den Hash). Beides liegt unter einem
// eigenen localStorage-Schlüssel. So bleibt man nach „Allen Fortschritt
// löschen“ in seinen Gruppen und fängt dort nur wieder bei 0 an.

import { state, save, currentStreak } from './state.js';
import { todayStr, esc } from './util.js';
import { icon, toast, confirmDialog } from './ui.js';

const API = 'https://qtrutjgrfapelbesxbdd.supabase.co/rest/v1/rpc/';
// Öffentlicher Schlüssel (publishable): darf im Code stehen, er erlaubt nur
// den Aufruf der freigegebenen Funktionen.
const API_KEY = 'sb_publishable_eoFkeLqqXtcUMoNerFbAMw_Cw0TKPme';
const STORE = 'alefbeth-rangliste-v1';
const NAME_MAX = 24;
const GROUP_MAX = 30;

// { id, secret, groups: [{ code, name }], current: code, sent: zuletzt hochgeladener Stand,
//   boards: { [code]: { week, rows } } zuletzt geladene Tabelle je Gruppe }
function load() {
  try {
    const raw = localStorage.getItem(STORE);
    if (raw) return { groups: [], current: null, sent: null, boards: {}, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Konnte die Ranglisten-Daten nicht laden:', e);
  }
  return { id: null, secret: null, groups: [], current: null, sent: null, boards: {} };
}

const me = load();

function store() {
  try {
    localStorage.setItem(STORE, JSON.stringify(me));
  } catch (e) {
    console.warn('Konnte die Ranglisten-Daten nicht speichern:', e);
  }
}

export const hasGroups = () => me.groups.length > 0;

// Schreibende Funktionen gehen per POST. Reine Abfragen (stable im SQL) gehen
// per GET mit allem in der URL: Ohne eigenen Header spart sich der Browser die
// CORS-Vorabanfrage, also einen ganzen Umlauf zum Server.
async function rpc(fn, args, { get = false } = {}) {
  const res = await (get
    ? fetch(`${API}${fn}?${new URLSearchParams({ ...args, apikey: API_KEY })}`, { cache: 'no-store' })
    : fetch(API + fn, {
      method: 'POST',
      headers: { apikey: API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify(args),
    }));
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    const err = new Error(body.message || res.statusText);
    err.status = res.status;
    throw err;
  }
  return res.status === 204 ? null : res.json();
}

// ---------- Wochenwertung ----------

// Montag der laufenden Woche als YYYY-MM-DD. Alle Geräte rechnen in ihrer
// Ortszeit, der Server vergleicht nur das Datum.
export function weekStart(d = new Date()) {
  return todayStr(new Date(d.getFullYear(), d.getMonth(), d.getDate() - ((d.getDay() + 6) % 7)));
}

// XP seit Montag, aus der Tagesstatistik (state.history).
export function weekXp() {
  const from = weekStart();
  return Object.entries(state.history)
    .filter(([day]) => day >= from)
    .reduce((sum, [, xp]) => sum + xp, 0);
}

const playerName = () => state.profile.name.slice(0, NAME_MAX);

function stand() {
  return {
    p_name: playerName(),
    p_week: weekStart(),
    p_week_xp: weekXp(),
    p_xp: state.xp,
    p_streak: currentStreak(),
  };
}

// Stand hochladen. Legt beim ersten Mal ID und Geheimnis an.
async function upload() {
  if (!me.id) {
    me.id = crypto.randomUUID();
    me.secret = `${crypto.randomUUID()}${crypto.randomUUID()}`;
    store();
  }
  const s = stand();
  await rpc('leaderboard_sync', { p_id: me.id, p_secret: me.secret, ...s });
  me.sent = JSON.stringify(s);
  store();
}

// Beim Screenwechsel aufgerufen: lädt hoch, wenn sich seit dem letzten Mal
// etwas geändert hat. Ohne Netz bleibt es beim alten Stand, der nächste
// Screenwechsel versucht es wieder. Läuft schon ein Upload, bekommt der
// Aufrufer dessen Promise, damit niemand denselben Stand zweimal schickt.
let syncing = null;
export function syncLeaderboard() {
  if (syncing) return syncing;
  if (!hasGroups() || !playerName() || JSON.stringify(stand()) === me.sent) return Promise.resolve();
  syncing = upload().catch(() => {}).finally(() => { syncing = null; });
  return syncing;
}

// ---------- Gruppen ----------

async function createGroup(name) {
  await upload();
  const code = await rpc('leaderboard_create_group', { p_id: me.id, p_secret: me.secret, p_name: name });
  me.groups.push({ code, name });
  me.current = code;
  store();
  return code;
}

async function joinGroup(code) {
  await upload();
  const name = await rpc('leaderboard_join', { p_id: me.id, p_secret: me.secret, p_code: code });
  if (!me.groups.some((g) => g.code === code)) me.groups.push({ code, name });
  me.current = code;
  store();
  return name;
}

async function leaveGroup(code) {
  await rpc('leaderboard_leave', { p_id: me.id, p_secret: me.secret, p_code: code });
  me.groups = me.groups.filter((g) => g.code !== code);
  delete me.boards[code];
  me.current = me.groups[0]?.code || null;
  store();
}

const board = (code) => rpc('leaderboard_board', { p_code: code, p_week: weekStart() }, { get: true });
const groupInfo = async (code) => (await rpc('leaderboard_group', { p_code: code }, { get: true }))[0] || null;

// Platz pro Zeile: Gleichstand teilt sich den Platz (1, 2, 2, 4).
function withRanks(rows) {
  return rows.map((r, i) => ({
    ...r,
    rank: i > 0 && rows[i - 1].week_xp === r.week_xp ? null : i + 1,
  })).map((r, i, all) => {
    if (r.rank === null) r.rank = all[i - 1].rank;
    return r;
  });
}

// Codes bestehen aus Großbuchstaben und Ziffern ohne I, O, 0 und 1.
export const normCode = (s) => String(s || '').toUpperCase().replace(/[^A-HJ-NP-Z2-9]/g, '').slice(0, 6);
const inviteLink = (code) => `${location.href.split('#')[0]}#/rangliste/${code}`;

const num = (n) => n.toLocaleString('de-DE');
const errorText = (e) => (e instanceof TypeError
  ? 'Keine Verbindung zum Server. Bist du online?'
  : 'Das hat nicht geklappt. Versuch es gleich noch einmal.');

// ---------- Bausteine ----------

const PRIVACY = 'Gespeichert werden dein Name, deine XP und deine Serie, bei Supabase in Frankfurt. '
  + 'Sehen kann sie nur, wer den Gruppencode kennt.';

// Jede Person bekommt aus ihrer ID eine feste Farbe für den Kreis mit der Initiale.
const TONES = ['tekhelet', 'minze', 'granat', 'koralle', 'gold'];
function tone(id) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  return TONES[h % TONES.length];
}

function avatarHtml(r, size = '') {
  const initial = [...r.name.trim()][0]?.toUpperCase() || '?';
  return `<span class="rl-avatar rl-avatar--${tone(r.player_id)}${size ? ` rl-avatar--${size}` : ''}" aria-hidden="true">${esc(initial)}</span>`;
}

// Restzeit bis Sonntag 24 Uhr, wenn die neue Woche beginnt: erst Tage und
// Stunden, am letzten Tag nur Stunden, in der letzten Stunde Minuten.
function timeLeftText(now = new Date()) {
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7 - ((now.getDay() + 6) % 7));
  const min = Math.ceil((end - now) / 60000);
  const days = Math.floor(min / 1440);
  const hours = Math.floor((min % 1440) / 60);
  if (min < 60) return `Neustart in ${min} Min.`;
  if (!days) return `Neustart in ${hours} Std.`;
  return `Neustart in ${days} ${days === 1 ? 'Tag' : 'Tagen'}${hours ? `, ${hours} Std.` : ''}`;
}

// Ein Satz zur eigenen Lage: Abstand nach vorn oder Vorsprung.
function standingText(rows, mine) {
  if (!mine) return '';
  if (rows.length === 1) return 'Du bist noch allein in der Gruppe. Lade jemanden ein.';
  if (rows[0].week_xp === 0) return 'Diese Woche hat noch niemand XP. Eine Lektion bringt dich nach vorn.';
  if (mine.rank === 1) {
    const second = rows.find((r) => r.player_id !== mine.player_id);
    const lead = mine.week_xp - second.week_xp;
    return lead === 0 ? 'Du teilst dir Platz 1.' : `Du führst mit <b>${num(lead)} XP</b> Vorsprung.`;
  }
  const ahead = rows.filter((r) => r.week_xp > mine.week_xp).at(-1);
  const gap = ahead.week_xp - mine.week_xp + 1;
  return `Noch <b>${num(gap)} XP</b> bis Platz ${ahead.rank}.`;
}

// Siegertreppchen: Platz 2, 1, 3 nebeneinander, der erste steht am höchsten.
function podiumHtml(top) {
  const place = (r) => {
    if (!r) return '<li class="rl-podium__place" aria-hidden="true"></li>';
    const mine = r.player_id === me.id;
    return `
      <li class="rl-podium__place rl-podium__place--${r.rank}${mine ? ' is-me' : ''}">
        ${r.rank === 1 ? `<span class="rl-podium__crown" aria-hidden="true">${icon('crown')}</span>` : ''}
        ${avatarHtml(r, r.rank === 1 ? 'xl' : 'lg')}
        <span class="rl-podium__name text-strong">${esc(r.name)}<span class="ab-sr">, Platz ${r.rank}</span></span>
        <span class="rl-podium__xp text-caption">${num(r.week_xp)} XP</span>
        <span class="rl-podium__block text-title" aria-hidden="true">${r.rank}</span>
      </li>`;
  };
  return `<ol class="rl-podium" aria-label="Die ersten drei">${place(top[1])}${place(top[0])}${place(top[2])}</ol>`;
}

function rowHtml(r) {
  const mine = r.player_id === me.id;
  const streak = r.streak ? `<span class="rl-row__streak">${icon('flame')}${r.streak}</span>` : '';
  return `
    <li class="rl-row${mine ? ' is-me' : ''}">
      <span class="rl-row__rank text-strong">${r.rank}</span>
      ${avatarHtml(r)}
      <span class="rl-row__name">
        <span class="text-strong">${esc(r.name)}</span>${mine ? '<span class="rl-you text-caption">du</span>' : ''}
        ${streak ? `<span class="rl-row__sub text-caption">${streak}<span class="ab-sr"> Tage Serie</span></span>` : ''}
      </span>
      <span class="rl-row__xp text-strong">${num(r.week_xp)}<span class="text-caption"> XP</span></span>
    </li>`;
}

function boardHtml(rows) {
  const mine = rows.find((r) => r.player_id === me.id);
  // Ab drei Leuten stehen die ersten drei auf dem Treppchen, der Rest darunter.
  const podium = rows.length >= 3 && rows[0].week_xp > 0;
  const rest = podium ? rows.slice(3) : rows;
  const standing = standingText(rows, mine);
  return `
    ${standing ? `
      <div class="ab-banner rl-standing" role="status">
        <span class="ab-banner__icon">${icon(mine?.rank === 1 && rows[0].week_xp > 0 ? 'crown' : 'bolt')}</span>
        <p class="ab-banner__text text-body">${standing}</p>
      </div>` : ''}
    ${podium ? podiumHtml(rows.slice(0, 3)) : ''}
    ${rest.length ? `<ol class="ab-card rl-list" ${podium ? 'start="4"' : ''} aria-label="${podium ? 'Weitere Plätze' : 'Plätze'}">${rest.map(rowHtml).join('')}</ol>` : ''}`;
}

// Name abfragen, falls die App noch keinen kennt.
function nameFieldHtml() {
  if (state.profile.name) return '';
  return `
    <label class="rl-field">
      <span class="text-strong">Dein Name</span>
      <span class="rl-field__hint text-caption">So sehen dich die anderen</span>
      <input class="ab-input text-strong" type="text" name="player" maxlength="${NAME_MAX}" autocomplete="given-name" placeholder="Vorname" required>
    </label>`;
}

// Gründen oder beitreten, umschaltbar. Steht im Leer-Zustand auf der Seite
// und sonst im Dialog hinter „Neue Gruppe“.
function startFormHtml(mode = 'create') {
  return `
    <div class="modeswitch rl-switch" role="tablist" aria-label="Gruppe">
      <button class="text-label" type="button" role="tab" data-mode="create" aria-selected="${mode === 'create'}">Gruppe gründen</button>
      <button class="text-label" type="button" role="tab" data-mode="join" aria-selected="${mode === 'join'}">Code eingeben</button>
    </div>
    <form class="rl-start" data-mode="${mode}" novalidate>
      ${nameFieldHtml()}
      <label class="rl-field" data-for="create">
        <span class="text-strong">Name der Gruppe</span>
        <input class="ab-input text-strong" type="text" name="group" maxlength="${GROUP_MAX}" placeholder="z. B. Giur-Kurs">
      </label>
      <label class="rl-field" data-for="join">
        <span class="text-strong">Gruppencode</span>
        <span class="rl-field__hint text-caption">Sechs Zeichen, etwa K7MQ2X</span>
        <input class="ab-input text-strong rl-code-input" type="text" name="code" maxlength="6" autocomplete="off"
               autocapitalize="characters" spellcheck="false" inputmode="text">
      </label>
      <button class="ab-btn text-button" type="submit">${mode === 'create' ? 'Gruppe gründen' : 'Beitreten'}</button>
    </form>`;
}

// Umschalter und Absenden verdrahten. onDone bekommt den Code der Gruppe.
function wireStartForm(root, onDone) {
  const form = root.querySelector('.rl-start');
  const btn = form.querySelector('[type="submit"]');
  const setMode = (mode) => {
    form.dataset.mode = mode;
    root.querySelectorAll('.rl-switch [data-mode]').forEach((b) => b.setAttribute('aria-selected', String(b.dataset.mode === mode)));
    btn.textContent = mode === 'create' ? 'Gruppe gründen' : 'Beitreten';
  };
  root.querySelectorAll('.rl-switch [data-mode]').forEach((b) => b.addEventListener('click', () => {
    setMode(b.dataset.mode);
    form.querySelector(`[data-for="${b.dataset.mode}"] input`).focus();
  }));
  const code = form.querySelector('[name="code"]');
  code.addEventListener('input', () => { code.value = normCode(code.value); });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const player = form.querySelector('[name="player"]');
    if (player && !player.value.trim()) {
      player.focus();
      return;
    }
    const mode = form.dataset.mode;
    const group = form.querySelector('[name="group"]').value.trim();
    if (mode === 'create' && !group) {
      form.querySelector('[name="group"]').focus();
      return;
    }
    if (mode === 'join' && code.value.length !== 6) {
      toast('Der Code hat sechs Zeichen.', { tone: 'error' });
      code.focus();
      return;
    }
    if (player) {
      state.profile.name = player.value.trim();
      save();
    }
    btn.disabled = true;
    try {
      if (mode === 'create') {
        const c = await createGroup(group);
        toast(`Gruppe „${group}“ gegründet`, { tone: 'success', icon: 'trophy' });
        onDone(c);
      } else {
        const name = await joinGroup(code.value);
        toast(`Willkommen in „${name}“`, { tone: 'success', icon: 'trophy' });
        onDone(code.value);
      }
    } catch (err) {
      toast(err.status === 404 ? 'Zu diesem Code gibt es keine Gruppe.' : errorText(err), { tone: 'error' });
    } finally {
      btn.disabled = false;
    }
  });
}

// Dialog im Stil des Design Systems (ab-dialog) mit dem Start-Formular.
function openStartDialog(onDone) {
  const dlg = document.createElement('dialog');
  dlg.className = 'ab-dialog rl-dialog';
  dlg.setAttribute('aria-labelledby', 'rl-dialog-title');
  dlg.innerHTML = `
    <button class="ab-iconbtn rl-dialog__close" type="button" aria-label="Schließen">${icon('close')}</button>
    <h2 class="ab-dialog__title text-heading" id="rl-dialog-title">Weitere Gruppe</h2>
    ${startFormHtml()}`;
  dlg.querySelector('.rl-dialog__close').addEventListener('click', () => dlg.close());
  dlg.addEventListener('close', () => dlg.remove());
  wireStartForm(dlg, (code) => {
    dlg.close();
    onDone(code);
  });
  document.body.append(dlg);
  dlg.showModal();
  dlg.querySelector('[name="player"], [name="group"]').focus();
}

// ---------- Ranglisten-Tab ----------

export function renderRangliste(host, joinCode = null) {
  if (joinCode) {
    renderInvite(host, normCode(joinCode));
    return;
  }
  if (!hasGroups()) {
    renderEmpty(host);
    return;
  }

  if (!me.groups.some((g) => g.code === me.current)) me.current = me.groups[0].code;
  const g = me.groups.find((x) => x.code === me.current);
  const chip = (x) => `<button class="ab-chip rl-chip text-label" type="button" data-code="${x.code}"
    aria-pressed="${x.code === g.code}">${esc(x.name)}</button>`;

  host.innerHTML = `
    <div class="screen rl">
      <header class="rl-head">
        <h1 class="screen__title text-title">Rangliste</h1>
        <span class="rl-head__week text-caption">${timeLeftText()}</span>
      </header>
      <div class="rl-chips" role="group" aria-label="Gruppe wählen">
        ${me.groups.map(chip).join('')}
        <button class="ab-chip rl-chip rl-chip--add text-label" type="button" id="rl-add">${icon('sparkle')}Neue Gruppe</button>
      </div>

      <div class="rl-board" aria-live="polite"><p class="rl-status text-body">Wird geladen …</p></div>

      <section class="ab-card rl-invite" aria-labelledby="rl-invite-title">
        <div class="rl-invite__text">
          <h2 class="text-strong" id="rl-invite-title">Freunde einladen</h2>
          <p class="text-caption">Code <span class="rl-invite__code text-strong">${g.code}</span></p>
        </div>
        <button class="ab-btn ab-btn--sm text-label" type="button" id="rl-share">Einladen</button>
      </section>

      <button class="ab-btn ab-btn--ghost ab-btn--danger ab-btn--sm text-label rl-leave" type="button" id="rl-leave">„${esc(g.name)}“ verlassen</button>
    </div>`;

  host.querySelectorAll('.rl-chip[data-code]').forEach((b) => b.addEventListener('click', () => {
    if (b.dataset.code === me.current) return;
    me.current = b.dataset.code;
    store();
    renderRangliste(host);
  }));
  host.querySelector('#rl-add').addEventListener('click', () => openStartDialog(() => renderRangliste(host)));
  host.querySelector('#rl-share').addEventListener('click', () => share(g));
  host.querySelector('#rl-leave').addEventListener('click', async () => {
    const ok = await confirmDialog({
      art: 'close',
      title: `„${g.name}“ verlassen?`,
      text: 'Du verschwindest aus dieser Rangliste. Mit dem Code kannst du später wieder beitreten.',
      confirm: 'Verlassen',
      cancel: 'Bleiben',
      danger: true,
    });
    if (!ok) return;
    try {
      await leaveGroup(g.code);
      renderRangliste(host);
    } catch (e) {
      toast(errorText(e), { tone: 'error' });
    }
  });
  loadBoard(host, g.code);
}

// Die eigene Zeile mit dem Stand dieses Geräts überschreiben und neu sortieren
// (wie leaderboard_board im SQL). So steht man richtig da, auch wenn der
// Upload noch unterwegs ist oder die gespeicherte Tabelle älter ist.
function withOwnStand(rows) {
  if (!rows.some((r) => r.player_id === me.id)) return rows;
  const s = stand();
  return rows
    .map((r) => (r.player_id === me.id
      ? { ...r, name: s.p_name || r.name, week_xp: s.p_week_xp, xp: s.p_xp, streak: s.p_streak }
      : r))
    .sort((a, b) => b.week_xp - a.week_xp || b.xp - a.xp || a.name.localeCompare(b.name, 'de'));
}

// Zuletzt geladene Tabelle einer Gruppe, nur aus der laufenden Woche. Eine aus
// der Vorwoche zeigte noch die alten Wochen-XP.
function cachedRows(code) {
  const c = me.boards[code];
  return c && c.week === weekStart() ? c.rows : null;
}

async function loadBoard(host, code) {
  const box = host.querySelector('.rl-board');
  let shown = '';
  const show = (html) => {
    if (html !== shown) box.innerHTML = shown = html;
  };
  // Die gespeicherte Tabelle steht sofort da, die frische ersetzt sie.
  const cached = cachedRows(code);
  if (cached) show(boardHtml(withRanks(withOwnStand(cached))));
  // Der eigene Stand geht nebenher hoch; die Tabelle wartet nicht darauf.
  syncLeaderboard();
  try {
    const rows = await board(code);
    if (rows.length) me.boards[code] = { week: weekStart(), rows };
    else delete me.boards[code];
    store();
    if (!box.isConnected) return;
    show(rows.length
      ? boardHtml(withRanks(withOwnStand(rows)))
      : '<p class="rl-status text-body">Die Gruppe gibt es nicht mehr.</p>');
  } catch (e) {
    // Ohne Netz bleibt die gespeicherte Tabelle stehen.
    if (box.isConnected && !cached) show(`<p class="rl-status text-body">${errorText(e)}</p>`);
  }
}

function renderEmpty(host) {
  host.innerHTML = `
    <div class="screen rl">
      <h1 class="screen__title text-title">Rangliste</h1>
      <section class="ab-card rl-hero">
        <span class="rl-hero__art">${icon('trophy')}</span>
        <h2 class="text-heading">Lernt um die Wette</h2>
        <p class="text-body">Gründe eine Gruppe und lade Freunde ein, oder tritt mit einem Code bei.
          Gezählt werden die XP der Woche, am Montag starten alle wieder bei 0.</p>
      </section>
      <section class="ab-card rl-startcard">${startFormHtml()}</section>
      <p class="rl-foot text-caption">${PRIVACY}</p>
    </div>`;
  wireStartForm(host, () => renderRangliste(host));
}

async function share(g) {
  const url = inviteLink(g.code);
  const text = `Lern mit mir Hebräisch lesen! Tritt in Alef Beth meiner Gruppe „${g.name}“ bei, Code ${g.code}:`;
  if (navigator.share) {
    try {
      await navigator.share({ title: 'Alef Beth Rangliste', text, url });
      return;
    } catch (e) {
      if (e.name === 'AbortError') return;
    }
  }
  try {
    await navigator.clipboard.writeText(`${text} ${url}`);
    toast('Einladungslink kopiert', { tone: 'success', icon: 'check' });
  } catch (_) {
    toast(`Code: ${g.code}`, { icon: 'bell' });
  }
}

// ---------- Einladung: #/rangliste/<CODE> ----------

async function renderInvite(host, code) {
  if (me.groups.some((g) => g.code === code)) {
    me.current = code;
    store();
    location.replace('#/rangliste');
    return;
  }
  host.innerHTML = `
    <div class="screen rl">
      <h1 class="screen__title text-title">Einladung</h1>
      <p class="rl-status text-body">Wird geladen …</p>
    </div>`;
  const status = host.querySelector('.rl-status');
  let info;
  try {
    info = await groupInfo(code);
  } catch (e) {
    if (status.isConnected) status.textContent = errorText(e);
    return;
  }
  if (!status.isConnected) return;
  if (!info) {
    status.innerHTML = `Zum Code ${esc(code)} gibt es keine Gruppe mehr. <a href="#/rangliste">Zur Rangliste</a>`;
    return;
  }
  status.outerHTML = `
    <section class="ab-card rl-hero">
      <span class="rl-hero__art">${icon('trophy')}</span>
      <p class="text-caption rl-hero__kicker">Du bist eingeladen in</p>
      <h2 class="text-heading">${esc(info.name)}</h2>
      <p class="text-body">${info.members} ${info.members === 1 ? 'Person lernt' : 'Leute lernen'} hier um die Wette.
        Gezählt werden die XP der Woche.</p>
      <form class="rl-start rl-start--invite" novalidate>
        ${nameFieldHtml()}
        <button class="ab-btn text-button" type="submit">Beitreten</button>
      </form>
    </section>
    <p class="rl-foot text-caption">${PRIVACY}</p>`;
  const form = host.querySelector('.rl-start');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const player = form.querySelector('[name="player"]');
    if (player && !player.value.trim()) {
      player.focus();
      return;
    }
    if (player) {
      state.profile.name = player.value.trim();
      save();
    }
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    try {
      await joinGroup(code);
      toast(`Willkommen in „${info.name}“`, { tone: 'success', icon: 'trophy' });
      location.replace('#/rangliste');
    } catch (err) {
      btn.disabled = false;
      toast(errorText(err), { tone: 'error' });
    }
  });
}
