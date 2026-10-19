// Giur-Wissen, Teil 5: Sukkot.
//
// Fragetexte stehen wörtlich im Prüfungskatalog. Die Antworten wurden als ENTWURF
// geschrieben und sind noch von keinem Rabbiner oder Lehrer durchgesehen: Alle
// Fragen tragen den Standardstatus 'entwurf'. Erst was der Prüfbogen bestätigt
// oder korrigiert, bekommt status 'geprueft'. Bräuche, die je nach Gemeinde
// abweichen, und unklare Fragen stehen im Feld `check`.
//
// Die Antworten gehen vom Leben außerhalb Israels aus (zwei Festtage).
//
// Felder je Frage: siehe Kopf von kaschrut.js.
//
// Nur reiner Text: Die Anzeige maskiert alles, HTML hat hier keine Wirkung.

const BRACHA_ANFANG = 'בָּרוּךְ אַתָּה ה׳ אֱלֹקֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ';
const BRACHA_ANFANG_UMSCHRIFT = 'Baruch ata Haschem, Elokejnu melech ha-olam, ascher kidschanu be-mizwotaw we-zivanu';
const BRACHA_ANFANG_DE = 'Gesegnet bist Du, Ewiger, unser G’tt, König der Welt, der uns durch seine Gebote geheiligt und uns geboten hat';

export const SUKKOT = [
  {
    id: 'suk-01',
    nr: 1,
    q: 'Auf welches Datum des jüdischen Kalenders feiern wir Sukkot?',
    type: 'fakt',
    kurz: 'Am 15. Tischri, fünf Tage nach Jom Kippur. Sukkot dauert bis zum 21. Tischri (Hoschana Rabba).',
    punkte: ['Danach folgen Schmini Azeret (22.) und Simchat Tora (23. Tischri, Frage 11).'],
    quelle: '3. Mose 23,34',
  },
  {
    id: 'suk-02',
    nr: 2,
    q: 'Wie viele Tage feiern wir Sukkot?',
    type: 'fakt',
    kurz: 'Sieben Tage (15. bis 21. Tischri). Außerhalb Israels sind die ersten zwei Tage volle Feiertage (Jom Tow), die übrigen Halbfeiertage (Chol ha-Mo’ed). Mit Schmini Azeret und Simchat Tora sind es neun Festtage.',
    punkte: [
      'In Israel ist nur der erste Tag Jom Tow, und Schmini Azeret und Simchat Tora fallen auf einen Tag (acht Tage insgesamt).',
      'An Chol ha-Mo’ed sind viele Arbeiten eingeschränkt, aber nicht alle verboten.',
    ],
    quelle: '3. Mose 23,34–36',
  },
  {
    id: 'suk-03',
    nr: 3,
    q: 'Warum wird Sukkot auch als „Jahreszeit des Erfreuens“ bezeichnet? Worüber erfreuen wir uns?',
    kurz: 'Sukkot heißt im Gebet „Seman Simchatenu“ („Zeit unserer Freude“), weil die Tora an diesem Fest ausdrücklich Freude gebietet: „Du sollst dich freuen an deinem Fest“ (5. Mose 16,14). Man freut sich über die eingebrachte Ernte, über die Vergebung von Jom Kippur und über G’ttes Schutz in der Wüste.',
    punkte: [
      'Sukkot ist das Erntefest („Chag ha-Assif“, Fest der Einsammlung).',
      'Nach Jom Kippur ist man mit G’tt versöhnt und kann sich unbeschwert freuen.',
      'Im Tempel gab es das Fest des Wasserschöpfens (Simchat Beit ha-Scho’ewa): „Wer diese Freude nicht gesehen hat, hat nie Freude gesehen“ (Mischna, Sukka 5,1).',
      'Zur Freude gehören Festmahlzeiten, Fleisch und Wein für Männer, schöne Kleidung oder Schmuck für Frauen, Süßes für Kinder – und Gäste, Arme, Witwen und Waisen.',
    ],
    quelle: '5. Mose 16,13–15',
    hebrew: [{ label: 'Zeit unserer Freude', text: 'זְמַן שִׂמְחָתֵנוּ', translit: 'seman simchatenu', de: 'Zeit unserer Freude' }],
  },
  {
    id: 'suk-04',
    nr: 4,
    q: 'Wie wird eine Sukka gebaut? Woran soll es uns erinnern?',
    kurz: 'Eine Sukka ist eine Hütte unter freiem Himmel mit mindestens drei Wänden (zwei ganzen und einer teilweisen) und einem Dach aus Pflanzen (Sechach, Frage 5). Sie erinnert an die Hütten, in denen G’tt die Israeliten nach dem Auszug aus Ägypten wohnen ließ – nach Rabbi Elieser an die Wolken der Herrlichkeit, die sie schützten (3. Mose 23,42–43).',
    punkte: [
      'Mindestens 10 Handbreit (etwa 80 bis 100 cm) hoch, höchstens 20 Ellen (etwa 9 bis 10 m).',
      'Mindestens 7 mal 7 Handbreit Grundfläche (etwa 60 mal 60 cm).',
      'Nicht unter einem Baum, Balkon oder Dach bauen: Über dem Sechach muss der Himmel sein.',
      'Die Wände müssen stabil genug sein, dass der Wind sie nicht bewegt.',
      'Man schmückt die Sukka und wohnt darin: isst, lernt, manche schlafen auch darin.',
      'Es ist ein Brauch, direkt nach Jom Kippur mit dem Bau anzufangen.',
    ],
    quelle: '3. Mose 23,42–43; Talmud, Sukka 11b; Schulchan Aruch, Orach Chajim 630–634',
    hebrew: [{ label: 'Sukka', text: 'סֻכָּה', translit: 'sukka', de: 'Laubhütte' }],
  },
  {
    id: 'suk-05',
    nr: 5,
    q: 'Woraus wird das Dach gemacht? Welche Richtlinien müssen beim Errichten des Daches beachtet werden?',
    kurz: 'Das Dach (Sechach) besteht aus Pflanzenmaterial, das aus dem Boden gewachsen und von ihm getrennt ist und nicht als Gerät oder Lebensmittel dient: Zweige, Schilf, Bambus oder koschere Sechach-Matten. Es muss mehr Schatten als Sonne geben, aber so locker sein, dass man bei Nacht die Sterne sehen kann.',
    punkte: [
      'Nicht erlaubt: Metall, Plastik, Stoff, Bretter, die als Gerät dienten, Obst oder Gemüse.',
      'Man legt das Sechach erst auf, wenn die Wände stehen.',
      'Das Sechach darf nicht an etwas Untauglichem befestigt werden (zum Beispiel mit Metallnägeln direkt tragen) – Einzelheiten beim Rabbiner.',
      'Gegen Regen darf man es nicht mit einer Plane abdecken, während man darin sitzt.',
    ],
    quelle: 'Mischna, Sukka 1,4; Schulchan Aruch, Orach Chajim 629–631',
    hebrew: [{ label: 'Sechach', text: 'סְכָךְ', translit: 'sechach', de: 'Dachbedeckung der Sukka' }],
  },
  {
    id: 'suk-06',
    nr: 6,
    q: 'Welche vier Pflanzen werden für den feierlichen Brauch verwendet?',
    type: 'fakt',
    kurz: 'Die „Arba’a Minim“ (vier Arten): Etrog (Zitrusfrucht), Lulaw (Palmzweig), Hadassim (drei Myrtenzweige) und Arawot (zwei Bachweidenzweige). Man nimmt sie an jedem Tag von Sukkot außer am Schabbat, spricht den Segen und schüttelt sie in alle sechs Richtungen.',
    punkte: [
      'Die Tora nennt sie in 3. Mose 23,40.',
      'Lulaw, Hadassim und Arawot werden zusammengebunden; den Etrog hält man in der anderen Hand.',
      'Der Midrasch vergleicht sie mit vier Arten von Juden: Der Etrog hat Geschmack und Duft (Tora und gute Taten), die Weide keines von beidem – zusammen bilden sie das Volk.',
      'Man schüttelt sie auch beim Hallel und trägt sie bei den Hoschanot um die Bima (Frage 10).',
    ],
    hebrew: [
      { label: 'Vier Arten', text: 'אַרְבָּעָה מִינִים', translit: 'arba’a minim', de: 'vier Arten' },
      {
        label: 'Segen über die vier Arten',
        text: `${BRACHA_ANFANG} עַל נְטִילַת לוּלָב.`,
        translit: `${BRACHA_ANFANG_UMSCHRIFT} al netilat lulaw.`,
        de: `${BRACHA_ANFANG_DE}, den Lulaw zu nehmen.`,
      },
    ],
    quelle: '3. Mose 23,40; Wajikra Rabba 30,12',
  },
  {
    id: 'suk-07',
    nr: 7,
    q: 'Welchen Segensspruch wird während des Essens in der Sukka gesprochen? Wann sprechen wir diesen Segen?',
    kurz: '„le-schew ba-Sukka“ („in der Sukka zu sitzen“). Man sagt ihn, wenn man in der Sukka Brot oder Gebäck (mehr als eine Eigröße) isst, nach dem Segen über das Brot oder beim Kiddusch. Am ersten Abend folgt nach dem Segen Schehechejanu.',
    punkte: [
      'Bei Obst oder Getränken allein sagt man den Segen nicht.',
      'Am ersten Abend muss man in der Sukka mindestens ein Stück Brot (Ke-Sajit) essen – das ist Pflicht, auch bei Regen.',
      'Wer bei starkem Regen leidet, ist an den anderen Tagen befreit.',
    ],
    hebrew: [{
      label: 'Segen über das Sitzen in der Sukka',
      text: `${BRACHA_ANFANG} לֵישֵׁב בַּסֻּכָּה.`,
      translit: `${BRACHA_ANFANG_UMSCHRIFT} le-schew ba-Sukka.`,
      de: `${BRACHA_ANFANG_DE}, in der Sukka zu sitzen.`,
    }],
    quelle: 'Schulchan Aruch, Orach Chajim 639,8 und 643',
  },
  {
    id: 'suk-08',
    nr: 8,
    q: 'Wann ist der letzte Tag in dem in der Sukka gegessen wird? Was ist die Mukze am Schabbat von Sukkot?',
    kurz: 'Mit Segen isst man zuletzt an Hoschana Rabba, dem 21. Tischri, in der Sukka. Außerhalb Israels sitzen viele auch an Schmini Azeret noch in der Sukka, aber ohne den Segen. Am Schabbat von Sukkot sind die vier Arten Mukze, weil man sie am Schabbat nicht benutzt. Sechach und Sukka-Schmuck sind während des ganzen Festes Mukze.',
    punkte: [
      'Den Sukka-Schmuck darf man auch nicht abnehmen oder davon essen, solange das Fest dauert.',
      'An Simchat Tora isst man nicht mehr in der Sukka.',
      'Den Etrog darf man am Schabbat riechen, wenn man es so bestimmt hat, das ist eine Einzelfrage.',
    ],
    quelle: 'Schulchan Aruch, Orach Chajim 638 und 658,2',
    check: 'Ob man an Schmini Azeret noch in der Sukka isst, ist Brauch der Gemeinde (manche chassidische Gemeinden anders).',
  },
  {
    id: 'suk-09',
    nr: 9,
    q: 'Wann und warum feiern wir Hoschana Rabba?',
    kurz: 'Hoschana Rabba ist der siebte Tag von Sukkot, der 21. Tischri. An diesem Tag wird das Urteil von Jom Kippur endgültig abgeschlossen, und an Sukkot wird über den Regen des Jahres entschieden. Deshalb betet man besonders viel um Rettung und Regen.',
    punkte: [
      'Der Name heißt „Großes Hoschana“: An diesem Tag sagt man die meisten Hoschanot (Frage 10).',
      'Man wünscht sich „Pitka towa“ („einen guten Zettel“, das gute Urteil).',
      'Der Tag ist ein Halbfeiertag (Chol ha-Mo’ed), Arbeit ist eingeschränkt.',
    ],
    hebrew: [{ label: 'Hoschana Rabba', text: 'הוֹשַׁעְנָא רַבָּה', translit: 'hoschana rabba', de: 'das große Hoschana' }],
  },
  {
    id: 'suk-10',
    nr: 10,
    q: 'Wie wird Hoschana Rabba gefeiert? Welche Zeremonie wird dabei abgehalten?',
    kurz: 'Im Morgengebet umkreist die Gemeinde siebenmal mit den vier Arten die Bima und sagt die Hoschanot („Hilf doch!“), wie die Priester im Tempel den Altar umkreisten. Danach schlägt jeder ein Bündel von fünf Bachweiden (die „Hoschanot“) auf den Boden.',
    punkte: [
      'An den anderen Tagen von Sukkot geht man einmal um die Bima, an Hoschana Rabba siebenmal.',
      'Das Schlagen der Weiden ist ein Brauch der Propheten. Es steht für das Abschütteln der Sünden und die Bitte um Regen.',
      'Viele lernen die Nacht davor durch (Tikkun Leil Hoschana Rabba) und lesen das 5. Buch Mose.',
      'Der Vorbeter trägt oft den weißen Kittel, Teile des Gebets sind wie an den Hohen Feiertagen.',
    ],
    quelle: 'Mischna, Sukka 4,5; Talmud, Sukka 44a',
  },
  {
    id: 'suk-11',
    nr: 11,
    q: 'Welche Jamim Towim folgen unmittelbar nach Sukkot?',
    type: 'fakt',
    kurz: 'Schmini Azeret („der achte Tag der Versammlung“, 22. Tischri) und außerhalb Israels am Tag darauf Simchat Tora („Freude der Tora“, 23. Tischri). In Israel fallen beide auf einen Tag.',
    punkte: [
      'Schmini Azeret ist ein eigenes Fest, kein Teil von Sukkot: Man spricht Schehechejanu.',
      'An Schmini Azeret wird um Regen gebetet (Frage 12) und Jiskor (Gedenkgebet für Verstorbene) gesagt.',
    ],
    quelle: '3. Mose 23,36; 4. Mose 29,35',
  },
  {
    id: 'suk-12',
    nr: 12,
    q: 'Was bedeutet das Gebet für „Geschem“? Wann wird es gesagt?',
    kurz: 'Tefillat Geschem ist das Gebet um Regen für das Land Israel. Der Vorbeter sagt es an Schmini Azeret im Mussaf-Gebet, im weißen Kittel. Ab dann fügt man „maschiw ha-ru’ach u-morid ha-geschem“ („der den Wind wehen und den Regen fallen lässt“) in die Amida ein, bis zum ersten Tag Pessach.',
    punkte: [
      'Im Winter braucht Israel Regen; im Sommer wäre er ein Fluch, deshalb bittet man erst nach Sukkot (man will nicht in der Sukka verregnet werden).',
      'Das Gegenstück ist das Tal-Gebet (um Tau) am ersten Tag Pessach (Teil 8, Frage 40).',
      'Die direkte Bitte um Regen („we-ten tal u-matar“) beginnt außerhalb Israels erst Anfang Dezember.',
    ],
    hebrew: [{ label: 'Formel in der Amida', text: 'מַשִּׁיב הָרוּחַ וּמוֹרִיד הַגֶּשֶׁם', translit: 'maschiw ha-ru’ach u-morid ha-geschem', de: 'der den Wind wehen und den Regen fallen lässt' }],
  },
  {
    id: 'suk-13',
    nr: 13,
    q: 'Wann und warum wird das Buch des Ecclesiastes (Kohelet) gelesen?',
    kurz: 'Am Schabbat von Chol ha-Mo’ed Sukkot (fällt keiner in die Festwoche, liest man es an Schmini Azeret). Kohelet erinnert mitten in der Fest- und Erntefreude daran, dass Besitz vergänglich ist („Alles ist Windhauch“) und was wirklich zählt: „Fürchte G’tt und halte Seine Gebote“ (Kohelet 12,13).',
    punkte: [
      'Kohelet wird König Schlomo zugeschrieben.',
      'Sukkot ist im Herbst: Kohelet passt zur Stimmung vom Ende eines Jahreskreises.',
      'Die Sukka selbst ist ein Bild für die Vergänglichkeit: Man verlässt das feste Haus.',
      'Viele Gemeinden lesen Kohelet aus einer Schriftrolle, andere aus dem Buch.',
    ],
    quelle: 'Kohelet 1,2; 12,13',
  },
  {
    id: 'suk-14',
    nr: 14,
    q: 'Was passiert in der Synagoge an Simchat Tora? Wozu werden die Kinder ermutigt?',
    kurz: 'Am Abend und am Morgen werden alle Torarollen aus dem Schrank genommen. Die Gemeinde tanzt mit ihnen in sieben Runden (Hakafot) um die Bima. Am Morgen wird jeder Mann zur Tora aufgerufen. Die Kinder tanzen mit Fähnchen mit, bekommen Süßigkeiten und werden gemeinsam unter einem großen Tallit zur Tora aufgerufen („Kol ha-Ne’arim“).',
    punkte: [
      'Bei „Kol ha-Ne’arim“ („alle Kinder“) spricht ein Erwachsener mit ihnen den Torasegen, die Gemeinde segnet sie mit „ha-Mal’ach ha-go’el“ (1. Mose 48,16).',
      'So sollen die Kinder die Tora mit Freude verbinden.',
      'Die Torarollen werden auch Kindern zum Halten oder Küssen gereicht.',
    ],
  },
  {
    id: 'suk-15',
    nr: 15,
    q: 'Wie viele Torarollen werden an Simchat Tora geöffnet? Warum?',
    type: 'fakt',
    kurz: 'Zum Lesen öffnet man drei Torarollen: In der ersten liest man das Ende der Tora (Wesot ha-Bracha), in der zweiten gleich den Anfang (Bereschit) und in der dritten den Abschnitt für das Fest (Maftir). Für die Hakafot holt man alle Rollen heraus.',
    punkte: [
      'Drei Rollen, damit die Gemeinde nicht warten muss, bis zurückgerollt ist.',
      'Ende und Anfang folgen direkt aufeinander: Die Tora-Lesung hört nie auf.',
      'Maftir: die Opfer von Schmini Azeret (4. Mose 29,35–30,1).',
    ],
    quelle: '5. Mose 33–34; 1. Mose 1,1–2,3; 4. Mose 29,35–30,1',
  },
  {
    id: 'suk-16',
    nr: 16,
    q: 'Warum feiert man Simchat Tora? Wie wird die Torahlesung durchgeführt?',
    kurz: 'Man feiert, dass die jährliche Lesung der Tora abgeschlossen ist und sofort wieder von vorn beginnt. Den letzten Abschnitt (Wesot ha-Bracha) liest man so oft, bis jeder Mann aufgerufen wurde. Dann kommen die Kinder (Kol ha-Ne’arim), der Chatan Tora liest das Ende, der Chatan Bereschit den Anfang der Tora, zuletzt folgt Maftir und Haftara (Josua 1).',
    punkte: [
      'Simchat Tora ist ein Fest der Gemeinde, kein Fest aus der Tora; es entstand im Mittelalter.',
      'Freude an der Tora: Man feiert nicht nur, was man gelernt hat, sondern, dass man lernen darf.',
      'Der Abschnitt wird oft in mehreren Räumen gleichzeitig gelesen, damit es nicht zu lange dauert.',
      'Haftara: Josua übernimmt nach Mosches Tod die Führung – die Geschichte geht weiter.',
    ],
    quelle: 'Josua 1',
  },
  {
    id: 'suk-17',
    nr: 17,
    q: 'Wer sind die „Chatan Tora“ und die „Chatan Bereschit“?',
    kurz: 'Zwei Männer, denen die Gemeinde eine große Ehre gibt: Der Chatan Tora („Bräutigam der Tora“) wird zum letzten Abschnitt der Tora aufgerufen, der Chatan Bereschit („Bräutigam von Bereschit“) zum ersten Abschnitt der Schöpfung.',
    punkte: [
      'Man nennt sie „Bräutigam“, weil die Gemeinde mit der Tora wie mit einer Braut Hochzeit feiert.',
      'Die Ehre bekommen oft verdiente Gemeindemitglieder. Sie geben dafür meist eine Spende oder eine Kiddusch-Feier.',
      'Beim Chatan Bereschit hält die Gemeinde oft einen Tallit wie eine Chuppa über ihn.',
    ],
  },
];
