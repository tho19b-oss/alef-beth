// Giur-Wissen, Teil 15: Synagoge.
//
// Fragetexte stehen wörtlich im Prüfungskatalog (offensichtliche Tippfehler
// berichtigt). Die Antworten wurden als ENTWURF geschrieben und sind noch von
// keinem Rabbiner oder Lehrer durchgesehen: Alle Fragen tragen den
// Standardstatus 'entwurf'. Erst was der Prüfbogen bestätigt oder korrigiert,
// bekommt status 'geprueft'. Bräuche, die je nach Gemeinde abweichen, und
// unklare Fragen stehen im Feld `check`.
//
// Die Fragen 5 bis 7 überschneiden sich mit den Begriffen aus Teil 11
// (Mechiza, Esrat Naschim); die Antworten verweisen darauf.
//
// Felder je Frage: siehe Kopf von kaschrut.js.
//
// Nur reiner Text: Die Anzeige maskiert alles, HTML hat hier keine Wirkung.

export const SYNAGOGE = [
  {
    id: 'syn-01',
    nr: 1,
    q: 'An welchen Tagen wird die Tora gelesen?',
    type: 'fakt',
    kurz: 'Am Montag und Donnerstag (morgens), am Schabbat (morgens und nachmittags zu Mincha), an Rosch Chodesch, an allen Feiertagen und an Chol ha-Mo’ed, an Chanukka, an Purim und an den Fasttagen.',
    punkte: [
      'Nach der Überlieferung ordnete schon Mosche an, dass nie drei Tage ohne Tora vergehen; Esra führte die Lesung am Montag und Donnerstag ein, die Markttage, an denen die Leute in die Stadt kamen.',
      'Am Schabbat-Morgen liest man den ganzen Wochenabschnitt (Parascha), an den anderen Tagen nur den Anfang des nächsten oder einen passenden Abschnitt.',
      'Für die Toralesung braucht man einen Minjan.',
    ],
    quelle: 'Talmud, Bawa Kamma 82a',
  },
  {
    id: 'syn-02',
    nr: 2,
    q: 'Wie viele Alijot werden am Schabbat verteilt?',
    type: 'fakt',
    kurz: 'Sieben, dazu der Maftir (der Achte, der auch die Haftara liest).',
    punkte: [
      'Zum Vergleich: Montag, Donnerstag, Schabbat-Mincha und Fasttage drei; Rosch Chodesch und Chol ha-Mo’ed vier; Feiertage fünf; Jom Kippur sechs.',
      'Am Schabbat darf man weitere Alijot hinzufügen.',
      'Alija heißt „Aufstieg“: Man steigt zur Bima hinauf.',
    ],
    quelle: 'Talmud, Megilla 21a–23a',
  },
  {
    id: 'syn-03',
    nr: 3,
    q: 'Aus welchem Grund wird eine Person mit einer „Alija“ geehrt? Nenne ein paar Beispiele.',
    kurz: 'Eine Alija ist eine Ehre, die man aus einem besonderen Anlass bekommt: zur Bar Mizwa, als Bräutigam am Schabbat vor der Hochzeit (Aufruf), als Vater nach der Geburt eines Kindes (Namensgebung der Tochter), am Jahrzeit eines Elternteils, nach überstandener Gefahr (zum Birkat ha-Gomel) oder als Gast.',
    punkte: [
      'Die erste Alija bekommt ein Kohen, die zweite ein Levi, danach Jisra’elim.',
      'Wer aufgerufen wird, spricht vor und nach dem Lesen einen Segen über die Tora.',
      'Man ruft jemanden mit seinem hebräischen Namen und dem Namen des Vaters auf (Konvertiten: „ben Awraham Awinu“).',
    ],
  },
  {
    id: 'syn-04',
    nr: 4,
    q: 'Nenne den hebräischen Begriff für:',
    sub: ['„Heilige Lade“', 'Vorhang vor der „Heiligen Lade“', 'erhobene Plattform, auf der der Tisch zum Lesen der Tora steht', 'Ausheben der Tora', 'Zusammenrollen und Binden der Tora', 'Rabbi', 'Kantor', 'Sexton'],
    type: 'fakt',
    kurz: 'Aron ha-Kodesch, Parochet, Bima, Hagba’a, Gelila, Raw, Chasan, Schammasch.',
    punkte: [
      'a. Aron ha-Kodesch: der Schrein für die Torarollen, an der Wand nach Jerusalem.',
      'b. Parochet: wie der Vorhang vor dem Allerheiligsten im Stiftszelt.',
      'c. Bima (auch Almemor oder bei Sefardim Tewa): meist in der Mitte der Synagoge.',
      'd. Hagba’a: Die Torarolle wird nach der Lesung geöffnet hochgehoben, damit alle die Schrift sehen.',
      'e. Gelila: Die Rolle wird zusammengerollt, gebunden und angezogen.',
      'f. Raw (Rabbiner, „Lehrer“).',
      'g. Chasan oder Schaliach Zibbur (Vorbeter, „Gesandter der Gemeinde“).',
      'h. Schammasch („Diener“); für die Ordnung im Gottesdienst sorgt der Gabbai.',
    ],
    hebrew: [
      { label: 'Heilige Lade', text: 'אֲרוֹן הַקֹּדֶשׁ', translit: 'aron ha-kodesch', de: 'heiliger Schrein' },
      { label: 'Vorhang', text: 'פָּרֹכֶת', translit: 'parochet', de: 'Vorhang' },
      { label: 'Plattform', text: 'בִּימָה', translit: 'bima', de: 'Bühne, Podest' },
      { label: 'Ausheben', text: 'הַגְבָּהָה', translit: 'hagbaha', de: 'Hochheben' },
      { label: 'Zusammenrollen', text: 'גְּלִילָה', translit: 'gelila', de: 'Rollen' },
      { label: 'Rabbi', text: 'רַב', translit: 'raw', de: 'Lehrer, Rabbiner' },
      { label: 'Kantor', text: 'חַזָּן', translit: 'chasan', de: 'Vorbeter' },
      { label: 'Synagogendiener', text: 'שַׁמָּשׁ', translit: 'schammasch', de: 'Diener' },
    ],
    check: 'Für „Rabbi“ ist auch „Rabbiner“ oder „Raw“ üblich; welche Form erwartet wird, bitte klären.',
  },
  {
    id: 'syn-05',
    nr: 5,
    q: 'Wie heißt die Trennung zwischen Männern und Frauen?',
    type: 'fakt',
    kurz: 'Mechiza (Trennwand).',
    hebrew: [{ label: 'Mechiza', text: 'מְחִיצָה', translit: 'mechiza', de: 'Trennwand' }],
  },
  {
    id: 'syn-06',
    nr: 6,
    q: 'Was ist eine Mechiza?',
    kurz: 'Die Trennwand, der Vorhang oder das Gitter in der Synagoge zwischen dem Bereich der Männer und dem der Frauen. Ohne Mechiza ist ein Raum nach orthodoxer Halacha für das gemeinsame Gebet nicht geeignet.',
    punkte: ['Die Frauen sitzen dahinter oder auf einer Empore. Die Höhe der Wand regeln die Autoritäten unterschiedlich.'],
  },
  {
    id: 'syn-07',
    nr: 7,
    q: 'Was ist Esrat Naschim?',
    kurz: 'Der Frauenbereich der Synagoge, hinter der Mechiza oder auf der Empore. Der Name stammt vom Vorhof der Frauen im Tempel in Jerusalem.',
    punkte: ['Siehe auch Teil 11, Begriffe 1.16 und 1.17.'],
  },
  {
    id: 'syn-08',
    nr: 8,
    q: 'Warum gibt es eine Teilung zwischen Männern und Frauen?',
    kurz: 'Damit jeder beim Gebet ganz auf G’tt ausgerichtet ist (Kawana) und nicht abgelenkt wird, und aus Zniut. Vorbild ist der Tempel: Bei der großen Feier an Sukkot baute man eine Empore für die Frauen, damit Männer und Frauen sich nicht mischen.',
    punkte: ['Die Trennung ist keine Wertung: Frauen und Männer haben vor G’tt den gleichen Wert, aber unterschiedliche Pflichten beim Gebet.'],
    quelle: 'Talmud, Sukka 51b–52a',
  },
  {
    id: 'syn-09',
    nr: 9,
    q: 'Was waren die Aufgaben der Leviten während der Zeit des Tempels?',
    kurz: 'Sie sangen und musizierten beim Opferdienst (jeden Tag einen eigenen Psalm), bewachten die Tore und Höfe des Tempels und halfen den Kohanim. In der Wüste trugen und bauten sie das Stiftszelt. Außerdem lehrten sie das Volk Tora.',
    punkte: [
      'Sie bekamen kein eigenes Land, sondern 48 Städte und den Zehnt (Ma’asser).',
      'Heute werden Leviten als Zweite zur Tora aufgerufen und waschen den Kohanim vor dem Priestersegen die Hände.',
      'Der Psalm des Tages (Schir schel Jom) am Ende des Morgengebets ist der Psalm, den die Leviten an diesem Tag sangen.',
    ],
    quelle: '4. Mose 3–4 und 18; 1. Chronik 23–26',
  },
  {
    id: 'syn-10',
    nr: 10,
    q: 'Von welchen Aufgaben sind die Leviten und die Kohanim ausgeschlossen?',
    kurz: 'Sie sind von der Auslösung der Erstgeborenen (Pidjon ha-Ben) befreit, weil sie selbst G’tt geweiht sind. Leviten und Kohanim bekamen kein Erbteil im Land. Ein Kohen darf sich nicht an Toten unrein machen (keinen Friedhof betreten, außer bei nächsten Verwandten) und darf keine geschiedene Frau und keine Konvertitin heiraten.',
    punkte: [
      'Kohanim und Leviten mussten im Altertum keinen Zehnt geben, sondern bekamen ihn.',
      'Gerade für Konvertitinnen wichtig: Eine Ehe mit einem Kohen ist nach der Halacha nicht erlaubt.',
    ],
    quelle: '3. Mose 21,1–7; 4. Mose 18,20–24; Talmud, Bechorot 47a',
    check: 'Die Frage ist offen formuliert („ausgeschlossen“ kann „befreit“ oder „nicht erlaubt“ heißen); welche Antwort erwartet wird, bitte klären.',
  },
  {
    id: 'syn-11',
    nr: 11,
    q: 'Wie drückt sich die Ehrfurcht vor G’tt in den Gottesdiensten aus? Nenne ein paar Beispiele.',
    kurz: 'Man kleidet sich ordentlich und bedeckt den Kopf (Kippa), redet nicht während des Gebets und der Toralesung, steht bei der Amida mit geschlossenen Füßen in Richtung Jerusalem und verneigt sich, steht auf, wenn der Toraschrein geöffnet ist oder die Tora getragen wird, und küsst die Tora mit dem Tallit oder Gebetbuch.',
    punkte: [
      'Über vielen Toraschreinen steht: „Da lifnej mi ata omed“, „Wisse, vor wem du stehst“ (nach Berachot 28b).',
      'Bei der Amida tritt man drei Schritte vor und am Ende drei Schritte zurück wie vor einem König.',
      'Man rennt nicht durch die Synagoge (außer um hinzukommen), isst nicht darin und benutzt sie nicht als Abkürzung.',
      'Man legt die Hand über die Augen beim ersten Satz des Sch’ma.',
    ],
    quelle: 'Talmud, Berachot 28b und 31a; Schulchan Aruch, Orach Chajim 151',
  },
  {
    id: 'syn-12',
    nr: 12,
    q: 'Darf man eine nicht-orthodoxe heilige Stätte betreten? Warum?',
    kurz: 'Eine Kirche betritt man nach der Halacha nicht, weil viele Autoritäten das Christentum mit seinem Glauben an die Dreifaltigkeit als Götzendienst (Awoda Sara) einstufen. Eine Moschee ist nach vielen erlaubt zu betreten, weil der Islam an einen einzigen G’tt glaubt, aber man betet dort nicht. In einer nicht-orthodoxen (liberalen) Synagoge soll man nicht beten, weil Mechiza und Gebetsordnung nicht der Halacha entsprechen.',
    punkte: [
      'Zum Besuch nichtjüdischer Feiern in der Familie: Teil 12, Frage 53.',
      'Beim Besuch als Tourist (Museum, Kathedrale) urteilen Rabbiner ebenfalls unterschiedlich.',
    ],
    quelle: 'Schulchan Aruch, Jore De’a 150; Rambam, Hilchot Awoda Sara 9,4',
    check: 'Die Frage ist mehrdeutig („nicht-orthodox“ = liberale Synagoge oder anderer Glaube?); bitte klären, wie das Beit Din sie versteht und was erlaubt ist.',
  },
];
