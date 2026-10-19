// Giur-Wissen, Teil 1: Kaschrut (Speisegesetze).
//
// Fragetexte stehen wörtlich im Prüfungskatalog; die Antworten sind ENTWÜRFE
// und müssen von einem Rabbiner oder Lehrer geprüft werden (status 'entwurf').
// Erst wenn eine Antwort geprüft ist, wird ihr Status auf 'geprueft' gesetzt.
//
// Felder je Frage
//   id      stabil, nie umnummerieren – der Lernfortschritt hängt daran
//   nr      Nummer im Prüfungskatalog
//   q       Fragetext, sub = Unterfragen (a., b., c.)
//   type    'erklaeren' (Standard) | 'fakt' | 'persoenlich'
//   kurz    Kernantwort in ein bis drei Sätzen (bei 'persoenlich': worauf es ankommt)
//   punkte  Merkpunkte
//   hebrew  [{ label, text, translit, de }] – Hebräisch zum Aufsagen
//   quelle  Fundstelle
//   check   was beim Lehrer oder Beit Din nachzufragen ist (Bräuche, unklare Frage)
//   status  'entwurf' (Standard) | 'geprueft'
//
// Nur reiner Text: Die Anzeige maskiert alles, HTML hat hier keine Wirkung.

const BRACHA_ANFANG = 'בָּרוּךְ אַתָּה ה׳ אֱלֹקֵינוּ מֶלֶךְ הָעוֹלָם, אֲשֶׁר קִדְּשָׁנוּ בְּמִצְוֹתָיו וְצִוָּנוּ';
const BRACHA_ANFANG_UMSCHRIFT = 'Baruch ata Haschem, Elokejnu melech ha-olam, ascher kidschanu be-mizwotaw we-zivanu';
const BRACHA_ANFANG_DE = 'Gesegnet bist Du, Ewiger, unser G’tt, König der Welt, der uns durch seine Gebote geheiligt und uns geboten hat';

export const KASCHRUT = [
  {
    id: 'kas-01',
    nr: 1,
    q: 'Was bedeutet der Ausdruck „Koscher“? Was ist „Glatt-Koscher“?',
    kurz: 'Koscher (hebr. kascher) heißt „tauglich, geeignet“: Speisen, die nach den jüdischen Speisegesetzen (Kaschrut) erlaubt sind – erlaubte Tierart, richtig geschlachtet und zubereitet, Milch und Fleisch nicht vermischt. „Glatt-Koscher“ ist der strengste Standard bei Fleisch: Die Lunge des Tieres war bei der Untersuchung völlig glatt, ohne Verwachsungen.',
    punkte: [
      '„Glatt“ meint die Lunge des geschlachteten Tieres: glatt = ohne Verwachsungen.',
      'Im sefardischen Sprachgebrauch heißt derselbe Standard „Chalak“ (hebr. „glatt“).',
      'Im Alltag wird „glatt koscher“ oft allgemein für „besonders streng koscher“ benutzt.',
      'Das Gegenteil von koscher: nicht koscher, „tref“ (Frage 6).',
    ],
    hebrew: [{ label: 'koscher', text: 'כָּשֵׁר', translit: 'kascher', de: 'tauglich, geeignet' }],
  },
  {
    id: 'kas-02',
    nr: 2,
    q: 'Welche Merkmale weisen koschere Fische auf?',
    type: 'fakt',
    kurz: 'Koschere Fische haben Flossen und Schuppen. Beides muss vorhanden sein (3. Mose 11,9).',
    punkte: [
      'Die Schuppen müssen sich ablösen lassen, ohne die Haut zu verletzen.',
      'Wer Schuppen hat, hat auch Flossen – umgekehrt nicht: Der Wels hat Flossen, aber keine passenden Schuppen.',
      'Koscher z. B.: Lachs, Karpfen, Forelle, Hering.',
      'Nicht koscher z. B.: Aal, Hai, Wels, Stör und alle Schalen- und Krustentiere.',
      'Fische brauchen keine Schechita (Frage 12).',
    ],
    quelle: '3. Mose 11,9–12; 5. Mose 14,9–10',
  },
  {
    id: 'kas-03',
    nr: 3,
    q: 'Welche Merkmale weisen koschere Säugetiere auf?',
    type: 'fakt',
    kurz: 'Ein Säugetier ist koscher, wenn es Wiederkäuer ist und gespaltene Hufe hat – beide Zeichen zusammen (3. Mose 11,3).',
    punkte: [
      'Beispiele: Rind, Schaf, Ziege.',
      'Die Tora nennt vier Tiere, die nur eines der beiden Zeichen haben und deshalb verboten sind: Kamel, Hase, Klippdachs (Schafan) und Schwein.',
      'Das Schwein hat gespaltene Hufe, ist aber kein Wiederkäuer.',
      'Auch ein koscheres Tier ist nur nach richtiger Schechita erlaubt (Fragen 9 und 10).',
    ],
    quelle: '3. Mose 11,3–8; 5. Mose 14,4–8',
  },
  {
    id: 'kas-04',
    nr: 4,
    q: 'Ist es einem Juden gestattet Insekten zu essen?',
    sub: ['Wenn ja, welche?'],
    kurz: 'Grundsätzlich nein, Insekten und Gewürm sind verboten. Die einzige Ausnahme sind bestimmte Heuschrecken-Arten (3. Mose 11,22), die man nur essen darf, wenn man ihre Art aus einer sicheren Überlieferung kennt.',
    punkte: [
      'Die jemenitische Gemeinde hat diese Überlieferung; in aschkenasischen Gemeinden werden Heuschrecken nicht gegessen.',
      'Praktisch wichtig: auch unabsichtlich keine Insekten essen. Salat, Kohl, Blumenkohl, Beeren und Mehl muss man auf Befall prüfen.',
      'Die Ausnahme gilt nur für Heuschrecken, nicht für andere Insekten.',
    ],
    quelle: '3. Mose 11,20–23.41–42',
    check: 'Wie Gemüse und Mehl genau geprüft werden sollen (Methode, welche Sorten).',
  },
  {
    id: 'kas-05',
    nr: 5,
    q: 'Welches Produkt eines Insekts darf ein Jude essen?',
    type: 'fakt',
    kurz: 'Bienenhonig. Die Biene sammelt nur den Nektar der Blüten und lagert ihn ein; der Honig stammt nicht aus ihrem Körper.',
    punkte: [
      'Sonst gilt: Was von einem nicht koscheren Tier kommt, ist verboten (z. B. Milch von einer Stute). Honig ist die bekannte Ausnahme.',
      'Quelle der Regel: Talmud, Bechorot 7b.',
    ],
  },
  {
    id: 'kas-06',
    nr: 6,
    q: 'Welchen Ausdruck benutzt man für Lebensmittel die nicht koscher sind?',
    type: 'fakt',
    kurz: '„Tref“ (auch „Treife“, von hebr. terefa, wörtlich „zerrissen“). Im Alltag steht das Wort für alles, was nicht koscher ist.',
    punkte: [
      'Ursprünglich: ein Tier, das von einem Raubtier gerissen wurde oder einen tödlichen Mangel hat (Frage 11).',
      'Weitere Wörter: „assur“ (verboten) und „Nevela“ (Tier, das nicht richtig geschlachtet wurde).',
    ],
    hebrew: [{ label: 'tref', text: 'טְרֵפָה', translit: 'terefa', de: 'zerrissen; nicht koscher' }],
  },
  {
    id: 'kas-07',
    nr: 7,
    q: 'Nenne einige Tiere die einem Juden nicht gestattet sind zu essen:',
    sub: ['von den Säugetieren:', 'von den Meerestieren:', 'andere:'],
    type: 'fakt',
    kurz: 'Säugetiere: Schwein, Kamel, Hase, Pferd. Meerestiere: Garnelen, Hummer, Muscheln, Austern, Tintenfisch, Aal, Hai. Andere: Raubvögel, Eulen, Strauß, Schlangen, Frösche und Insekten.',
    punkte: [
      'Säugetiere: alle, die nicht beide Zeichen haben (wiederkäuen und gespaltene Hufe), dazu Raubtiere wie Hund, Katze, Bär.',
      'Meerestiere: alles ohne Flossen und Schuppen, auch Wale und Delfine.',
      'Vögel: Die Tora zählt die verbotenen Arten auf (3. Mose 11,13–19), vor allem Raubvögel. Erlaubt sind z. B. Huhn, Gans, Ente, Truthahn, Taube.',
    ],
    quelle: '3. Mose 11; 5. Mose 14',
  },
  {
    id: 'kas-08',
    nr: 8,
    q: 'Kann man Fisch in einem nicht-koscheren Geschäft kaufen?',
    sub: ['Wenn ja, wie?'],
    kurz: 'Ja, wenn man sicher sein kann, dass es ein koscherer Fisch ist. Dazu kauft man ihn ganz oder zumindest mit Haut und Schuppen, damit man die Art erkennt.',
    punkte: [
      'Filets ohne Haut kann man nicht zuverlässig bestimmen. Man kauft sie nur mit Hechscher oder wenn Haut mit Schuppen dranbleibt.',
      'Verarbeiteten Fisch (Konserven, Räucherfisch, Paniertes) nur mit Hechscher kaufen.',
      'Fisch braucht keine Schechita und gilt als parwe (Frage 30).',
    ],
    check: 'Ob und wie das Zerlegen mit Messern und Brettern des Händlers eine Rolle spielt, und wie viel Haut dranbleiben muss.',
  },
  {
    id: 'kas-09',
    nr: 9,
    q: 'Warum müssen Tiere nach einem Ritual geschlachtet werden?',
    kurz: 'Weil die Tora es gebietet („schlachte … wie ich dir geboten habe“, 5. Mose 12,21). Die genauen Regeln stammen aus der mündlichen Tora. Schechita tötet das Tier schnell und möglichst schmerzlos, entfernt das Blut weitgehend und erlaubt, das Tier zu prüfen.',
    punkte: [
      'Mitgefühl mit den Tieren (Tza’ar Ba’alei Chajim): Fleischessen ist erlaubt (1. Mose 9,3), aber streng geregelt.',
      'Blut ist verboten (Frage 16), der Schnitt sorgt für rasches Ausbluten.',
      'Der Schochet prüft das Tier auf Mängel (Frage 11).',
    ],
    quelle: '5. Mose 12,21',
  },
  {
    id: 'kas-10',
    nr: 10,
    q: 'Was wissen Sie über den Ablauf des jüdischen Schlachtens?',
    kurz: 'Ein ausgebildeter, frommer Schochet spricht die Bracha und durchtrennt mit einem makellos scharfen Messer in einem schnellen, durchgehenden Schnitt Luft- und Speiseröhre. Danach prüft er Messer und Tier.',
    punkte: [
      'Der Schochet ist ein Mann, der in den Gesetzen ausgebildet ist und von einem Rabbiner autorisiert wurde.',
      'Das Messer ist sehr scharf und ohne Scharte. Man prüft es mit dem Fingernagel, vor und nach dem Schnitt.',
      'Ein Zug hin und her, ohne Druck und ohne Pause. Fünf Fehler machen die Schechita ungültig: Schehija (Pause), Derasa (Druck), Chalada (Verdecken), Hagrama (falsche Stelle), Ikkur (Herausreißen).',
      'Bei Säugetieren wird der größte Teil von Luft- und Speiseröhre durchtrennt, bei Geflügel mindestens eine der beiden.',
      'Danach folgt die Untersuchung der Organe, vor allem der Lunge (Bedika). Zeigt sich ein Mangel, ist das Tier tref (Frage 11).',
      'Bei Geflügel und Wild wird das Blut mit Erde bedeckt (Kisui Hadam).',
    ],
    quelle: '5. Mose 12,21; 3. Mose 17,13',
    check: 'Wie ausführlich der Ablauf gewusst werden muss (Überblick oder die fünf Fehler im Einzelnen).',
  },
  {
    id: 'kas-11',
    nr: 11,
    q: 'Unter welchen Bedingungen nennt man Tiere „Tref“?',
    kurz: 'Tref ist ein Tier mit einem Mangel oder einer Verletzung, an der es nach der Auslegung der Weisen nicht länger als zwölf Monate leben könnte, z. B. durchlöcherte Speiseröhre oder Lunge, gebrochenes Rückgrat oder eine Verletzung durch ein Raubtier. Ein solches Tier ist auch nach richtiger Schechita nicht koscher.',
    punkte: [
      'Der Schochet prüft nach dem Schnitt die Organe, besonders die Lunge auf Löcher und Verwachsungen.',
      'Nicht verwechseln: Nevela ist ein Tier, das nicht ordnungsgemäß geschlachtet wurde oder von selbst verendet ist.',
    ],
    quelle: '2. Mose 22,30',
  },
  {
    id: 'kas-12',
    nr: 12,
    q: 'Welche Tiere und Vögel müssen nach dem Ritual (Schechita) geschlachtet werden?',
    type: 'fakt',
    kurz: 'Alle koscheren Säugetiere (z. B. Rind, Schaf, Ziege) und alle koscheren Vögel (z. B. Huhn, Gans, Ente, Truthahn). Nur Fische brauchen keine Schechita.',
    punkte: [
      'Bei Geflügel und Wild wird nach der Schechita das Blut mit Erde bedeckt.',
    ],
  },
  {
    id: 'kas-13',
    nr: 13,
    q: 'Wo werden Sie Ihr Fleisch kaufen?',
    type: 'persoenlich',
    kurz: 'Hier zählt die eigene, ehrliche Antwort. Üblich: in einer koscheren Metzgerei oder einem koscheren Geschäft mit gültigem Hechscher, bei verpacktem Fleisch mit unversehrtem Siegel.',
    punkte: [
      'Nenne konkret, wo du einkaufst und woran du die Aufsicht erkennst (Hechscher, Siegel, anerkanntes Rabbinat).',
      'Sag, was du tust, wenn es kein koscheres Fleisch gibt (z. B. vegetarisch oder Fisch essen).',
      'Beim Rabbiner erfragen, welche Aufsicht er anerkennt.',
    ],
  },
  {
    id: 'kas-14',
    nr: 14,
    q: 'Wie wird Fleisch koscher gemacht?',
    kurz: 'Fleisch wird „gekoschert“, um das Blut zu entfernen: einweichen (etwa 30 Minuten in Wasser), abtropfen lassen, mit grobem Salz bestreuen (etwa eine Stunde) und dreimal gründlich abspülen.',
    punkte: [
      'Spätestens 72 Stunden nach der Schlachtung (Frage 17).',
      'Das Fleisch liegt ganz im Wasser. Das Salz ist grobkörnig und kommt auf alle Seiten. Das Blut muss abfließen können.',
      'Bei Geflügel auch innen salzen.',
      'Tiefgefrorenes Fleisch muss man vorher auftauen. Leber wird anders behandelt (Frage 15).',
      'Meist erledigt das schon der koschere Metzger.',
    ],
    check: 'Die genauen Zeiten fürs Einweichen und Salzen.',
  },
  {
    id: 'kas-15',
    nr: 15,
    q: 'Was ist die einzige richtige Methode um koschere Leber zuzubereiten?',
    type: 'fakt',
    kurz: 'Leber ist sehr blutreich und wird deshalb nicht gesalzen, sondern über offener Flamme oder auf dem Grill gebraten, bis das Blut ausgetreten ist.',
    punkte: [
      'Vorher einschneiden und abspülen, damit das Blut ablaufen kann.',
      'Auf einen Rost legen, damit das Blut abtropft.',
      'Nach dem Braten abspülen. Danach darf man sie auch weiter zubereiten, z. B. kochen.',
    ],
    check: 'Einzelheiten: Einschneiden, ob vorher Salz verwendet wird.',
  },
  {
    id: 'kas-16',
    nr: 16,
    q: 'Warum ist das Konsumieren von Blut unter allen Umständen verboten?',
    kurz: 'In der Tora ist das Blut der Sitz der Lebenskraft („das Blut ist die Seele“, 5. Mose 12,23) und gehört G’tt. Der Genuss von Blut ist ausdrücklich verboten, bei jedem Tier und in jeder Lage (3. Mose 17,10–14).',
    punkte: [
      'Schon Noach bekam dieses Verbot (1. Mose 9,4).',
      'Es erinnert daran, dass Leben heilig ist: Fleischessen ist ein Zugeständnis.',
      'Folgen im Alltag: Schechita, Ausbluten, Koschern, Leber braten, Eier prüfen.',
    ],
    quelle: '3. Mose 17,10–14; 5. Mose 12,23; 1. Mose 9,4',
  },
  {
    id: 'kas-17',
    nr: 17,
    q: 'Wie lange hat man maximal Zeit nach dem Schlachten um das Fleisch einzuweichen und zu pökeln?',
    type: 'fakt',
    kurz: 'Höchstens 72 Stunden (drei Tage). Danach ist das Blut eingetrocknet und das Fleisch darf nicht mehr normal gesalzen werden.',
    punkte: [
      'Fleisch, bei dem die Frist verpasst wurde, darf nur noch gebraten werden.',
    ],
    check: 'Ob man die Frist durch Abspülen verlängern kann und was bei verpasster Frist gilt.',
  },
  {
    id: 'kas-18',
    nr: 18,
    q: 'Was ist die allgemeine Regelung bezüglich eines Bluttropfens in Eiern?',
    type: 'fakt',
    kurz: 'Ein Ei mit einem Bluttropfen (Blutfleck) isst man nicht. Deshalb schlägt man Eier einzeln in ein durchsichtiges Glas auf und prüft sie, bevor man sie verwendet.',
    punkte: [
      'Nie mehrere Eier gleichzeitig in eine Schüssel schlagen: Ein schlechtes Ei würde alles unbrauchbar machen.',
      'Hartgekochte Eier kann man nicht prüfen, also vorher roh prüfen.',
      'Grund ist das Blutverbot (Frage 16).',
    ],
    check: 'Die genaue Regel: ganzes Ei wegwerfen oder nur den Fleck entfernen; Fleck im Dotter oder im Eiweiß.',
  },
  {
    id: 'kas-19',
    nr: 19,
    q: 'Was macht man, wenn man außerhalb isst um die Kaschrut einzuhalten?',
    kurz: 'Man isst nur, was nachweislich koscher ist: im koscheren Restaurant mit gültiger Aufsicht, verpackte Produkte mit Hechscher oder frisches Obst und Gemüse. In einer nicht koscheren Küche isst man kein gekochtes Essen und bringt notfalls eigenes mit.',
    punkte: [
      'Auf Reisen oder im Flugzeug: koschere Mahlzeit vorbestellen und versiegelt lassen.',
      'Bei Einladungen: vorher klären oder eigenes Essen, Besteck und Geschirr mitbringen.',
      'Gekochtes von Nichtjuden: Frage 42. Wein: Frage 38.',
    ],
    check: 'Was in der Praxis erlaubt ist (z. B. Salat oder Getränke im nicht koscheren Restaurant); Rabbiner sehen das unterschiedlich.',
  },
  {
    id: 'kas-20',
    nr: 20,
    q: 'Wie hält man eine Küche in einem koscheren Zustand?',
    kurz: 'Mit strikter Trennung von Milchigem, Fleischigem und Parwe – eigenes Geschirr, Besteck, Töpfe, Schwämme und Handtücher – und nur mit koscheren, geprüften Zutaten.',
    punkte: [
      'Getrennte Sätze für milchig und fleischig, meist farbig markiert. Ein Parwe-Satz ist üblich.',
      'Getrennte Spülbecken oder Einlagen, getrennte Arbeitsflächen oder Unterlagen.',
      'Nur Lebensmittel mit Hechscher; Obst, Gemüse und Mehl auf Insekten prüfen; Eier einzeln prüfen.',
      'Neues Geschirr tauchen (Frage 21). Bei Verwechslung den Rabbiner fragen (Frage 23).',
      'Ofen, Spülmaschine und Mikrowelle nach den Regeln der Fragen 27 bis 29.',
    ],
  },
  {
    id: 'kas-21',
    nr: 21,
    q: 'Was muss man mit neuem Geschirr, Utensilien und Besteck machen bevor man sie benutzt?',
    kurz: 'Geschirr, Besteck und Töpfe aus Metall oder Glas, die ein Nichtjude hergestellt oder verkauft hat, taucht man vor dem ersten Gebrauch in einer Mikwe unter (Tewilat Kelim, 4. Mose 31,21–23).',
    punkte: [
      'Vorher gründlich reinigen, Aufkleber und Kleberreste entfernen.',
      'Das Stück muss ganz vom Wasser umschlossen sein, man hält es also locker.',
      'Gilt für Gegenstände, mit denen man isst, kocht oder serviert; Einwegzeug ausgenommen.',
      'Eine Mikwe ist ein Tauchbad mit natürlichem Wasser (Frage 34). Ein Wasserhahn reicht nicht.',
      'Holz, Plastik und Papier: keine Pflicht.',
      'Die Bracha steht in Frage 22.',
    ],
    quelle: '4. Mose 31,21–23',
    check: 'Wie es bei Keramik, Porzellan, Plastik und Glas gehandhabt wird (mit oder ohne Bracha) – das ist Brauchsache.',
  },
  {
    id: 'kas-22',
    nr: 22,
    q: 'Welchen Segensspruch wird für welchen Gegenstand angewendet?',
    type: 'fakt',
    kurz: 'Beim Tauchen von Geschirr spricht man vor dem Eintauchen die Bracha „… al tewilat keli“ für ein einzelnes Stück und „… al tewilat kelim“ für mehrere Stücke.',
    punkte: [
      'Bei mehreren Stücken spricht man die Bracha einmal und taucht dann alle.',
      'Man spricht sie, während man das Geschirr in der Hand hält, vor dem ersten Eintauchen.',
    ],
    hebrew: [
      {
        label: 'Ein Gegenstand',
        text: `${BRACHA_ANFANG} עַל טְבִילַת כְּלִי.`,
        translit: `${BRACHA_ANFANG_UMSCHRIFT} al tewilat keli.`,
        de: `${BRACHA_ANFANG_DE}, ein Gerät zu tauchen.`,
      },
      {
        label: 'Mehrere Gegenstände',
        text: `${BRACHA_ANFANG} עַל טְבִילַת כֵּלִים.`,
        translit: `${BRACHA_ANFANG_UMSCHRIFT} al tewilat kelim.`,
        de: `${BRACHA_ANFANG_DE}, Geräte zu tauchen.`,
      },
    ],
    check: 'Die Frage ist im Katalog knapp gestellt. Gemeint ist vermutlich die Bracha beim Tauchen (Frage 21).',
  },
  {
    id: 'kas-23',
    nr: 23,
    q: 'Was macht man, wenn man versehentlich milchiges Geschirr, Utensilien oder Besteck mit Fleischigem verwechselt hat?',
    kurz: 'Das entscheidet man nicht selbst, sondern fragt den Rabbiner (Schaila). Es kommt darauf an, ob das Geschirr heiß oder kalt, nass oder trocken war und wann es zuletzt benutzt wurde.',
    punkte: [
      'Die Speise nicht vorschnell wegwerfen: erst fragen.',
      'Bei kaltem, trockenem Geschirr genügt oft Abspülen.',
      'Bei Hitze geht Geschmack über: Das Geschirr muss eventuell gekaschert werden, die Speise kann verboten sein.',
      'Ist die Speise sehr viel mehr als die Menge, die sich verbunden hat, kann sie erlaubt sein (Regel 1:60, „Bitul beschischim“).',
      'Alle Einzelheiten dem Rabbiner schildern: heiß oder kalt, trocken oder nass, wann benutzt, was und wie viel.',
    ],
    check: 'Immer Schaila stellen – die Regeln hängen stark vom Einzelfall ab.',
  },
  {
    id: 'kas-24',
    nr: 24,
    q: 'Wie lang ist die Minimum Wartezeiten zwischen dem Essen von Milchigem und Fleischigem? Zwischen Fleischigem und Milchigem?',
    type: 'fakt',
    kurz: 'Nach Fleisch bis Milch: 6 Stunden (so lehren viele aschkenasische Gemeinden). Nach Milch bis Fleisch: keine feste Stundenzahl, aber man spült den Mund, isst etwas Neutrales (z. B. Brot) und trinkt Wasser.',
    punkte: [
      'Die Zeit zählt ab dem Ende des Fleischessens.',
      'Nach hartem Käse wartet man wie nach Fleisch (Frage 36).',
      'Brauch je nach Gemeinde: 6 Stunden, 3 Stunden (Brauch der deutschen Juden) oder 1 Stunde (Brauch niederländischer Juden).',
    ],
    quelle: '2. Mose 23,19; 5. Mose 14,21',
    check: 'Welche Wartezeit zwischen Fleisch und Milch gilt (6, 3 oder 1 Stunde) – das ist Brauchsache und muss genau bekannt sein.',
  },
  {
    id: 'kas-25',
    nr: 25,
    q: 'Nenne einige koschere Symbole. Wofür steht „D“ und „P“?',
    type: 'fakt',
    kurz: 'Bekannte Hechscher-Zeichen sind z. B. OU (Orthodox Union), OK, Star-K, KLBD und Badatz; dazu kommen die Siegel örtlicher Rabbinate. „D“ steht für Dairy, also milchig bzw. mit Milchbestandteilen. „P“ steht für Pessach (koscher für Pessach).',
    punkte: [
      'Oft steht dabei, ob das Produkt milchig, fleischig oder Parwe ist.',
      'Ein einfaches „K“ ist keine verlässliche Aufsicht: Jeder Hersteller darf es selbst aufdrucken.',
      'Gültig ist ein Zeichen nur, wenn das Rabbinat oder Beit Din es anerkennt.',
    ],
    check: 'Ob „P“ im Katalog für Pessach oder für Pareve steht, und welche Siegel anerkannt sind.',
  },
  {
    id: 'kas-26',
    nr: 26,
    q: 'Nenne 2 Produkte die keines koscheren Symbols bedürfen?',
    type: 'fakt',
    kurz: 'Zum Beispiel frisches, unverarbeitetes Obst und Gemüse sowie Salz oder reines Wasser. Auch rohe Eier brauchen kein Symbol.',
    punkte: [
      'Voraussetzung: unverarbeitet und ohne Zusatzstoffe.',
      'Obst und Gemüse trotzdem auf Insekten prüfen (Frage 4), Eier auf Blut (Frage 18).',
      'Alles Verarbeitete braucht ein Hechscher (Frage 35).',
    ],
  },
  {
    id: 'kas-27',
    nr: 27,
    q: 'Kann man eine Spülmaschine für sowohl Milch als auch Fleisch benutzen? Wenn ja, wie?',
    kurz: 'Wenn der Rabbiner es erlaubt, ja: nacheinander, nie gleichzeitig. Dazwischen reinigt man das Sieb und lässt die Maschine leer mit heißem Programm laufen.',
    punkte: [
      'Getrennte Körbe und Einsätze für milchig und fleischig.',
      'Manche warten zwischen den Ladungen zusätzlich 24 Stunden.',
      'Am sichersten sind zwei Maschinen oder getrenntes Spülen von Hand in eigenen Becken.',
    ],
    check: 'Die Spülmaschine ist unter Rabbinern umstritten: Welche Regelung gilt?',
  },
  {
    id: 'kas-28',
    nr: 28,
    q: 'Kann man eine Mikrowelle für sowohl Milch als auch Fleisch benutzen? Wie?',
    kurz: 'Ja, wenn die Speisen abgedeckt oder verschlossen sind, damit weder Dampf noch Spritzer etwas übertragen. Milchiges und Fleischiges nie gleichzeitig.',
    punkte: [
      'Mit Deckel oder Folie abdecken.',
      'Innenraum und Drehteller sauber halten, evtl. eigene Unterlagen verwenden.',
      'Wurde etwas Heißes unabgedeckt hineingestellt, den Rabbiner fragen (oft hilft Kaschern: Schale Wasser aufkochen).',
    ],
    check: 'Welche Regelung für die Mikrowelle gilt.',
  },
  {
    id: 'kas-29',
    nr: 29,
    q: 'Kann man einen herkömmlichen Ofen für sowohl Milch als auch Fleisch benutzen? Wie?',
    kurz: 'Ja, wenn man den Ofen sauber hält und die Speisen abdeckt. Milchiges und Fleischiges nach Möglichkeit nacheinander, nicht zusammen.',
    punkte: [
      'Vorher gründlich reinigen, besonders Spritzer.',
      'Speisen mit Deckel oder Folie abdecken; getrennte Bleche und Formen.',
      'Zwischendurch den Ofen einmal richtig heiß ausheizen.',
    ],
    check: 'Ob Milchiges und Fleischiges zeitgleich im Ofen stehen dürfen; Rabbiner sehen das unterschiedlich.',
  },
  {
    id: 'kas-30',
    nr: 30,
    q: 'Was bedeutet der Ausdruck „Parwe“?',
    kurz: '„Parwe“ (auch pareve) heißt neutral: weder milchig noch fleischig. Parwe-Speisen darf man mit Milchigem und mit Fleischigem essen.',
    punkte: [
      'Parwe sind Pflanzliches, Eier und Fisch.',
      'Wird Parwe heiß in einem milchigen oder fleischigen Topf zubereitet, kann es dessen Charakter annehmen.',
      'Fisch und Fleisch isst man nach Brauch nicht zusammen auf einem Teller.',
    ],
  },
  {
    id: 'kas-31',
    nr: 31,
    q: 'Nenne einige Beispiele für Parwe Lebensmittel.',
    type: 'fakt',
    kurz: 'Obst, Gemüse, Getreide, Reis, Nüsse, Eier, Fisch, Öl, Zucker, Salz, Kaffee und Tee.',
    punkte: [
      'Fertigprodukte nur mit Hechscher, auf dem „Parwe“ steht.',
    ],
  },
  {
    id: 'kas-32',
    nr: 32,
    q: 'Wann muss Challah abgesondert werden?',
    kurz: 'Wenn man aus ausreichend Mehl einer der fünf Getreidearten (Weizen, Gerste, Dinkel, Hafer, Roggen) Teig für Brot macht, trennt man vor dem Backen ein Stück vom Teig ab (4. Mose 15,17–21).',
    punkte: [
      'Der Teig ist geknetet, aber noch nicht geformt und gebacken.',
      'Challa gehört zu den drei besonderen Mizwot der Frau (Challa, Nida, Schabbat-Kerzen).',
      'Die Bracha spricht man nur, wenn die Menge dafür reicht (Frage 33).',
    ],
    hebrew: [
      {
        label: 'Bracha',
        text: `${BRACHA_ANFANG} לְהַפְרִישׁ חַלָּה מִן הָעִיסָּה.`,
        translit: `${BRACHA_ANFANG_UMSCHRIFT} lehafrisch challa min ha-isa.`,
        de: `${BRACHA_ANFANG_DE}, Challa vom Teig abzusondern.`,
      },
    ],
    quelle: '4. Mose 15,17–21',
    check: 'Wortlaut der Bracha und Reihenfolge des Absonderns.',
  },
  {
    id: 'kas-33',
    nr: 33,
    q: 'Ab welcher Menge Teig unterliegt eine Challah einem Gesetz wonach es abgesondert werden muss?',
    type: 'fakt',
    kurz: 'Ab etwa 1,2 kg Mehl muss man Challa absondern. Die Bracha spricht man erst ab etwa 2,25 kg.',
    punkte: [
      'Zwischen den beiden Mengen sondert man ohne Bracha ab.',
    ],
    check: 'Die Gewichtsangaben unterscheiden sich je nach Quelle (1,2 kg oder 2,25 kg): Welche gelten?',
  },
  {
    id: 'kas-34',
    nr: 34,
    q: 'Was macht man mit der abgesonderten Challah?',
    type: 'fakt',
    kurz: 'Man trennt ein kleines Stück Teig ab (etwa olivengroß), sagt „Harej zo Challa“ („Dies ist Challa“), wickelt es in Folie und verbrennt es. Man isst es nicht.',
    punkte: [
      'Im Tempel erhielt der Kohen die Challa. Heute gibt es dafür keine Verwendung.',
      'Danach darf man den übrigen Teig backen und essen.',
    ],
    hebrew: [{ label: 'Spruch beim Absondern', text: 'הֲרֵי זוֹ חַלָּה', translit: 'Harej zo Challa', de: 'Dies ist Challa' }],
  },
  {
    id: 'kas-35',
    nr: 35,
    q: 'Was muss man beim Kauf von verarbeiteten Lebensmitteln, z.B. Dosenessen, beachten?',
    kurz: 'Man achtet auf ein anerkanntes Hechscher und darauf, ob das Produkt milchig, fleischig oder Parwe ist. Die Zutatenliste allein reicht nicht.',
    punkte: [
      'Versteckte Zutaten: Gelatine, Lab, Emulgatoren, Aromen, Farbstoffe (z. B. Karmin), Glycerin.',
      'Herstellung: Maschinen können auch für Unkoscheres genutzt werden.',
      'Für Pessach braucht man zusätzlich ein Hechscher „koscher lePessach“.',
    ],
  },
  {
    id: 'kas-36',
    nr: 36,
    q: 'Worin besteht der Unterschied zwischen weichem und hartem Käse in Bezug auf die Einhaltung der Wartezeit vor dem Verzehr von Fleisch?',
    kurz: 'Nach weichem Käse genügt es, den Mund zu spülen und etwas Neutrales zu essen. Nach hartem, lange gereiftem Käse (etwa ab sechs Monaten Reifezeit, z. B. Parmesan) wartet man wie nach Fleisch.',
    punkte: [
      'Grund: Harter Käse hinterlässt lange Geschmack und Reste im Mund.',
      'Die Wartezeit ist dieselbe wie in Frage 24.',
    ],
    check: 'Ab welcher Reifezeit ein Käse „hart“ gilt und wie viele Stunden gewartet wird.',
  },
  {
    id: 'kas-37',
    nr: 37,
    q: 'Warum ist ein koscheres Symbol auf israelischen Produkten erforderlich?',
    kurz: '„In Israel hergestellt“ heißt nicht automatisch „koscher“. Zutaten, Herstellung und Geräte müssen geprüft werden, und für Erzeugnisse des Landes Israel gelten zusätzliche Gebote wie Teruma, Ma’asser und Schmita.',
    punkte: [
      'Nicht jeder Hersteller hält sich an die Speisegesetze.',
      'Das Rabbinat (und private Hechscherim) kontrolliert die Aufsicht.',
      'Zu Schmita siehe Frage 41.',
    ],
  },
  {
    id: 'kas-38',
    nr: 38,
    q: 'Was ist „nicht-koscherer“ Wein? Warum darf es nach den Regeln der Halacha nicht getrunken werden?',
    kurz: 'Nicht koscher ist Wein, den Nichtjuden hergestellt oder angefasst haben („Stam Jajin“), und Wein, der für Götzendienst bestimmt war („Jajin Nesech“). Die Weisen haben das Trinken verboten, um enge Gemeinschaft und Mischehen zu verhindern.',
    punkte: [
      'Koscher ist Wein, wenn ihn Juden, die die Mizwot halten, von der Traube bis zur Flasche herstellen, oder wenn er unter Aufsicht steht.',
      'Gekochter bzw. pasteurisierter Wein („Mewuschal“) bleibt auch nach Berührung durch Nichtjuden erlaubt.',
      'Gilt auch für Traubensaft.',
    ],
    check: 'Wie „Mewuschal“ beurteilt wird und welche Weine anerkannt sind.',
  },
  {
    id: 'kas-39',
    nr: 39,
    q: 'Welche alkoholischen Getränke darf ein Jude zu sich nehmen unabhängig wer sie hergestellt hat?',
    type: 'fakt',
    kurz: 'Getränke, die nicht aus Trauben gemacht sind, z. B. Bier, Wodka, Whisky, Gin und Rum, darf man grundsätzlich trinken, wenn sie pur sind. Likör, Aromen und Mischgetränke brauchen ein Hechscher.',
    punkte: [
      'Wein und Traubenbrände (Cognac, Brandy, Grappa) nur mit Hechscher.',
      'Whisky aus Weinfässern (z. B. Sherry) kann problematisch sein.',
      'An Pessach gelten besondere Regeln (Frage 40).',
    ],
    check: 'Welche Getränke ohne Hechscher erlaubt sind; Rabbiner beurteilen das unterschiedlich.',
  },
  {
    id: 'kas-40',
    nr: 40,
    q: 'An welchen Feiertagen sind Spirituosen, die aus Getreide destilliert werden, verboten?',
    type: 'fakt',
    kurz: 'An Pessach. Getränke aus Weizen, Gerste, Roggen, Hafer oder Dinkel (z. B. Bier, Whisky, Wodka aus Getreide) sind Chamez.',
    punkte: [
      'Chamez darf man an Pessach weder essen noch besitzen.',
      'Erlaubt sind nur Getränke mit Hechscher „koscher lePessach“.',
    ],
  },
  {
    id: 'kas-41',
    nr: 41,
    q: 'Was bedeutet „Schmita“? Was müssen wir mit Vorsicht beachten?',
    kurz: 'Schmita ist das Brachjahr: Alle sieben Jahre ruht das Land Israel (3. Mose 25,1–7). Man bestellt es nicht wie sonst, und die Früchte dieses Jahres haben besondere Heiligkeit. Vorsicht: Früchte aus Israel in diesem Jahr nur mit Hechscher kaufen und sie nicht verschwenden oder wegwerfen.',
    punkte: [
      'Das letzte Schmita-Jahr war 5782 (2021/22), das nächste ist 5789 (2028/29).',
      'Im Schmita-Jahr werden auch Schulden erlassen (5. Mose 15,1–2). Hillel führte dafür den Prosbul ein.',
      'Es gibt Lösungen für die Landwirte, z. B. den Verkauf des Landes (Heter Mechira) oder das Lager des Beit Din (Otzar Beit Din). Welche gilt, hängt vom Hechscher ab.',
    ],
    quelle: '3. Mose 25,1–7; 5. Mose 15,1–2',
    check: 'Welche Lösung für die Landwirtschaft anerkannt wird, und wie man Reste behandelt.',
  },
  {
    id: 'kas-42',
    nr: 42,
    q: 'Darf man Essen, das von einem Nicht-Juden zubereitet wurde, essen?',
    kurz: 'Nur sehr eingeschränkt: Gekochtes eines Nichtjuden darf man nur essen, wenn ein Jude beim Kochen mitgewirkt hat (z. B. das Feuer angezündet, „Bischul Akum“). Für Brot gibt es eigene Regeln („Pat Akum“). Außerdem muss die Küche koscher sein.',
    punkte: [
      'Roh Essbares (Obst, Gemüse) ist erlaubt.',
      'Hinter den Regeln steht die Sorge vor unkoscheren Zutaten und vor zu enger Gemeinschaft (Mischehe).',
      'In der Praxis: verpackte Produkte mit Hechscher und frisches Obst und Gemüse.',
    ],
    check: 'Wie streng die Regeln im Alltag gehandhabt werden, z. B. bei Einladungen oder in Restaurants.',
  },
  {
    id: 'kas-43',
    nr: 43,
    q: 'Wie lautet die allgemeine Regelung bezüglich gewürzter Zutaten (z.B.: Zitronen, Essig, Zwiebeln, usw.)?',
    kurz: 'Scharfe Zutaten wie Zwiebel, Knoblauch, Zitrone, Essig, Meerrettich oder Senf (hebr. charif) nehmen den Geschmack eines Messers oder Gefäßes auf, schon ohne Hitze. Man schneidet sie deshalb nur mit dem passenden (milchigen, fleischigen oder Parwe-) Messer.',
    punkte: [
      'Eine Zwiebel, die mit einem fleischigen Messer geschnitten wurde, gilt danach als fleischig.',
      'Essig (besonders Weinessig) und Gewürze brauchen ein Hechscher.',
    ],
    check: 'Die Frage ist missverständlich formuliert („gewürzte Zutaten“). Gemeint sind vermutlich scharfe Zutaten – bitte klären.',
  },
];
