// Giur-Wissen, Teil 16: Tefilla (Gebet).
//
// Fragetexte stehen wörtlich im Prüfungskatalog (offensichtliche Tippfehler
// berichtigt). Die Antworten wurden als ENTWURF geschrieben und sind noch von
// keinem Rabbiner oder Lehrer durchgesehen: Alle Fragen tragen den
// Standardstatus 'entwurf'. Erst was der Prüfbogen bestätigt oder korrigiert,
// bekommt status 'geprueft'. Bräuche, die je nach Gemeinde abweichen, und
// unklare Fragen stehen im Feld `check`.
//
// Felder je Frage: siehe Kopf von kaschrut.js.
//
// Nur reiner Text: Die Anzeige maskiert alles, HTML hat hier keine Wirkung.

export const TEFILLA = [
  {
    id: 'tef-01',
    nr: 1,
    q: 'Wie heißen das Morgengebet, das Mittagsgebet und das Abendgebet auf Hebräisch?',
    type: 'fakt',
    kurz: 'Schacharit (Morgengebet), Mincha (Nachmittagsgebet) und Ma’ariw oder Arwit (Abendgebet).',
    punkte: [
      'Nach dem Talmud führten die Väter sie ein: Awraham das Morgengebet, Jizchak das Nachmittagsgebet, Ja’akow das Abendgebet.',
      'Zugleich stehen sie für die täglichen Opfer im Tempel.',
      'An Schabbat, Feiertagen und Rosch Chodesch kommt Mussaf („Zusatz“) dazu, an Jom Kippur auch Ne’ila.',
    ],
    hebrew: [
      { label: 'Morgengebet', text: 'שַׁחֲרִית', translit: 'schacharit', de: 'Morgengebet' },
      { label: 'Nachmittagsgebet', text: 'מִנְחָה', translit: 'mincha', de: 'Gabe (Speiseopfer)' },
      { label: 'Abendgebet', text: 'מַעֲרִיב', translit: 'ma’ariw', de: 'Abendgebet' },
    ],
    quelle: 'Talmud, Berachot 26b',
  },
  {
    id: 'tef-02',
    nr: 2,
    q: 'Warum ist das Schema ebenfalls ein wichtiges Gebet?',
    kurz: 'Das Sch’ma ist das jüdische Glaubensbekenntnis: „Höre, Israel, der Ewige ist unser G’tt, der Ewige ist einzig“ (5. Mose 6,4). Mit ihm nimmt man jeden Tag die Herrschaft G’ttes (Ol Malchut Schamajim) und die Gebote an. Es zu sagen ist ein Gebot der Tora.',
    punkte: [
      'Es besteht aus drei Abschnitten: Sch’ma (5. Mose 6,4–9), We-haja im schamoa (5. Mose 11,13–21) und der Abschnitt über Zizit (4. Mose 15,37–41).',
      'Es sind die ersten Worte, die man einem Kind beibringt, und die letzten vor dem Tod; viele Märtyrer starben mit dem Sch’ma auf den Lippen.',
      'Beim ersten Vers bedeckt man die Augen mit der rechten Hand.',
    ],
    hebrew: [{
      label: 'Sch’ma Jisrael',
      text: 'שְׁמַע יִשְׂרָאֵל ה׳ אֱלֹקֵינוּ ה׳ אֶחָד',
      translit: 'Sch’ma Jisrael, Haschem Elokejnu, Haschem echad',
      de: 'Höre, Israel, der Ewige ist unser G’tt, der Ewige ist einzig',
    }],
    quelle: '5. Mose 6,4–9; Mischna, Berachot 2,2',
  },
  {
    id: 'tef-03',
    nr: 3,
    q: 'Wie oft wird es aufgesagt?',
    type: 'fakt',
    kurz: 'Zweimal am Tag, morgens und abends: „wenn du dich niederlegst und wenn du aufstehst“ (5. Mose 6,7). Dazu sagt man es vor dem Schlafen (Kri’at Sch’ma al ha-Mita).',
    punkte: ['Das Morgen-Sch’ma muss bis zum Ende der dritten Tagesstunde gesagt sein, das Abend-Sch’ma nach Einbruch der Nacht.'],
    quelle: '5. Mose 6,7; Mischna, Berachot 1,1–2',
  },
  {
    id: 'tef-04',
    nr: 4,
    q: 'Wie viele Brachot enthält das Schmone Essre?',
    type: 'fakt',
    kurz: 'Neunzehn. Ursprünglich waren es achtzehn („Schmone Esre“ heißt achtzehn); in der Zeit von Rabban Gamliel kam der Segen gegen die Verleumder (We-la-malschinim) dazu.',
    quelle: 'Talmud, Berachot 28b',
  },
  {
    id: 'tef-05',
    nr: 5,
    q: 'Wie oft wird es aufgesagt?',
    type: 'fakt',
    kurz: 'Dreimal am Tag an Werktagen: in Schacharit, Mincha und Ma’ariw.',
    punkte: ['An Schabbat und Feiertagen sagt man statt der 19 Segen eine kürzere Amida mit sieben Segen (Frage 7), dazu im Mussaf eine weitere.'],
  },
  {
    id: 'tef-06',
    nr: 6,
    q: 'Wer wiederholt das Schmone Essre?',
    type: 'fakt',
    kurz: 'Der Vorbeter (Chasan, Schaliach Zibbur) wiederholt es laut für die Gemeinde (Chasarat ha-Schaz), wenn ein Minjan da ist. Dabei sagt die Gemeinde die Keduscha und antwortet „Amen“.',
    punkte: ['Ursprünglicher Grund: damit auch die, die nicht selbst beten konnten, durch Zuhören und „Amen“ ihre Pflicht erfüllen.'],
  },
  {
    id: 'tef-07',
    nr: 7,
    q: 'Wie viele Segen enthält die Amida am Schabbat?',
    type: 'fakt',
    kurz: 'Sieben: die ersten drei und die letzten drei Segen wie am Werktag, dazwischen ein Segen über die Heiligkeit des Schabbat statt der dreizehn Bitten.',
    punkte: [
      'Am Schabbat bittet man nicht um persönliche Bedürfnisse, um die Ruhe und Freude des Tages nicht zu stören.',
      'Das Mussaf an Rosch Haschana hat neun Segen.',
    ],
  },
  {
    id: 'tef-08',
    nr: 8,
    q: 'Ab wann sagen wir das Mittagsgebet?',
    type: 'fakt',
    kurz: 'Ab einer halben Stunde nach dem Mittag (Mincha Gedola, sechseinhalb Stunden nach Tagesbeginn) bis Sonnenuntergang. Besser ist es nach dem Talmud ab Mincha Ketana (neuneinhalb Stunden).',
    punkte: ['Die Stunden sind „Zeitstunden“: Der helle Tag wird in zwölf gleiche Teile geteilt. Die genauen Zeiten stehen im Gemeindekalender.'],
    quelle: 'Mischna, Berachot 4,1; Schulchan Aruch, Orach Chajim 233',
  },
  {
    id: 'tef-09',
    nr: 9,
    q: 'Wievielmal am Tag wird das Alenu im Allgemeinen gesagt?',
    type: 'fakt',
    kurz: 'Dreimal: am Ende von Schacharit, Mincha und Ma’ariw.',
    punkte: ['Bei „wa-anachnu kor’im“ („wir beugen uns“) verneigt man sich. Zum Inhalt: Teil 4, Frage 8.'],
  },
  {
    id: 'tef-10',
    nr: 10,
    q: 'Was ist das „Kaddisch“-Gebet?',
    kurz: 'Ein Lobpreis auf Aramäisch, der G’ttes Namen heiligt und um das Kommen Seines Reiches bittet: „Jitgadal we-jitkadasch schmej rabba“. Die Gemeinde antwortet „Amen, jehe schmej rabba mewarach …“. Es trennt die Teile des Gottesdienstes und wird von Trauernden gesagt.',
    punkte: [
      'Arten: Chazi Kaddisch (halbes), Kaddisch Schalem (ganzes, nach der Amida), Kaddisch Jatom (der Trauernden) und Kaddisch de-Rabbanan (nach dem Lernen).',
      'Den Tod erwähnt es nicht (Teil 12, Frage 66).',
    ],
  },
  {
    id: 'tef-11',
    nr: 11,
    q: 'Benötigt es einen „Minjan“?',
    type: 'fakt',
    kurz: 'Ja. Kaddisch ist ein „Dawar sche-bi-Keduscha“, etwas Heiliges, das nur in Gegenwart von zehn jüdischen Männern über 13 Jahren gesagt wird.',
    punkte: ['Ebenso Barchu, Keduscha, die Wiederholung der Amida, die Toralesung und der Priestersegen.'],
    quelle: 'Talmud, Megilla 23b',
  },
  {
    id: 'tef-12',
    nr: 12,
    q: 'Gib eine kurze Zusammenfassung des Inhaltes des Schmone Essre.',
    kurz: 'Drei Segen des Lobes am Anfang (G’tt der Väter, G’ttes Macht und die Auferstehung, G’ttes Heiligkeit), dreizehn Bitten in der Mitte (um Erkenntnis, Umkehr, Vergebung, Erlösung, Heilung, ein gutes Jahr, Sammlung der Verbannten, gerechtes Gericht, gegen die Verleumder, für die Gerechten, für Jerusalem, für den Maschiach aus Davids Haus, dass G’tt das Gebet erhört) und drei Segen des Dankes am Schluss (Wiederherstellung des Tempeldienstes, Dank „Modim“, Bitte um Frieden).',
    punkte: [
      'Man betet sie stehend, still, mit geschlossenen Füßen, in Richtung Jerusalem.',
      'In der Bitte „Schome’a Tefilla“ darf man eigene Anliegen mit eigenen Worten einfügen.',
    ],
    quelle: 'Talmud, Berachot 33a und 34a; Megilla 17b',
  },
  {
    id: 'tef-13',
    nr: 13,
    q: 'Wann wird es vom Kantor aufgesagt?',
    type: 'fakt',
    kurz: 'In Schacharit, Mincha und Mussaf, nachdem die Gemeinde es still gebetet hat, wenn ein Minjan da ist. In Ma’ariw wird es nicht wiederholt, weil das Abendgebet ursprünglich freiwillig war.',
    punkte: ['Freitagabend sagt der Vorbeter stattdessen einen kurzen Ersatz (Magen Awot).'],
  },
  {
    id: 'tef-14',
    nr: 14,
    q: 'Was ist die dreifältige Struktur des Gebets?',
    kurz: 'Lob (Schewach), Bitte (Bakascha) und Dank (Hoda’a). Wie ein Diener vor seinem König lobt man G’tt zuerst, trägt dann seine Bitten vor und dankt zum Schluss.',
    quelle: 'Talmud, Berachot 34a',
  },
  {
    id: 'tef-15',
    nr: 15,
    q: 'Wer schrieb die „13 Artikel des Glaubens“?',
    type: 'fakt',
    kurz: 'Der Rambam (Maimonides), in seinem Kommentar zur Mischna (Sanhedrin, Kapitel Chelek).',
    punkte: ['Zum Rambam: Teil 14, Frage 11.'],
  },
  {
    id: 'tef-16',
    nr: 16,
    q: 'Welches Gedicht beruht darauf?',
    type: 'fakt',
    kurz: '„Jigdal“, ein Lied, das jeden der dreizehn Grundsätze in einer Zeile zusammenfasst. Man singt es oft am Anfang des Morgengebets oder am Ende des Freitagabend-Gottesdienstes.',
    punkte: [
      'Es wird Daniel ben Jehuda aus Rom (14. Jahrhundert) zugeschrieben.',
      'Dazu gibt es die Fassung in Prosa, die mit „Ani ma’amin“ („Ich glaube“) beginnt.',
    ],
  },
  {
    id: 'tef-17',
    nr: 17,
    q: 'Nenne die „13 Artikel“.',
    type: 'fakt',
    kurz: 'Man glaubt, dass G’tt (1) der Schöpfer ist, der alles lenkt, (2) einzig ist, (3) keinen Körper hat, (4) der Erste und der Letzte ist, (5) dass man nur zu Ihm beten darf, (6) dass die Worte der Propheten wahr sind, (7) dass Mosche der größte Prophet war, (8) dass die ganze Tora, die wir haben, Mosche gegeben wurde, (9) dass die Tora nicht ausgetauscht wird, (10) dass G’tt die Taten und Gedanken der Menschen kennt, (11) dass Er belohnt und bestraft, (12) dass der Maschiach kommen wird und (13) dass die Toten auferstehen werden.',
    punkte: ['Merkhilfe: 1–5 handeln von G’tt, 6–9 von Prophetie und Tora, 10–13 von Lohn, Strafe und Erlösung.'],
    quelle: 'Rambam, Kommentar zur Mischna, Sanhedrin 10',
  },
  {
    id: 'tef-18',
    nr: 18,
    q: 'Benötigt man für die folgenden Mizwot einen Minjan:',
    sub: ['Brit Mila', 'Beerdigung', 'Hochzeit'],
    kurz: 'Brit Mila und Beerdigung brauchen keinen Minjan, man bemüht sich aber darum; bei der Hochzeit braucht man ihn für die sieben Segen (Schewa Brachot).',
    punkte: [
      'a. Brit Mila: kein Minjan nötig, aber üblich und erwünscht, weil die Mizwa öffentlich gefeiert werden soll („Ehre des Königs in der Menge“).',
      'b. Beerdigung: Das Begraben braucht keinen Minjan, aber Kaddisch am Grab und die Trostreihen (Schura) brauchen einen.',
      'c. Hochzeit: Für die Kidduschin genügen zwei Zeugen; die Schewa Brachot unter der Chuppa brauchen einen Minjan (Talmud, Ketubot 7b).',
    ],
  },
  {
    id: 'tef-19',
    nr: 19,
    q: 'Was ist Tefillat Haderech?',
    kurz: 'Das Reisegebet: Man bittet G’tt um eine sichere Reise in Frieden und ohne Gefahren. Man sagt es einmal am Tag, wenn man eine Reise aus der Stadt antritt (mindestens etwa vier Kilometer außerhalb), sobald man den Ort verlassen hat.',
    punkte: ['Es beginnt: „Jehi razon mi-lefanecha … sche-tolichenu le-schalom“, „Es sei Dein Wille …, dass Du uns in Frieden führst“.'],
    hebrew: [{
      label: 'Anfang des Reisegebets',
      text: 'יְהִי רָצוֹן מִלְּפָנֶיךָ ה׳ אֱלֹקֵינוּ וֵאלֹקֵי אֲבוֹתֵינוּ שֶׁתּוֹלִיכֵנוּ לְשָׁלוֹם',
      translit: 'jehi razon mi-lefanecha Haschem Elokejnu we-Elokej awotejnu sche-tolichenu le-schalom',
      de: 'Es sei Dein Wille, Ewiger, unser G’tt und G’tt unserer Väter, dass Du uns in Frieden führst',
    }],
    quelle: 'Talmud, Berachot 29b–30a; Schulchan Aruch, Orach Chajim 110',
  },
  {
    id: 'tef-20',
    nr: 20,
    q: 'Wie viele Gebete sind für Frauen mindestens erforderlich?',
    kurz: 'Darüber sind sich die Autoritäten nicht einig. Nach dem Rambam genügt ein Gebet am Tag mit Lob, Bitte und Dank. Nach der Mischna Berura sollen Frauen täglich zweimal die Amida beten, in Schacharit und Mincha. Dazu kommen die Morgensegen (Birkot ha-Schachar) und das Tischgebet.',
    punkte: [
      'Frauen sind vom Sch’ma befreit (zeitgebunden), sagen aber gewöhnlich den ersten Vers.',
      'Ma’ariw gilt für Frauen nicht als Pflicht.',
    ],
    quelle: 'Talmud, Berachot 20b; Rambam, Hilchot Tefilla 1,2; Mischna Berura 106,4',
    check: 'Welche Gebete für Frauen erwartet werden (ein Gebet oder Schacharit und Mincha), bitte klären.',
  },
];
