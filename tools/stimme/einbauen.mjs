// Baut ein Paket aus der Stimmen-Werkstatt in die App ein:
//   node tools/stimme/einbauen.mjs <alef-beth-stimme.zip>
//
// Jeder Clip wird mit ffmpeg gesäubert – auf das Gesprochene zugeschnitten,
// auf gleiche Lautheit gebracht (Spitze höchstens −2 dBFS), kurze Blenden,
// MP3 mono 64 kbit/s – und landet als
// audio/he/<key>.mp3. Danach entsteht audio/he/index.json neu. Ein Paket mit
// nur einigen Clips (z. B. für neue Wörter) ergänzt die vorhandenen; Clips,
// zu denen es keinen Text mehr gibt, fliegen raus.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { basename, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { inflateRawSync } from 'node:zlib';
import { speechEntries } from '../../data/curriculum.js';

const OUT = fileURLToPath(new URL('../../audio/he/', import.meta.url));
// Lautheit = lautestes 100-ms-Stück (RMS). Lässt die Spitze das Ziel nicht
// zu, bleibt der Clip etwas leiser.
const LOUD_DB = -11;
const PEAK_DB = -2;
const RATE = 44100;
const FRAME = RATE / 100; // 10 ms
// Gesprochen ist, was höchstens 30 dB unter dem lautesten Fenster liegt, samt
// Pausen bis 0,3 s; an den Rändern zählt alles bis 40 dB darunter dazu.
const CORE_DB = 30;
const EDGE_DB = 40;
const GAP = 30;
// Vor dem ersten Laut 30 ms stehen lassen, nach dem letzten 80 ms.
const LEAD = 0.03;
const TAIL = 0.08;

// ZIP lesen: ohne Kompression wie aus der Werkstatt oder mit „Deflate“, falls
// das Paket unterwegs neu gepackt wurde.
function readZip(buf) {
  let eocd = buf.length - 22;
  while (eocd >= 0 && buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error('Das ist keine ZIP-Datei.');
  const files = new Map();
  let p = buf.readUInt32LE(eocd + 16);
  for (let i = buf.readUInt16LE(eocd + 10); i > 0; i--) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error('Die ZIP-Datei ist beschädigt.');
    const method = buf.readUInt16LE(p + 10);
    const packed = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const local = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nameLen);
    const start = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const raw = buf.subarray(start, start + packed);
    if (!name.endsWith('/')) {
      if (method !== 0 && method !== 8) throw new Error(`${name}: unbekannte Kompression ${method}`);
      files.set(basename(name), method === 8 ? inflateRawSync(raw) : raw);
    }
    p += 46 + nameLen + buf.readUInt16LE(p + 30) + buf.readUInt16LE(p + 32);
  }
  return files;
}

function run(cmd, args, binary = false) {
  const res = spawnSync(cmd, args, { encoding: binary ? 'buffer' : 'utf8', maxBuffer: 1 << 28 });
  if (res.error) throw new Error(`${cmd} fehlt: ${res.error.message}`);
  if (res.status !== 0) throw new Error(`${cmd}: ${String(res.stderr).trim().split('\n').slice(-2).join(' ')}`);
  return res;
}

// Pegel in 10-ms-Fenstern (RMS in dBFS).
function levels(file) {
  const pcm = run('ffmpeg', ['-v', 'error', '-nostdin', '-i', file, '-ac', '1', '-ar', String(RATE), '-f', 's16le', '-'], true).stdout;
  const samples = pcm.length >> 1;
  const db = [];
  for (let s = 0; s < samples; s += FRAME) {
    const n = Math.min(FRAME, samples - s);
    let sum = 0;
    for (let k = 0; k < n; k++) sum += (pcm.readInt16LE((s + k) * 2) / 32768) ** 2;
    db.push(10 * Math.log10(sum / n + 1e-12));
  }
  return db;
}

// Wo wird gesprochen? ElevenLabs hängt manchmal nach langer Stille noch einen
// kurzen Laut ans Dateiende; der bleibt draußen. Reicht die Sprache bis ans
// Ende, ist der Clip womöglich abgeschnitten.
function speech(db) {
  const max = db.length ? Math.max(...db) : -Infinity;
  if (max < -60) throw new Error('Der Clip ist still.');
  const parts = [];
  db.forEach((d, i) => {
    if (d < max - CORE_DB) return;
    const prev = parts.at(-1);
    if (prev && i - prev[1] <= GAP) prev[1] = i;
    else parts.push([i, i]);
  });
  const end = parts.at(-1);
  const rest = parts.length > 1 && end[1] >= db.length - 5 && end[1] - end[0] < 25;
  if (rest) parts.pop();
  let first = parts[0][0];
  let last = parts.at(-1)[1];
  while (first > 0 && db[first - 1] >= max - EDGE_DB) first--;
  while (last < db.length - 1 && db[last + 1] >= max - EDGE_DB) last++;
  return {
    from: Math.max(0, first / 100 - LEAD),
    to: Math.min(db.length / 100, (last + 1) / 100 + TAIL),
    loud: loudness(db.slice(first, last + 1)),
    parts: parts.length,
    rest,
    cut: last >= db.length - 2,
  };
}

function loudness(db) {
  const energy = db.map((d) => 10 ** (d / 10));
  let best = 0;
  for (let i = 0; i === 0 || i + 10 <= energy.length; i++) {
    const w = energy.slice(i, i + 10);
    best = Math.max(best, w.reduce((a, b) => a + b, 0) / w.length);
  }
  return 10 * Math.log10(best);
}

// Spitzenpegel in dB, gemessen nach dem Filter.
function peak(file, filter) {
  const { stderr } = run('ffmpeg', ['-hide_banner', '-nostdin', '-i', file, '-af', `${filter},volumedetect`, '-f', 'null', '-']);
  const max = Number(/max_volume: (-?[\d.]+) dB/.exec(stderr)?.[1]);
  if (!Number.isFinite(max)) throw new Error('Pegel nicht messbar – ist der Clip still?');
  return max;
}

function duration(file) {
  return Number(run('ffprobe', ['-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', file]).stdout);
}

function encode(input, output, trim, gain, length) {
  run('ffmpeg', ['-hide_banner', '-nostdin', '-y', '-i', input,
    '-af', `${trim},volume=${gain.toFixed(2)}dB,afade=t=in:d=0.005,afade=t=out:st=${Math.max(0, length - 0.04).toFixed(3)}:d=0.04`,
    '-ac', '1', '-ar', String(RATE), '-c:a', 'libmp3lame', '-b:a', '64k', output]);
}

const zipPath = process.argv[2];
if (!zipPath || !existsSync(zipPath)) {
  console.error('Aufruf: node tools/stimme/einbauen.mjs <alef-beth-stimme.zip>');
  process.exit(1);
}

const files = readZip(readFileSync(zipPath));
const info = files.has('stimme.json') ? JSON.parse(files.get('stimme.json').toString('utf8')) : {};
const entries = speechEntries();
const known = new Set(entries.map((e) => `${e.key}.mp3`));
const extra = [...files.keys()].filter((n) => n.endsWith('.mp3') && !known.has(n));

mkdirSync(OUT, { recursive: true });
const work = mkdtempSync(join(tmpdir(), 'alefbeth-stimme-'));
const done = [];
const problems = [];
try {
  for (const e of entries) {
    const data = files.get(`${e.key}.mp3`);
    if (!data) continue;
    const raw = join(work, `${e.key}.mp3`);
    const out = join(OUT, `${e.key}.mp3`);
    try {
      writeFileSync(raw, data);
      const s = speech(levels(raw));
      const trim = `atrim=start=${s.from.toFixed(3)}:end=${s.to.toFixed(3)},asetpts=PTS-STARTPTS`;
      encode(raw, out, trim, Math.min(LOUD_DB - s.loud, PEAK_DB - peak(raw, trim)), s.to - s.from);
      done.push({
        key: e.key, ...s, loud: speech(levels(out)).loud,
        peak: peak(out, 'anull'), duration: duration(out), bytes: statSync(out).size,
      });
    } catch (err) {
      problems.push(`${e.key}: ${err.message}`);
    }
  }
} finally {
  rmSync(work, { recursive: true, force: true });
}

// Alte Clips ohne Text entfernen, dann die Liste aus allem schreiben, was da ist.
for (const name of readdirSync(OUT)) {
  if (name.endsWith('.mp3') && !known.has(name)) rmSync(join(OUT, name));
}
const indexFile = join(OUT, 'index.json');
const before = existsSync(indexFile) ? JSON.parse(readFileSync(indexFile, 'utf8')) : {};
const present = entries.filter((e) => existsSync(join(OUT, `${e.key}.mp3`)));
const index = {
  stimme: info.stimme || before.stimme || 'Aufnahme',
  herkunft: info.herkunft || before.herkunft || '',
  modell: info.modell || before.modell || '',
  erzeugt: info.erzeugt || before.erzeugt || new Date().toISOString(),
  clips: Object.fromEntries(present.map((e) => [e.text, `${e.key}.mp3`])),
};
writeFileSync(indexFile, `${JSON.stringify(index, null, 2)}\n`);

// Bericht
const keys = (list) => list.map((d) => d.key).join(', ');
console.log(`Eingebaut: ${done.length} Clips, Stimme „${index.stimme}“.`);
if (done.length) {
  const span = (list, digits) => `${Math.min(...list).toFixed(digits)} bis ${Math.max(...list).toFixed(digits)}`;
  console.log(`Dauer ${span(done.map((d) => d.duration), 2)} s, `
    + `Lautheit ${span(done.map((d) => d.loud), 1)} dB, Spitze ${span(done.map((d) => d.peak), 1)} dB, `
    + `zusammen ${Math.round(done.reduce((n, d) => n + d.bytes, 0) / 1024)} KB.`);
}
const rests = done.filter((d) => d.rest);
const cut = done.filter((d) => d.cut);
const split = done.filter((d) => d.parts > 1);
if (rests.length) console.log(`Geräusch am Ende entfernt (${rests.length}): ${keys(rests)}`);
if (cut.length) console.log(`Anhören – endet womöglich mitten im Laut: ${keys(cut)}`);
if (split.length) console.log(`Anhören – längere Pause im Clip: ${keys(split)}`);
if (before.stimme && info.stimme && before.stimme !== info.stimme) {
  console.log(`Achtung: Bisher sprach „${before.stimme}“, das Paket ist von „${info.stimme}“.`);
}
if (problems.length) console.log(`Nicht eingebaut:\n  ${problems.join('\n  ')}`);
if (extra.length) console.log(`Im Paket, aber ohne Text in der App (ignoriert): ${extra.join(', ')}`);
const missing = entries.filter((e) => !existsSync(join(OUT, `${e.key}.mp3`)));
if (missing.length) console.log(`Noch ohne Clip (${missing.length}): ${missing.map((e) => e.key).join(', ')}`);
console.log(`audio/he/index.json: ${present.length} von ${entries.length} Texten.`);
