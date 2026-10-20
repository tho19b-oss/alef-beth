// Giur-Wissen, Teil 17: Brachot (Segenssprüche).
//
// Fragetexte stehen wörtlich im Prüfungskatalog (offensichtliche Tippfehler
// berichtigt). Die Antworten wurden als ENTWURF geschrieben und sind noch von
// keinem Rabbiner oder Lehrer durchgesehen: Alle Fragen tragen den
// Standardstatus 'entwurf'. Erst was der Prüfbogen bestätigt oder korrigiert,
// bekommt status 'geprueft'. Bräuche, die je nach Gemeinde abweichen, und
// unklare Fragen stehen im Feld `check`.
//
// Die Segen stehen mit ihrem Schluss; davor kommt immer „Baruch ata Haschem,
// Elokejnu melech ha-olam“ (BRACHA_KOENIG).
//
// Felder je Frage: siehe Kopf von kaschrut.js.
//
// Nur reiner Text: Die Anzeige maskiert alles, HTML hat hier keine Wirkung.

const BRACHA_KOENIG = 'בָּרוּךְ אַתָּה ה׳ אֱלֹקֵינוּ מֶלֶךְ הָעוֹלָם';
const BRACHA_KOENIG_UMSCHRIFT = 'Baruch ata Haschem, Elokejnu melech ha-olam';
const BRACHA_KOENIG_DE = 'Gesegnet bist Du, Ewiger, unser G’tt, König der Welt';

// Ein Segen mit dem gemeinsamen Anfang.
function segen(label, schluss, schlussUmschrift, schlussDe) {
  return {
    label,
    text: `${BRACHA_KOENIG}, ${schluss}`,
    translit: `${BRACHA_KOENIG_UMSCHRIFT}, ${schlussUmschrift}`,
    de: `${BRACHA_KOENIG_DE}, ${schlussDe}`,
  };
}

const HAMOZI = segen('Ha-Mozi (Brot)', 'הַמּוֹצִיא לֶחֶם מִן הָאָרֶץ.', 'ha-mozi lechem min ha-arez.', 'der Brot aus der Erde hervorbringt.');
const GAFEN = segen('Ha-Gafen (Wein, Traubensaft)', 'בּוֹרֵא פְּרִי הַגָּפֶן.', 'bore pri ha-gafen.', 'der die Frucht des Weinstocks erschafft.');
const HAEZ = segen('Ha-Ez (Baumfrüchte)', 'בּוֹרֵא פְּרִי הָעֵץ.', 'bore pri ha-ez.', 'der die Frucht des Baumes erschafft.');
const HAADAMA = segen('Ha-Adama (Früchte der Erde)', 'בּוֹרֵא פְּרִי הָאֲדָמָה.', 'bore pri ha-adama.', 'der die Frucht der Erde erschafft.');
const MEZONOT = segen('Mesonot (Gebäck, Getreide)', 'בּוֹרֵא מִינֵי מְזוֹנוֹת.', 'bore minej mesonot.', 'der allerlei Speisen erschafft.');
const SCHEHAKOL = segen('Schehakol (alles andere)', 'שֶׁהַכֹּל נִהְיָה בִּדְבָרוֹ.', 'schehakol nihja bi-dwaro.', 'durch dessen Wort alles entstanden ist.');
const NEFASCHOT = segen('Bore Nefaschot (danach)', 'בּוֹרֵא נְפָשׁוֹת רַבּוֹת וְחֶסְרוֹנָן …', 'bore nefaschot rabbot we-chesronan …', 'der viele Lebewesen erschafft und was ihnen fehlt …');

export const BRACHOT = [
  {
    id: 'bra-01',
    nr: 1,
    q: 'Welche Bracha sagen wir für:',
    sub: ['Banane', 'Wassermelone', 'French Toast', 'Likör', 'Ananas', 'Erdnüsse', 'Cashewnüsse', 'Reis (vor und nach dem Essen)'],
    type: 'fakt',
    kurz: 'Banane, Wassermelone, Ananas und Erdnüsse: Ha-Adama. Cashewnüsse: Ha-Ez. Likör: Schehakol. French Toast aus Brotscheiben: Ha-Mozi. Reis: vorher Mesonot, danach Bore Nefaschot.',
    punkte: [
      'a. Banane: Ha-Adama, weil die Staude nach jeder Ernte neu aus dem Boden treibt und nicht als Baum gilt. Danach Bore Nefaschot.',
      'b. Wassermelone: Ha-Adama (wächst am Boden). Danach Bore Nefaschot.',
      'c. French Toast (in Ei getauchtes, gebratenes Brot): Es bleibt Brot, also Händewaschen, Ha-Mozi und danach das Tischgebet (Birkat ha-Mason).',
      'd. Likör: Schehakol, danach Bore Nefaschot. Nur Wein und Traubensaft bekommen Ha-Gafen.',
      'e. Ananas: nach den meisten Ha-Adama, weil die Pflanze nur wenige Jahre trägt und keinen Stamm wie ein Baum hat.',
      'f. Erdnüsse: Ha-Adama, sie wachsen in der Erde.',
      'g. Cashewnüsse: Ha-Ez, sie wachsen an einem Baum.',
      'h. Reis: vorher Bore minej mesonot (Schulchan Aruch, Orach Chajim 208,7), danach Bore Nefaschot.',
    ],
    hebrew: [HAEZ, HAADAMA, MEZONOT, SCHEHAKOL, NEFASCHOT],
    quelle: 'Schulchan Aruch, Orach Chajim 202–208',
    check: 'Bei Ananas, French Toast und Reis gibt es abweichende Meinungen; bitte klären, welche gelten soll.',
  },
  {
    id: 'bra-02',
    nr: 2,
    q: 'Welche Segen werden gesagt für:',
    sub: [
      'vor und nach dem Essen von Brot, „Challa“ oder „Mazza“',
      'vor und nach dem Trinken von Traubensaft oder Traubenwein',
      'vor und nach dem Verzehr von Baumfrüchten',
      'vor und nach dem Essen von Naturprodukten, die aus der Erde kommen',
      'vor und nach dem Verzehr von Produkten aus Weizen, Gerste, Roggen, Hafer oder Dinkel',
      'vor und nach dem Essen von verarbeiteten Früchten und Gemüse',
      'vor und nach dem Riechen von Düften',
    ],
    kurz: 'Brot: Ha-Mozi, danach Birkat ha-Mason. Wein: Ha-Gafen, danach Al ha-Gefen. Baumfrüchte: Ha-Ez, danach Bore Nefaschot (bei den sieben Arten Al ha-Ez). Früchte der Erde: Ha-Adama, danach Bore Nefaschot. Gebäck aus den fünf Getreidearten: Mesonot, danach Al ha-Michja. Verarbeitetes: je nachdem, ob es erkennbar bleibt. Düfte: eigene Segen, danach keiner.',
    punkte: [
      'a. Brot, Challa, Mazza: vorher Händewaschen und „ha-Mozi lechem min ha-arez“, danach das Tischgebet (Birkat ha-Mason).',
      'b. Traubensaft oder Wein: „bore pri ha-gafen“, danach der kurze Segen „Al ha-Gefen“ (Me’en Schalosch).',
      'c. Baumfrüchte: „bore pri ha-ez“, danach „Bore Nefaschot“; bei Trauben, Feigen, Granatäpfeln, Oliven und Datteln „Al ha-Ez“.',
      'd. Aus der Erde (Gemüse, Melonen, Bananen): „bore pri ha-adama“, danach „Bore Nefaschot“.',
      'e. Gebäck, Kuchen, Nudeln aus den fünf Getreidearten: „bore minej mesonot“, danach „Al ha-Michja“. Wird daraus eine Mahlzeit mit Brot-Menge, gilt Ha-Mozi.',
      'f. Verarbeitet: Bleibt die Frucht erkennbar (Kompott, Stücke), behält sie ihren Segen. Ist sie ganz zerkleinert oder ausgepresst (Saft), meist Schehakol. Danach Bore Nefaschot.',
      'g. Düfte: Gewürze „bore minej wessamim“, duftende Bäume und Sträucher „bore azej wessamim“, duftende Kräuter „bore issewej wessamim“, duftende Früchte „ha-noten re’ach tow ba-perot“. Danach sagt man nichts.',
    ],
    hebrew: [HAMOZI, GAFEN, HAEZ, HAADAMA, MEZONOT],
    quelle: 'Mischna, Berachot 6,1; Schulchan Aruch, Orach Chajim 167, 202–216',
  },
  {
    id: 'bra-03',
    nr: 3,
    q: 'Wann sagen wir das Tischgebet nach den Mahlzeiten?',
    kurz: 'Nach jeder Mahlzeit, bei der man Brot gegessen hat, mindestens die Menge einer Olive (Kesajit, etwa 27 bis 30 Gramm) in kurzer Zeit. Man sagt es am Ort des Essens, bevor man wieder Hunger hat (spätestens etwa 72 Minuten nach dem Essen nach vielen).',
    punkte: [
      'Es ist ein Gebot der Tora: „Du wirst essen, satt werden und den Ewigen, deinen G’tt, segnen“ (5. Mose 8,10).',
      'Birkat ha-Mason hat vier Segen: für die Nahrung, für das Land, für Jerusalem und „ha-Tow we-ha-Metiw“.',
    ],
    quelle: '5. Mose 8,10; Schulchan Aruch, Orach Chajim 184',
  },
  {
    id: 'bra-04',
    nr: 4,
    q: 'Wann ist das Händewaschen vor den Mahlzeiten erforderlich?',
    kurz: 'Vor dem Essen von Brot (Ha-Mozi). Man gießt mit einem Becher Wasser über jede Hand, meist zweimal, spricht „al netilat jadajim“ und trocknet die Hände ab.',
    punkte: [
      'Bei weniger als einer Olive Brot wäscht man ohne Segen.',
      'Vor Gebäck (Mesonot), Obst und anderem Essen wäscht man nicht.',
      'Vor Speisen, die in eine Flüssigkeit getaucht sind, waschen viele ohne Segen (wie beim Karpas am Seder).',
    ],
    hebrew: [{
      label: 'Segen beim Händewaschen',
      text: 'בָּרוּךְ אַתָּה ה׳ אֱלֹקֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ עַל נְטִילַת יָדָיִם.',
      translit: 'Baruch ata Haschem, Elokejnu melech ha-olam, ascher kidschanu be-mizwotaw we-zivanu al netilat jadajim.',
      de: 'Gesegnet bist Du, Ewiger, unser G’tt, König der Welt, der uns durch seine Gebote geheiligt und uns das Händewaschen geboten hat.',
    }],
    quelle: 'Talmud, Chullin 106a; Schulchan Aruch, Orach Chajim 158–162',
  },
  {
    id: 'bra-05',
    nr: 5,
    q: 'Wann sehen wir vom Sprechen ab, von der Zeit des Händewaschens bis nach dem Aufsagen des Hamozi-Segens und dem ersten Biss des Brotes?',
    kurz: 'Die ganze Zeit vom Segen über das Händewaschen bis man den ersten Bissen Brot nach Ha-Mozi gegessen hat. Man redet nicht und unterbricht nicht, damit Waschen, Segen und Essen zusammengehören.',
    punkte: ['Muss man etwas sagen, das zum Essen gehört (etwa „Reich mir das Salz“), ist das nach vielen erlaubt; besser ist ein Zeichen ohne Worte.'],
    quelle: 'Schulchan Aruch, Orach Chajim 166–167',
    check: 'Die Frage ist etwas unklar formuliert; vermutlich ist gefragt, wie lange man schweigt.',
  },
  {
    id: 'bra-06',
    nr: 6,
    q: 'Wann wird das „Simun“ für das Tischgebet nach den Mahlzeiten gesagt?',
    kurz: 'Wenn mindestens drei Männer über 13 Jahren gemeinsam Brot gegessen haben. Einer lädt die anderen zum Segnen ein („Rabbotaj, newarech“), sie antworten, und dann sagt man das Tischgebet. Ab zehn Männern fügt man „Elokejnu“ ein.',
    punkte: ['Drei oder mehr Frauen, die zusammen gegessen haben, können ein eigenes Simun machen.'],
    quelle: 'Mischna, Berachot 7,1–3; Schulchan Aruch, Orach Chajim 192–199',
  },
  {
    id: 'bra-07',
    nr: 7,
    q: 'Was wird gesagt:',
    sub: ['über das Tragen neuer Kleider', 'über das Kaufen eines neuen Hauses', 'über das Hören von Donner'],
    type: 'fakt',
    kurz: 'Neues, wertvolles Kleid: Schehechejanu. Neues Haus: Schehechejanu (wenn man allein darin wohnt) oder „ha-Tow we-ha-Metiw“ (wenn es auch der Familie gehört). Donner: „sche-kocho u-gwurato male olam“.',
    punkte: [
      'a. Ein neues, wichtiges Kleidungsstück, über das man sich freut (Anzug, Kleid): Schehechejanu beim ersten Anziehen. Manche sagen „Malbisch Arumim“. Für Socken oder Unterwäsche sagt man nichts.',
      'b. Neues Haus: Schehechejanu oder „ha-Tow we-ha-Metiw“ („der gut ist und Gutes tut“), wenn die Freude geteilt wird.',
      'c. Donner: „sche-kocho u-gwurato male olam“, „dessen Kraft und Macht die Welt erfüllt“. Bei Blitz: „osse ma’asse wereschit“, „der das Werk der Schöpfung tut“.',
    ],
    hebrew: [segen('Beim Donner', 'שֶׁכֹּחוֹ וּגְבוּרָתוֹ מָלֵא עוֹלָם.', 'sche-kocho u-gwurato male olam.', 'dessen Kraft und Macht die Welt erfüllt.')],
    quelle: 'Mischna, Berachot 9,2–3; Schulchan Aruch, Orach Chajim 223 und 227',
    check: 'Ob bei neuen Kleidern Schehechejanu oder Malbisch Arumim gesagt wird, ist Brauchsache.',
  },
  {
    id: 'bra-08',
    nr: 8,
    q: 'Was ist „Birkat Hagomel“?',
    kurz: 'Der Dank-Segen nach überstandener Gefahr. Man sagt ihn vor einem Minjan, meist bei der Toralesung: nach einer Reise über das Meer oder einem Flug, nach einer Reise durch die Wüste, nach überstandener schwerer Krankheit und nach der Entlassung aus Gefangenschaft.',
    punkte: [
      'Die vier Fälle stammen aus Psalm 107.',
      'Die Gemeinde antwortet: „Mi sche-gemalcha kol tow, hu jigmalcha kol tow, sela“, „Der dir alles Gute erwiesen hat, möge dir weiter alles Gute erweisen“.',
      'Frauen sagen ihn nach einer Geburt, oft vor Männern in der Synagoge oder zu Hause vor zehn Personen.',
    ],
    hebrew: [segen('Birkat ha-Gomel', 'הַגּוֹמֵל לְחַיָּבִים טוֹבוֹת, שֶׁגְּמָלַנִי כָּל טוֹב.', 'ha-gomel le-chajawim towot sche-gmalani kol tow.', 'der den Schuldigen Gutes erweist und mir alles Gute erwiesen hat.')],
    quelle: 'Psalm 107; Talmud, Berachot 54b; Schulchan Aruch, Orach Chajim 219',
  },
  {
    id: 'bra-09',
    nr: 9,
    q: 'Was ist das jiddische Wort für beten?',
    type: 'fakt',
    kurz: '„Dawnen“ (auch „dawenen“).',
    punkte: ['Das Gebet selbst heißt auf Jiddisch „Tfile“ (hebräisch Tefilla).'],
  },
  {
    id: 'bra-10',
    nr: 10,
    q: 'Was ist das jiddische Wort für Segen?',
    type: 'fakt',
    kurz: '„Broche“ (Mehrzahl „Broches“), vom hebräischen Bracha.',
  },
  {
    id: 'bra-11',
    nr: 11,
    q: 'Was sagen wir, wenn wir versehentlich den falschen Segen gesagt haben? Nenne zwei Situationen.',
    kurz: 'Hat man einen Segen umsonst gesagt, spricht man sofort „Baruch Schem kewod malchuto le-olam wa-ed“. Merkt man den Fehler noch im Augenblick (innerhalb von zwei, drei Worten), verbessert man ihn einfach.',
    punkte: [
      'Situation 1: Man hat „ha-Ez“ über eine Banane oder Gemüse gesagt. Der Segen gilt nicht; wer es sofort merkt, sagt gleich „bore pri ha-adama“, sonst „Baruch Schem …“ und den richtigen Segen.',
      'Situation 2: Man hat den Segen gesagt, und dann fällt das Essen auf den Boden oder man isst es doch nicht: „Baruch Schem kewod malchuto le-olam wa-ed“.',
      'Gut zu wissen: „ha-Adama“ über eine Baumfrucht und „Schehakol“ über alles gelten nachträglich.',
    ],
    hebrew: [{ label: 'nach einem vergeblichen Segen', text: 'בָּרוּךְ שֵׁם כְּבוֹד מַלְכוּתוֹ לְעוֹלָם וָעֶד', translit: 'baruch schem kewod malchuto le-olam wa-ed', de: 'Gesegnet sei der Name der Herrlichkeit Seines Reiches für immer und ewig' }],
    quelle: 'Schulchan Aruch, Orach Chajim 206,6 und 209',
    check: 'Welche zwei Situationen der Katalog meint, ist nicht eindeutig; bitte klären.',
  },
  {
    id: 'bra-12',
    nr: 12,
    q: 'Was darf nicht im gleichen Zimmer vorhanden sein, wenn wir Brachot sprechen?',
    kurz: 'Unbedeckte Nacktheit (Erwa) in Sichtweite, Kot oder Urin, ein schlechter Geruch und etwa ein ungereinigtes Töpfchen oder eine offene Windel. Dann darf man keinen Segen und kein Gebet sagen und keine Tora lernen.',
    punkte: [
      '„Dein Lager soll heilig sein“ (5. Mose 23,15).',
      'Ist etwas Unreines da, geht man weg oder deckt es ab.',
    ],
    quelle: '5. Mose 23,15; Talmud, Berachot 25a–b; Schulchan Aruch, Orach Chajim 75–87',
  },
  {
    id: 'bra-13',
    nr: 13,
    q: 'Unter welchen Bedingungen müssen wir unsere Hände vor dem Beten waschen?',
    kurz: 'Morgens nach dem Aufstehen (Netilat Jadajim, dreimal abwechselnd), nach dem Gang zur Toilette, nachdem man Schuhe oder bedeckte Körperstellen berührt hat, nach dem Friedhof und allgemein, wenn die Hände nicht sauber sind. Vor jedem Gebet soll man die Hände waschen.',
    punkte: [
      'Nach der Toilette sagt man den Segen „Ascher jazar“.',
      'Gibt es kein Wasser, reibt man die Hände an etwas Sauberem ab.',
    ],
    quelle: 'Talmud, Berachot 15a; Schulchan Aruch, Orach Chajim 4 und 92,4–5',
  },
];
