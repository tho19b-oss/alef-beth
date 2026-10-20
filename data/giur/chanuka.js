// Giur-Wissen, Teil 6: Chanuka.
//
// Fragetexte stehen wörtlich im Prüfungskatalog. Die Antworten wurden als ENTWURF
// geschrieben und sind noch von keinem Rabbiner oder Lehrer durchgesehen: Alle
// Fragen tragen den Standardstatus 'entwurf'. Erst was der Prüfbogen bestätigt
// oder korrigiert, bekommt status 'geprueft'. Bräuche, die je nach Gemeinde
// abweichen, und unklare Fragen stehen im Feld `check`.
//
// Felder je Frage: siehe Kopf von kaschrut.js.
//
// Nur reiner Text: Die Anzeige maskiert alles, HTML hat hier keine Wirkung.

const BRACHA_ANFANG = 'בָּרוּךְ אַתָּה ה׳ אֱלֹקֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ';
const BRACHA_ANFANG_UMSCHRIFT = 'Baruch ata Haschem, Elokejnu melech ha-olam, ascher kidschanu be-mizwotaw we-zivanu';
const BRACHA_ANFANG_DE = 'Gesegnet bist Du, Ewiger, unser G’tt, König der Welt, der uns durch seine Gebote geheiligt und uns geboten hat';

const BRACHA_KOENIG = 'בָּרוּךְ אַתָּה ה׳ אֱלֹקֵינוּ מֶלֶךְ הָעוֹלָם';
const BRACHA_KOENIG_UMSCHRIFT = 'Baruch ata Haschem, Elokejnu melech ha-olam';
const BRACHA_KOENIG_DE = 'Gesegnet bist Du, Ewiger, unser G’tt, König der Welt';

export const CHANUKA = [
  {
    id: 'chan-01',
    nr: 1,
    q: 'Nenne das jüdische Datum von Chanuka.',
    type: 'fakt',
    kurz: 'Vom 25. Kislew bis zum 2. Tewet (oder 3. Tewet, wenn der Kislew nur 29 Tage hat). Die erste Kerze zündet man am Abend vor dem 25. Kislew.',
    punkte: ['Chanuka fällt meist in den Dezember.'],
  },
  {
    id: 'chan-02',
    nr: 2,
    q: 'Wie viele Tage feiern wir Chanuka?',
    type: 'fakt',
    kurz: 'Acht Tage, nach dem Wunder, dass das Öl für einen Tag acht Tage lang brannte (Frage 3).',
    punkte: ['Chanuka ist kein Feiertag mit Arbeitsverbot. Viele Frauen arbeiten nicht, solange die Lichter brennen.'],
  },
  {
    id: 'chan-03',
    nr: 3,
    q: 'Warum feiern wir Chanuka?',
    kurz: 'Zur Erinnerung an zwei Wunder um 165 v. d. Z.: Die kleine Schar der Makkabäer (Hasmonäer) besiegte das große Heer der griechisch-syrischen Herrscher, die die Tora verbieten wollten, und weihte den entweihten Tempel neu ein. Dort fand man nur ein Krüglein reines Öl für einen Tag, und die Menora brannte damit acht Tage, bis neues Öl bereit war.',
    punkte: [
      'König Antiochus IV. verbot Schabbat, Beschneidung und Torastudium und stellte im Tempel Götzenbilder auf.',
      'Mattitjahu und seine Söhne, vor allem Jehuda ha-Makkabi, führten den Aufstand.',
      'Man zündet die Lichter, um das Wunder bekannt zu machen („Pirsumej Nissa“).',
      'Chanuka feiert den Sieg des Glaubens über die Anpassung an die griechische Kultur.',
    ],
    quelle: 'Talmud, Schabbat 21b; 1. Makkabäerbuch 4',
  },
  {
    id: 'chan-04',
    nr: 4,
    q: 'Was bedeutet das Wort Chanuka?',
    type: 'fakt',
    kurz: 'Chanuka heißt „Einweihung“: die Wiedereinweihung des Tempels und des Altars. Eine Deutung liest darin „Chanu Kaf-He“: „Sie ruhten am 25.“ (Kaf-He = 25) – am 25. Kislew ruhten die Makkabäer vom Kampf.',
    punkte: ['Das Fest heißt auch „Fest der Lichter“.'],
    hebrew: [{ label: 'Chanuka', text: 'חֲנֻכָּה', translit: 'chanuka', de: 'Einweihung' }],
  },
  {
    id: 'chan-05',
    nr: 5,
    q: 'Wie lautet die Brachot für das Anzünden der Chanuka-Kerzen?',
    type: 'fakt',
    kurz: 'Jeden Abend zwei Segenssprüche: „le-hadlik ner schel Chanuka“ und „sche-asa nissim la-awotejnu“. Am ersten Abend kommt Schehechejanu dazu. Man spricht die Segen vor dem Zünden.',
    punkte: [
      'Den vollen Wortlaut zum Aufsagen siehe unten.',
      'Die Segen spricht man vor dem Zünden, anders als beim Schabbat-Licht.',
    ],
    hebrew: [
      {
        label: 'Segen 1',
        text: `${BRACHA_ANFANG} לְהַדְלִיק נֵר שֶׁל חֲנֻכָּה.`,
        translit: `${BRACHA_ANFANG_UMSCHRIFT} le-hadlik ner schel Chanuka.`,
        de: `${BRACHA_ANFANG_DE}, das Chanuka-Licht zu zünden.`,
      },
      {
        label: 'Segen 2',
        text: `${BRACHA_KOENIG}, שֶׁעָשָׂה נִסִּים לַאֲבוֹתֵינוּ בַּיָּמִים הָהֵם בַּזְּמַן הַזֶּה.`,
        translit: `${BRACHA_KOENIG_UMSCHRIFT}, sche-asa nissim la-awotejnu ba-jamim ha-hem ba-sman ha-se.`,
        de: `${BRACHA_KOENIG_DE}, der unseren Vätern Wunder getan hat in jenen Tagen, zu dieser Zeit.`,
      },
      {
        label: 'Segen 3 (erster Abend)',
        text: `${BRACHA_KOENIG}, שֶׁהֶחֱיָנוּ וְקִיְּמָנוּ וְהִגִּיעָנוּ לַזְּמַן הַזֶּה.`,
        translit: `${BRACHA_KOENIG_UMSCHRIFT}, schehechejanu we-kijemanu we-higianu la-sman ha-se.`,
        de: `${BRACHA_KOENIG_DE}, der uns hat leben lassen, uns erhalten und uns diese Zeit hat erreichen lassen.`,
      },
    ],
    quelle: 'Schulchan Aruch, Orach Chajim 676',
  },
  {
    id: 'chan-06',
    nr: 6,
    q: 'Wie viele Kerzen zünden wir?',
    type: 'fakt',
    kurz: 'Am ersten Abend eine, an jedem weiteren Abend eine mehr, am achten Abend acht. Dazu kommt jeden Abend der Schamasch („Diener“), mit dem man die anderen zündet. Zusammen sind es 36 Lichter ohne Schamasch.',
    punkte: [
      'So folgt man der Schule Hillels: Die Heiligkeit soll wachsen, nicht abnehmen (Talmud, Schabbat 21b).',
      'Der Schamasch steht höher oder abseits, damit man ihn nicht mitzählt.',
      'Am liebsten zündet man mit Olivenöl, Kerzen sind auch erlaubt.',
    ],
    quelle: 'Talmud, Schabbat 21b',
  },
  {
    id: 'chan-07',
    nr: 7,
    q: 'Welche 2 Dinge muss man beachten, wenn man an einem Freitag die Chanuka-Kerzen zündet?',
    kurz: 'Erstens: Die Chanuka-Lichter zündet man vor den Schabbat-Kerzen, also vor Sonnenuntergang. Zweitens: Sie müssen genug Öl oder lange genug Kerzen haben, um bis mindestens eine halbe Stunde nach Einbruch der Dunkelheit zu brennen.',
    punkte: [
      'Die üblichen kleinen Chanuka-Kerzen reichen dafür oft nicht – man nimmt größere oder mehr Öl.',
      'Am Samstagabend zündet man erst nach Schabbat-Ausgang: zu Hause meist nach der Hawdala, in der Synagoge vorher.',
      'Die Chanukia steht am Schabbat danach an ihrem Platz; sie ist Mukze.',
    ],
    quelle: 'Schulchan Aruch, Orach Chajim 679',
  },
  {
    id: 'chan-08',
    nr: 8,
    q: 'Was kann man mit den Chanuka-Kerzen machen nachdem sie jede Nacht gezündet wurden?',
    kurz: 'Nichts außer sie anschauen. Ihr Licht darf man nicht benutzen, etwa zum Lesen oder Arbeiten. So heißt es in „ha-Nerot halalu“: „Wir haben nicht die Erlaubnis, sie zu benutzen, nur sie anzusehen.“',
    punkte: [
      'Deshalb gibt es den Schamasch: Benutzt man versehentlich Licht, dann seins.',
      'Man soll die Lichter auch nicht vor Ablauf der Pflichtzeit (eine halbe Stunde) löschen.',
      'Übrig gebliebenes Öl und Dochte verbrennt man nach Chanuka.',
    ],
    quelle: 'Schulchan Aruch, Orach Chajim 673,1 und 677,4',
  },
  {
    id: 'chan-09',
    nr: 9,
    q: 'Was bedeutet das Gebet Al Hanissim?',
    kurz: '„Al ha-Nissim“ heißt „für die Wunder“. Es ist ein Dankgebet, das man an Chanuka (und Purim) in die Amida (im Segen „Modim“) und ins Tischgebet einfügt. Es erzählt kurz, wie G’tt die Wenigen über die Vielen siegen ließ und wie der Tempel neu eingeweiht wurde.',
    punkte: [
      'Vergisst man es, wiederholt man das Gebet nicht.',
      'Der Purim-Text erzählt dagegen von Mordechai und Esther (Teil 7).',
    ],
    hebrew: [{ label: 'Für die Wunder', text: 'עַל הַנִּסִּים', translit: 'al ha-nissim', de: 'für die Wunder' }],
  },
  {
    id: 'chan-10',
    nr: 10,
    q: 'Welche Regeln müssen bezüglich der Einhaltung des Kerzenzündens und die Zeit des Kerzenzündens befolgt werden?',
    kurz: 'Man zündet nach Einbruch der Dunkelheit (oder nach Brauch bei Sonnenuntergang), und die Lichter müssen mindestens eine halbe Stunde brennen. Man stellt die Lichter von rechts nach links auf und zündet das neueste (linke) zuerst. Alle stehen in einer Reihe auf gleicher Höhe, der Schamasch abgesetzt.',
    punkte: [
      'Wer nicht rechtzeitig zünden konnte, darf es noch tun, solange im Haus jemand wach ist (mit Segen, wenn Leute auf der Straße sind oder die Familie da ist).',
      'Frauen sind ebenso verpflichtet, denn auch sie waren Teil des Wunders.',
      'Während die Lichter die Pflichtzeit brennen, arbeitet man nicht und bleibt dabei.',
      'Bei Aschkenasim zündet oft jedes Familienmitglied eine eigene Chanukia, bei Sefarden eine pro Haushalt.',
      'Freitag und Samstagabend: Frage 7.',
    ],
    quelle: 'Schulchan Aruch, Orach Chajim 672–676',
    check: 'Ob man bei Sonnenuntergang oder bei Dunkelheit zündet und wer im Haus zündet, ist Brauch der Familie.',
  },
  {
    id: 'chan-11',
    nr: 11,
    q: 'Wo wird die Menorah platziert?',
    kurz: 'An der Haustür zur Straße hin, auf der linken Seite (gegenüber der Mesusa), damit man von Mizwot umgeben ist. Wer nicht an der Straße wohnt, stellt sie ins Fenster zur Straße. Ziel ist, das Wunder öffentlich zu machen.',
    punkte: [
      'Die Lichter sollen zwischen 3 und 10 Handbreit (etwa 25 bis 80 cm) über dem Boden stehen, im Fenster höchstens 20 Ellen hoch.',
      'Wo es gefährlich ist, sie zu zeigen, stellt man sie drinnen auf, etwa auf den Tisch – so war es oft in der Diaspora.',
      'Der Leuchter heißt eigentlich Chanukia; die Menora im Tempel hatte sieben Arme.',
    ],
    quelle: 'Talmud, Schabbat 21b–22a; Schulchan Aruch, Orach Chajim 671',
    check: 'Wo die Chanukia in der eigenen Wohnung stehen soll (Tür oder Fenster), bitte beim Lehrer klären.',
  },
  {
    id: 'chan-12',
    nr: 12,
    q: 'Was wird nach dem Zünden der Chanuka-Kerzen gesungen?',
    kurz: '„ha-Nerot halalu“ („Diese Lichter“), das erklärt, warum man die Lichter zündet und dass man sie nur ansehen darf, und danach „Ma’os Zur“ („Fels meiner Rettung“), ein Lied über die Rettung des Volkes in allen Epochen.',
    punkte: [
      'Ma’os Zur hat sechs Strophen: Ägypten, Babel, Purim, Chanuka und die künftige Erlösung.',
      'Sefarden singen oft Psalm 30 („Mismor schir chanukat ha-bajit“).',
    ],
    hebrew: [
      { label: 'Diese Lichter', text: 'הַנֵּרוֹת הַלָּלוּ', translit: 'ha-nerot halalu', de: 'diese Lichter' },
      { label: 'Fels meiner Rettung', text: 'מָעוֹז צוּר', translit: 'ma’os zur', de: 'Fels meiner Rettung' },
    ],
  },
  {
    id: 'chan-13',
    nr: 13,
    q: 'Was ist ein Sewiwon (Dreidel)? Welche Buchstaben sich darauf?',
    kurz: 'Ein Kreisel mit vier Seiten, mit dem man an Chanuka spielt. Darauf stehen die Buchstaben Nun, Gimel, He, Schin für „Nes gadol haja scham“: „Ein großes Wunder geschah dort“. In Israel steht statt Schin ein Pe für „po“ („hier“).',
    punkte: [
      'Nach der Überlieferung lernten Kinder unter den Griechen heimlich Tora und spielten, wenn Soldaten kamen, zum Schein mit dem Kreisel.',
      'Beim Spiel um Nüsse oder Münzen bedeutet: Nun = nichts, Gimel = alles, He = die Hälfte, Schin = einzahlen.',
    ],
    hebrew: [
      { label: 'Sewiwon', text: 'סְבִיבוֹן', translit: 'sewiwon', de: 'Kreisel' },
      { label: 'Buchstaben', text: 'נ ג ה ש', translit: 'nun, gimel, he, schin', de: 'Nes gadol haja scham' },
      { label: 'Bedeutung', text: 'נֵס גָּדוֹל הָיָה שָׁם', translit: 'nes gadol haja scham', de: 'ein großes Wunder geschah dort' },
    ],
  },
  {
    id: 'chan-14',
    nr: 14,
    q: 'Welche traditionellen Speisen werden an Chanuka gegessen?',
    kurz: 'In Öl Gebackenes, zur Erinnerung an das Ölwunder: Latkes (Kartoffelpuffer) und Sufganijot (Krapfen, Pfannkuchen). Viele essen auch Milchspeisen, besonders Käse.',
    punkte: [
      'Milchspeisen erinnern an Jehudit, die einem feindlichen Feldherrn Käse und Wein gab und ihn dann tötete.',
      'Chanuka-Geld (Gelt) für Kinder ist ein weiterer Brauch.',
    ],
    quelle: 'Rema, Orach Chajim 670,2',
  },
];
