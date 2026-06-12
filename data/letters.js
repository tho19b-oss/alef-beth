// Die 22 Buchstaben des Alef-Bet (Druckschrift, wie im Siddur).
// translit = Aussprache-Umschrift, sound = Erklärung auf Deutsch,
// mnemonic = Eselsbrücke, ttsWord = Buchstabenname auf Hebräisch (für die Sprachausgabe),
// lookAlikes = leicht zu verwechselnde Buchstaben (für Drills).

export const LETTERS = [
  {
    id: 'alef', glyph: 'א', name: 'Alef', translit: '(stumm)',
    sound: 'stumm – trägt nur den Vokal, der bei ihm steht',
    mnemonic: 'Sieht aus wie ein schräges X mit zwei Ärmchen – und schweigt vornehm.',
    ttsWord: 'אָלֶף', lookAlikes: ['tsadi'], dagesh: null, final: null,
  },
  {
    id: 'bet', glyph: 'ב', name: 'Bet', translit: 'w / b',
    sound: 'w wie in „Wein“ – mit Punkt (בּ): b wie in „Ball“',
    mnemonic: 'Ein Haus (hebräisch „bajit“) mit offener Tür nach links.',
    ttsWord: 'בֵּית', lookAlikes: ['kaf'],
    dagesh: { glyph: 'בּ', translit: 'b' }, final: null,
  },
  {
    id: 'gimel', glyph: 'ג', name: 'Gimel', translit: 'g',
    sound: 'g wie in „Garten“',
    mnemonic: 'Ein Kamel (hebräisch „gamal“) mit langem Hals und einem Bein vorgestreckt.',
    ttsWord: 'גִּימֶל', lookAlikes: ['nun'], dagesh: null, final: null,
  },
  {
    id: 'dalet', glyph: 'ד', name: 'Dalet', translit: 'd',
    sound: 'd wie in „Dach“',
    mnemonic: 'Eine Tür (hebräisch „delet“) – der Balken oben steht rechts über.',
    ttsWord: 'דָּלֶת', lookAlikes: ['resh'], dagesh: null, final: null,
  },
  {
    id: 'he', glyph: 'ה', name: 'He', translit: 'h',
    sound: 'h wie in „Haus“ – sanft gehaucht',
    mnemonic: 'Wie ein Fenster mit einem Spalt unten links – da entweicht der Hauch.',
    ttsWord: 'הֵא', lookAlikes: ['chet', 'tav'], dagesh: null, final: null,
  },
  {
    id: 'vav', glyph: 'ו', name: 'Waw', translit: 'w',
    sound: 'w wie in „Wasser“ – trägt auch die Vokale o (וֹ) und u (וּ)',
    mnemonic: 'Ein gerader Haken (hebräisch „waw“) – schlicht ein senkrechter Strich.',
    ttsWord: 'וָו', lookAlikes: ['zayin', 'yod'], dagesh: null, final: null,
  },
  {
    id: 'zayin', glyph: 'ז', name: 'Sajin', translit: 's (weich)',
    sound: 'stimmhaftes s wie in „Sonne“ (englisches z)',
    mnemonic: 'Ein Schwert (hebräisch „sajin“) mit Griff, der oben übersteht.',
    ttsWord: 'זַיִן', lookAlikes: ['vav'], dagesh: null, final: null,
  },
  {
    id: 'chet', glyph: 'ח', name: 'Chet', translit: 'ch',
    sound: 'ch wie in „Bach“ – kehlig gekratzt',
    mnemonic: 'Ein geschlossener Torbogen – der Laut kratzt hinten im Hals.',
    ttsWord: 'חֵית', lookAlikes: ['he', 'tav'], dagesh: null, final: null,
  },
  {
    id: 'tet', glyph: 'ט', name: 'Tet', translit: 't',
    sound: 't wie in „Tag“',
    mnemonic: 'Eine eingerollte Schlange, die in einem Korb liegt.',
    ttsWord: 'טֵית', lookAlikes: ['mem'], dagesh: null, final: null,
  },
  {
    id: 'yod', glyph: 'י', name: 'Jod', translit: 'j',
    sound: 'j wie in „Jahr“ – oft Teil von i- und ej-Lauten',
    mnemonic: 'Der kleinste Buchstabe – ein Tropfen, der in der Luft schwebt.',
    ttsWord: 'יוֹד', lookAlikes: ['vav'], dagesh: null, final: null,
  },
  {
    id: 'kaf', glyph: 'כ', name: 'Kaf', translit: 'ch / k',
    sound: 'ch wie in „Bach“ – mit Punkt (כּ): k wie in „Kind“',
    mnemonic: 'Eine gebogene Handfläche (hebräisch „kaf“).',
    ttsWord: 'כַּף', lookAlikes: ['bet'],
    dagesh: { glyph: 'כּ', translit: 'k' }, final: 'kaf-sofit',
  },
  {
    id: 'lamed', glyph: 'ל', name: 'Lamed', translit: 'l',
    sound: 'l wie in „Licht“',
    mnemonic: 'Der Lange – ragt als einziger Buchstabe über die Zeile, wie ein Hirtenstab.',
    ttsWord: 'לָמֶד', lookAlikes: [], dagesh: null, final: null,
  },
  {
    id: 'mem', glyph: 'מ', name: 'Mem', translit: 'm',
    sound: 'm wie in „Meer“',
    mnemonic: 'Eine Welle (hebräisch „majim“ = Wasser).',
    ttsWord: 'מֵם', lookAlikes: ['tet'], dagesh: null, final: 'mem-sofit',
  },
  {
    id: 'nun', glyph: 'נ', name: 'Nun', translit: 'n',
    sound: 'n wie in „Nacht“',
    mnemonic: 'Eine kleine sitzende Kerzenflamme.',
    ttsWord: 'נוּן', lookAlikes: ['gimel', 'kaf'], dagesh: null, final: 'nun-sofit',
  },
  {
    id: 'samech', glyph: 'ס', name: 'Samech', translit: 's (scharf)',
    sound: 'scharfes s wie in „Fass“',
    mnemonic: 'Ein geschlossener Ring – aus dem S kommt nichts heraus.',
    ttsWord: 'סָמֶךְ', lookAlikes: ['mem-sofit'], dagesh: null, final: null,
  },
  {
    id: 'ayin', glyph: 'ע', name: 'Ajin', translit: '(stumm)',
    sound: 'stumm – ursprünglich ein Kehllaut, trägt den Vokal',
    mnemonic: 'Ein Auge (hebräisch „ajin“) – es schaut, sagt aber nichts.',
    ttsWord: 'עַיִן', lookAlikes: ['tsadi'], dagesh: null, final: null,
  },
  {
    id: 'pe', glyph: 'פ', name: 'Pe', translit: 'f / p',
    sound: 'f wie in „Fisch“ – mit Punkt (פּ): p wie in „Post“',
    mnemonic: 'Ein Mund (hebräisch „pe“) mit einem Zahn darin.',
    ttsWord: 'פֵּא', lookAlikes: ['kaf'],
    dagesh: { glyph: 'פּ', translit: 'p' }, final: 'pe-sofit',
  },
  {
    id: 'tsadi', glyph: 'צ', name: 'Tzadi', translit: 'z',
    sound: 'z wie in „Zahl“ (ts)',
    mnemonic: 'Ein Angler mit gebeugtem Rücken und ausgestrecktem Arm.',
    ttsWord: 'צָדִי', lookAlikes: ['ayin'], dagesh: null, final: 'tsadi-sofit',
  },
  {
    id: 'kuf', glyph: 'ק', name: 'Kuf', translit: 'k',
    sound: 'k wie in „Kino“',
    mnemonic: 'Ein Affe (hebräisch „kof“), dessen Schwanz unter die Zeile hängt.',
    ttsWord: 'קוֹף', lookAlikes: ['he'], dagesh: null, final: null,
  },
  {
    id: 'resh', glyph: 'ר', name: 'Resch', translit: 'r',
    sound: 'r wie in „Rose“',
    mnemonic: 'Ein gebeugter Kopf (hebräisch „rosch“) – oben rund, ohne Ecke.',
    ttsWord: 'רֵישׁ', lookAlikes: ['dalet'], dagesh: null, final: null,
  },
  {
    id: 'shin', glyph: 'שׁ', name: 'Schin', translit: 'sch',
    sound: 'sch wie in „Schule“ – mit Punkt links (שׂ „Sin“): scharfes s',
    mnemonic: 'Drei züngelnde Flammen – sch wie ein zischendes Feuer.',
    ttsWord: 'שִׁין', lookAlikes: [], dagesh: null, final: null,
    variant: { glyph: 'שׂ', name: 'Sin', translit: 's (scharf)' },
  },
  {
    id: 'tav', glyph: 'ת', name: 'Taw', translit: 't',
    sound: 't wie in „Tor“',
    mnemonic: 'Wie ein Chet, aber mit kleinem Fuß unten links – ein Tanzschuh.',
    ttsWord: 'תָּו', lookAlikes: ['chet', 'he'], dagesh: null, final: null,
  },
];

// Die 5 Endformen (Sofit-Buchstaben) – stehen nur am Wortende.
export const FINALS = [
  {
    id: 'kaf-sofit', glyph: 'ך', name: 'Kaf Sofit', baseId: 'kaf', translit: 'ch',
    sound: 'ch am Wortende (wie in בָּרוּךְ „baruch“)',
    mnemonic: 'Kaf streckt am Wortende das Bein lang nach unten.',
    ttsWord: 'כַּף סוֹפִית', lookAlikes: ['dalet', 'resh'], dagesh: null, final: null,
  },
  {
    id: 'mem-sofit', glyph: 'ם', name: 'Mem Sofit', baseId: 'mem', translit: 'm',
    sound: 'm am Wortende (wie in שָׁלוֹם „schalom“)',
    mnemonic: 'Mem schließt sich am Wortende zu einem Kasten.',
    ttsWord: 'מֵם סוֹפִית', lookAlikes: ['samech'], dagesh: null, final: null,
  },
  {
    id: 'nun-sofit', glyph: 'ן', name: 'Nun Sofit', baseId: 'nun', translit: 'n',
    sound: 'n am Wortende (wie in אָמֵן „amen“)',
    mnemonic: 'Nun streckt sich am Wortende zu einem langen Strich.',
    ttsWord: 'נוּן סוֹפִית', lookAlikes: ['vav', 'zayin'], dagesh: null, final: null,
  },
  {
    id: 'pe-sofit', glyph: 'ף', name: 'Pe Sofit', baseId: 'pe', translit: 'f',
    sound: 'f am Wortende',
    mnemonic: 'Pe lässt am Wortende die Zunge weit heraushängen.',
    ttsWord: 'פֵּא סוֹפִית', lookAlikes: ['kaf-sofit'], dagesh: null, final: null,
  },
  {
    id: 'tsadi-sofit', glyph: 'ץ', name: 'Tzadi Sofit', baseId: 'tsadi', translit: 'z',
    sound: 'z (ts) am Wortende',
    mnemonic: 'Tzadi richtet sich am Wortende auf und streckt die Arme.',
    ttsWord: 'צָדִי סוֹפִית', lookAlikes: ['ayin'], dagesh: null, final: null,
  },
];
