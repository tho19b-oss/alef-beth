// Prüfbogen für die Giur-Antworten: macht aus den Daten in data/giur/<teil>.js
// ein ausfüllbares HTML-Dokument. Ein Rabbiner oder Lehrer (oder du selbst im
// Gespräch mit ihm) beurteilt jede Antwort – stimmt, mit Änderung, falsch – und
// schreibt Anmerkungen dazu. Alles speichert der Browser von selbst; das Ergebnis
// lässt sich als Text kopieren oder als Datei speichern und später wieder laden.
//
//   node tools/giur-pruefbogen.mjs kaschrut [ausgabe.html]
//
// Drucken: im Browser „Drucken → Als PDF speichern“ (die Werkzeugleiste bleibt weg).

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

// Hebräische Schrift der App einbetten, damit Anzeige und Druck überall gleich aussehen.
const fontFile = fileURLToPath(new URL('../fonts/frankruhllibre-hebrew.woff2', import.meta.url));
const fontData = readFileSync(fontFile).toString('base64');

const datum = new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
const klaerung = teil.fragen.filter((q) => q.check);

const frage = (q) => `
  <section class="frage" id="q-${q.id}">
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
    <fieldset class="pruefung">
      <legend>Beurteilung zu Frage ${q.nr}</legend>
      <label class="wahl w-stimmt"><input type="radio" name="u-${q.id}" value="stimmt"> stimmt so</label>
      <label class="wahl w-aenderung"><input type="radio" name="u-${q.id}" value="aenderung"> mit Änderung</label>
      <label class="wahl w-falsch"><input type="radio" name="u-${q.id}" value="falsch"> falsch</label>
      <label class="notiz">Anmerkung oder korrigierte Antwort
        <textarea name="n-${q.id}" rows="2" placeholder="Hier schreiben …"></textarea>
      </label>
    </fieldset>
  </section>`;

// Läuft im Browser: wird als Quelltext ins Dokument gesetzt und dort ausgeführt.
function client(cfg) {
  const KEY = `giur-pruefbogen:${cfg.teil}`;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const URTEIL = { stimmt: 'stimmt so', aenderung: 'MIT ÄNDERUNG', falsch: 'FALSCH' };
  const sec = (id) => document.getElementById(`q-${id}`);
  const toast = $('#meldung');
  const speicherstand = $('#speicherstand');
  let toastTimer = null;
  function melden(t) {
    toast.textContent = t;
    toast.classList.add('sichtbar');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('sichtbar'), 4500);
  }

  function lesen() {
    const antworten = {};
    for (const f of cfg.fragen) {
      const urteil = $('input[type=radio]:checked', sec(f.id))?.value || '';
      const notiz = $('textarea', sec(f.id)).value.trim();
      if (urteil || notiz) antworten[f.id] = { urteil, notiz };
    }
    return {
      format: 'giur-pruefbogen-v1',
      teil: cfg.teil,
      geprueftVon: $('#von').value.trim(),
      datum: $('#datum').value.trim(),
      antworten,
    };
  }

  function setzen(data) {
    $('#von').value = data.geprueftVon || '';
    $('#datum').value = data.datum || '';
    for (const f of cfg.fragen) {
      const a = data.antworten?.[f.id] || { urteil: '', notiz: '' };
      $$('input[type=radio]', sec(f.id)).forEach((r) => { r.checked = r.value === a.urteil; });
      $('textarea', sec(f.id)).value = a.notiz || '';
    }
    aktualisieren();
  }

  function text() {
    const d = lesen();
    const z = Object.values(d.antworten).filter((a) => a.urteil);
    const n = (u) => z.filter((a) => a.urteil === u).length;
    const zeilen = [
      `Giur-Prüfbogen Teil ${cfg.nr}: ${cfg.titel}`,
      `Geprüft von: ${d.geprueftVon || '–'}   Datum: ${d.datum || '–'}`,
      `${z.length} von ${cfg.fragen.length} Fragen beurteilt (stimmt: ${n('stimmt')}, mit Änderung: ${n('aenderung')}, falsch: ${n('falsch')})`,
      '',
    ];
    for (const f of cfg.fragen) {
      const a = d.antworten[f.id];
      if (!a) continue;
      const kopf = `Frage ${f.nr} (${f.q.length > 70 ? `${f.q.slice(0, 67)}…` : f.q})`;
      const u = a.urteil ? URTEIL[a.urteil] : 'keine Beurteilung';
      zeilen.push(`${kopf} – ${u}${a.notiz ? `: ${a.notiz}` : ''}`);
    }
    return zeilen.join('\n');
  }

  function hoehe(t) {
    t.style.height = 'auto';
    t.style.height = `${Math.max(t.scrollHeight, 44)}px`;
  }

  function aktualisieren() {
    let beurteilt = 0;
    for (const f of cfg.fragen) {
      const s = sec(f.id);
      const u = $('input[type=radio]:checked', s)?.value || '';
      s.classList.remove('u-stimmt', 'u-aenderung', 'u-falsch');
      if (u) { s.classList.add(`u-${u}`); beurteilt += 1; }
      hoehe($('textarea', s));
    }
    $('#fortschritt-text').textContent = `${beurteilt} von ${cfg.fragen.length} beurteilt`;
    $('#fortschritt').style.width = `${Math.round((beurteilt / cfg.fragen.length) * 100)}%`;
  }

  let timer = null;
  function speichern() {
    aktualisieren();
    clearTimeout(timer);
    timer = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(lesen()));
        speicherstand.textContent = '✓ gespeichert';
      } catch {
        speicherstand.textContent = '⚠ nicht gespeichert';
        melden('Achtung: In diesem Browser lässt sich nicht automatisch speichern. Bitte regelmäßig „Als Datei speichern“ drücken.');
      }
    }, 300);
  }

  // Ein zweiter Klick auf die schon gewählte Beurteilung nimmt sie wieder zurück.
  $$('.wahl').forEach((l) => {
    const r = $('input', l);
    l.addEventListener('mousedown', () => { r.dataset.war = r.checked ? '1' : ''; });
    r.addEventListener('click', () => {
      if (r.dataset.war === '1') r.checked = false;
      r.dataset.war = '';
      speichern();
    });
  });
  $$('textarea, #von, #datum').forEach((e) => e.addEventListener('input', speichern));

  function kopieren(t) {
    if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(t);
    const ta = document.createElement('textarea');
    ta.value = t;
    document.body.append(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    return Promise.resolve();
  }

  $('#b-kopieren').addEventListener('click', () => {
    kopieren(text())
      .then(() => melden('Ergebnis als Text kopiert – jetzt in den Chat einfügen oder per Mail schicken.'))
      .catch(() => melden('Kopieren hat nicht geklappt. Bitte „Als Datei speichern“ nehmen.'));
  });
  $('#b-speichern').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(lesen(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `Giur-Pruefbogen-${cfg.teil}-Ergebnis.json`;
    document.body.append(a);
    a.click();
    a.remove();
    melden('Datei gespeichert (meist im Ordner „Downloads“).');
  });
  $('#b-laden').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    file.text().then((t) => {
      const data = JSON.parse(t);
      if (data.format !== 'giur-pruefbogen-v1' || data.teil !== cfg.teil) throw new Error('falsche Datei');
      setzen(data);
      speichern();
      melden('Datei geladen.');
    }).catch(() => melden('Diese Datei passt nicht zu diesem Prüfbogen.'));
    e.target.value = '';
  });
  $('#b-weiter').addEventListener('click', () => {
    const offen = cfg.fragen.find((f) => !$('input[type=radio]:checked', sec(f.id)));
    if (!offen) { melden('Alle Fragen sind beurteilt.'); return; }
    sec(offen.id).scrollIntoView({ behavior: 'smooth', block: 'start' });
    $('input', sec(offen.id)).focus({ preventScroll: true });
  });
  $('#b-drucken').addEventListener('click', () => window.print());
  $('#b-zurueck').addEventListener('click', () => {
    if (!confirm('Wirklich alle Beurteilungen und Anmerkungen löschen?')) return;
    setzen({ antworten: {} });
    try { localStorage.removeItem(KEY); } catch { /* nichts zu löschen */ }
    melden('Alles gelöscht.');
  });

  // Das „Mehr“-Menü klappt nach einer Auswahl oder einem Klick daneben wieder zu.
  const mehr = $('.mehr');
  $$('button', mehr).forEach((b) => b.addEventListener('click', () => { setTimeout(() => { mehr.open = false; }, 0); }));
  $('#b-laden').addEventListener('change', () => { mehr.open = false; });
  document.addEventListener('click', (e) => { if (!mehr.contains(e.target)) mehr.open = false; });
  window.addEventListener('beforeprint', aktualisieren);

  try {
    const alt = localStorage.getItem(KEY);
    if (alt) {
      setzen(JSON.parse(alt));
      speicherstand.textContent = '✓ gespeichert';
      melden('Frühere Eingaben wurden wiederhergestellt.');
    }
  } catch { /* ohne Speicher einfach leer starten */ }
  aktualisieren();

  // Für Tests und Notfälle: window.giurPruefbogen.text()
  window.giurPruefbogen = { lesen, text, setzen };
}

const cfg = {
  teil: teil.id,
  nr: teil.nr,
  titel: teil.title,
  fragen: teil.fragen.map((q) => ({ id: q.id, nr: q.nr, q: q.q })),
};
// Im Skript-Element darf kein „<“ stehen, das ein Tag öffnen könnte.
const cfgJson = JSON.stringify(cfg).split('<').join(`${String.fromCharCode(92)}u003c`);

const html = `<!doctype html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Giur-Wissen, Teil ${teil.nr}: ${esc(teil.title)} – Prüfbogen</title>
<style>
  @font-face { font-family: "Frank Ruhl Libre Hebrew"; src: url(data:font/woff2;base64,${fontData}) format("woff2"); font-weight: 400 700; }
  @page { size: A4; margin: 18mm 16mm; }
  * { box-sizing: border-box; }
  body { font: 11pt/1.45 "Segoe UI", Roboto, Helvetica, Arial, sans-serif; color: #222; margin: 0; background: #fff; }
  .seite { max-width: 190mm; margin: 0 auto; padding: 0 5mm 20mm; }
  h1 { font-size: 20pt; margin: 6mm 0 2mm; }
  h2 { font-size: 12pt; margin: 0 0 2mm; line-height: 1.35; }
  .untertitel { color: #555; margin: 0 0 6mm; }
  .hinweis { border: 1.5px solid #b8860b; background: #fff8e1; padding: 4mm 5mm; border-radius: 3mm; margin-bottom: 6mm; }
  .hinweis p { margin: 0 0 2mm; } .hinweis p:last-child { margin: 0; }
  .kopf { display: flex; flex-wrap: wrap; gap: 4mm; margin-bottom: 6mm; }
  .kopf label { display: grid; gap: 1mm; font-size: 9.5pt; color: #555; flex: 1 1 60mm; }
  .kopf input { font: inherit; color: #222; padding: 2mm 3mm; border: 1.5px solid #999; border-radius: 2mm; }
  .liste { margin: 0 0 8mm; padding: 0; list-style: none; } .liste li { margin-bottom: 1.5mm; }
  .liste a { color: inherit; text-decoration: none; } .liste a:hover b { text-decoration: underline; }
  .frage { border-top: 1px solid #bbb; border-left: 5px solid transparent; padding: 4mm 0 5mm 4mm; break-inside: avoid; scroll-margin-top: 28mm; }
  .frage.u-stimmt { border-left-color: #0d8460; background: #f2faf6; }
  .frage.u-aenderung { border-left-color: #e08a00; background: #fff8ec; }
  .frage.u-falsch { border-left-color: #c22d48; background: #fdf1f3; }
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
  .pruefung { margin: 3mm 0 0; padding: 0; border: 0; display: flex; flex-wrap: wrap; align-items: center; gap: 2mm 6mm; font-size: 10.5pt; }
  .pruefung legend { position: absolute; width: 1px; height: 1px; overflow: hidden; clip: rect(0 0 0 0); }
  .wahl { display: inline-flex; align-items: center; gap: 2mm; min-height: 9mm; cursor: pointer; }
  .wahl input { width: 5mm; height: 5mm; margin: 0; accent-color: #444; }
  .w-stimmt input { accent-color: #0d8460; } .w-aenderung input { accent-color: #e08a00; } .w-falsch input { accent-color: #c22d48; }
  .notiz { flex: 1 1 100%; display: grid; gap: 1mm; font-size: 9pt; color: #555; }
  .notiz textarea { font-family: inherit; font-size: 11pt; line-height: 1.4; color: #222; width: 100%; min-height: 44px; padding: 2mm 3mm; border: 1.5px solid #bbb; border-radius: 2mm; resize: vertical; background: #fff; }
  .werkzeug { position: sticky; top: 0; z-index: 5; background: #fff; border-bottom: 1px solid #ccc; padding: 2.5mm 5mm; }
  .werkzeug-innen { max-width: 190mm; margin: 0 auto; display: grid; gap: 2mm; }
  .zeile { display: flex; gap: 2mm; align-items: center; }
  .balken { flex: 1 1 20mm; height: 3mm; border-radius: 2mm; background: #e7e2d8; overflow: hidden; }
  #speicherstand { font-size: 9pt; color: #777; white-space: nowrap; }
  .mehr { position: relative; margin-left: auto; }
  .mehr summary { list-style: none; font-size: 10pt; padding: 2mm 3.5mm; border: 1.5px solid #888; border-radius: 2mm; background: #fff; cursor: pointer; user-select: none; }
  .mehr summary::-webkit-details-marker { display: none; }
  .mehr[open] summary { background: #f2f2f2; }
  .mehr-liste { position: absolute; right: 0; top: calc(100% + 2mm); z-index: 6; display: grid; gap: 2mm; min-width: 52mm; padding: 3mm; background: #fff; border: 1.5px solid #888; border-radius: 3mm; box-shadow: 0 4px 14px #0003; }
  .mehr-liste button, .mehr-liste .datei { text-align: left; }
  .balken i { display: block; height: 100%; width: 0; background: #0d8460; transition: width .25s; }
  #fortschritt-text { font-size: 10pt; font-weight: 600; white-space: nowrap; }
  button, .datei { font: inherit; font-size: 10pt; padding: 2mm 3.5mm; border: 1.5px solid #888; border-radius: 2mm; background: #fff; color: #222; cursor: pointer; }
  button:hover, .datei:hover { background: #f2f2f2; }
  button.haupt { background: #0d8460; border-color: #0d8460; color: #fff; font-weight: 600; }
  button.haupt:hover { background: #0a7454; }
  .datei input { display: none; }
  #meldung { position: fixed; left: 50%; bottom: 14px; z-index: 9; transform: translateX(-50%); max-width: min(92vw, 150mm); padding: 2.5mm 4mm; border-radius: 3mm; background: #2a2a2a; color: #fff; font-size: 10pt; opacity: 0; pointer-events: none; transition: opacity .2s; }
  #meldung.sichtbar { opacity: 1; }
  @media (max-width: 600px) { body { font-size: 10.5pt; } .werkzeug { padding: 2mm 3mm; } .seite { padding: 0 3mm 20mm; } }
  @media print {
    .werkzeug, #meldung { display: none !important; }
    .seite { max-width: none; padding: 0; }
    .frage.u-stimmt, .frage.u-aenderung, .frage.u-falsch { background: none; }
    .kopf input, .notiz textarea { border-color: #888; }
  }
</style>
</head>
<body>
  <div class="werkzeug">
    <div class="werkzeug-innen">
      <div class="zeile">
        <span id="fortschritt-text">0 von ${teil.fragen.length} beurteilt</span>
        <div class="balken" aria-hidden="true"><i id="fortschritt"></i></div>
        <span id="speicherstand"></span>
      </div>
      <div class="zeile">
        <button type="button" class="haupt" id="b-weiter">Nächste offene Frage</button>
        <button type="button" id="b-kopieren">Als Text kopieren</button>
        <details class="mehr">
          <summary>Mehr</summary>
          <div class="mehr-liste">
            <button type="button" id="b-speichern">Als Datei speichern</button>
            <label class="datei">Datei laden<input type="file" id="b-laden" accept=".json,application/json"></label>
            <button type="button" id="b-drucken">Drucken / PDF</button>
            <button type="button" id="b-zurueck">Alles löschen</button>
          </div>
        </details>
      </div>
    </div>
  </div>
  <div id="meldung" role="status" aria-live="polite"></div>

  <div class="seite">
    <h1>Giur-Wissen – Teil ${teil.nr}: ${esc(teil.title)}</h1>
    <p class="untertitel">Antwort-Entwürfe zur Prüfung · ${teil.fragen.length} Fragen · Stand ${datum}</p>

    <div class="hinweis">
      <p><b>Bitte prüfen.</b> Die Fragen stammen wörtlich aus dem Prüfungskatalog fürs Beit Din. Die Antworten sind
      Entwürfe, die von keinem Rabbiner geprüft sind; sie sollen nur als Grundlage dienen.</p>
      <p>Bei jeder Frage bitte wählen, ob die Antwort stimmt, geändert werden muss oder falsch ist, und
      bei Bräuchen den Maßstab des Lehrers bzw. des Beit Din angeben (z. B. Wartezeit zwischen Fleisch und Milch,
      Maße, anerkannte Siegel). Mit „Zu klären“ sind Stellen markiert, an denen Bräuche oder Meinungen auseinandergehen oder
      die Frage im Katalog unklar ist. Die Eingaben speichert der Browser von selbst.</p>
    </div>

    <div class="kopf">
      <label>Geprüft von (Name, Funktion)<input type="text" id="von" autocomplete="off"></label>
      <label>Datum<input type="text" id="datum" autocomplete="off" placeholder="z. B. 20.10.2026"></label>
    </div>

    ${klaerung.length ? `
    <h2>Klärungsliste (${klaerung.length} Fragen)</h2>
    <ol class="liste">
      ${klaerung.map((q) => `<li><a href="#q-${q.id}"><b>${q.nr}.</b> ${esc(q.check)}</a></li>`).join('')}
    </ol>` : ''}

    ${teil.fragen.map(frage).join('')}
  </div>
<script>(${client.toString()})(${cfgJson});</script>
</body>
</html>
`;

writeFileSync(out, html);
console.log(`${out}: ${teil.fragen.length} Fragen, ${klaerung.length} mit Klärungsbedarf`);
