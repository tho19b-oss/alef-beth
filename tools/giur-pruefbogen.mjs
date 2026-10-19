// Prüfbogen für die Giur-Antworten: macht aus den Daten in data/giur/<teil>.js
// ein druckfähiges Dokument (HTML, A4), das ein Rabbiner oder Lehrer durchgehen
// und mit Haken und Anmerkungen versehen kann.
//
//   node tools/giur-pruefbogen.mjs kaschrut [ausgabe.html]
//
// Als PDF: die HTML-Datei im Browser öffnen und „Drucken → Als PDF speichern“,
// oder Chrome headless mit --print-to-pdf.

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { getTeil, TEILE, TYPE_LABEL, STATUS_LABEL } from '../data/giur.js';

const teilId = process.argv[2];
const teil = getTeil(teilId);
if (!teil || !teil.fragen.length) {
  const verfuegbar = TEILE.filter((t) => t.fragen.length).map((t) => t.id).join(', ');
  console.error(`Teil „${teilId ?? ''}“ gibt es nicht oder er ist noch nicht aufbereitet. Verfügbar: ${verfuegbar}`);
  process.exit(1);
}
const out = process.argv[3] || `Giur-Pruefbogen-${teil.id}.html`;

const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[c]));

// Hebräische Schrift der App einbetten, damit Druck und PDF überall gleich aussehen.
const fontFile = fileURLToPath(new URL('../fonts/frankruhllibre-hebrew.woff2', import.meta.url));
const fontData = readFileSync(fontFile).toString('base64');

const datum = new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
const klaerung = teil.fragen.filter((q) => q.check);

const frage = (q) => `
  <section class="frage">
    <h2><span class="nr">${q.nr}</span> ${esc(q.q)}</h2>
    ${q.sub?.length ? `<ol class="sub" type="a">${q.sub.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>` : ''}
    <p class="meta">${TYPE_LABEL[q.type]} · ${STATUS_LABEL[q.status]}</p>
    <p class="label">${q.type === 'persoenlich' ? 'Worauf es ankommt (persönliche Antwort)' : 'Antwort-Entwurf'}</p>
    <p class="kurz">${esc(q.kurz)}</p>
    ${q.punkte?.length ? `<ul>${q.punkte.map((p) => `<li>${esc(p)}</li>`).join('')}</ul>` : ''}
    ${(q.hebrew || []).map((h) => `
      <div class="hebrew">
        <p class="label">${esc(h.label)}</p>
        <p class="he" lang="he" dir="rtl">${esc(h.text)}</p>
        ${h.translit ? `<p class="small">${esc(h.translit)}</p>` : ''}
        ${h.de ? `<p class="small">${esc(h.de)}</p>` : ''}
      </div>`).join('')}
    ${q.quelle ? `<p class="small">Quelle: ${esc(q.quelle)}</p>` : ''}
    ${q.check ? `<p class="klaeren"><b>Zu klären:</b> ${esc(q.check)}</p>` : ''}
    <div class="pruefung">
      <span class="box">stimmt so</span><span class="box">mit Änderung</span><span class="box">falsch</span>
      <span class="anm">Anmerkung:</span>
      <div class="zeilen"></div>
    </div>
  </section>`;

const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<title>Giur-Wissen, Teil ${teil.nr}: ${esc(teil.title)} – Antwort-Entwürfe zur Prüfung</title>
<style>
  @font-face { font-family: "Frank Ruhl Libre Hebrew"; src: url(data:font/woff2;base64,${fontData}) format("woff2"); font-weight: 400 700; }
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font: 11pt/1.45 "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #222; margin: 0; }
  h1 { font-size: 20pt; margin: 0 0 2mm; }
  h2 { font-size: 12pt; margin: 0 0 2mm; line-height: 1.35; }
  .untertitel { color: #555; margin: 0 0 6mm; }
  .hinweis { border: 1.5px solid #b8860b; background: #fff8e1; padding: 4mm 5mm; border-radius: 3mm; margin-bottom: 6mm; }
  .hinweis p { margin: 0 0 2mm; } .hinweis p:last-child { margin: 0; }
  .liste { margin: 0 0 8mm; padding-left: 6mm; } .liste li { margin-bottom: 1.5mm; }
  .frage { border-top: 1px solid #bbb; padding: 4mm 0 5mm; break-inside: avoid; }
  .nr { display: inline-block; min-width: 8mm; padding: 0 2mm; margin-right: 2mm; border-radius: 4mm; background: #eee; text-align: center; font-weight: 700; }
  .meta { color: #777; font-size: 9pt; margin: 0 0 2mm; }
  .label { font-size: 8.5pt; letter-spacing: .06em; text-transform: uppercase; color: #a33; font-weight: 700; margin: 2mm 0 1mm; }
  .kurz { margin: 0 0 2mm; }
  ul { margin: 0 0 2mm; padding-left: 6mm; } li { margin-bottom: 1mm; }
  .sub { margin: 0 0 2mm; padding-left: 9mm; }
  .small { font-size: 9.5pt; color: #555; margin: 0 0 1mm; }
  .hebrew { margin: 2mm 0; padding: 2mm 4mm; background: #f6f1e7; border-radius: 2mm; }
  .he { font: 400 17pt/1.7 "Frank Ruhl Libre Hebrew", "David", "Times New Roman", serif; margin: 0 0 1mm; }
  .klaeren { background: #e8eefc; border-radius: 2mm; padding: 2mm 3mm; margin: 2mm 0; }
  .pruefung { margin-top: 3mm; font-size: 10pt; }
  .box { display: inline-block; margin-right: 6mm; }
  .box::before { content: ""; display: inline-block; width: 3.4mm; height: 3.4mm; border: 1.2px solid #444; margin-right: 1.5mm; vertical-align: -0.5mm; }
  .anm { color: #555; }
  .zeilen { height: 14mm; background: repeating-linear-gradient(to bottom, transparent 0, transparent 6.5mm, #bbb 6.5mm, #bbb 6.9mm); }
  @media screen { body { max-width: 190mm; margin: 8mm auto; padding: 0 6mm; } }
</style>
</head>
<body>
  <h1>Giur-Wissen – Teil ${teil.nr}: ${esc(teil.title)}</h1>
  <p class="untertitel">Antwort-Entwürfe zur Prüfung · ${teil.fragen.length} Fragen · Stand ${datum}</p>

  <div class="hinweis">
    <p><b>Bitte prüfen.</b> Die Fragen stammen wörtlich aus dem Prüfungskatalog fürs Beit Din. Die Antworten sind
    Entwürfe, die von keinem Rabbiner geprüft sind; sie sollen nur als Grundlage dienen.</p>
    <p>Bei jeder Frage bitte ankreuzen, ob die Antwort stimmt, geändert werden muss oder falsch ist, und
    bei Bräuchen den Maßstab des Lehrers bzw. des Beit Din angeben (z. B. Wartezeit zwischen Fleisch und Milch,
    Maße, anerkannte Siegel). Mit „Zu klären“ sind Stellen markiert, an denen Bräuche oder Meinungen auseinandergehen oder
    die Frage im Katalog unklar ist.</p>
  </div>

  ${klaerung.length ? `
  <h2>Klärungsliste (${klaerung.length} Fragen)</h2>
  <ol class="liste" style="list-style: none; padding-left: 0">
    ${klaerung.map((q) => `<li><b>${q.nr}.</b> ${esc(q.check)}</li>`).join('')}
  </ol>` : ''}

  ${teil.fragen.map(frage).join('')}
</body>
</html>
`;

writeFileSync(out, html);
console.log(`${out}: ${teil.fragen.length} Fragen, ${klaerung.length} mit Klärungsbedarf`);
