// Soundeffekte: Glockenspiel-Töne für Antworten und Feiern, live per Web Audio
// erzeugt – keine Audiodateien, offline von Anfang an dabei. Alle Töne stehen
// in einer Tonleiter (D-Dur-Pentatonik), damit nichts schief klingt, wenn sich
// zwei Klänge überlappen. Die Lautstärken folgen den Feier-Stufen: „Richtig“
// kommt dutzendmal pro Lektion und ist deshalb leiser als die Feiern.
// Die hebräische Sprachausgabe läuft getrennt davon (audio.js).

import { state } from './state.js';

const AC = window.AudioContext || window.webkitAudioContext;

export function soundSupported() {
  return !!AC;
}

// ---------- Klangerzeugung ----------

const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);
const pick = (list) => list[Math.floor(Math.random() * list.length)];

// D-Dur-Pentatonik von D5 bis D7: die Leiter für Richtig und Kombo.
const LADDER = [74, 76, 78, 81, 83, 86, 88, 90, 93, 95, 98];
// Paare finden: ein D-Dur-Akkord, Ton für Ton (bis zu fünf Paare).
const PAIRS = [86, 90, 93, 98, 102];

// Kleiner, warmer Raum: Rauschen, das abklingt und nach hinten dunkler wird.
function roomImpulse(ctx, seconds) {
  const len = Math.floor(ctx.sampleRate * seconds);
  const fade = ctx.sampleRate * 0.006;
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let c = 0; c < 2; c++) {
    const d = buf.getChannelData(c);
    let lp = 0;
    for (let i = 0; i < len; i++) {
      const x = i / len;
      lp += (0.6 - 0.45 * x) * (Math.random() * 2 - 1 - lp);
      d[i] = lp * (1 - x) ** 3.4 * Math.min(1, i / fade);
    }
  }
  return buf;
}

// Sicherheitsnetz, falls viele Töne zugleich klingen: Spitzen über 0,8 werden
// weich gerundet statt hart abgeschnitten.
function softCurve() {
  const curve = new Float32Array(2049);
  for (let i = 0; i < curve.length; i++) {
    const x = i / 1024 - 1;
    const a = Math.abs(x);
    curve[i] = a < 0.8 ? x : Math.sign(x) * (0.8 + 0.2 * Math.tanh((a - 0.8) / 0.2));
  }
  return curve;
}

// Baut die Klangkette für einen AudioContext – oder für einen
// OfflineAudioContext, um die Klänge ohne Lautsprecher zu prüfen.
export function makeEngine(ctx, output = ctx.destination) {
  const sr = ctx.sampleRate;

  const out = ctx.createGain();
  out.gain.value = 0.9;
  const limiter = ctx.createDynamicsCompressor();
  limiter.threshold.value = -10;
  limiter.knee.value = 6;
  limiter.ratio.value = 4;
  limiter.attack.value = 0.002;
  limiter.release.value = 0.2;
  const soft = ctx.createWaveShaper();
  soft.curve = softCurve();
  out.connect(limiter);
  limiter.connect(soft);
  soft.connect(output);

  const room = ctx.createConvolver();
  room.buffer = roomImpulse(ctx, 1.5);
  room.connect(out);

  const noise = ctx.createBuffer(1, sr, sr);
  const nd = noise.getChannelData(0);
  for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;

  // Ein Klang = ein Kanal mit eigener Lautstärke: trocken in den Ausgang,
  // ein Teil (wet) in den Raum.
  function channel(wet, level = 1) {
    const g = ctx.createGain();
    g.gain.value = level;
    g.connect(out);
    const send = ctx.createGain();
    send.gain.value = wet;
    g.connect(send);
    send.connect(room);
    return g;
  }

  // Schnell an, dann exponentiell ausklingen (tau = Zeitkonstante).
  function envelope(g, t, peak, attack, tau) {
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(peak, t + attack);
    g.gain.setTargetAtTime(0, t + attack, tau);
    return t + attack + tau * 8 + 0.02;
  }

  function tone(dest, f, t, { peak = 0.3, attack = 0.002, tau = 0.3, type = 'sine', from = 0, glide = 0.03 } = {}) {
    if (f > sr * 0.45) return;
    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(from ? f * from : f, t);
    if (from) osc.frequency.exponentialRampToValueAtTime(f, t + glide);
    const g = ctx.createGain();
    const end = envelope(g, t, peak, attack, tau);
    osc.connect(g);
    g.connect(dest);
    osc.start(t);
    osc.stop(end);
  }

  function hiss(dest, t, { peak = 0.2, attack = 0.002, tau = 0.02, f = 2000, to = 0, sweep = 0.2, q = 1 } = {}) {
    const src = ctx.createBufferSource();
    src.buffer = noise;
    src.loop = true;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.Q.value = q;
    filter.frequency.setValueAtTime(f, t);
    if (to) filter.frequency.exponentialRampToValueAtTime(to, t + sweep);
    const g = ctx.createGain();
    const end = envelope(g, t, peak, attack, tau);
    src.connect(filter);
    filter.connect(g);
    g.connect(dest);
    src.start(t, Math.random() * 0.5);
    src.stop(end);
  }

  // Glockenspiel: die unharmonischen Teiltöne eines frei schwingenden
  // Metallstabs (1 : 2,76 : 5,4 : 8,93), die hohen klingen schneller ab.
  // len < 1 klingt kürzer – für Töne, die oft kommen.
  function bell(dest, midi, t, v = 1, len = 1) {
    const f = hz(midi);
    const k = len * (1000 / f) ** 0.3;
    tone(dest, f, t, { peak: 0.4 * v, attack: 0.001, tau: 0.85 * k });
    tone(dest, f * 2.76, t, { peak: 0.14 * v, attack: 0.001, tau: 0.32 * k });
    tone(dest, f * 5.4, t, { peak: 0.07 * v, attack: 0.001, tau: 0.14 * k });
    tone(dest, f * 8.93, t, { peak: 0.03 * v, attack: 0.001, tau: 0.07 * k });
    hiss(dest, t, { peak: 0.05 * v, tau: 0.003, f: 7500, q: 1.5 });
  }

  // Akkord leicht gezupft statt auf einen Schlag: klingt weicher und vermeidet
  // Spitzen, wenn alle Töne zugleich einsetzen.
  function chord(dest, midis, t, v) {
    midis.forEach((m, i) => bell(dest, m, t + i * 0.012, v));
  }

  // Glitzer: ein paar hohe Töne zufällig verteilt, wie Konfetti.
  function sparkle(dest, t, span, count, peak) {
    for (let i = 0; i < count; i++) {
      bell(dest, pick([93, 95, 98, 100, 102, 105]), t + Math.random() * span, peak * (0.6 + Math.random() * 0.4));
    }
  }

  // Holz: kurzer Ton, der minimal zu hoch einsetzt, dazu das Klicken des Schlägels.
  function wood(dest, f, t, peak, tau) {
    tone(dest, f, t, { peak, attack: 0.001, tau, from: 1.25, glide: 0.012 });
    hiss(dest, t, { peak: peak * 0.35, tau: 0.004, f: Math.min(f * 2.2, 8000), q: 2 });
  }

  // Eine Flamme faucht kurz auf.
  function flame(dest, t, v) {
    hiss(dest, t, { peak: 0.24 * v, attack: 0.1, tau: 0.09, f: 450, to: 2200, sweep: 0.25, q: 0.9 });
  }

  // Plopp: ein Ton, der blitzschnell nach oben gleitet – etwas erscheint.
  function pop(dest, t, peak) {
    tone(dest, 1050, t, { peak, attack: 0.002, tau: 0.035, from: 0.45, glide: 0.04 });
  }

  // Ein metallisches Klacken, wie ein Schloss.
  function latch(dest, t, f) {
    hiss(dest, t, { peak: 0.45, tau: 0.005, f, q: 4 });
    tone(dest, f * 0.75, t, { peak: 0.08, attack: 0.001, tau: 0.012 });
  }

  // Weicher Klangteppich aus leicht verstimmten Dreiecksschwingungen.
  function pad(dest, midis, t, { attack, hold, release, peak }) {
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 1800;
    lowpass.Q.value = 0.5;
    const g = ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(1, t + attack);
    g.gain.setValueAtTime(1, t + attack + hold);
    g.gain.setTargetAtTime(0, t + attack + hold, release / 4);
    lowpass.connect(g);
    g.connect(dest);
    const end = t + attack + hold + release * 2;
    for (const m of midis) {
      for (const cents of [-7, 7]) {
        const osc = ctx.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = hz(m);
        osc.detune.value = cents;
        const og = ctx.createGain();
        og.gain.value = peak;
        osc.connect(og);
        og.connect(lowpass);
        osc.start(t);
        osc.stop(end);
      }
    }
  }

  // Jeder Klang plant ab Zeitpunkt t und gibt seine Länge in Sekunden zurück.
  const SOUNDS = {
    // Zwei Töne aufwärts, mit dem ✓. In einer Kombo klettert step die Leiter
    // hoch (ein Fehler setzt zurück); flame: die Flamme erscheint gerade.
    richtig(t, { step = 0, flame: withFlame = false }) {
      const ch = channel(0.16, 0.5);
      const s = Math.max(0, Math.min(step, 5));
      const v = 1 - s * 0.05; // hohe Töne wirken lauter: leicht ausgleichen
      bell(ch, LADDER[3 + s], t, 0.75 * v, 0.6);
      bell(ch, LADDER[5 + s], t + 0.075, v, 0.6);
      if (withFlame) flame(ch, t + 0.02, 0.8);
      return 0.55;
    },
    // Ein einzelner, gedämpfter Holzton: sagt nur „angekommen“, wertet nicht.
    falsch(t) {
      wood(channel(0.06, 0.62), 300, t, 0.4, 0.06);
      return 0.3;
    },
    // Paare finden: Antippen klickt leise wie Holz ...
    paarTipp(t) {
      wood(channel(0.04, 1.4), 1500, t, 0.16, 0.025);
      return 0.15;
    },
    // ... jedes gefundene Paar (k = 0, 1, …) klingt einen Ton höher, das
    // letzte von n schließt den Akkord.
    paar(t, { k = 0, n = 3 }) {
      const ch = channel(0.2, 0.75);
      bell(ch, PAIRS[Math.min(k, PAIRS.length - 1)], t, 0.9, 0.7);
      if (k < n - 1) return 0.6;
      chord(ch, PAIRS.slice(0, n), t + 0.16, 0.32);
      sparkle(ch, t + 0.2, 0.5, 4, 0.07);
      return 1.3;
    },
    // Feier-Screen (Stufe 3): ein Lauf aufwärts, der Akkord fällt genau mit
    // dem Konfetti (380 ms), danach glitzert es nach.
    lektion(t) {
      const ch = channel(0.22);
      [74, 78, 81, 86].forEach((m, i) => bell(ch, m, t + i * 0.085, 0.75 + i * 0.05));
      const hit = t + 0.38;
      chord(ch, [86, 90, 93], hit, 0.55);
      bell(ch, 98, hit + 0.01, 0.45);
      sparkle(ch, hit + 0.08, 0.7, 6, 0.07);
      return 1.8;
    },
    // Unter 60 %: keine Fanfare, nur ein warmer Akkord – wie das fehlende Konfetti.
    lektionSanft(t) {
      const ch = channel(0.25, 0.78);
      [74, 81, 86].forEach((m, i) => bell(ch, m, t + i * 0.03, 0.5));
      return 1.2;
    },
    // Neues Abzeichen (Stufe 4): Lauf über einem Klangteppich, Glitzer beim
    // Lichtstreif über die Medaille (350 ms) und beim großen Konfetti (420 ms).
    abzeichen(t) {
      const ch = channel(0.3, 1.1);
      pad(ch, [62, 66, 69, 74], t, { attack: 0.3, hold: 1, release: 1, peak: 0.05 });
      [86, 90, 93, 98, 102].forEach((m, i) => bell(ch, m, t + 0.05 + i * 0.07, 0.42 + i * 0.04));
      [105, 102, 100, 98, 95, 93].forEach((m, i) => bell(ch, m, t + 0.36 + i * 0.03, 0.12));
      chord(ch, [74, 81, 86, 90], t + 0.42, 0.4);
      sparkle(ch, t + 0.5, 1, 8, 0.06);
      return 2.6;
    },
    // Tagesziel voll (Stufe 3): Der Ring füllt sich, zugleich ploppt die
    // Krone. Ein schneller Lauf aufwärts, der Akkord trifft den Höhepunkt
    // des Ploppens, dazu glitzert das kleine Konfetti.
    tagesziel(t) {
      const ch = channel(0.2);
      [74, 76, 78, 81, 83].forEach((m, i) => bell(ch, m, t + i * 0.03, 0.3 + i * 0.07));
      const top = t + 0.15;
      pop(ch, top, 0.22);
      chord(ch, [86, 90, 93], top, 0.45);
      sparkle(ch, top + 0.05, 0.4, 3, 0.06);
      return 1.1;
    },
    // Bonus abholen (Stufe 2): Klimpern beim Tippen, dann schwirren die
    // Funken zum XP-Chip. Ihre Flugzeit ist zufällig (0,7–1 s), der Klang
    // landet nach 0,85 s.
    bonus(t) {
      const ch = channel(0.22, 0.8);
      bell(ch, 93, t, 0.5);
      bell(ch, 98, t + 0.075, 0.7);
      for (let i = 0; i < 7; i++) bell(ch, pick([98, 100, 102, 105]), t + 0.15 + i * 0.045, 0.09);
      hiss(ch, t + 0.15, { peak: 0.035, attack: 0.3, tau: 0.12, f: 2500, to: 6000, sweep: 0.6, q: 2 });
      const land = t + 0.85;
      pop(ch, land, 0.12);
      bell(ch, 98, land, 0.5);
      bell(ch, 102, land + 0.07, 0.4);
      return 1.4;
    },
    // Station frei (Lernpfad): Das Schloss klackt bei jedem Wackeln, nach
    // 420 ms ploppt die Station in Granat auf.
    stationFrei(t) {
      const ch = channel(0.12);
      latch(ch, t + 0.1, 3400);
      latch(ch, t + 0.21, 2700);
      pop(ch, t + 0.42, 0.28);
      bell(ch, 86, t + 0.43, 0.6);
      return 1;
    },
    // Einheit geschafft (Stufe 4): ein kleines Erkennungsmotiv, kurz, kurz,
    // lang. Der volle Akkord kommt nach 0,55 s – zusammen mit dem Konfetti.
    einheit(t) {
      const ch = channel(0.26, 1.1);
      bell(ch, 86, t, 0.7);
      bell(ch, 86, t + 0.12, 0.7);
      bell(ch, 93, t + 0.24, 0.9);
      bell(ch, 98, t + 0.24, 0.35);
      const hit = t + 0.55;
      pad(ch, [62, 69, 74, 78], hit - 0.05, { attack: 0.08, hold: 0.6, release: 0.9, peak: 0.03 });
      chord(ch, [74, 81, 86, 90, 98], hit, 0.42);
      sparkle(ch, hit + 0.05, 0.9, 7, 0.06);
      return 2.4;
    },
    // Serie verlängert (Erfolge): Die Flamme faucht auf, der heutige Punkt
    // der Woche ploppt mit zwei Tönen.
    serie(t) {
      const ch = channel(0.2);
      flame(ch, t, 1);
      const p = t + 0.12;
      pop(ch, p, 0.2);
      bell(ch, 81, p, 0.55);
      bell(ch, 86, p + 0.09, 0.7);
      return 1;
    },
  };

  return { play: (name, t, opts = {}) => SOUNDS[name](t, opts) };
}

// ---------- Abspielen ----------

let ctx = null;
let engine = null;
let touched = false; // gab es schon eine Berührung? Vorher lässt der Browser keinen Ton zu
let quietAt = 0;     // Context-Zeit, zu der der letzte Klang verklungen ist
let sleepTimer = 0;

function wakeContext() {
  if (!ctx) {
    ctx = new AC();
    engine = makeEngine(ctx);
  }
  if (ctx.state !== 'running') ctx.resume().catch(() => {});
}

// Ein laufender AudioContext hält am Handy die Audio-Hardware wach und kostet
// Akku – nach dem letzten Ton schläft er deshalb wieder ein.
function sleepLater(seconds) {
  clearTimeout(sleepTimer);
  sleepTimer = setTimeout(() => {
    if (ctx.state === 'running') ctx.suspend().catch(() => {});
  }, seconds * 1000);
}

// Spielt einen Klang, sofern Soundeffekte eingeschaltet sind. Ein Fehler beim
// Abspielen darf nie die Übung aufhalten – dann bleibt es eben still.
// Vor der ersten Berührung (etwa wenn die App direkt auf „Erfolge“ startet)
// bleibt es ebenfalls still: Der Ton käme sonst verspätet beim nächsten Tippen.
export function sound(name, opts) {
  if (!AC || !touched || !state.settings.sounds) return;
  try {
    wakeContext();
    const start = ctx.currentTime + 0.02;
    quietAt = Math.max(quietAt, start + engine.play(name, start, opts));
    sleepLater(quietAt - ctx.currentTime + 3); // + Nachklang
  } catch (e) {
    console.warn('Klang konnte nicht abgespielt werden:', e);
  }
}

// Am iPhone darf Web Audio erst nach einer Berührung starten. Jede Berührung
// weckt den Context deshalb vorsorglich – so klingen auch die Feiern, die
// zeitversetzt nach dem letzten Tippen kommen.
function onTouch() {
  touched = true;
  if (!AC || !state.settings.sounds) return;
  try {
    wakeContext();
    sleepLater(Math.max(0, quietAt - ctx.currentTime) + 3);
  } catch (e) {
    // ohne Klang geht es auch
  }
}
for (const type of ['click', 'touchend', 'keydown']) {
  addEventListener(type, onTouch, { capture: true, passive: true });
}
