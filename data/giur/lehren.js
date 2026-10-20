// Giur-Wissen, Teil 14: Jüdische Lehren.
//
// Fragetexte stehen wörtlich im Prüfungskatalog (offensichtliche Tippfehler
// berichtigt). Die Antworten wurden als ENTWURF geschrieben und sind noch von
// keinem Rabbiner oder Lehrer durchgesehen: Alle Fragen tragen den
// Standardstatus 'entwurf'. Erst was der Prüfbogen bestätigt oder korrigiert,
// bekommt status 'geprueft'. Bräuche und Fragen, bei denen die Halacha vom
// Einzelfall abhängt, stehen im Feld `check`.
//
// Die Fragen 20 bis 24 (Abtreibung, Selbstverteidigung, Organspende,
// Euthanasie, Geburtenkontrolle) geben die Grundhaltung wieder. Im Ernstfall
// entscheidet immer ein Rabbiner nach den genauen Umständen.
//
// Felder je Frage: siehe Kopf von kaschrut.js.
//
// Nur reiner Text: Die Anzeige maskiert alles, HTML hat hier keine Wirkung.

export const LEHREN = [
  {
    id: 'leh-01',
    nr: 1,
    q: 'Was bedeuten die Ausdrücke „Geschriebenes Gesetz“ und „Mündliches Gesetz“?',
    kurz: 'Das geschriebene Gesetz (Tora sche-bi-Chtaw) ist die schriftliche Tora, die fünf Bücher Mose (im weiteren Sinn der ganze Tanach). Das mündliche Gesetz (Tora sche-be-al Pe) ist die Erklärung dazu, die Mosche ebenfalls am Sinai erhielt und die von Generation zu Generation mündlich weitergegeben wurde. Erst später schrieb man sie in Mischna und Talmud nieder.',
    punkte: [
      'Ohne die mündliche Lehre versteht man die schriftliche nicht: Wie man schlachtet, was Tefillin genau sind oder welche Arbeiten am Schabbat verboten sind, steht nur dort.',
      '„Mosche empfing die Tora am Sinai und überlieferte sie Jehoschua, Jehoschua den Ältesten …“ (Pirkej Awot 1,1).',
      'Beide sind nach orthodoxem Glauben gleichermaßen von G’tt.',
    ],
    quelle: 'Pirkej Awot 1,1; Talmud, Schabbat 31a',
  },
  {
    id: 'leh-02',
    nr: 2,
    q: 'Welche gesammelten Werke beinhalten die schriftlichen und mündlichen Gesetze?',
    kurz: 'Das schriftliche Gesetz steht im Tanach (Tora, Propheten, Schriften). Das mündliche Gesetz steht in der Mischna (um 200 n. d. Z. von Rabbi Jehuda ha-Nassi geordnet) und im Talmud (Mischna mit der Gemara, der Diskussion darüber), dazu in den Midraschim.',
    punkte: [
      'Es gibt zwei Talmude: den babylonischen (Bawli, um 500 n. d. Z., maßgeblich) und den Jerusalemer (Jeruschalmi).',
      'Später fassten Gesetzeswerke die Halacha zusammen: Mischne Tora (Rambam), Arba’a Turim und der Schulchan Aruch (Frage 16).',
    ],
  },
  {
    id: 'leh-03',
    nr: 3,
    q: 'Der Tanach ist herkömmlich in drei Hauptteile aufgeteilt. Nenne sie auf Hebräisch und Deutsch.',
    type: 'fakt',
    kurz: 'Tora (Weisung, die fünf Bücher Mose), Newi’im (Propheten) und Ketuwim (Schriften). Aus den Anfangsbuchstaben T-N-K entsteht das Wort „Tanach“.',
    punkte: [
      'Newi’im: zum Beispiel Jehoschua, Richter, Samuel, Könige, Jeschajahu, Jirmejahu, Jecheskel und die zwölf kleinen Propheten.',
      'Ketuwim: zum Beispiel Psalmen, Sprüche, Ijow, die fünf Megillot (Hoheslied, Rut, Klagelieder, Kohelet, Ester), Daniel, Esra-Nechemja, Chronik.',
      'Insgesamt 24 Bücher.',
    ],
    hebrew: [
      { label: 'Tora', text: 'תּוֹרָה', translit: 'tora', de: 'Weisung, Lehre' },
      { label: 'Newi’im', text: 'נְבִיאִים', translit: 'newi’im', de: 'Propheten' },
      { label: 'Ketuwim', text: 'כְּתוּבִים', translit: 'ketuwim', de: 'Schriften' },
    ],
  },
  {
    id: 'leh-04',
    nr: 4,
    q: 'Nenne einige positive und einige negative Gebote der Tora.',
    kurz: 'Gebote (Mizwot Asse, „tu!“): den Schabbat heiligen, die Eltern ehren, morgens und abends das Sch’ma sagen, Tefillin anlegen, eine Mesusa anbringen, Zedaka geben. Verbote (Mizwot Lo Ta’asse, „tu nicht!“): nicht morden, nicht stehlen, kein Fleisch mit Milch kochen, an Pessach kein Chamez essen, nicht schlecht über andere reden, keine Rache nehmen.',
    quelle: 'Rambam, Sefer ha-Mizwot',
  },
  {
    id: 'leh-05',
    nr: 5,
    q: 'Wie ist die Gesamtzahl der „Mizwot“?',
    type: 'fakt',
    kurz: '613 (Tarjag Mizwot, nach den hebräischen Zahlbuchstaben Taw-Resch-Jud-Gimel).',
    punkte: ['Viele davon gelten heute nicht, weil sie am Tempel oder am Land Israel hängen. Dazu kommen die rabbinischen Gebote, etwa Chanukka-Lichter und Megilla.'],
    quelle: 'Talmud, Makkot 23b',
  },
  {
    id: 'leh-06',
    nr: 6,
    q: 'Wie viele davon sind negative und wie viele positive Gebote?',
    type: 'fakt',
    kurz: '248 Gebote (positiv) und 365 Verbote (negativ).',
    punkte: ['Nach dem Talmud entsprechen die 248 Gebote den Gliedern des menschlichen Körpers und die 365 Verbote den Tagen des Sonnenjahres: Mit dem ganzen Körper und an jedem Tag dient man G’tt.'],
    quelle: 'Talmud, Makkot 23b',
  },
  {
    id: 'leh-07',
    nr: 7,
    q: 'Erkläre das Wort „Mizwa“. Was bedeutet es, eine zu tun?',
    kurz: 'Mizwa heißt „Gebot“, von „ziwa“ (befehlen). Eine Mizwa tun heißt, G’ttes Willen zu erfüllen. Nach einer Deutung hängt das Wort mit „zawta“ (Verbindung) zusammen: Jede Mizwa verbindet den Menschen mit G’tt.',
    punkte: [
      'Umgangssprachlich heißt Mizwa auch einfach „gute Tat“.',
      '„Eine Mizwa zieht eine andere nach sich“ (Pirkej Awot 4,2).',
      'Man sagt vor vielen Mizwot einen Segen: „… der uns durch Seine Gebote geheiligt hat“.',
    ],
  },
  {
    id: 'leh-08',
    nr: 8,
    q: 'Nenne die fünf Bücher Mose.',
    type: 'fakt',
    kurz: 'Bereschit (1. Mose, Genesis), Schemot (2. Mose, Exodus), Wajikra (3. Mose, Levitikus), Bemidbar (4. Mose, Numeri) und Dewarim (5. Mose, Deuteronomium).',
    punkte: ['Die hebräischen Namen stammen jeweils aus den ersten Worten des Buches.'],
    hebrew: [
      { label: '1. Mose', text: 'בְּרֵאשִׁית', translit: 'bereschit', de: 'Im Anfang' },
      { label: '2. Mose', text: 'שְׁמוֹת', translit: 'schemot', de: 'Namen' },
      { label: '3. Mose', text: 'וַיִּקְרָא', translit: 'wajikra', de: 'Und Er rief' },
      { label: '4. Mose', text: 'בְּמִדְבַּר', translit: 'bemidbar', de: 'In der Wüste' },
      { label: '5. Mose', text: 'דְּבָרִים', translit: 'dewarim', de: 'Worte' },
    ],
  },
  {
    id: 'leh-09',
    nr: 9,
    q: 'Wie heißt der „Pentateuch“ auf Hebräisch?',
    type: 'fakt',
    kurz: 'Chumasch, von „Chamischa Chumsche Tora“, „die fünf Fünftel der Tora“.',
    hebrew: [{ label: 'Chumasch', text: 'חֻמָּשׁ', translit: 'chumasch', de: 'Fünftel (die fünf Bücher)' }],
  },
  {
    id: 'leh-10',
    nr: 10,
    q: 'Wer war Raschi, und wofür war er bekannt? Wo hat er gelebt?',
    kurz: 'Rabbi Schlomo Jizchaki (1040–1105), der wichtigste Erklärer von Tora und Talmud. Er lebte in Troyes in Frankreich und lernte in seiner Jugend in Worms und Mainz.',
    punkte: [
      'Sein Kommentar zur Tora erklärt jedes schwierige Wort einfach und klar; Kinder lernen bis heute „Chumasch mit Raschi“.',
      'Sein Talmud-Kommentar steht in jeder Ausgabe innen neben dem Text.',
      'Er verdiente sein Geld als Weinbauer.',
    ],
  },
  {
    id: 'leh-11',
    nr: 11,
    q: 'Wer war der Rambam, und wofür war er bekannt? Wo hat er gelebt?',
    kurz: 'Rabbi Mosche ben Maimon (Maimonides, 1138–1204), Gelehrter, Philosoph und Arzt. Er schrieb die Mischne Tora, das erste vollständige Gesetzeswerk der Halacha, und den „Führer der Unschlüssigen“ (More Newuchim). Geboren in Córdoba (Spanien), floh er vor Verfolgung über Fès (Marokko) nach Fustat (Kairo) in Ägypten, wo er Leibarzt am Hof Saladins war.',
    punkte: [
      'Von ihm stammen die dreizehn Glaubensgrundsätze (Teil 16, Frage 17).',
      'Man sagt: „Von Mosche bis Mosche stand keiner auf wie Mosche.“',
      'Begraben ist er in Tiberias.',
    ],
  },
  {
    id: 'leh-12',
    nr: 12,
    q: 'Wer war der Ramban, und wofür war er bekannt? Wo hat er gelebt?',
    kurz: 'Rabbi Mosche ben Nachman (Nachmanides, 1194–1270), Talmudgelehrter, Kabbalist und Arzt aus Girona in Spanien. Bekannt ist er für seinen tiefgründigen Kommentar zur Tora und dafür, dass er 1263 in Barcelona die jüdische Seite in einem öffentlichen Streitgespräch mit der Kirche vertrat.',
    punkte: [
      'Danach musste er Spanien verlassen. Er ging ins Land Israel und baute in Jerusalem die Gemeinde wieder auf; die Ramban-Synagoge dort trägt seinen Namen.',
      'Für ihn ist das Wohnen im Land Israel ein Gebot der Tora.',
    ],
  },
  {
    id: 'leh-13',
    nr: 13,
    q: 'Wer war Raw Jossef Karo, und wofür war er bekannt? Wo hat er gelebt?',
    kurz: 'Rabbi Josef Karo (1488–1575) verfasste den Schulchan Aruch, das bis heute maßgebliche Gesetzbuch der Halacha, und dazu das große Werk Beit Josef. Er wurde in Spanien (vermutlich Toledo) geboren, floh nach der Vertreibung 1492 ins Osmanische Reich und lebte zuletzt in Safed im Land Israel.',
    punkte: ['Er folgte meist den sefardischen Autoritäten; für Aschkenasim ergänzte ihn der Rema (Frage 14).'],
  },
  {
    id: 'leh-14',
    nr: 14,
    q: 'Wer war Raw Mosche Isserles, und wofür war er bekannt? Wo hat er gelebt?',
    kurz: 'Rabbi Mosche Isserles, der Rema (um 1530–1572), Rabbiner in Krakau (Polen). Er schrieb zum Schulchan Aruch Anmerkungen (die „Mappa“, das „Tischtuch“), die den Brauch der Aschkenasim festhalten. Seitdem gilt der Schulchan Aruch für Sefardim und Aschkenasim gemeinsam.',
    punkte: ['Seine Synagoge in Krakau steht heute noch.'],
  },
  {
    id: 'leh-15',
    nr: 15,
    q: 'Wer war der Chafez Chajim, und wofür war er bekannt? Wo hat er gelebt?',
    kurz: 'Rabbi Jisrael Me’ir Kagan (1838–1933) aus Radin (heute Belarus). Er schrieb das Buch „Chafez Chajim“ über die Gesetze gegen Laschon ha-Ra, nach dem man ihn nennt, und die Mischna Berura, einen maßgeblichen Kommentar zum Schulchan Aruch, Orach Chajim, den Aschkenasim im Alltag befolgen.',
    punkte: [
      'Der Name kommt aus Psalm 34,13–14: „Wer ist der Mensch, der Leben begehrt (chafez chajim) … Bewahre deine Zunge vor Bösem.“',
      'Er war bekannt für seine Bescheidenheit und gründete in Radin eine große Jeschiwa.',
    ],
  },
  {
    id: 'leh-16',
    nr: 16,
    q: 'Wie heißt das größte maßgebende Gesetz in der jüdischen Gesetzgebung?',
    type: 'fakt',
    kurz: 'Der Schulchan Aruch („Gedeckter Tisch“) von Rabbi Josef Karo, zusammen mit den Anmerkungen des Rema.',
    punkte: [
      'Er hat vier Teile: Orach Chajim (Alltag, Gebet, Schabbat, Feste), Jore De’a (Kaschrut, Trauer und anderes), Ewen ha-Eser (Ehe) und Choschen Mischpat (Recht).',
      'Vorher gab es die Mischne Tora des Rambam und die Arba’a Turim, nach denen der Schulchan Aruch geordnet ist.',
    ],
    check: 'Der Katalog schreibt „das größte maßgebende Gesetz“; vermutlich ist das Gesetzbuch gemeint.',
  },
  {
    id: 'leh-17',
    nr: 17,
    q: 'Wie ist die jüdische Einstellung gegenüber Sünde? Gibt es eine ursprüngliche Sünde?',
    kurz: 'Jeder Mensch kann sündigen, „denn es gibt keinen Gerechten auf Erden, der nur Gutes tut“ (Kohelet 7,20). Aber er kann immer umkehren (Teschuwa), und G’tt nimmt die Umkehr an. Eine Erbsünde gibt es nicht: Jeder Mensch wird mit einer reinen Seele geboren und ist nur für seine eigenen Taten verantwortlich.',
    punkte: [
      '„Mein G’tt, die Seele, die Du mir gegeben hast, ist rein“ (Morgengebet).',
      '„Der Sohn soll nicht die Schuld des Vaters tragen“ (Jecheskel 18,20).',
      'Die Sünde Adams brachte den Tod und die Mühe in die Welt, aber keine geerbte Schuld.',
      'Das hebräische Wort Chet heißt eigentlich „das Ziel verfehlen“.',
    ],
    quelle: 'Kohelet 7,20; Jecheskel 18,20; Rambam, Hilchot Teschuwa',
  },
  {
    id: 'leh-18',
    nr: 18,
    q: 'Warum ist die jüdische Erziehung von so großer Bedeutung für das jüdische Kind? Mit welchem Alter endet die Verpflichtung zu lernen?',
    kurz: 'Nur durch Lernen wird die Tora weitergegeben, und das jüdische Volk bleibt bestehen. Die Tora gebietet es: „Du sollst sie deinen Kindern einschärfen“ (5. Mose 6,7). Die Pflicht zu lernen endet nie, sie gilt bis zum letzten Lebenstag.',
    punkte: [
      'Der Vater muss den Sohn lehren, bis er selbst lernen kann, und ihm auch einen Beruf beibringen (Kidduschin 29a, 30b).',
      'Jeder Ort soll Lehrer für Kinder haben; die Welt besteht durch den Atem der Schulkinder (Schabbat 119b).',
      'Rambam: Jeder Jude ist verpflichtet, Tora zu lernen, ob arm oder reich, jung oder alt, bis zum Tag seines Todes (Hilchot Talmud Tora 1,8–10).',
    ],
    quelle: '5. Mose 6,7; Rambam, Hilchot Talmud Tora 1',
  },
  {
    id: 'leh-19',
    nr: 19,
    q: 'Was ist der Unterschied zwischen Orthodoxen und anderen religiösen Bewegungen im Judentum? Skizziere die grundlegenden Unterschiede.',
    kurz: 'Das orthodoxe Judentum glaubt, dass die schriftliche und die mündliche Tora von G’tt am Sinai gegeben wurden, und hält die Halacha für verbindlich und unveränderlich. Die konservative Bewegung (Masorti) hält die Halacha für verbindlich, aber im Lauf der Geschichte veränderbar. Das liberale oder Reformjudentum sieht die Gebote nicht als bindend an und stellt die Ethik und die persönliche Entscheidung in den Mittelpunkt.',
    punkte: [
      'Die Unterschiede zeigen sich etwa bei Schabbat, Kaschrut, gemischtem Sitzen in der Synagoge, Frauen als Rabbinerinnen und bei der Frage, wer Jude ist (manche Reformgemeinden erkennen auch die Abstammung über den Vater an).',
      'Übertritte, die nicht vor einem orthodoxen Beit Din erfolgt sind, erkennen orthodoxe Gemeinden und das israelische Oberrabbinat nicht an.',
      'Die Reformbewegung entstand im 19. Jahrhundert in Deutschland. Die Neo-Orthodoxie (Samson Raphael Hirsch) war die Antwort darauf.',
    ],
  },
  {
    id: 'leh-20',
    nr: 20,
    q: 'Wie ist die jüdische Einstellung gegenüber Abtreibung?',
    kurz: 'Abtreibung ist grundsätzlich verboten, weil das Ungeborene ein werdendes Leben ist. Sie ist aber erlaubt und sogar geboten, wenn das Leben der Mutter in Gefahr ist: Ihr Leben geht vor, solange das Kind noch nicht geboren ist (Mischna, Ohalot 7,6).',
    punkte: [
      'Vor der Geburt gilt das Ungeborene noch nicht als voller Mensch, deshalb ist Abtreibung kein Mord im Sinne der Halacha, aber trotzdem schwer verboten.',
      'Ob auch eine ernste Gefahr für die Gesundheit der Mutter oder eine schwere Krankheit des Kindes genügt, darüber urteilen die Autoritäten verschieden.',
    ],
    quelle: 'Mischna, Ohalot 7,6; Talmud, Sanhedrin 72b',
    check: 'In jedem konkreten Fall entscheidet ein Rabbiner (Posek) nach den genauen Umständen.',
  },
  {
    id: 'leh-21',
    nr: 21,
    q: 'Wie ist die jüdische Einstellung gegenüber Selbstverteidigung?',
    kurz: 'Selbstverteidigung ist erlaubt und geboten: „Wer kommt, um dich zu töten, dem komme zuvor“ (Talmud, Sanhedrin 72a). Auch einen anderen Menschen muss man vor einem Angreifer (Rodef) retten, notfalls mit Gewalt.',
    punkte: [
      'Man darf aber nur so viel Gewalt anwenden wie nötig; reicht es, den Angreifer zu verletzen, darf man ihn nicht töten.',
      '„Steh nicht untätig beim Blut deines Nächsten“ (3. Mose 19,16).',
      'Am Schabbat darf man sich selbstverständlich verteidigen (Lebensrettung).',
    ],
    quelle: '2. Mose 22,1; 3. Mose 19,16; Talmud, Sanhedrin 72a–74a',
  },
  {
    id: 'leh-22',
    nr: 22,
    q: 'Wie ist die jüdische Einstellung gegenüber Organspende?',
    kurz: 'Ein Leben zu retten ist eine der größten Mizwot. Eine Lebendspende (etwa einer Niere) gilt als sehr lobenswert, wenn die Gefahr für den Spender gering ist. Die Spende nach dem Tod ist nach vielen Autoritäten erlaubt und sogar ein Gebot, wenn damit unmittelbar ein Leben gerettet wird; strittig ist vor allem, wann ein Mensch als tot gilt (Hirntod oder Herzstillstand).',
    punkte: [
      'Bedenken: die Würde des Toten (Niwul ha-Met), das vollständige Begraben und der Zeitpunkt des Todes.',
      'Das israelische Oberrabbinat erkennt den Hirntod unter strengen Bedingungen an; andere Autoritäten nicht.',
      'Für Spenderausweise gibt es halachische Varianten, die einen Rabbiner einbeziehen.',
    ],
    check: 'Ob und in welcher Form ein Organspendeausweis ausgefüllt werden soll, bitte mit dem Rabbiner klären.',
  },
  {
    id: 'leh-23',
    nr: 23,
    q: 'Wie ist die jüdische Einstellung gegenüber Euthanasie?',
    kurz: 'Aktive Sterbehilfe ist verboten: Jedes Leben, auch jede Stunde Leben, hat unendlichen Wert, und den Tod herbeizuführen gilt als Mord. Erlaubt ist aber, Schmerzen zu lindern und etwas wegzunehmen, das das Sterben nur künstlich hinauszögert.',
    punkte: [
      'Der Rema erlaubt, ein „Hindernis“ zu entfernen, das den Tod des Sterbenden aufhält, verbietet aber alles, was ihn beschleunigt (Jore De’a 339,1).',
      'Wie weit man lebenserhaltende Maßnahmen beginnen oder fortsetzen muss, ist eine schwierige Einzelfrage.',
      'Auch Beihilfe zum Suizid ist verboten.',
    ],
    quelle: 'Talmud, Schabbat 151b; Rema, Jore De’a 339,1',
    check: 'Fragen am Lebensende (Patientenverfügung, Behandlungsabbruch) im Einzelfall mit dem Rabbiner klären.',
  },
  {
    id: 'leh-24',
    nr: 24,
    q: 'Wie ist die jüdische Einstellung gegenüber Geburtenkontrolle?',
    kurz: 'Kinder zu bekommen ist eine Mizwa („Seid fruchtbar und mehret euch“, 1. Mose 1,28); der Mann soll mindestens einen Sohn und eine Tochter haben. Verhütung ist deshalb nicht einfach frei. Aus guten Gründen, etwa Gesundheit der Frau, kann ein Rabbiner sie erlauben; dann werden Methoden bevorzugt, die den natürlichen Verkehr nicht verändern (etwa die Pille).',
    punkte: [
      'Auch nach dem Erfüllen des Mindestgebots ist es eine Mizwa, weitere Kinder zu bekommen (Jeschajahu 45,18; Kohelet 11,6).',
      'Die Frage wird nicht allein entschieden: Man spricht als Paar mit einem Rabbiner.',
    ],
    quelle: '1. Mose 1,28; Mischna, Jewamot 6,6; Schulchan Aruch, Ewen ha-Eser 1 und 5',
    check: 'Ob und welche Verhütung in welcher Lage erlaubt ist, entscheidet ein Rabbiner im Einzelfall.',
  },
];
