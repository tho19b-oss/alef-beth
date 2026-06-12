// Wortschatz für Einheit 3 – echte Wörter mit Nikud, Umschrift und Bedeutung.
// noTts: true → wird nicht von der Sprachausgabe gesprochen (Gottesname).

export const WORDS = [
  // Lektion 1 – Erste Wörter
  { id: 'w-shabbat', hebrew: 'שַׁבָּת', translit: 'schabbat', meaning: 'Schabbat, Ruhetag' },
  { id: 'w-shalom', hebrew: 'שָׁלוֹם', translit: 'schalom', meaning: 'Frieden; Hallo' },
  { id: 'w-abba', hebrew: 'אַבָּא', translit: 'abba', meaning: 'Papa, Vater' },
  { id: 'w-imma', hebrew: 'אִמָּא', translit: 'imma', meaning: 'Mama, Mutter' },
  { id: 'w-torah', hebrew: 'תּוֹרָה', translit: 'tora', meaning: 'Tora, Weisung' },

  // Lektion 2 – Wörter aus dem Siddur
  { id: 'w-baruch', hebrew: 'בָּרוּךְ', translit: 'baruch', meaning: 'gesegnet' },
  { id: 'w-ata', hebrew: 'אַתָּה', translit: 'ata', meaning: 'du' },
  { id: 'w-melech', hebrew: 'מֶלֶךְ', translit: 'melech', meaning: 'König' },
  { id: 'w-haolam', hebrew: 'הָעוֹלָם', translit: 'ha-olam', meaning: 'die Welt' },
  { id: 'w-amen', hebrew: 'אָמֵן', translit: 'amen', meaning: 'Amen – „so sei es“' },

  // Lektion 3 – Schma Israel
  { id: 'w-shema', hebrew: 'שְׁמַע', translit: 'sch’ma', meaning: 'höre!' },
  { id: 'w-yisrael', hebrew: 'יִשְׂרָאֵל', translit: 'jisrael', meaning: 'Israel' },
  { id: 'w-echad', hebrew: 'אֶחָד', translit: 'echad', meaning: 'eins, einzig' },

  // Lektion 4 – Alltag & Feste
  { id: 'w-mazaltov', hebrew: 'מַזָּל טוֹב', translit: 'masal tow', meaning: 'Glückwunsch!' },
  { id: 'w-chagsameach', hebrew: 'חַג שָׂמֵחַ', translit: 'chag sameach', meaning: 'frohes Fest!' },
  { id: 'w-kasher', hebrew: 'כָּשֵׁר', translit: 'kascher', meaning: 'koscher, tauglich' },
  { id: 'w-tefilla', hebrew: 'תְּפִלָּה', translit: 't’filla', meaning: 'Gebet' },
  { id: 'w-mitzvah', hebrew: 'מִצְוָה', translit: 'mizwa', meaning: 'Gebot, gute Tat' },

  // Lektion 5 – Die Bracha-Formel
  {
    id: 'w-hashem', hebrew: 'ה׳', translit: 'Haschem', noTts: true,
    meaning: '„der Name“ – Kürzel für den Gottesnamen (gesprochen: Adonai)',
  },
  {
    id: 'w-elokeinu', hebrew: 'אֱלֹקֵינוּ', translit: 'Elokejnu', noTts: true,
    meaning: 'unser G’tt (respektvolle Schreibweise mit ק)',
  },
];
