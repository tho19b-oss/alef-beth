// Konto über Supabase Auth (Projekt „alef-beth“), SQL in supabase/konto.sql.
//
// Beim Start holt sich die App still eine anonyme Sitzung. Damit hat jedes
// Gerät eine feste Nutzer-ID, ohne dass jemand etwas eingibt. Wer das Konto
// mit seiner E-Mail sichert, bekommt ein Backup seines Fortschritts und meldet
// sich auf einem neuen Gerät mit einem Code aus der Mail wieder an. Die App
// spricht Supabase Auth direkt über fetch an, ohne Bibliothek.

import { state, STATE_KEY } from './state.js';
import { esc } from './util.js';
import { icon, toast, confirmDialog } from './ui.js';
import { adoptPlayer, forgetPlayer } from './rangliste.js';

const BASE = 'https://qtrutjgrfapelbesxbdd.supabase.co';
const API_KEY = 'sb_publishable_eoFkeLqqXtcUMoNerFbAMw_Cw0TKPme';
const STORE = 'alefbeth-konto-v1';
// Hinweis auf der Startseite erst, wenn es etwas zu verlieren gibt.
const HINT_XP = 300;

// { session: { access_token, refresh_token, expires_at, user }, sent: zuletzt
//   gesicherter Fortschritt (JSON), savedAt: Zeitpunkt der letzten Sicherung,
//   hintClosed: Hinweis auf der Startseite weggetippt }
function load() {
  try {
    const raw = localStorage.getItem(STORE);
    if (raw) return { session: null, sent: null, savedAt: null, hintClosed: false, ...JSON.parse(raw) };
  } catch (e) {
    console.warn('Konnte die Konto-Daten nicht laden:', e);
  }
  return { session: null, sent: null, savedAt: null, hintClosed: false };
}

const acc = load();

function store() {
  try {
    localStorage.setItem(STORE, JSON.stringify(acc));
  } catch (e) {
    console.warn('Konnte die Konto-Daten nicht speichern:', e);
  }
}

const user = () => acc.session?.user || null;
// Gesichert heißt: Das Konto hat eine E-Mail und ist nicht mehr anonym.
export const isSaved = () => !!user() && !user().is_anonymous && !!user().email;
export const accountEmail = () => (isSaved() ? user().email : '');

// ---------- Supabase Auth ----------

async function auth(path, { method = 'POST', body, token } = {}) {
  const res = await fetch(`${BASE}/auth/v1/${path}`, {
    method,
    headers: {
      apikey: API_KEY,
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.msg || data.message || data.error_description || res.statusText);
    err.status = res.status;
    err.code = data.error_code || data.code;
    throw err;
  }
  return data;
}

function keepSession(s) {
  acc.session = {
    access_token: s.access_token,
    refresh_token: s.refresh_token,
    expires_at: s.expires_at || Math.floor(Date.now() / 1000) + (s.expires_in || 3600),
    user: { id: s.user.id, email: s.user.email || '', is_anonymous: !!s.user.is_anonymous },
  };
  store();
}

// Eine Sitzung beschaffen: die gespeicherte, wenn nötig erneuert, sonst eine
// neue anonyme. Liefert das Zugangs-Token oder null (offline, oder anonyme
// Logins sind im Projekt aus). Gleichzeitige Aufrufe teilen sich eine Anfrage.
const RETRY_MS = 10 * 60 * 1000;
let signupFailedAt = 0;
let pending = null;
export function accessToken() {
  const s = acc.session;
  if (s && s.expires_at - 60 > Date.now() / 1000) return Promise.resolve(s.access_token);
  if (!pending) {
    pending = (async () => {
      if (s) {
        try {
          keepSession(await auth('token?grant_type=refresh_token', { body: { refresh_token: s.refresh_token } }));
          return acc.session.access_token;
        } catch (e) {
          // Ohne Netz die alte Sitzung behalten, der nächste Aufruf versucht es wieder.
          if (e instanceof TypeError) return null;
          // Abgelaufen oder widerrufen. Ein gesichertes Konto meldet sich mit
          // dem Mail-Code neu an, ein anonymes bekommt eine neue Sitzung.
          if (isSaved()) return null;
          acc.session = null;
          store();
        }
      }
      // Nach einem Fehlschlag erst nach RETRY_MS wieder fragen, sonst ginge
      // jeder Ranglisten-Aufruf zweimal zum Server.
      if (Date.now() - signupFailedAt < RETRY_MS) return null;
      try {
        keepSession(await auth('signup', { body: {} }));
        return acc.session.access_token;
      } catch (_) {
        signupFailedAt = Date.now();
        return null;
      }
    })().finally(() => { pending = null; });
  }
  return pending;
}

// Aufruf einer Funktion aus konto.sql mit der Sitzung.
async function rpc(fn, args = {}) {
  const token = await accessToken();
  if (!token) throw new TypeError('keine Sitzung');
  const res = await fetch(`${BASE}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: { apikey: API_KEY, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(args),
  });
  if (!res.ok) {
    const err = new Error(res.statusText);
    err.status = res.status;
    throw err;
  }
  return res.status === 204 ? null : res.json();
}

// ---------- Fortschritt sichern ----------

// Beim Screenwechsel und wenn die App in den Hintergrund geht: sichert den
// Fortschritt, wenn sich seit dem letzten Mal etwas geändert hat.
let saving = null;
export function syncProgress() {
  if (saving || !isSaved()) return saving || Promise.resolve();
  const data = JSON.stringify(state);
  if (data === acc.sent) return Promise.resolve();
  saving = rpc('progress_save', { p_data: state })
    .then((at) => {
      acc.sent = data;
      acc.savedAt = at;
      store();
    })
    .catch(() => {})
    .finally(() => { saving = null; });
  return saving;
}

// Nach dem Anmelden auf einem Gerät: Backup holen und, wenn gewünscht, den
// Stand dieses Geräts damit ersetzen. Liefert true, wenn die App neu laden muss.
async function restore() {
  const rows = await rpc('progress_load');
  const backup = rows?.[0];
  if (!backup) return false;
  const localXp = state.xp || 0;
  if (localXp > 0) {
    const keep = await confirmDialog({
      art: 'book',
      title: 'Welchen Fortschritt nehmen?',
      text: `Im Konto liegen ${(backup.data.xp || 0).toLocaleString('de-DE')} XP, auf diesem Gerät `
        + `${localXp.toLocaleString('de-DE')} XP. Der andere Stand wird überschrieben.`,
      cancel: 'Den aus dem Konto',
      confirm: 'Den von diesem Gerät',
    });
    if (keep) return false;
  }
  localStorage.setItem(STATE_KEY, JSON.stringify(backup.data));
  acc.sent = JSON.stringify(backup.data);
  acc.savedAt = backup.updated_at;
  store();
  return true;
}

// Ranglisten-Spieler des Kontos übernehmen, damit die Gruppen wieder da sind.
async function restorePlayer() {
  const player = await rpc('leaderboard_me');
  if (player) adoptPlayer(player);
}

// ---------- Abläufe ----------

const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

const errorText = (e) => {
  if (e instanceof TypeError) return 'Keine Verbindung zum Server. Bist du online?';
  if (e.code === 'otp_expired') return 'Der Code ist falsch oder abgelaufen.';
  if (e.code === 'over_email_send_rate_limit' || e.status === 429) return 'Zu viele Versuche. Warte ein paar Minuten.';
  return 'Das hat nicht geklappt. Versuch es gleich noch einmal.';
};

// Konto sichern: Die anonyme Sitzung bekommt eine E-Mail. Supabase schickt
// einen Code an die Adresse, mit dem Code gilt sie als bestätigt. Die
// Nutzer-ID bleibt dieselbe, die Ranglisten-Gruppen hängen also schon dran.
async function sendLinkCode(email) {
  const token = await accessToken();
  if (!token) throw new TypeError('keine Sitzung');
  await auth('user', { method: 'PUT', token, body: { email } });
}

async function verifyLinkCode(email, code) {
  keepSession(await auth('verify', { body: { type: 'email_change', email, token: code } }));
}

// Anmelden mit einem vorhandenen Konto: Code an die E-Mail, nur wenn es das
// Konto schon gibt (create_user: false).
async function sendLoginCode(email) {
  await auth('otp', { body: { email, create_user: false } });
}

async function verifyLoginCode(email, code) {
  keepSession(await auth('verify', { body: { type: 'email', email, token: code } }));
}

// Dialog in zwei Schritten: E-Mail, dann Code. mode 'save' sichert dieses
// Gerät, mode 'login' meldet ein vorhandenes Konto an.
export function openAccountDialog(mode = 'save', onDone = () => {}) {
  const dlg = document.createElement('dialog');
  dlg.className = 'ab-dialog rl-dialog konto-dialog';
  dlg.setAttribute('aria-labelledby', 'konto-title');
  document.body.append(dlg);
  dlg.addEventListener('close', () => dlg.remove());
  let email = '';

  const close = `<button class="ab-iconbtn rl-dialog__close" type="button" aria-label="Schließen">${icon('close')}</button>`;
  const wireClose = () => dlg.querySelector('.rl-dialog__close').addEventListener('click', () => dlg.close());

  function emailStep() {
    const login = mode === 'login';
    dlg.innerHTML = `
      ${close}
      <h2 class="ab-dialog__title text-heading" id="konto-title">${login ? 'Anmelden' : 'Konto sichern'}</h2>
      <p class="text-body konto-dialog__text">${login
        ? 'Gib die E-Mail deines Kontos ein. Wir schicken dir einen Code, dann holst du deinen Fortschritt auf dieses Gerät.'
        : 'Mit deiner E-Mail liegt dein Fortschritt auch im Konto. Auf einem neuen Gerät meldest du dich mit einem Code aus der Mail an.'}</p>
      <form class="rl-start" novalidate>
        <label class="rl-field">
          <span class="text-strong">E-Mail</span>
          <input class="ab-input text-strong" type="email" name="email" autocomplete="email" inputmode="email"
                 spellcheck="false" value="${esc(email)}" required>
        </label>
        <button class="ab-btn text-button" type="submit">Code schicken</button>
        <button class="ab-btn ab-btn--ghost text-label konto-dialog__switch" type="button">${login
          ? 'Noch kein Konto? Dieses Gerät sichern' : 'Schon ein Konto? Anmelden'}</button>
      </form>`;
    wireClose();
    const form = dlg.querySelector('form');
    const input = form.querySelector('[name="email"]');
    form.querySelector('.konto-dialog__switch').addEventListener('click', () => {
      mode = login ? 'save' : 'login';
      email = input.value.trim();
      emailStep();
    });
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      email = input.value.trim().toLowerCase();
      if (!isEmail(email)) {
        toast('Das sieht nicht nach einer E-Mail aus.', { tone: 'error' });
        input.focus();
        return;
      }
      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      try {
        await (login ? sendLoginCode(email) : sendLinkCode(email));
        codeStep();
      } catch (err) {
        btn.disabled = false;
        if (!login && (err.code === 'email_exists' || err.status === 422)) {
          toast('Zu dieser E-Mail gibt es schon ein Konto. Melde dich an.', { tone: 'error' });
          mode = 'login';
          emailStep();
        } else if (login && (err.code === 'otp_disabled' || err.status === 422)) {
          toast('Zu dieser E-Mail gibt es kein Konto.', { tone: 'error' });
        } else {
          toast(errorText(err), { tone: 'error' });
        }
      }
    });
    input.focus();
  }

  function codeStep() {
    dlg.innerHTML = `
      ${close}
      <h2 class="ab-dialog__title text-heading" id="konto-title">Code eingeben</h2>
      <p class="text-body konto-dialog__text">Wir haben dir einen Code an <b>${esc(email)}</b> geschickt.
        Schau auch im Spam-Ordner nach.</p>
      <form class="rl-start" novalidate>
        <label class="rl-field">
          <span class="text-strong">Code aus der Mail</span>
          <input class="ab-input text-strong konto-code" type="text" name="code" inputmode="numeric"
                 autocomplete="one-time-code" maxlength="10" required>
        </label>
        ${navigator.clipboard?.readText ? '<button class="ab-btn ab-btn--ghost text-label konto-paste" type="button">Code einfügen</button>' : ''}
        <button class="ab-btn text-button" type="submit">Bestätigen</button>
        <button class="ab-btn ab-btn--ghost text-label konto-dialog__switch" type="button">Andere E-Mail</button>
      </form>`;
    wireClose();
    const form = dlg.querySelector('form');
    const input = form.querySelector('[name="code"]');
    const fill = (text) => {
      input.value = text.replace(/\D/g, '');
      if (input.value.length === 6 && !form.querySelector('[type="submit"]').disabled) form.requestSubmit();
    };
    input.addEventListener('input', () => fill(input.value));
    form.querySelector('.konto-paste')?.addEventListener('click', async () => {
      try {
        fill(await navigator.clipboard.readText());
      } catch {
        input.focus();
      }
    });
    form.querySelector('.konto-dialog__switch').addEventListener('click', emailStep);
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (input.value.length < 6) {
        input.focus();
        return;
      }
      const btn = form.querySelector('[type="submit"]');
      btn.disabled = true;
      try {
        if (mode === 'login') {
          await verifyLoginCode(email, input.value);
          dlg.close();
          await restorePlayer().catch(() => {});
          if (await restore().catch(() => false)) {
            location.reload();
            return;
          }
          acc.sent = null;
          await syncProgress();
          toast('Angemeldet', { tone: 'success', icon: 'check' });
        } else {
          await verifyLinkCode(email, input.value);
          dlg.close();
          acc.sent = null;
          await syncProgress();
          toast('Konto gesichert', { tone: 'success', icon: 'check' });
        }
        onDone();
      } catch (err) {
        btn.disabled = false;
        toast(errorText(err), { tone: 'error' });
        input.select();
      }
    });
    input.focus();
  }

  emailStep();
  dlg.showModal();
}

// Abmelden: Dieses Gerät fängt danach frisch an. Der Fortschritt bleibt im
// Konto und kommt beim nächsten Anmelden zurück.
export async function signOut() {
  const ok = await confirmDialog({
    art: 'close',
    title: 'Abmelden?',
    text: 'Dein Fortschritt bleibt im Konto. Auf diesem Gerät fängst du danach von vorn an, bis du dich wieder anmeldest.',
    confirm: 'Abmelden',
    cancel: 'Angemeldet bleiben',
    danger: true,
  });
  if (!ok) return;
  await syncProgress();
  const token = acc.session?.access_token;
  if (token) auth('logout', { token }).catch(() => {});
  localStorage.removeItem(STORE);
  localStorage.removeItem(STATE_KEY);
  forgetPlayer();
  location.hash = '#/';
  location.reload();
}

// Konto löschen: Backup, Ranglisten-Einträge und das Konto selbst. Der
// Fortschritt auf diesem Gerät bleibt.
export async function deleteAccount() {
  const ok = await confirmDialog({
    art: 'close',
    title: 'Konto löschen?',
    text: 'Das Backup und deine Plätze in den Ranglisten sind danach weg. Der Fortschritt auf diesem Gerät bleibt.',
    confirm: 'Endgültig löschen',
    cancel: 'Behalten',
    danger: true,
  });
  if (!ok) return false;
  try {
    await rpc('account_delete');
  } catch (e) {
    toast(errorText(e), { tone: 'error' });
    return false;
  }
  localStorage.removeItem(STORE);
  Object.assign(acc, load());
  forgetPlayer();
  toast('Konto gelöscht', { tone: 'success', icon: 'check' });
  accessToken();
  return true;
}

// ---------- Bausteine für die Screens ----------

// Abschnitt „Konto“ in den Einstellungen.
export function accountSettingsHtml() {
  if (isSaved()) {
    const at = acc.savedAt
      ? new Date(acc.savedAt).toLocaleString('de-DE', { dateStyle: 'short', timeStyle: 'short' })
      : 'noch nicht';
    return `
      <div class="ab-settings">
        <div class="ab-setting">
          <span class="ab-setting__text"><span class="text-strong">${esc(accountEmail())}</span>
            <span class="ab-setting__desc text-caption">Zuletzt gesichert: ${at}</span></span>
          <button class="ab-btn ab-btn--secondary ab-btn--sm text-label" type="button" id="konto-out">Abmelden</button>
        </div>
      </div>
      <button class="ab-btn ab-btn--ghost ab-btn--danger ab-btn--sm text-label konto-delete" type="button" id="konto-delete">Konto löschen</button>`;
  }
  return `
    <section class="ab-card konto-card">
      <p class="text-body">Dein Fortschritt liegt nur auf diesem Gerät. Sichere ihn mit deiner E-Mail,
        dann holst du ihn auf jedem Gerät zurück.</p>
      <div class="konto-card__actions">
        <button class="ab-btn ab-btn--sm text-label" type="button" id="konto-save">Konto sichern</button>
        <button class="ab-btn ab-btn--ghost ab-btn--sm text-label" type="button" id="konto-login">Ich habe schon ein Konto</button>
      </div>
    </section>`;
}

export function wireAccountSettings(host, rerender) {
  host.querySelector('#konto-save')?.addEventListener('click', () => openAccountDialog('save', rerender));
  host.querySelector('#konto-login')?.addEventListener('click', () => openAccountDialog('login', rerender));
  host.querySelector('#konto-out')?.addEventListener('click', signOut);
  host.querySelector('#konto-delete')?.addEventListener('click', async () => {
    if (await deleteAccount()) rerender();
  });
}

// Hinweis auf der Startseite: beim allerersten Start „Schon ein Konto?“, ab
// HINT_XP einmal „Konto sichern“, bis man ihn wegtippt.
export function accountHintHtml() {
  if (isSaved()) return '';
  if (!state.xp && !Object.keys(state.lessons).length) {
    return `<p class="konto-first text-caption">Schon ein Konto? <button class="konto-link text-label" type="button" id="konto-hint-login">Anmelden</button></p>`;
  }
  if (state.xp < HINT_XP || acc.hintClosed) return '';
  return `
    <div class="ab-banner konto-hint" role="status">
      <span class="ab-banner__icon">${icon('lock')}</span>
      <p class="ab-banner__text text-body">Sichere deinen Fortschritt mit deiner E-Mail, damit er bei einem neuen Handy nicht verloren geht.</p>
      <span class="konto-hint__actions">
        <button class="ab-btn ab-btn--sm text-label" type="button" id="konto-hint-save">Sichern</button>
        <button class="ab-iconbtn" type="button" id="konto-hint-close" aria-label="Hinweis schließen">${icon('close')}</button>
      </span>
    </div>`;
}

export function wireAccountHint(host, rerender) {
  host.querySelector('#konto-hint-login')?.addEventListener('click', () => openAccountDialog('login', rerender));
  host.querySelector('#konto-hint-save')?.addEventListener('click', () => openAccountDialog('save', rerender));
  host.querySelector('#konto-hint-close')?.addEventListener('click', () => {
    acc.hintClosed = true;
    store();
    host.querySelector('.konto-hint')?.remove();
  });
}
