// Curriculum: Einheiten → Lektionen → Lernitems.
// Einheiten tragen eine Zierglyphe fürs Banner, Lektionen ihr Zeichen für den
// Lernpfad (hebräischer Text, keine Emoji).
// Außerdem: Item-Registry und Hilfsfunktionen für Anzeige & Distraktoren.

import { LETTERS, FINALS } from './letters.js';
import { NIKUD, SYLLABLES } from './nikud.js';
import { WORDS } from './words.js';

// ---------- Registry: jede Lern-Einheit (Buchstabe/Vokal/Silbe/Wort) unter ihrer id ----------

const REGISTRY = new Map();
LETTERS.forEach((x) => REGISTRY.set(x.id, { type: 'letter', ...x }));
FINALS.forEach((x) => REGISTRY.set(x.id, { type: 'letter', ...x }));
NIKUD.forEach((x) => REGISTRY.set(x.id, { type: 'vowel', ...x }));
SYLLABLES.forEach((x) => REGISTRY.set(x.id, { type: 'syllable', ...x }));
WORDS.forEach((x) => REGISTRY.set(x.id, { type: 'word', ...x }));

export function getItem(id) {
  const it = REGISTRY.get(id);
  if (!it) throw new Error(`Unbekanntes Lernitem: ${id}`);
  return it;
}

// Gibt es dieses Lernitem (noch)? Für gespeicherte Fortschritte, die aus einer
// älteren Datenversion stammen könnten.
export function hasItem(id) {
  return REGISTRY.has(id);
}

// ---------- Generische Anzeige-Helfer ----------

// Großes hebräisches Zeichen / Wort des Items
export function display(item) {
  if (item.type === 'letter') return item.glyph;
  if (item.type === 'vowel') return item.display;
  return item.hebrew;
}

// Hauptantwort (Optionstext): Buchstabe → Name, Vokal → Name, Silbe/Wort → Umschrift
export function mainLabel(item) {
  if (item.type === 'letter') return item.name;
  if (item.type === 'vowel') return `${item.name} – ${item.soundLabel}`;
  return item.translit;
}

// Zusatzzeile unter der Hauptantwort
export function subLabel(item) {
  if (item.type === 'letter') return item.translit;
  if (item.type === 'word') return item.meaning;
  return '';
}

// Text für die Sprachausgabe (null = nicht sprechen)
export function ttsText(item) {
  if (item.noTts) return null;
  if (item.type === 'letter') return item.ttsWord;
  if (item.type === 'vowel') return item.example;
  return item.hebrew;
}

// Silbe einer Lautvariante: die Glyphe mit Kamatz (בָ „wa“ / בָּ „ba“). NFC
// sortiert das Kamatz vor Dagesch und Schin-Punkt, wie in den Daten.
export function variantSyllable(glyph) {
  return `${glyph}\u05B8`.normalize('NFC');
}

// Alles, was die Stimme sprechen kann, jeder Text einmal. key benennt die
// Audiodatei (audio/he/<key>.mp3), label und gruppe helfen beim Erzeugen.
// Der Gottesname fehlt, weil ttsText für ihn nichts liefert.
export function speechEntries() {
  const entries = [];
  const seen = new Set();
  const add = (key, text, label, gruppe) => {
    if (!text) return;
    const nfc = text.normalize('NFC');
    if (seen.has(nfc)) return;
    seen.add(nfc);
    entries.push({ key, text: nfc, label, gruppe });
  };
  // Laut einer Variante als Silbe mit a: „w / b“ → „wa“, „s (scharf)“ → „sa“
  const syllable = (translit) => `${translit.split('/')[0].replace(/\(.*\)/, '').trim()}a`;

  for (const l of [...LETTERS, ...FINALS]) add(l.id, ttsText(getItem(l.id)), l.name, 'Buchstabe');
  for (const s of SYLLABLES) add(s.id, ttsText(getItem(s.id)), s.translit, 'Silbe');
  for (const v of NIKUD) add(v.id, ttsText(getItem(v.id)), `${v.exampleTranslit} (${v.name})`, 'Silbe');
  for (const l of LETTERS) {
    if (l.dagesh) {
      add(`var-${l.id}`, variantSyllable(l.glyph), `${syllable(l.translit)} (${l.name} ohne Punkt)`, 'Variante');
      add(`var-${l.id}-dagesch`, variantSyllable(l.dagesh.glyph), `${syllable(l.dagesh.translit)} (${l.name} mit Punkt)`, 'Variante');
    } else if (l.variant) {
      add(`var-${l.id}`, variantSyllable(l.glyph), `${syllable(l.translit)} (${l.name})`, 'Variante');
      add(`var-${l.id}-${l.variant.name.toLowerCase()}`, variantSyllable(l.variant.glyph), `${syllable(l.variant.translit)} (${l.variant.name})`, 'Variante');
    }
  }
  for (const w of WORDS) add(w.id, ttsText(getItem(w.id)), w.translit, 'Wort');
  return entries;
}

// Wert, über den Distraktoren als „zu ähnlich“ aussortiert werden
function distinctKey(item, field) {
  if (field === 'meaning') return item.meaning;
  if (item.type === 'letter') return item.name;
  if (item.type === 'vowel') return item.name;
  return item.translit;
}

// ---------- Einheiten & Lektionen ----------

export const UNITS = [
  {
    id: 'u1',
    title: 'Das Alef-Bet',
    glyph: 'א',
    desc: 'Alle 22 Buchstaben, die 5 Endformen und die Verwechsler-Paare.',
    lessons: [
      { id: 'u1l1', kind: 'letters', title: 'Schin, Bet, Taw', icon: 'שׁ', newItems: ['shin', 'bet', 'tav'], bonusWord: 'w-shabbat' },
      { id: 'u1l2', kind: 'letters', title: 'Alef, Lamed, Mem', icon: 'א', newItems: ['alef', 'lamed', 'mem'] },
      { id: 'u1l3', kind: 'letters', title: 'Waw, He, Resch', icon: 'ו', newItems: ['vav', 'he', 'resh'] },
      { id: 'u1l4', kind: 'letters', title: 'Jod, Nun, Kuf', icon: 'י', newItems: ['yod', 'nun', 'kuf'] },
      { id: 'u1l5', kind: 'letters', title: 'Dalet, Gimel, Ajin', icon: 'ד', newItems: ['dalet', 'gimel', 'ayin'] },
      { id: 'u1l6', kind: 'letters', title: 'Samech, Pe, Kaf', icon: 'ס', newItems: ['samech', 'pe', 'kaf'] },
      { id: 'u1l7', kind: 'letters', title: 'Sajin, Tet, Chet, Tzadi', icon: 'ז', newItems: ['zayin', 'tet', 'chet', 'tsadi'] },
      { id: 'u1l8', kind: 'letters', title: 'Die Endformen', icon: 'ם', newItems: ['kaf-sofit', 'mem-sofit', 'nun-sofit', 'pe-sofit', 'tsadi-sofit'] },
      {
        id: 'u1l9', kind: 'lookalike', title: 'Verwechsler-Training', icon: 'ד ר',
        pairs: [
          ['bet', 'kaf'], ['dalet', 'resh'], ['he', 'chet'], ['he', 'tav'],
          ['vav', 'zayin'], ['gimel', 'nun'], ['mem-sofit', 'samech'], ['ayin', 'tsadi'],
        ],
      },
    ],
  },
  {
    id: 'u2',
    title: 'Nikud – die Vokale',
    glyph: 'בָּ',
    desc: 'Die Vokalzeichen unter und über den Buchstaben – damit wird aus Zeichen Sprache.',
    lessons: [
      { id: 'u2l1', kind: 'nikud', title: 'Patach & Kamatz (a)', icon: 'אַ', newItems: ['patach', 'kamatz'], syllables: ['syl-ba', 'syl-scha', 'syl-ta', 'syl-ma', 'syl-la', 'syl-ra'] },
      { id: 'u2l2', kind: 'nikud', title: 'Schwa', icon: 'אְ', newItems: ['sheva'], syllables: ['syl-bschwa', 'syl-schschwa', 'syl-lschwa', 'syl-bra', 'syl-schma'] },
      { id: 'u2l3', kind: 'nikud', title: 'Zere & Segol (e)', icon: 'אֵ', newItems: ['tzere', 'segol'], syllables: ['syl-be', 'syl-le', 'syl-te', 'syl-me', 'syl-sche'] },
      { id: 'u2l4', kind: 'nikud', title: 'Chirik (i) & Cholam (o)', icon: 'אִ', newItems: ['chirik', 'cholam', 'cholam-male'], syllables: ['syl-bi', 'syl-mi', 'syl-schi', 'syl-lo', 'syl-ro', 'syl-to', 'syl-scho'] },
      { id: 'u2l5', kind: 'nikud', title: 'Kubuz, Schuruk & Chataf (u)', icon: 'אֻ', newItems: ['kubutz', 'shuruk', 'chataf-patach', 'chataf-segol', 'chataf-kamatz'], syllables: ['syl-mu', 'syl-ku', 'syl-ru', 'syl-bu', 'syl-schu', 'syl-cha'] },
    ],
  },
  {
    id: 'u3',
    title: 'Wörter lesen',
    glyph: 'שׁ',
    desc: 'Echte Wörter aus Siddur und Alltag – jetzt liest du Hebräisch!',
    lessons: [
      { id: 'u3l1', kind: 'words', title: 'Erste Wörter', icon: 'שָׁלוֹם', newItems: ['w-shabbat', 'w-shalom', 'w-abba', 'w-imma', 'w-torah'] },
      { id: 'u3l2', kind: 'words', title: 'Wörter aus dem Siddur', icon: 'אָמֵן', newItems: ['w-baruch', 'w-ata', 'w-melech', 'w-haolam', 'w-amen'] },
      { id: 'u3l3', kind: 'words', title: 'Schma Israel', icon: 'שְׁמַע', newItems: ['w-shema', 'w-yisrael', 'w-echad'] },
      { id: 'u3l4', kind: 'words', title: 'Alltag & Feste', icon: 'חַג', newItems: ['w-mazaltov', 'w-chagsameach', 'w-kasher', 'w-tefilla', 'w-mitzvah'] },
      { id: 'u3l5', kind: 'bracha', title: 'Die Bracha lesen', icon: 'בָּרוּךְ', newItems: ['w-hashem', 'w-elokeinu'], reviewWords: ['w-baruch', 'w-ata', 'w-melech', 'w-haolam'] },
    ],
  },
];

const ORDERED = UNITS.flatMap((u) => u.lessons.map((l) => ({ ...l, unitId: u.id })));

export function orderedLessons() {
  return ORDERED;
}

export function getLesson(id) {
  const l = ORDERED.find((x) => x.id === id);
  if (!l) throw new Error(`Unbekannte Lektion: ${id}`);
  return l;
}

// Eine Lektion ist frei, wenn die vorherige (global) abgeschlossen ist.
export function isUnlocked(lessonId, completedMap) {
  const idx = ORDERED.findIndex((l) => l.id === lessonId);
  if (idx <= 0) return true;
  return !!completedMap[ORDERED[idx - 1].id];
}

// Items eines Lektionstyps, die bis einschließlich dieser Lektion eingeführt wurden
// (Pool für Distraktoren).
export function learnedPool(lessonId, type) {
  const idx = ORDERED.findIndex((l) => l.id === lessonId);
  const ids = [];
  for (let i = 0; i <= idx; i++) {
    const l = ORDERED[i];
    for (const id of l.newItems || []) ids.push(id);
    for (const id of l.syllables || []) ids.push(id);
    for (const id of l.reviewWords || []) ids.push(id);
  }
  return [...new Set(ids)].filter((id) => getItem(id).type === type);
}

// Distraktoren wählen: bevorzugt Verwechsler (lookAlikes), sonst zufällig aus dem Pool.
// field='meaning' sortiert nach Bedeutung statt Name/Umschrift aus.
export function pickDistractors(item, poolIds, n, field = 'main') {
  const seen = new Set([distinctKey(item, field)]);
  const candidates = [];
  const prefer = (item.lookAlikes || []).filter((id) => poolIds.includes(id));
  const rest = poolIds.filter((id) => id !== item.id && !prefer.includes(id));
  shuffleInPlace(rest);
  for (const id of [...prefer, ...rest]) {
    const cand = getItem(id);
    const key = distinctKey(cand, field);
    if (seen.has(key)) continue;
    seen.add(key);
    candidates.push(cand);
    if (candidates.length >= n) break;
  }
  return candidates;
}

function shuffleInPlace(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
