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

// { id, secret, groups: [{ code, name }], current: code, sent: zuletzt hochgeladener Stand }
function load() {
  try {
    const raw = localStorage.getItem(STORE);
    if (raw) return { groups: [], current: null, sent: null, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Konnte die Ranglisten-Daten nicht laden:', e);
  }
  return { id: null, secret: null, groups: [], current: null, sent: null };
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

async function rpc(fn, args) {
  const res = await fetch(API + fn, {
    method: 'POST',
    headers: { apikey: API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
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
// Screenwechsel versucht es wieder.
let syncing = null;
export function syncLeaderboard() {
  if (!hasGroups() || !playerName() || syncing) return;
  if (JSON.stringify(stand()) === me.sent) return;
  syncing = upload().catch(() => {}).finally(() => { syncing = null; });
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
  me.current = me.groups[0]?.code || null;
  store();
}

const board = (code) => rpc('leaderboard_board', { p_code: code, p_week: weekStart() });
const groupInfo = async (code) => (await rpc('leaderboard_group', { p_code: code }))[0] || null;

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

// ---------- Karte auf der Erfolge-Seite ----------

export function teaserHtml() {
  const g = me.groups.find((x) => x.code === me.current) || me.groups[0];
  const sub = g ? `${esc(g.name)} · <span data-rank>Platz wird geladen …</span>` : 'Mit Freunden um die meisten XP der Woche';
  return `
    <a class="ab-alpha rl-teaser" href="#/rangliste">
      <span class="ab-alpha__glyph rl-teaser__art">${icon('trophy')}</span>
      <span class="ab-alpha__text"><span class="text-strong">Rangliste</span>
        <span class="ab-alpha__sub text-caption">${sub}</span></span>
      <span class="rl-chevron" aria-hidden="true">${icon('chevron')}</span>
    </a>`;
}

// Platz nachtragen, sobald der Server geantwortet hat.
export async function fillTeaser(host) {
  const slot = host.querySelector('[data-rank]');
  if (!slot) return;
  const g = me.groups.find((x) => x.code === me.current) || me.groups[0];
  try {
    const rows = withRanks(await board(g.code));
    const mine = rows.find((r) => r.player_id === me.id);
    if (!slot.isConnected) return;
    slot.textContent = mine ? `Platz ${mine.rank} von ${rows.length}` : `${rows.length} dabei`;
  } catch (_) {
    slot.remove();
  }
}

// ---------- Ranglisten-Seite ----------

const backHtml = `<a class="rl-back text-label" href="#/erfolge">${icon('chevron')}Erfolge</a>`;

const PRIVACY = 'Für die Rangliste speichert die App deinen Namen, deine XP und deine Serie '
  + 'auf einem Server (Supabase in Frankfurt). Sehen kann sie nur, wer den Gruppencode kennt.';

function nameFieldHtml() {
  if (state.profile.name) return '';
  return `
    <div class="ab-setting profile-field">
      <label class="ab-setting__text" for="rl-name"><span class="text-strong">Dein Name</span>
        <span class="ab-setting__desc text-caption">So sehen dich die anderen</span></label>
      <input class="ab-input text-strong" type="text" id="rl-name" maxlength="${NAME_MAX}" autocomplete="given-name" placeholder="Vorname" required>
    </div>`;
}

// Formulare zum Anlegen und Beitreten. Kennt die App noch keinen Namen,
// fragt ein Feld darüber nach ihm, für beide Formulare.
function formsHtml() {
  const name = nameFieldHtml();
  return `
    ${name ? `<div class="ab-settings">${name}</div>` : ''}
    <form class="ab-card rl-form" data-form="create">
      <h2 class="text-strong">Neue Gruppe anlegen</h2>
      <div class="ab-settings">
        <div class="ab-setting profile-field">
          <label class="ab-setting__text" for="rl-group"><span class="text-strong">Name der Gruppe</span></label>
          <input class="ab-input text-strong" type="text" id="rl-group" maxlength="${GROUP_MAX}" placeholder="z. B. Giur-Kurs" required>
        </div>
      </div>
      <button class="ab-btn text-button" type="submit">Anlegen</button>
    </form>
    <form class="ab-card rl-form" data-form="join">
      <h2 class="text-strong">Mit Code beitreten</h2>
      <div class="ab-settings">
        <div class="ab-setting profile-field">
          <label class="ab-setting__text" for="rl-code"><span class="text-strong">Gruppencode</span>
            <span class="ab-setting__desc text-caption">Sechs Zeichen, etwa K7MQ2X</span></label>
          <input class="ab-input text-strong rl-code-input" type="text" id="rl-code" maxlength="6" autocomplete="off"
                 autocapitalize="characters" spellcheck="false" required>
        </div>
      </div>
      <button class="ab-btn ab-btn--secondary text-button" type="submit">Beitreten</button>
    </form>`;
}

function rowHtml(r) {
  const mine = r.player_id === me.id;
  const medal = r.week_xp > 0 && r.rank <= 3 ? ` rl-row--${r.rank}` : '';
  const streak = r.streak ? `${icon('flame')}${r.streak} ${r.streak === 1 ? 'Tag' : 'Tage'} · ` : '';
  return `
    <li class="ab-alpha rl-row${medal}${mine ? ' is-me' : ''}">
      <span class="ab-alpha__glyph"><span class="text-heading">${r.rank}</span></span>
      <span class="ab-alpha__text"><span class="text-strong">${esc(r.name)}${mine ? ' <span class="rl-you text-caption">du</span>' : ''}</span>
        <span class="ab-alpha__sub rl-row__sub text-caption">${streak}${num(r.xp)} XP gesamt</span></span>
      <span class="rl-row__xp text-strong">${num(r.week_xp)}<span class="text-caption"> XP</span></span>
    </li>`;
}

function weekRangeText() {
  const from = new Date(`${weekStart()}T00:00`);
  const to = new Date(from.getFullYear(), from.getMonth(), from.getDate() + 6);
  const f = (d) => d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' });
  return `${f(from)} bis ${f(to)}`;
}

export function renderRangliste(host, joinCode = null) {
  if (joinCode) {
    renderInvite(host, normCode(joinCode));
    return;
  }
  if (!hasGroups()) {
    host.innerHTML = `
      <div class="screen">
        ${backHtml}
        <h1 class="screen__title text-title">Rangliste</h1>
        <p class="rl-desc text-body">Lerne mit Freunden um die Wette. Gezählt werden die XP der
          laufenden Woche, am Montag beginnen alle wieder bei 0.</p>
        ${formsHtml()}
        <div class="ab-hint ab-hint--info">${icon('lock')}<p class="text-body">${PRIVACY}</p></div>
      </div>`;
    wireForms(host);
    return;
  }

  if (!me.groups.some((g) => g.code === me.current)) me.current = me.groups[0].code;
  const g = me.groups.find((x) => x.code === me.current);
  const picker = me.groups.length > 1
    ? `<span class="ab-select rl-picker"><select class="ab-input text-strong" id="rl-pick" aria-label="Gruppe">${
      me.groups.map((x) => `<option value="${x.code}"${x.code === g.code ? ' selected' : ''}>${esc(x.name)}</option>`).join('')}</select></span>`
    : `<p class="rl-group text-heading">${esc(g.name)}</p>`;

  host.innerHTML = `
    <div class="screen">
      ${backHtml}
      <h1 class="screen__title text-title">Rangliste</h1>
      ${picker}
      <p class="rl-desc text-caption">XP vom ${weekRangeText()}</p>
      <ol class="ab-alphalist rl-list" aria-live="polite"><li class="rl-status text-body">Wird geladen …</li></ol>

      <section class="ab-card rl-invite" aria-labelledby="rl-invite-title">
        <h2 class="text-strong" id="rl-invite-title">Freunde einladen</h2>
        <p class="text-body">Gruppencode</p>
        <p class="rl-invite__code text-title">${g.code}</p>
        <div class="rl-invite__btns">
          <button class="ab-btn text-button" type="button" id="rl-share">Einladung teilen</button>
          <button class="ab-btn ab-btn--ghost ab-btn--danger text-button" type="button" id="rl-leave">Gruppe verlassen</button>
        </div>
      </section>

      <h2 class="screen__section text-heading">Weitere Gruppe</h2>
      ${formsHtml()}
      <div class="ab-hint ab-hint--info">${icon('lock')}<p class="text-body">${PRIVACY}</p></div>
    </div>`;

  host.querySelector('#rl-pick')?.addEventListener('change', (e) => {
    me.current = e.target.value;
    store();
    renderRangliste(host);
  });
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
  wireForms(host);
  loadBoard(host, g.code);
}

async function loadBoard(host, code) {
  const list = host.querySelector('.rl-list');
  try {
    // Erst den eigenen Stand hochladen, damit man sich gleich richtig einsortiert sieht.
    await upload().catch(() => {});
    const rows = withRanks(await board(code));
    if (!list.isConnected) return;
    list.innerHTML = rows.length
      ? rows.map(rowHtml).join('')
      : '<li class="rl-status text-body">Die Gruppe gibt es nicht mehr.</li>';
  } catch (e) {
    if (list.isConnected) list.innerHTML = `<li class="rl-status text-body">${errorText(e)}</li>`;
  }
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

// Den Namen aus dem Feld übernehmen, falls die App noch keinen kennt.
function takeName(host) {
  const input = host.querySelector('#rl-name');
  if (!input) return true;
  const name = input.value.trim();
  if (!name) {
    input.focus();
    return false;
  }
  state.profile.name = name;
  save();
  return true;
}

function wireForms(host) {
  host.querySelectorAll('.rl-code-input').forEach((input) => {
    input.addEventListener('input', () => { input.value = normCode(input.value); });
  });
  host.querySelectorAll('.rl-form').forEach((form) => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!takeName(host)) return;
      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      try {
        if (form.dataset.form === 'create') {
          const name = form.querySelector('#rl-group').value.trim();
          if (!name) return;
          await createGroup(name);
          toast(`Gruppe „${name}“ angelegt`, { tone: 'success', icon: 'trophy' });
        } else {
          const code = normCode(form.querySelector('#rl-code').value);
          if (code.length !== 6) {
            toast('Der Code hat sechs Zeichen.', { tone: 'error' });
            return;
          }
          const name = await joinGroup(code);
          toast(`Willkommen in „${name}“`, { tone: 'success', icon: 'trophy' });
        }
        renderRangliste(host);
      } catch (err) {
        toast(err.status === 404 ? 'Zu diesem Code gibt es keine Gruppe.' : errorText(err), { tone: 'error' });
      } finally {
        btn.disabled = false;
      }
    });
  });
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
    <div class="screen">
      ${backHtml}
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
    status.textContent = `Zum Code ${code} gibt es keine Gruppe. Vielleicht hat sie inzwischen niemand mehr.`;
    return;
  }
  status.outerHTML = `
    <form class="ab-card rl-form rl-invite">
      <span class="ab-alpha__glyph rl-teaser__art">${icon('trophy')}</span>
      <h2 class="text-heading">${esc(info.name)}</h2>
      <p class="text-body">${info.members} ${info.members === 1 ? 'Person lernt' : 'Leute lernen'} hier um die Wette.
        Gezählt werden die XP der laufenden Woche.</p>
      ${state.profile.name ? '' : `<div class="ab-settings">${nameFieldHtml()}</div>`}
      <button class="ab-btn text-button" type="submit">Beitreten</button>
    </form>
    <div class="ab-hint ab-hint--info">${icon('lock')}<p class="text-body">${PRIVACY}</p></div>`;
  const form = host.querySelector('.rl-form');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!takeName(host)) return;
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
