// Nikud – die Vokalzeichen. display zeigt das Zeichen an einem gepunkteten
// Platzhalterkreis (◌), example ist eine Beispielsilbe mit bekanntem Buchstaben.

export const NIKUD = [
  {
    id: 'patach', display: 'בַ', mark: 'ַ', name: 'Patach', soundLabel: 'a',
    sound: 'a wie in „Mann“ – ein kleiner Strich unter dem Buchstaben',
    example: 'בַּ', exampleTranslit: 'ba',
  },
  {
    id: 'kamatz', display: 'בָ', mark: 'ָ', name: 'Kamatz', soundLabel: 'a',
    sound: 'a wie in „Vater“ – ein kleines T unter dem Buchstaben',
    example: 'מָ', exampleTranslit: 'ma',
  },
  {
    id: 'sheva', display: 'בְ', mark: 'ְ', name: 'Schwa', soundLabel: 'e (flüchtig) / stumm',
    sound: 'ganz kurzes e wie in „beginnen“ – oder stumm: zwei Punkte untereinander',
    example: 'שְׁ', exampleTranslit: 'sch’',
  },
  {
    id: 'tzere', display: 'בֵ', mark: 'ֵ', name: 'Zere', soundLabel: 'e',
    sound: 'e wie in „See“ – zwei Punkte nebeneinander',
    example: 'בֵּ', exampleTranslit: 'be',
  },
  {
    id: 'segol', display: 'בֶ', mark: 'ֶ', name: 'Segol', soundLabel: 'e',
    sound: 'e wie in „Bett“ – drei Punkte als Dreieck',
    example: 'מֶ', exampleTranslit: 'me',
  },
  {
    id: 'chirik', display: 'בִ', mark: 'ִ', name: 'Chirik', soundLabel: 'i',
    sound: 'i wie in „Lied“ – ein einzelner Punkt unter dem Buchstaben',
    example: 'בִּ', exampleTranslit: 'bi',
  },
  {
    id: 'cholam', display: 'בֹ', mark: 'ֹ', name: 'Cholam', soundLabel: 'o',
    sound: 'o wie in „Boot“ – ein Punkt oben links über dem Buchstaben',
    example: 'לֹ', exampleTranslit: 'lo',
  },
  {
    id: 'cholam-male', display: 'בוֹ', mark: 'וֹ', name: 'Cholam male', soundLabel: 'o',
    sound: 'o wie in „Boot“ – ein Waw mit Punkt obendrauf (וֹ)',
    example: 'תּוֹ', exampleTranslit: 'to',
  },
  {
    id: 'kubutz', display: 'בֻ', mark: 'ֻ', name: 'Kubuz', soundLabel: 'u',
    sound: 'u wie in „Fuß“ – drei schräge Punkte unter dem Buchstaben',
    example: 'מֻ', exampleTranslit: 'mu',
  },
  {
    id: 'shuruk', display: 'בוּ', mark: 'וּ', name: 'Schuruk', soundLabel: 'u',
    sound: 'u wie in „Fuß“ – ein Waw mit Punkt in der Mitte (וּ)',
    example: 'בּוּ', exampleTranslit: 'bu',
  },
  {
    id: 'chataf-patach', display: 'עֲ', mark: 'ֲ', name: 'Chataf-Patach', soundLabel: 'a (kurz)',
    sound: 'ganz kurzes a – Schwa + Patach kombiniert, steht bei Kehlbuchstaben',
    example: 'חֲ', exampleTranslit: 'cha',
  },
  {
    id: 'chataf-segol', display: 'אֱ', mark: 'ֱ', name: 'Chataf-Segol', soundLabel: 'e (kurz)',
    sound: 'ganz kurzes e – Schwa + Segol kombiniert, steht bei Kehlbuchstaben',
    example: 'אֱ', exampleTranslit: 'e',
  },
  {
    id: 'chataf-kamatz', display: 'אֳ', mark: 'ֳ', name: 'Chataf-Kamatz', soundLabel: 'o (kurz)',
    sound: 'ganz kurzes o – Schwa + Kamatz kombiniert, steht bei Kehlbuchstaben',
    example: 'אֳ', exampleTranslit: 'o',
  },
];

// Lesesilben für die Drills (Buchstabe + Vokal). Die Übungen fragen die Umschrift ab.
export const SYLLABLES = [
  // Patach + Kamatz (a)
  { id: 'syl-ba', hebrew: 'בַּ', translit: 'ba', vowelId: 'patach' },
  { id: 'syl-scha', hebrew: 'שַׁ', translit: 'scha', vowelId: 'patach' },
  { id: 'syl-ta', hebrew: 'תַּ', translit: 'ta', vowelId: 'patach' },
  { id: 'syl-ma', hebrew: 'מָ', translit: 'ma', vowelId: 'kamatz' },
  { id: 'syl-la', hebrew: 'לָ', translit: 'la', vowelId: 'kamatz' },
  { id: 'syl-ra', hebrew: 'רָ', translit: 'ra', vowelId: 'kamatz' },
  // Schwa
  { id: 'syl-bschwa', hebrew: 'בְּ', translit: 'b’', vowelId: 'sheva' },
  { id: 'syl-schschwa', hebrew: 'שְׁ', translit: 'sch’', vowelId: 'sheva' },
  { id: 'syl-lschwa', hebrew: 'לְ', translit: 'l’', vowelId: 'sheva' },
  { id: 'syl-bra', hebrew: 'בְּרָ', translit: 'b’ra', vowelId: 'sheva' },
  { id: 'syl-schma', hebrew: 'שְׁמָ', translit: 'sch’ma', vowelId: 'sheva' },
  // Zere + Segol (e)
  { id: 'syl-be', hebrew: 'בֵּ', translit: 'be', vowelId: 'tzere' },
  { id: 'syl-le', hebrew: 'לֵ', translit: 'le', vowelId: 'tzere' },
  { id: 'syl-te', hebrew: 'תֵּ', translit: 'te', vowelId: 'tzere' },
  { id: 'syl-me', hebrew: 'מֶ', translit: 'me', vowelId: 'segol' },
  { id: 'syl-sche', hebrew: 'שֶׁ', translit: 'sche', vowelId: 'segol' },
  // Chirik + Cholam (i / o)
  { id: 'syl-bi', hebrew: 'בִּ', translit: 'bi', vowelId: 'chirik' },
  { id: 'syl-mi', hebrew: 'מִ', translit: 'mi', vowelId: 'chirik' },
  { id: 'syl-schi', hebrew: 'שִׁ', translit: 'schi', vowelId: 'chirik' },
  { id: 'syl-lo', hebrew: 'לֹ', translit: 'lo', vowelId: 'cholam' },
  { id: 'syl-ro', hebrew: 'רֹ', translit: 'ro', vowelId: 'cholam' },
  { id: 'syl-to', hebrew: 'תּוֹ', translit: 'to', vowelId: 'cholam-male' },
  { id: 'syl-scho', hebrew: 'שׁוֹ', translit: 'scho', vowelId: 'cholam-male' },
  // Kubuz + Schuruk + Chataf (u / Kurzvokale)
  { id: 'syl-mu', hebrew: 'מֻ', translit: 'mu', vowelId: 'kubutz' },
  { id: 'syl-ku', hebrew: 'קֻ', translit: 'ku', vowelId: 'kubutz' },
  { id: 'syl-ru', hebrew: 'רוּ', translit: 'ru', vowelId: 'shuruk' },
  { id: 'syl-bu', hebrew: 'בּוּ', translit: 'bu', vowelId: 'shuruk' },
  { id: 'syl-schu', hebrew: 'שׁוּ', translit: 'schu', vowelId: 'shuruk' },
  { id: 'syl-cha', hebrew: 'חֲ', translit: 'cha', vowelId: 'chataf-patach' },
];
