// Giur-Wissen, Teil 8: Pessach.
//
// Fragetexte stehen wörtlich im Prüfungskatalog. Die Antworten wurden als ENTWURF
// geschrieben und sind noch von keinem Rabbiner oder Lehrer durchgesehen: Alle
// Fragen tragen den Standardstatus 'entwurf'. Erst was der Prüfbogen bestätigt
// oder korrigiert, bekommt status 'geprueft'. Bräuche, die je nach Gemeinde
// abweichen, und unklare Fragen stehen im Feld `check`.
//
// Im Katalog ist Punkt 41 leer. Es gibt deshalb keine Frage pes-41; die übrigen
// IDs folgen den Nummern im Katalog (47 Fragen).
//
// Die Antworten gehen vom Leben außerhalb Israels aus (zwei Seder-Abende).
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

export const PESSACH = [
  {
    id: 'pes-01',
    nr: 1,
    q: 'Wann und was ist „Schabbat Hagadol“? Erkläre den Namen.',
    kurz: 'Schabbat ha-Gadol („der große Schabbat“) ist der Schabbat vor Pessach. Der Name erinnert an ein großes Wunder: Am 10. Nissan, einem Schabbat, nahm jede Familie in Ägypten ein Lamm für das Pessach-Opfer – das Tier, das die Ägypter verehrten –, und die Ägypter taten ihnen nichts.',
    punkte: [
      'Die Haftara (Maleachi 3,4–24) endet mit „vor dem großen (ha-gadol) Tag des Ewigen“.',
      'Der Rabbiner hält eine große Predigt, traditionell über die Gesetze von Pessach.',
      'Am Nachmittag lesen viele einen Teil der Haggada („Awadim hajinu“).',
    ],
    quelle: '2. Mose 12,3; Schulchan Aruch, Orach Chajim 430',
  },
  {
    id: 'pes-02',
    nr: 2,
    q: 'Warum sind Erstgeborene verpflichtet an „Erew Pessach“ zu fasten?',
    kurz: 'Aus Dank, dass die erstgeborenen Israeliten bei der zehnten Plage, dem Tod der Erstgeborenen in Ägypten, verschont wurden. Das Fasten heißt Ta’anit Bechorot und fällt auf den 14. Nissan.',
    punkte: [
      'Es betrifft erstgeborene Söhne; bei kleinen Kindern fastet oft der Vater für sie.',
      'Fällt Erew Pessach auf Schabbat, wird das Fasten auf Donnerstag vorverlegt.',
      'Fast alle lösen das Fasten durch einen Sijum (Frage 3).',
    ],
    quelle: 'Schulchan Aruch, Orach Chajim 470',
  },
  {
    id: 'pes-03',
    nr: 3,
    q: 'Wie kann man vom Fasten der Erstgeborenen befreit sein?',
    kurz: 'Durch die Teilnahme an einem Sijum: Jemand schließt am Morgen das Studium eines Talmud-Traktats ab, und das gehört zu einem Festmahl (Se’udat Mizwa). Wer davon isst, darf an diesem Tag essen.',
    punkte: [
      'Der Sijum findet meist nach dem Morgengebet in der Synagoge statt.',
      'Auch eine Brit Mila oder ein Pidjon ha-Ben am selben Tag würde befreien.',
    ],
    quelle: 'Mischna Berura 470,10',
  },
  {
    id: 'pes-04',
    nr: 4,
    q: 'Was ist die „Seder-Nacht“? Wie viele werden abgehalten?',
    kurz: 'Der festliche Abend zu Beginn von Pessach (15. Nissan), an dem die Familie nach einer festen Ordnung (Seder) die Geschichte vom Auszug aus Ägypten erzählt, Mazza und Maror isst und vier Becher Wein trinkt. Außerhalb Israels feiert man zwei Seder-Abende, in Israel einen.',
    punkte: [
      'Der Ablauf hat 15 Stationen von Kadesch bis Nirza (Frage 28).',
      'Grundlage: „Du sollst es deinem Kind an diesem Tag erzählen“ (2. Mose 13,8).',
    ],
    hebrew: [{ label: 'Seder', text: 'סֵדֶר', translit: 'seder', de: 'Ordnung' }],
  },
  {
    id: 'pes-05',
    nr: 5,
    q: 'Welche Gebote müssen in der Seder-Nacht erfüllt werden?',
    kurz: 'Aus der Tora: Mazza essen und die Geschichte vom Auszug erzählen (Sippur Jezi’at Mizrajim). Von den Rabbinen: vier Becher Wein trinken, Maror essen, Hallel sagen und beim Essen angelehnt sitzen (Hesewa) als Zeichen der Freiheit.',
    punkte: [
      'Zur Erzählung gehören die drei Dinge, die Rabban Gamliel nennt: Pessach, Mazza, Maror (Frage 35).',
      'Weitere Teile: Korech (Frage 25) und Afikoman (Frage 30).',
      'Man soll die Kinder zum Fragen bringen (Frage 32).',
    ],
    quelle: '2. Mose 12,18 und 13,8; Talmud, Pessachim 108a–116b',
  },
  {
    id: 'pes-06',
    nr: 6,
    q: 'Sind die Frauen verpflichtet diese Gebote erfüllen? Warum?',
    kurz: 'Ja. Obwohl Frauen von den meisten zeitgebundenen Geboten befreit sind, sind sie am Seder verpflichtet: Auch sie waren Teil des Wunders („Af hen hajju be-oto ha-nes“). Bei der Mazza gilt: Wer das Chamez-Verbot hat, hat auch das Gebot, Mazza zu essen.',
    punkte: [
      'Der Talmud sagt auch: Durch das Verdienst der gerechten Frauen wurde Israel aus Ägypten befreit (Sota 11b).',
      'Das gilt für Mazza, Maror, vier Becher, Erzählung und Hallel.',
    ],
    quelle: 'Talmud, Pessachim 43b und 108a–b',
  },
  {
    id: 'pes-07',
    nr: 7,
    q: 'Was wird auf einem Seder-Tisch gedeckt?',
    kurz: 'Der Seder-Teller (Ke’ara, Frage 8), drei bedeckte Mazzot (Frage 9), Wein oder Traubensaft mit einem Becher für jeden und dem Becher für Elijahu, Salzwasser, Haggadot für alle und Kissen zum Anlehnen. Dazu festliches Geschirr und die Feiertagskerzen.',
    punkte: [
      'Der Tisch soll wie bei freien, wohlhabenden Menschen aussehen.',
      'Der Seder-Teller steht vor dem, der den Seder leitet.',
    ],
  },
  {
    id: 'pes-08',
    nr: 8,
    q: 'Nenne alle Speisen die auf einem Seder-Teller gelegt werden und erkläre deren symbolische Bedeutung.',
    kurz: 'Seroa (Knochen) für das Pessach-Opfer, Bejza (gekochtes und angeröstetes Ei) für das Festopfer, Maror (Bitterkraut) für die Bitterkeit der Sklaverei, Charosset (süßer Brei) für den Lehm der Ziegel, Karpas (Gemüse zum Eintauchen) und Chasseret (zweites Bitterkraut für Korech).',
    punkte: [
      'Seroa: ein angebratener Knochen mit etwas Fleisch; „Arm“ erinnert auch an „mit ausgestrecktem Arm“. Er wird nicht gegessen (Frage 24).',
      'Bejza: das Festopfer (Chagiga) und Trauer um den zerstörten Tempel.',
      'Maror: meist Meerrettich oder Romanasalat.',
      'Charosset: aus Äpfeln, Nüssen, Wein und Zimt; erinnert an den Mörtel.',
      'Karpas: zum Beispiel Sellerie, Petersilie oder Kartoffel; man taucht es in Salzwasser (Tränen).',
      'Chasseret: oft Salat, für das Sandwich Korech.',
      'Die Anordnung folgt dem Ari (Rabbi Jizchak Luria) oder anderen Bräuchen.',
    ],
    hebrew: [
      { label: 'Knochen', text: 'זְרוֹעַ', translit: 'seroa', de: 'Arm, Knochen' },
      { label: 'Ei', text: 'בֵּיצָה', translit: 'bejza', de: 'Ei' },
      { label: 'Bitterkraut', text: 'מָרוֹר', translit: 'maror', de: 'Bitterkraut' },
      { label: 'Fruchtbrei', text: 'חֲרֹסֶת', translit: 'charosset', de: 'süßer Fruchtbrei' },
      { label: 'Gemüse', text: 'כַּרְפַּס', translit: 'karpas', de: 'Gemüse zum Eintauchen' },
      { label: 'Zweites Bitterkraut', text: 'חֲזֶרֶת', translit: 'chasseret', de: 'Bitterkraut, Lattich' },
    ],
    check: 'Welche Anordnung und welche Pflanzen (Maror, Karpas) die Familie nimmt, ist Brauch.',
  },
  {
    id: 'pes-09',
    nr: 9,
    q: 'Wie viele Mazot kommen auf den Tisch? Wie heißen sie?',
    type: 'fakt',
    kurz: 'Drei Mazzot, übereinander und bedeckt. Sie heißen Kohen, Levi und Jisrael (nach anderen Deutungen stehen sie für Awraham, Jizchak und Jakow). Die mittlere wird bei Jachaz gebrochen, die größere Hälfte wird der Afikoman.',
    punkte: [
      'Zwei ganze Mazzot sind für den Segen wie die zwei Brote am Schabbat (Lechem Mischne), die gebrochene ist das „Brot der Armut“ (Frage 21).',
      'Man nimmt Mazza Schmura (Frage 10).',
    ],
    quelle: 'Schulchan Aruch, Orach Chajim 473,4',
  },
  {
    id: 'pes-10',
    nr: 10,
    q: 'Was ist der Unterschied zwischen normaler Maza und Maza Schmura?',
    kurz: 'Mazza Schmura („bewachte Mazza“) wird vom Schnitt des Getreides an bewacht, damit es nie mit Wasser in Berührung kommt und sauer wird. Bei normaler Pessach-Mazza beginnt die Aufsicht erst beim Mahlen oder Kneten. Für das Gebot am Seder nimmt man Schmura-Mazza.',
    punkte: [
      'Grundlage: „Ihr sollt die Mazzot bewachen“ (2. Mose 12,17).',
      'Schmura-Mazza ist oft rund und von Hand gebacken, es gibt sie aber auch maschinell.',
      'Viele essen das ganze Fest über nur Schmura-Mazza.',
      'Die ganze Zeit vom Kneten bis zum Ofen darf 18 Minuten nicht überschreiten.',
    ],
    quelle: '2. Mose 12,17; Schulchan Aruch, Orach Chajim 453,4',
  },
  {
    id: 'pes-11',
    nr: 11,
    q: 'Was ist „Chamez“? Welche Speisen sind „Chamez“?',
    kurz: 'Chamez ist Gesäuertes: eine der fünf Getreidearten (Weizen, Gerste, Dinkel, Hafer, Roggen), die mit Wasser in Berührung kam und länger als 18 Minuten liegen blieb, sodass sie aufgehen konnte. Chamez sind Brot, Kuchen, Nudeln, Kekse, Bier, Getreideschnaps und alles, was Getreide enthält und nicht für Pessach hergestellt wurde.',
    punkte: [
      'An Pessach ist Chamez verboten zu essen, zu besitzen und davon Nutzen zu haben (2. Mose 12,15 und 13,7).',
      'Darum braucht man für Pessach Produkte mit Hechscher „koscher le-Pessach“.',
      'Auch kleinste Mengen Chamez sind an Pessach verboten.',
    ],
    quelle: '2. Mose 12,15–20; 13,7',
    hebrew: [{ label: 'Gesäuertes', text: 'חָמֵץ', translit: 'chamez', de: 'Gesäuertes' }],
  },
  {
    id: 'pes-12',
    nr: 12,
    q: 'Was sind Kitnijot?',
    kurz: 'Kitnijot („Hülsenfrüchte“) sind Hülsenfrüchte, Reis, Mais, Hirse und ähnliche Körner und Samen (zum Beispiel Erbsen, Bohnen, Linsen, Soja, Sesam). Sie sind kein Chamez, aber Aschkenasim essen sie an Pessach nach altem Brauch nicht, weil sie mit Getreide verwechselt oder vermischt werden könnten. Sefarden essen sie.',
    punkte: [
      'Besitzen und Nutzen ist erlaubt, nur das Essen meidet man.',
      'Kranke und Kleinkinder dürfen sie bei Bedarf essen.',
    ],
    quelle: 'Rema, Orach Chajim 453,1',
    check: 'Ob man Kitnijot isst, richtet sich nach dem Brauch der Gemeinde (aschkenasisch oder sefardisch).',
  },
  {
    id: 'pes-13',
    nr: 13,
    q: 'Was sind Gebrokts?',
    kurz: 'Gebrokts (jiddisch „gebrockt“, hebräisch „Mazza Schruja“) ist Mazza, die mit Flüssigkeit in Berührung kam, zum Beispiel Mazza-Knödel oder in Suppe getauchte Mazza. Viele, vor allem chassidische Familien, essen das nicht, aus Sorge, dass ungebackenes Mehl darin noch säuern könnte. Andere essen es ohne Bedenken.',
    punkte: [
      'Halachisch ist gebackene Mazza nicht mehr fähig, Chamez zu werden; es ist ein Brauch der Vorsicht.',
      'Wer kein Gebrokts isst, isst es oft am achten Tag doch (außerhalb Israels).',
    ],
    check: 'Ob die Familie Gebrokts isst, ist Brauch.',
  },
  {
    id: 'pes-14',
    nr: 14,
    q: 'Präzisiere die Dauer des Verbotes in der das Essen oder Verarbeitung von Chamez gültig ist.',
    kurz: 'Ab dem Vormittag des 14. Nissan (Erew Pessach): Essen ist ab Ende der vierten Tagesstunde verboten, Besitzen und Nutzen ab Ende der fünften Stunde. Das Verbot dauert bis zum Ende von Pessach, außerhalb Israels bis zur Dunkelheit nach dem 22. Nissan.',
    punkte: [
      'Die Stunden sind „Zeitstunden“: der helle Tag geteilt durch 12. Die genaue Uhrzeit steht im Gemeindekalender.',
      'Chamez, das einem Juden während Pessach gehörte, bleibt auch danach verboten (Chamez sche-awar alaw ha-Pessach). Deshalb verkauft man sein Chamez (Frage 15).',
    ],
    quelle: 'Schulchan Aruch, Orach Chajim 443; 448',
  },
  {
    id: 'pes-15',
    nr: 15,
    q: 'Was wird am Vorabend von Pessach (Erew Pessach) sowie am Morgen davor gemacht?',
    kurz: 'Am Abend vor dem 14. Nissan sucht man mit einer Kerze nach Chamez (Bedikat Chamez) und erklärt danach übriges Chamez für herrenlos (Kol Chamira). Am Morgen isst man zum letzten Mal Chamez, verbrennt das übrige (Bi’ur Chamez) und sagt die Erklärung noch einmal. Dann bereitet man den Seder vor.',
    punkte: [
      'Bedikat Chamez: nach Einbruch der Dunkelheit, mit Segen „al bi’ur chamez“, oft mit Kerze, Feder und Holzlöffel. Man legt zehn Stückchen Brot aus, die gefunden werden.',
      'Kol Chamira: aramäische Erklärung, dass alles unbekannte Chamez wie Staub sei.',
      'Verkauf des Chamez (Mechirat Chamez): über den Rabbiner, vor dem Ende der fünften Stunde.',
      'Erstgeborene fasten oder gehen zum Sijum (Fragen 2 und 3).',
      'Ab Mittag keine Mazza mehr essen, damit man sie am Abend mit Appetit isst.',
    ],
    hebrew: [{
      label: 'Segen bei der Chamez-Suche',
      text: `${BRACHA_ANFANG} עַל בִּעוּר חָמֵץ.`,
      translit: `${BRACHA_ANFANG_UMSCHRIFT} al bi’ur chamez.`,
      de: `${BRACHA_ANFANG_DE}, das Gesäuerte zu beseitigen.`,
    }],
    quelle: 'Schulchan Aruch, Orach Chajim 431–445',
  },
  {
    id: 'pes-16',
    nr: 16,
    q: 'Ist es einem Juden gestattet Chamez Geschirr an Pessach zu benutzen?',
    kurz: 'Nein. Geschirr, in dem das Jahr über Chamez gekocht oder gegessen wurde, hat Chamez aufgenommen. Man räumt es weg und benutzt eigenes Pessach-Geschirr. Manches Geschirr aus Metall kann man vorher koscher machen (Frage 17).',
    punkte: [
      'Das Chamez-Geschirr wird gründlich gereinigt und in einem verschlossenen Schrank verwahrt.',
      'Es muss nicht verkauft werden; nur Chamez-Reste daran würde man verkaufen.',
    ],
    quelle: 'Schulchan Aruch, Orach Chajim 451',
  },
  {
    id: 'pes-17',
    nr: 17,
    q: 'Wie macht man seine Küche koscher für Pessach?',
    kurz: 'Zuerst alles gründlich von Chamez reinigen, dann kaschern: Backofen und Herd ausglühen oder mit höchster Hitze leeren lassen, Metalltöpfe und Besteck in kochendes Wasser tauchen (Hag’ala), Spüle und Arbeitsflächen mit kochendem Wasser übergießen und abdecken. Was sich nicht kaschern lässt, wird weggeräumt und durch Pessach-Geschirr ersetzt.',
    punkte: [
      'Grundsatz: Wie ein Gefäß das Chamez aufgenommen hat, so gibt es es wieder ab – direkt am Feuer braucht Ausglühen (Libun), in Wasser Abkochen (Hag’ala).',
      'Steingut, Porzellan und meist auch Kunststoff lassen sich nicht kaschern.',
      'Glas wird bei Aschkenasim meist nicht gekaschert, bei Sefarden reicht oft Abspülen.',
      'Vor dem Kaschern 24 Stunden nicht benutzen.',
      'Kühlschrank und Schränke reinigen und oft auslegen.',
    ],
    quelle: 'Schulchan Aruch, Orach Chajim 451–452',
    check: 'Wie man Herd, Ofen, Spülmaschine und Glas kaschert, bitte beim Rabbiner erfragen. Viele Gemeinden kaschern Töpfe gemeinsam.',
  },
  {
    id: 'pes-18',
    nr: 18,
    q: 'Von welchem Zeitpunkt an dürfen wir an Pessach Mazot essen?',
    kurz: 'Ab dem Seder-Abend, nach Einbruch der Dunkelheit am 15. Nissan: Die erste Mazza isst man beim Seder mit dem Segen „al achilat mazza“. Am Erew Pessach selbst isst man keine Mazza, viele schon ab Rosch Chodesch Nissan nicht.',
    punkte: [
      'Grund: Die Mazza am Seder soll man mit Appetit und als neue Mizwa essen (Talmud Jeruschalmi, Pessachim 10,1).',
      'Kinder, die den Seder nicht verstehen, dürfen am Erew Pessach Mazza essen.',
    ],
    hebrew: [{
      label: 'Segen über das Mazza-Essen',
      text: `${BRACHA_ANFANG} עַל אֲכִילַת מַצָּה.`,
      translit: `${BRACHA_ANFANG_UMSCHRIFT} al achilat mazza.`,
      de: `${BRACHA_ANFANG_DE}, Mazza zu essen.`,
    }],
    quelle: 'Schulchan Aruch, Orach Chajim 471,2 und 472,1',
  },
  {
    id: 'pes-19',
    nr: 19,
    q: 'An was soll uns Maza erinnern?',
    kurz: 'An den Auszug aus Ägypten: Die Israeliten mussten so schnell aufbrechen, dass ihr Teig keine Zeit hatte zu säuern (2. Mose 12,39). Zugleich erinnert sie an das karge Brot der Sklaverei, das „Brot der Armut“ (Frage 21).',
    punkte: [
      'Die Mazza steht also für Sklaverei und Freiheit zugleich.',
      'Mazza aus Mehl und Wasser ohne Zusatz gilt auch als Bild für Bescheidenheit; das aufgeblähte Chamez für Stolz.',
    ],
    quelle: '2. Mose 12,39; 5. Mose 16,3',
  },
  {
    id: 'pes-20',
    nr: 20,
    q: 'Welche Brachot sagt man für Kartoffellatkes?',
    type: 'fakt',
    kurz: 'Vorher „bore pri ha-adama“ („der die Frucht der Erde schafft“), weil die Kartoffel der Hauptbestandteil ist. Danach die kurze Schlussbracha „bore nefaschot“.',
    punkte: [
      'Wenig Mazzamehl als Bindemittel ändert nichts an der Bracha.',
      'Wären sie hauptsächlich aus Mazzamehl, wäre der Segen „bore mine mesonot“ – bei Mazza selbst „ha-mozi“.',
    ],
    hebrew: [{
      label: 'Segen über Früchte der Erde',
      text: `${BRACHA_KOENIG}, בּוֹרֵא פְּרִי הָאֲדָמָה.`,
      translit: `${BRACHA_KOENIG_UMSCHRIFT}, bore pri ha-adama.`,
      de: `${BRACHA_KOENIG_DE}, der die Frucht der Erde schafft.`,
    }],
    check: 'Die Frage steht im Katalog bei Pessach. Ob der Lehrer hier Latkes aus Mazzamehl meint (dann mesonot), bitte klären.',
  },
  {
    id: 'pes-21',
    nr: 21,
    q: 'Was ist das „Brot des Leidens“? Warum nennen wir es so?',
    kurz: 'Das „Brot des Leidens“ oder „Brot der Armut“ (Lechem Oni, 5. Mose 16,3) ist die Mazza. Sie war das einfache Brot der Sklaven in Ägypten aus Mehl und Wasser. Am Seder beginnt die Erzählung mit „Ha lachma anja“: „Dies ist das Brot der Armut, das unsere Väter in Ägypten aßen“.',
    punkte: [
      'Ein Armer hat oft nur ein Stück Brot; deshalb bricht man die mittlere Mazza (Jachaz).',
      'Der Talmud deutet „oni“ auch als „antworten“: Brot, über dem man viel erzählt (Pessachim 115b).',
      'Mit „Ha lachma anja“ lädt man auch alle Hungrigen ein.',
    ],
    hebrew: [{ label: 'Brot der Armut', text: 'לֶחֶם עֹנִי', translit: 'lechem oni', de: 'Brot der Armut, des Leidens' }],
    quelle: '5. Mose 16,3',
  },
  {
    id: 'pes-22',
    nr: 22,
    q: 'Wann essen wir Maror, Charosset und ein geröstetes Ei?',
    kurz: 'Maror isst man nach der Mazza (Station Maror), eingetaucht in Charosset, und noch einmal bei Korech zwischen zwei Stücken Mazza. Das Ei isst man zu Beginn der Mahlzeit (Schulchan Orech), oft in Salzwasser.',
    punkte: [
      'Charosset isst man nicht für sich, es dient zum Eintauchen des Maror (Frage 23).',
      'Das Ei auf dem Seder-Teller bleibt dort; gegessen wird ein gekochtes Ei.',
      'Das Ei ist auch ein Zeichen der Trauer um den Tempel – der erste Seder-Tag fällt immer auf denselben Wochentag wie Tischa be-Aw.',
    ],
  },
  {
    id: 'pes-23',
    nr: 23,
    q: 'Wozu wird es benutzt?',
    kurz: 'Bezieht sich auf die vorige Frage: Charosset dient dazu, den Maror einzutauchen. Es erinnert an den Lehm, aus dem die Sklaven Ziegel machten, und mildert die Schärfe des Maror. Das Ei erinnert an das Festopfer (Chagiga) im Tempel und an die Trauer über seine Zerstörung.',
    punkte: [
      'Man schüttelt das Charosset ab, damit der bittere Geschmack bleibt.',
      'Nach dem Talmud ist Charosset auch gegen das Gift („Kappa“) im Bitterkraut (Pessachim 116a).',
    ],
    check: 'Die Frage ist im Katalog nicht eindeutig. Was gemeint ist (Charosset, Ei oder alles), bitte beim Lehrer klären.',
  },
  {
    id: 'pes-24',
    nr: 24,
    q: 'Warum darf gebratenes Fleisch an Seder nicht serviert werden?',
    kurz: 'Das Pessach-Opfer wurde im Tempel am Feuer gebraten gegessen. Ohne Tempel darf man es nicht darbringen. Wer am Seder gebratenes Fleisch isst, sähe so aus, als äße er außerhalb des Tempels Opferfleisch. Deshalb isst man am Seder-Abend kein gegrilltes oder trocken gebratenes Fleisch.',
    punkte: [
      'Auch der Knochen (Seroa) auf dem Teller wird nicht gegessen.',
      'Aschkenasim meiden jedes gebratene Fleisch, auch Geflügel; gekochtes oder geschmortes ist erlaubt.',
    ],
    quelle: 'Mischna, Pessachim 4,4; Schulchan Aruch, Orach Chajim 476,1',
  },
  {
    id: 'pes-25',
    nr: 25,
    q: 'Warum essen wir Mazot und Maror zusammen?',
    kurz: 'Bei Korech („wickeln“) isst man Mazza und Maror zusammen wie ein Sandwich, zur Erinnerung an Hillel. Er aß zur Zeit des Tempels Pessach-Opfer, Mazza und Maror zusammen, denn die Tora sagt: „Mit Mazzot und Bitterkräutern sollen sie es essen“ (4. Mose 9,11).',
    punkte: [
      'Man sagt dazu „Secher le-Mikdasch ke-Hillel“ („zur Erinnerung an den Tempel, wie Hillel“).',
      'Eine Deutung: Freiheit (Mazza) und Bitterkeit (Maror) gehören zusammen.',
      'Wie bei der Mazza isst man angelehnt.',
    ],
    quelle: '4. Mose 9,11; Talmud, Pessachim 115a',
  },
  {
    id: 'pes-26',
    nr: 26,
    q: 'Was ist ein „Kittel“? Was stellt es dar?',
    kurz: 'Ein schlichtes weißes Gewand, das der Leiter des Seders trägt (auch an Jom Kippur, bei der Hochzeit und als Totenhemd). Weiß steht für Reinheit und Festlichkeit, wie bei Königen oder freien Menschen. Zugleich erinnert es daran, dass das Leben endlich ist, damit man in der Freude demütig bleibt.',
    punkte: [
      'Der Kittel ist bei Aschkenasim Brauch, bei Sefarden nicht.',
      'Viele Männer tragen ihn zum ersten Mal unter der Chuppa.',
    ],
    hebrew: [{ label: 'Kittel', text: 'קִיטְל', translit: 'kittel', de: 'weißes Gewand (jiddisch)' }],
    check: 'Wer den Kittel trägt (nur der Hausherr oder alle Männer), ist Brauch.',
  },
  {
    id: 'pes-27',
    nr: 27,
    q: 'Sind Frauen verpflichtet am Seder teilzunehmen? Wenn ja, warum?',
    kurz: 'Ja. Frauen sind zu allen Geboten des Seders verpflichtet, weil auch sie Teil des Wunders der Befreiung waren und weil Israel durch das Verdienst der gerechten Frauen befreit wurde (siehe Frage 6).',
    punkte: [
      'Frauen sitzen ebenfalls angelehnt (Hesewa), nach aschkenasischem Brauch ist das freiwillig.',
      'Sie sollen die Erzählung hören oder mitsprechen.',
    ],
    quelle: 'Talmud, Pessachim 108a; Sota 11b',
  },
  {
    id: 'pes-28',
    nr: 28,
    q: 'Erkläre die Worte „Seder“ und „Haggada“.',
    kurz: 'Seder heißt „Ordnung“: Der Abend folgt einem festen Ablauf von 15 Stationen. Haggada heißt „Erzählung“: das Buch mit dem Text für den Seder, nach „we-higgadta le-wincha“ („Du sollst deinem Kind erzählen“, 2. Mose 13,8).',
    punkte: [
      'Die 15 Stationen: Kadesch, Urchaz, Karpas, Jachaz, Maggid, Rachza, Mozi, Mazza, Maror, Korech, Schulchan Orech, Zafun, Barech, Hallel, Nirza.',
      'Die Haggada enthält Erzählung, Lieder, Psalmen und Segen.',
    ],
    hebrew: [
      { label: 'Ordnung', text: 'סֵדֶר', translit: 'seder', de: 'Ordnung' },
      { label: 'Erzählung', text: 'הַגָּדָה', translit: 'haggada', de: 'Erzählung' },
    ],
    quelle: '2. Mose 13,8',
  },
  {
    id: 'pes-29',
    nr: 29,
    q: 'An jedem Seder hoffen wir, dass jemand erscheint. Wer?',
    type: 'fakt',
    kurz: 'Der Prophet Elijahu (Elija), der nach der Überlieferung das Kommen des Maschiach ankündigt (Maleachi 3,23). Für ihn steht ein besonderer Becher (Kos Elijahu) auf dem Tisch, und man öffnet ihm die Tür bei „Schefoch chamatcha“.',
    punkte: [
      'Pessach ist die Nacht der Erlösung; man hofft auf die endgültige Erlösung.',
      'Man singt „Elijahu ha-Nawi“.',
    ],
    quelle: 'Maleachi 3,23–24',
  },
  {
    id: 'pes-30',
    nr: 30,
    q: 'Was ist ein „Afikoman“? Welche zwei Dinge muss man beim Verzehr beachten?',
    kurz: 'Der Afikoman ist die größere Hälfte der mittleren Mazza, die bei Jachaz versteckt wird. Man isst sie am Ende der Mahlzeit (Zafun) zur Erinnerung an das Pessach-Opfer. Beachten muss man: sie vor Mitternacht (Chazot) essen und danach nichts mehr essen, damit der Geschmack der Mazza bleibt.',
    punkte: [
      'Man isst mindestens ein Ke-Sajit (etwa eine halbe bis eine ganze Mazza nach Brauch), angelehnt.',
      'Danach trinkt man nur noch den dritten und vierten Becher und Wasser.',
      'Kinder „stehlen“ oft den Afikoman und bekommen ein Geschenk, damit sie wach bleiben.',
      'Der Name kommt vermutlich vom griechischen Wort für Nachtisch.',
    ],
    quelle: 'Schulchan Aruch, Orach Chajim 477–478',
  },
  {
    id: 'pes-31',
    nr: 31,
    q: 'Wie viele Gläser Wein trinken wir während des Seders?',
    type: 'fakt',
    kurz: 'Vier Becher. Sie stehen für die vier Ausdrücke der Erlösung in 2. Mose 6,6–7: „Ich führe heraus, Ich rette, Ich erlöse, Ich nehme euch“.',
    punkte: [
      'Becher 1 beim Kiddusch, 2 nach dem Maggid, 3 nach dem Tischgebet, 4 nach dem Hallel.',
      'Man trinkt jeweils den größten Teil eines Bechers von mindestens etwa 86 ml, angelehnt.',
      'Wer keinen Wein verträgt, nimmt Traubensaft.',
      'Der fünfte Becher (für Elijahu) wird nicht getrunken (Frage 29).',
    ],
    quelle: '2. Mose 6,6–7; Talmud Jeruschalmi, Pessachim 10,1',
  },
  {
    id: 'pes-32',
    nr: 32,
    q: 'Sage die vier Fragen auf die am Seder-Abend gefragt werden.',
    type: 'fakt',
    kurz: '„Ma nischtana“: Warum ist diese Nacht anders als alle anderen Nächte? In allen Nächten essen wir Chamez und Mazza, heute nur Mazza. Sonst essen wir alle Kräuter, heute Bitterkraut. Sonst tauchen wir nicht einmal ein, heute zweimal. Sonst sitzen oder lehnen wir, heute lehnen wir alle.',
    punkte: [
      'Das jüngste Kind stellt die Fragen nach dem zweiten Becher.',
      'Die Antwort ist die Haggada, beginnend mit „Awadim hajinu“ („Sklaven waren wir“).',
      'Den Text zum Aufsagen siehe unten.',
    ],
    hebrew: [
      { label: 'Einleitung', text: 'מַה נִּשְׁתַּנָּה הַלַּיְלָה הַזֶּה מִכָּל הַלֵּילוֹת?', translit: 'ma nischtana ha-lajla ha-se mi-kol ha-lejlot?', de: 'Was unterscheidet diese Nacht von allen anderen Nächten?' },
      { label: 'Frage 1', text: 'שֶׁבְּכָל הַלֵּילוֹת אָנוּ אוֹכְלִין חָמֵץ וּמַצָּה, הַלַּיְלָה הַזֶּה כֻּלּוֹ מַצָּה.', translit: 'sche-be-chol ha-lejlot anu ochlin chamez u-mazza, ha-lajla ha-se kulo mazza.', de: 'In allen Nächten essen wir Gesäuertes und Mazza, in dieser Nacht nur Mazza.' },
      { label: 'Frage 2', text: 'שֶׁבְּכָל הַלֵּילוֹת אָנוּ אוֹכְלִין שְׁאָר יְרָקוֹת, הַלַּיְלָה הַזֶּה מָרוֹר.', translit: 'sche-be-chol ha-lejlot anu ochlin sche’ar jerakot, ha-lajla ha-se maror.', de: 'In allen Nächten essen wir alle Kräuter, in dieser Nacht Bitterkraut.' },
      { label: 'Frage 3', text: 'שֶׁבְּכָל הַלֵּילוֹת אֵין אָנוּ מַטְבִּילִין אֲפִילוּ פַּעַם אֶחָת, הַלַּיְלָה הַזֶּה שְׁתֵּי פְעָמִים.', translit: 'sche-be-chol ha-lejlot ejn anu matbilin afilu pa’am achat, ha-lajla ha-se schtej fe’amim.', de: 'In allen Nächten tauchen wir nicht einmal ein, in dieser Nacht zweimal.' },
      { label: 'Frage 4', text: 'שֶׁבְּכָל הַלֵּילוֹת אָנוּ אוֹכְלִין בֵּין יוֹשְׁבִין וּבֵין מְסֻבִּין, הַלַּיְלָה הַזֶּה כֻּלָּנוּ מְסֻבִּין.', translit: 'sche-be-chol ha-lejlot anu ochlin bejn joschwin u-wejn messubin, ha-lajla ha-se kulanu messubin.', de: 'In allen Nächten essen wir sitzend oder angelehnt, in dieser Nacht lehnen wir alle.' },
    ],
    quelle: 'Mischna, Pessachim 10,4',
  },
  {
    id: 'pes-33',
    nr: 33,
    q: 'Beschreibe die vier Söhne die in der Haggada erwähnt werden.',
    kurz: 'Die Haggada beschreibt vier Kinder, denen man je nach Art antwortet: den Weisen (Chacham), der nach allen Gesetzen fragt; den Frevler (Rascha), der sich ausschließt („Was soll euch dieser Dienst?“); den Einfachen (Tam), der fragt „Was ist das?“; und den, der nicht zu fragen weiß (sche-ejno jode’a lisch’ol), für den man selbst beginnt.',
    punkte: [
      'Chacham: Man erklärt ihm alle Gesetze bis zum Afikoman.',
      'Rascha: Weil er sagt „euch“ und nicht „uns“, antwortet man scharf: „Wäre er dort gewesen, wäre er nicht erlöst worden“.',
      'Tam: „Mit starker Hand führte uns G’tt aus Ägypten.“',
      'Wer nicht fragen kann: „Du sollst es deinem Kind erzählen“ (2. Mose 13,8).',
      'Die Lehre: Jedes Kind bekommt eine Antwort, die es versteht.',
    ],
    quelle: '2. Mose 12,26; 13,8; 13,14; 5. Mose 6,20',
  },
  {
    id: 'pes-34',
    nr: 34,
    q: 'Nenne einige der „Zehn Plagen“.',
    type: 'fakt',
    kurz: 'Blut, Frösche, Läuse, wilde Tiere, Viehpest, Geschwüre, Hagel, Heuschrecken, Finsternis und der Tod der Erstgeborenen.',
    punkte: [
      'Rabbi Jehuda fasste sie mit Abkürzungen zusammen: „Dezach, Adasch, Be’achaw“.',
      'Bei jeder Plage nimmt man einen Tropfen Wein aus dem Becher: Unsere Freude ist nicht vollständig, wenn andere leiden.',
    ],
    hebrew: [{
      label: 'Die zehn Plagen',
      text: 'דָּם, צְפַרְדֵּעַ, כִּנִּים, עָרוֹב, דֶּבֶר, שְׁחִין, בָּרָד, אַרְבֶּה, חֹשֶׁךְ, מַכַּת בְּכוֹרוֹת',
      translit: 'dam, zefarde’a, kinim, arow, dewer, schechin, barad, arbe, choschech, makkat bechorot',
      de: 'Blut, Frösche, Läuse, wilde Tiere, Viehpest, Geschwüre, Hagel, Heuschrecken, Finsternis, Tod der Erstgeborenen',
    }],
    quelle: '2. Mose 7–12',
  },
  {
    id: 'pes-35',
    nr: 35,
    q: 'Welche drei Dinge müssen am Seder-Abend erwähnt werden um unsere Pflicht zu erfüllen?',
    type: 'fakt',
    kurz: 'Rabban Gamliel sagt: Wer diese drei Dinge an Pessach nicht erklärt hat, hat seine Pflicht nicht erfüllt: Pessach (das Opfer – weil G’tt an den Häusern der Israeliten vorüberging), Mazza (weil der Teig nicht säuern konnte) und Maror (weil die Ägypter das Leben bitter machten).',
    punkte: [
      'Man zeigt dabei auf die Mazza und den Maror, nicht aber auf den Knochen (das Opfer gibt es heute nicht).',
    ],
    quelle: 'Mischna, Pessachim 10,5',
    hebrew: [{ label: 'Die drei Dinge', text: 'פֶּסַח, מַצָּה וּמָרוֹר', translit: 'Pessach, mazza u-maror', de: 'Pessach-Opfer, Mazza und Bitterkraut' }],
  },
  {
    id: 'pes-36',
    nr: 36,
    q: 'Was feiern wir am siebten Tag von Pessach?',
    kurz: 'Die Spaltung des Schilfmeers (Kri’at Jam Suf): Am siebten Tag nach dem Auszug zog Israel trocken durchs Meer, und die Ägypter ertranken. In der Tora liest man das Meereslied (Schirat ha-Jam, 2. Mose 15).',
    punkte: [
      'Der siebte Tag ist wieder Jom Tow, außerhalb Israels auch der achte.',
      'Manche bleiben die Nacht wach und lernen.',
      'Man sagt nur das halbe Hallel: G’tt sagte den Engeln, „Meine Geschöpfe ertrinken, und ihr singt?“ (Talmud, Megilla 10b).',
    ],
    quelle: '2. Mose 14–15',
  },
  {
    id: 'pes-37',
    nr: 37,
    q: 'An welchem anderen Feiertag sagen wir „Leschana habaa birushalajim“?',
    type: 'fakt',
    kurz: 'An Jom Kippur, am Ende des Ne’ila-Gebets nach dem letzten Schofarton. Am Seder ist es der Schluss der Haggada.',
    punkte: ['„Le-schana ha-ba’a bi-Jeruschalajim“: „Nächstes Jahr in Jerusalem!“'],
    hebrew: [{ label: 'Nächstes Jahr in Jerusalem', text: 'לְשָׁנָה הַבָּאָה בִּירוּשָׁלָיִם', translit: 'le-schana ha-ba’a bi-Jeruschalajim', de: 'nächstes Jahr in Jerusalem' }],
  },
  {
    id: 'pes-38',
    nr: 38,
    q: 'Zu welchem anderen Anlass, außer Pessach, laden wir Elijahu HaNavi ein?',
    type: 'fakt',
    kurz: 'Zur Brit Mila (Beschneidung). Dort steht ein besonderer Stuhl für Elijahu (Kisse schel Elijahu), weil er nach dem Midrasch Zeuge jeder Brit Mila ist.',
    punkte: [
      'Elijahu hatte geklagt, Israel habe den Bund verlassen (1. Könige 19,10); deshalb soll er sehen, dass der Bund gehalten wird.',
      'Elijahu wird auch in der Hawdala am Schabbat-Ausgang besungen.',
    ],
    quelle: 'Pirkej de-Rabbi Elieser 29',
  },
  {
    id: 'pes-39',
    nr: 39,
    q: 'Wann lesen wir „Shir Hashirim“, und was ist es?',
    kurz: 'Schir ha-Schirim, das Hohelied, liest man am Schabbat von Chol ha-Mo’ed Pessach (sonst am siebten oder achten Tag). Es ist ein Liebeslied, König Schlomo zugeschrieben, und wird als Bild für die Liebe zwischen G’tt und dem Volk Israel verstanden.',
    punkte: [
      'Es passt zu Pessach: Es spielt im Frühling, und beim Auszug „verlobte“ sich G’tt mit Israel.',
      'Rabbi Akiwa nannte es „das Allerheiligste“ unter den Schriften (Mischna, Jadajim 3,5).',
      'Viele sagen es auch jeden Freitagabend.',
    ],
    quelle: 'Mischna, Jadajim 3,5',
  },
  {
    id: 'pes-40',
    nr: 40,
    q: 'Was ist das „Tal“-Gebet? Wann wird es gelesen?',
    kurz: 'Tefillat Tal ist das Gebet um Tau für das Land Israel. Der Vorbeter sagt es am ersten Tag Pessach im Mussaf-Gebet. Ab dann hört man auf, um Regen zu bitten („maschiw ha-ru’ach u-morid ha-geschem“), weil im Sommer in Israel Regen nicht gut ist.',
    punkte: [
      'Das Gegenstück ist das Gebet um Regen (Geschem) an Schmini Azeret (Teil 5, Frage 12).',
      'Sefarden und viele in Israel sagen im Sommer „morid ha-tal“ („der den Tau fallen lässt“).',
    ],
    hebrew: [{ label: 'Tau', text: 'טַל', translit: 'tal', de: 'Tau' }],
    check: 'Ob man im Sommer „morid ha-tal“ sagt oder nichts, ist Brauch der Gemeinde.',
  },
  {
    id: 'pes-42',
    nr: 42,
    q: 'Wann beginnen wir das Omer zu zählen?',
    type: 'fakt',
    kurz: 'Am zweiten Abend von Pessach (am Abend des 16. Nissan), außerhalb Israels beim zweiten Seder. Man zählt 49 Tage, jeden Abend nach Einbruch der Dunkelheit, mit Segen.',
    punkte: [
      'Am 16. Nissan wurde im Tempel das Omer, eine Gabe aus der neuen Gerste, dargebracht.',
      'Man zählt Tage und Wochen: „Heute ist der 10. Tag, das sind eine Woche und drei Tage zum Omer“.',
    ],
    hebrew: [{
      label: 'Segen zum Omer-Zählen',
      text: `${BRACHA_ANFANG} עַל סְפִירַת הָעֹמֶר.`,
      translit: `${BRACHA_ANFANG_UMSCHRIFT} al sefirat ha-omer.`,
      de: `${BRACHA_ANFANG_DE}, das Omer zu zählen.`,
    }],
    quelle: '3. Mose 23,15–16',
  },
  {
    id: 'pes-43',
    nr: 43,
    q: 'Was bedeutet „Lag Ba-Omer“? Wann ist es?',
    kurz: 'Lag ba-Omer ist der 33. Tag des Omer, der 18. Ijar. „Lag“ sind die Buchstaben Lamed (30) und Gimel (3). An diesem Tag hörte die Seuche unter den Schülern Rabbi Akiwas auf, und es ist der Todestag (Jahrzeit) von Rabbi Schimon bar Jochai. Die Trauerbräuche der Omer-Zeit sind aufgehoben.',
    punkte: [
      'Man feiert mit Lagerfeuern, Ausflügen, Hochzeiten und dem ersten Haarschnitt kleiner Jungen (Chalaka).',
      'Rabbi Schimon bar Jochai wird der Sohar zugeschrieben; viele pilgern an sein Grab in Meron.',
    ],
    hebrew: [{ label: 'Lag ba-Omer', text: 'ל״ג בָּעֹמֶר', translit: 'lag ba-omer', de: '33. Tag des Omer' }],
  },
  {
    id: 'pes-44',
    nr: 44,
    q: 'Aus welchem Grund und wie lange zählen wir das Omer?',
    kurz: 'Weil die Tora es gebietet: Vom Tag des Omer-Opfers an sollen sieben volle Wochen gezählt werden, bis zum Schawuot-Fest (3. Mose 23,15–16). Man zählt 49 Tage. Das Zählen verbindet den Auszug aus Ägypten (Pessach) mit der Gabe der Tora (Schawuot): Die Freiheit hatte ein Ziel.',
    punkte: [
      'Nach der Überlieferung zählten die Israeliten die Tage bis zum Sinai voller Erwartung.',
      'Die Kabbala sieht in jedem Tag eine Stufe der Charakterbildung (sieben Eigenschaften mal sieben).',
      'Der 50. Tag ist Schawuot.',
    ],
    quelle: '3. Mose 23,15–16; 5. Mose 16,9',
  },
  {
    id: 'pes-45',
    nr: 45,
    q: 'Was passiert wenn einer vergessen sollte einen Tag zu zählen?',
    kurz: 'Hat man am Abend vergessen, zählt man am folgenden Tag ohne Segen und zählt danach normal mit Segen weiter. Hat man einen ganzen Tag (Abend und Tag) vergessen, zählt man die restlichen Tage ohne Segen weiter.',
    punkte: [
      'Grund: Die Tora spricht von „sieben vollständigen Wochen“; nach manchen Meinungen ist die Kette dann unterbrochen.',
      'Um das Zählen nicht zu vergessen, helfen Kalender, Apps oder das gemeinsame Zählen in der Synagoge.',
    ],
    quelle: 'Schulchan Aruch, Orach Chajim 489,7–8',
  },
  {
    id: 'pes-46',
    nr: 46,
    q: 'Die Omer-Tage betrachtet man auch als eine Zeit des Trauerns. Warum?',
    kurz: 'In dieser Zeit starben 24.000 Schüler Rabbi Akiwas an einer Seuche, weil sie einander nicht mit Respekt behandelten (Talmud, Jewamot 62b). Aschkenasim gedenken außerdem der Gemeinden, die in den Kreuzzügen 1096 im Rheinland (Speyer, Worms, Mainz) in dieser Jahreszeit ermordet wurden.',
    punkte: [
      'Die Trauer endet an Lag ba-Omer, wo die Seuche aufhörte (Frage 43).',
      'Die Lehre daraus: gegenseitige Achtung als Vorbereitung auf die Tora.',
    ],
    quelle: 'Talmud, Jewamot 62b',
  },
  {
    id: 'pes-47',
    nr: 47,
    q: 'Worauf verzichten wir während der Omer-Periode?',
    kurz: 'Man heiratet nicht, schneidet und rasiert sich nicht die Haare und hört keine Live-Musik und tanzt nicht. Große Feiern verschiebt man.',
    punkte: [
      'Wie lange das gilt, ist Brauch: bis Lag ba-Omer, oder von Rosch Chodesch Ijar bis kurz vor Schawuot, oder anders.',
      'Viele vermeiden auch neue Kleidung oder Früchte, über die man Schehechejanu sagt.',
      'Verlobungen und Brit Mila sind erlaubt.',
    ],
    quelle: 'Schulchan Aruch und Rema, Orach Chajim 493',
    check: 'Welche 33 Tage man trauert und was genau verboten ist, richtet sich nach dem Brauch der Gemeinde.',
  },
  {
    id: 'pes-48',
    nr: 48,
    q: 'Was ist Pirkei Avot?',
    kurz: 'Pirkej Awot („Sprüche der Väter“) ist ein Traktat der Mischna mit ethischen Lehren der Weisen, von Mosche am Sinai bis zu den Rabbinen der Mischna-Zeit. Man lernt jeden Schabbat-Nachmittag zwischen Pessach und Schawuot ein Kapitel (sechs Kapitel in sechs Wochen), viele den ganzen Sommer.',
    punkte: [
      'Es beginnt: „Mosche empfing die Tora am Sinai und überlieferte sie Josua …“.',
      'Bekannte Sprüche: „Wenn ich nicht für mich bin, wer ist für mich? Und wenn ich nur für mich bin, was bin ich? Und wenn nicht jetzt, wann?“ (Hillel, 1,14).',
      'Das sechste Kapitel (Kinjan Tora) ist eine spätere Ergänzung über das Torastudium.',
    ],
    hebrew: [{ label: 'Sprüche der Väter', text: 'פִּרְקֵי אָבוֹת', translit: 'pirkej awot', de: 'Kapitel der Väter' }],
  },
];
