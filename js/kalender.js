// Jüdischer Kalender für die Begrüßung: hebräisches Datum und Feiertagsgruß.
// Rechnen tut der Browser (Intl mit Kalender „hebrew“), die App braucht dafür
// weder Tabellen noch Netz. Der Tag wechselt um Mitternacht, nicht mit dem
// Sonnenuntergang: Erev-Abende zählen deshalb noch zum Vortag.
// Feiertage nach dem Brauch der Diaspora (zwei Tage Rosch haSchana,
// acht Tage Pessach, zwei Tage Schawuot).

const fmt = (() => {
  try {
    const f = new Intl.DateTimeFormat('en-u-ca-hebrew', { day: 'numeric', month: 'long', year: 'numeric' });
    return f.resolvedOptions().calendar === 'hebrew' ? f : null;
  } catch {
    return null;
  }
})();

// Englische ICU-Namen der Monate → deutsche Umschrift.
const MONTHS = {
  Tishri: 'Tischri', Heshvan: 'Cheschwan', Kislev: 'Kislew', Tevet: 'Tewet', Shevat: 'Schwat',
  Adar: 'Adar', 'Adar I': 'Adar I', 'Adar II': 'Adar II', Nisan: 'Nissan', Iyar: 'Ijar',
  Sivan: 'Siwan', Tamuz: 'Tamus', Av: 'Aw', Elul: 'Elul',
};

// { day, month (ICU-Name), year } oder null, wenn der Browser den Kalender nicht kennt.
export function hebrewDate(d = new Date()) {
  if (!fmt) return null;
  const p = Object.fromEntries(fmt.formatToParts(d).map((x) => [x.type, x.value]));
  return { day: Number(p.day), month: p.month, year: Number(p.year) };
}

// „9. Cheschwan 5787“
export function hebrewDateText(d = new Date()) {
  const h = hebrewDate(d);
  return h ? `${h.day}. ${MONTHS[h.month] || h.month} ${h.year}` : '';
}

const CHAG = { he: 'חַג שָׂמֵחַ', translit: 'Chag sameach', de: 'Frohes Fest' };

// Feiertag an diesem Tag mit passendem Gruß, sonst null.
export function holidayFor(d = new Date()) {
  const h = hebrewDate(d);
  if (!h) return null;
  const { day, month } = h;
  const is = (m, from, to = from) => month === m && day >= from && day <= to;

  if (is('Tishri', 1, 2)) return { name: 'Rosch haSchana', he: 'שָׁנָה טוֹבָה', translit: 'Schana tova', de: 'Ein gutes neues Jahr' };
  // Zwischen Rosch haSchana und Jom Kippur
  if (is('Tishri', 3, 9)) return { name: 'Tage der Umkehr', he: 'גְּמַר חֲתִימָה טוֹבָה', translit: "G'mar chatima tova", de: 'Eine gute Besiegelung' };
  if (is('Tishri', 10)) return { name: 'Jom Kippur', he: 'גְּמַר חֲתִימָה טוֹבָה', translit: "G'mar chatima tova", de: 'Eine gute Besiegelung' };
  if (is('Tishri', 15, 21)) return { name: 'Sukkot', ...CHAG };
  if (is('Tishri', 22)) return { name: 'Schmini Azeret', ...CHAG };
  if (is('Tishri', 23)) return { name: 'Simchat Tora', ...CHAG };
  // Chanukka beginnt am 25. Kislew und dauert acht Tage. Der Kislew hat 29
  // oder 30 Tage, deshalb endet es am 2. oder 3. Tewet. Die Schleife zählt
  // vom heutigen Tag rückwärts bis zum 25. Kislew.
  for (let i = 0; i < 8; i += 1) {
    const back = hebrewDate(new Date(d.getFullYear(), d.getMonth(), d.getDate() - i));
    if (back.month === 'Kislev' && back.day === 25) {
      return { name: `Chanukka, ${i + 1}. Tag`, he: 'חֲנֻכָּה שָׂמֵחַ', translit: 'Chanukka sameach', de: 'Frohes Chanukka' };
    }
  }
  // Purim im Schaltjahr im Adar II, sonst im Adar
  if (is('Adar', 14) || is('Adar II', 14)) return { name: 'Purim', he: 'פּוּרִים שָׂמֵחַ', translit: 'Purim sameach', de: 'Frohes Purim' };
  if (is('Nisan', 15, 22)) return { name: 'Pessach', ...CHAG };
  if (is('Sivan', 6, 7)) return { name: 'Schawuot', ...CHAG };
  return null;
}
