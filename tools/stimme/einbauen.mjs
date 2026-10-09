// Baut ein Paket aus der Stimmen-Werkstatt in die App ein:
//   node tools/stimme/einbauen.mjs <alef-beth-stimme.zip>
//
// Jeder Clip wird mit ffmpeg gesäubert – Stille vorn und hinten weg, Spitze
// auf −2 dBFS, kurze Blenden, MP3 mono 64 kbit/s – und landet als
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
const PEAK_DB = -2;
// Stille vorn bis auf 30 ms und hinten bis auf 60 ms abschneiden.
const TRIM = 'silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.03,'
  + 'areverse,silenceremove=start_periods=1:start_threshold=-50dB:start_silence=0.06,areverse';

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

function run(cmd, args) {
  const res = spawnSync(cmd, args, { encoding: 'utf8' });
  if (res.error) throw new Error(`${cmd} fehlt: ${res.error.message}`);
  if (res.status !== 0) throw new Error(`${cmd}: ${res.stderr.trim().split('\n').slice(-2).join(' ')}`);
  return res;
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

function encode(input, output, gain) {
  run('ffmpeg', ['-hide_banner', '-nostdin', '-y', '-i', input,
    '-af', `${TRIM},volume=${gain.toFixed(2)}dB,afade=t=in:d=0.005,areverse,afade=t=in:d=0.005,areverse`,
    '-ac', '1', '-ar', '44100', '-c:a', 'libmp3lame', '-b:a', '64k', output]);
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
      encode(raw, out, PEAK_DB - peak(raw, TRIM));
      done.push({ key: e.key, peak: peak(out, 'anull'), duration: duration(out), bytes: statSync(out).size });
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
console.log(`Eingebaut: ${done.length} Clips, Stimme „${index.stimme}“.`);
if (done.length) {
  const secs = done.map((d) => d.duration);
  const peaks = done.map((d) => d.peak);
  console.log(`Dauer ${Math.min(...secs).toFixed(2)}–${Math.max(...secs).toFixed(2)} s, `
    + `Spitze ${Math.min(...peaks).toFixed(1)} bis ${Math.max(...peaks).toFixed(1)} dB, `
    + `zusammen ${Math.round(done.reduce((n, d) => n + d.bytes, 0) / 1024)} KB.`);
}
if (before.stimme && info.stimme && before.stimme !== info.stimme) {
  console.log(`Achtung: Bisher sprach „${before.stimme}“, das Paket ist von „${info.stimme}“.`);
}
if (problems.length) console.log(`Nicht eingebaut:\n  ${problems.join('\n  ')}`);
if (extra.length) console.log(`Im Paket, aber ohne Text in der App (ignoriert): ${extra.join(', ')}`);
const missing = entries.filter((e) => !existsSync(join(OUT, `${e.key}.mp3`)));
if (missing.length) console.log(`Noch ohne Clip (${missing.length}): ${missing.map((e) => e.key).join(', ')}`);
console.log(`audio/he/index.json: ${present.length} von ${entries.length} Texten.`);
