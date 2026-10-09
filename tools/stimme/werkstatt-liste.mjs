// Schreibt die Sprechtexte der App in die Stimmen-Werkstatt (werkstatt.html).
// Nach jeder Änderung an den Daten aufrufen:  node tools/stimme/werkstatt-liste.mjs
import { readFileSync, writeFileSync } from 'node:fs';
import { speechEntries } from '../../data/curriculum.js';

// Die Probe: Texte, an denen sich eine Stimme bewähren muss – Lautvarianten,
// Schwa und Chataf, ein Kehllaut und zwei ganze Wörter.
const PROBE = [
  'var-bet', 'var-bet-dagesch', 'var-kaf', 'var-kaf-dagesch', 'var-shin', 'var-shin-sin',
  'syl-schschwa', 'chataf-segol', 'syl-cha', 'chet', 'w-shalom', 'w-baruch',
];

const entries = speechEntries();
const keys = new Set(entries.map((e) => e.key));
for (const key of PROBE) {
  if (!keys.has(key)) throw new Error(`Probe-Eintrag fehlt in den Daten: ${key}`);
}

const file = new URL('./werkstatt.html', import.meta.url);
const html = readFileSync(file, 'utf8');
const slot = /(<script type="application\/json" id="eintraege">)[\s\S]*?(<\/script>)/;
if (!slot.test(html)) throw new Error('Platz für die Liste in werkstatt.html nicht gefunden');
// „<“ maskiert, damit kein Text das Script-Element beenden kann.
const json = JSON.stringify({ eintraege: entries, probe: PROBE }).replace(/</g, '\\u003c');
writeFileSync(file, html.replace(slot, (_, open, close) => open + json + close));
console.log(`${entries.length} Einträge in werkstatt.html geschrieben (Probe: ${PROBE.length}).`);
