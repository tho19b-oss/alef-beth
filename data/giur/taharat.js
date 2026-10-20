// Giur-Wissen, Teil 18: Taharat Hamischpacha (Familienreinheit).
//
// Fragetexte stehen wörtlich im Prüfungskatalog (offensichtliche Tippfehler
// berichtigt). Die Antworten wurden als ENTWURF geschrieben und sind noch von
// keinem Rabbiner oder Lehrer durchgesehen: Alle Fragen tragen den
// Standardstatus 'entwurf'. Erst was der Prüfbogen bestätigt oder korrigiert,
// bekommt status 'geprueft'. Abweichende Bräuche stehen im Feld `check`.
//
// Die Gesetze der Familienreinheit lernt man mit einer Lehrerin oder einem
// Rabbiner; hier steht nur der Grundriss nach aschkenasischem Brauch. In
// jedem Zweifelsfall (Flecken, Zyklus, Zeiten) fragt man einen Rabbiner.
//
// Felder je Frage: siehe Kopf von kaschrut.js.
//
// Nur reiner Text: Die Anzeige maskiert alles, HTML hat hier keine Wirkung.

export const TAHARAT = [
  {
    id: 'tah-01',
    nr: 1,
    q: 'An welchen weiteren zwei Tagen, außer der Nidda-Zeit, enthält sich eine Frau ihrem Mann?',
    type: 'fakt',
    kurz: 'An Jom Kippur und an Tischa be-Aw. An beiden Tagen sind eheliche Beziehungen verboten, wie Essen und Trinken.',
    punkte: [
      'Dazu kommt die Zeit der Trauer (Schiwa) und die Tage, an denen die Periode erwartet wird (Onat Perischa, Fragen 7 bis 9).',
      'In der Nacht des Tauchgangs nach der Mikwe ist es dagegen eine Mizwa, zusammen zu sein.',
    ],
    quelle: 'Schulchan Aruch, Orach Chajim 554,1 und 615,1',
    check: 'Der Katalog fragt nach „zwei Tagen“; ob die Fasttage oder die Tage der erwarteten Periode gemeint sind, bitte klären.',
  },
  {
    id: 'tah-02',
    nr: 2,
    q: 'Beschreibe das Verhalten zwischen Mann und Frau während der Nidda-Periode betreffend:',
    sub: ['Schlafgewohnheiten', 'am Tisch essen', 'Sitzen', 'Gegenstände weiterreichen', 'Reste des anderen aufessen', 'Servieren bei Tisch'],
    kurz: 'In der Nidda-Zeit berühren sich Mann und Frau nicht und halten Abstand-Regeln (Harchakot) ein, damit sie nicht zueinander kommen. Die Regeln zu den einzelnen Punkten stehen in den Merkpunkten.',
    punkte: [
      'a. Schlafen: in getrennten Betten, die sich nicht berühren; man setzt oder legt sich nicht auf das Bett des anderen.',
      'b. Essen: Man isst nicht von einem Teller; am gemeinsamen Tisch stellt man ein Zeichen (Heker) zwischen die Teller, etwa ein Gefäß, das sonst nicht dort steht.',
      'c. Sitzen: nicht zusammen auf einer Bank oder einem Sofa, das wackelt oder nachgibt, außer jemand sitzt dazwischen.',
      'd. Weiterreichen: Man reicht sich nichts direkt von Hand zu Hand und wirft sich nichts zu; man stellt es ab, und der andere nimmt es.',
      'e. Reste: Der Mann isst und trinkt nicht von dem, was die Frau übrig gelassen hat, in ihrer Gegenwart (außer jemand anderes hat dazwischen davon gegessen, oder es wurde umgefüllt). Für die Frau gilt das nicht.',
      'f. Servieren: Die Frau schenkt dem Mann nicht auf die übliche Art ein und reicht ihm das Essen nicht hin, sondern macht es anders als sonst (zum Beispiel mit der linken Hand oder stellt es neben ihn). Ebenso schenkt der Mann ihr keinen Wein ein.',
    ],
    quelle: 'Schulchan Aruch, Jore De’a 195',
    check: 'Die Einzelheiten der Harchakot (Heker, Sitzen, Einschenken) unterscheiden sich nach Brauch: mit der Lehrerin klären.',
  },
  {
    id: 'tah-03',
    nr: 3,
    q: 'Wie lange dauert diese Zeit?',
    kurz: 'Vom Beginn der Blutung bis zum Untertauchen in der Mikwe: mindestens fünf Tage (nach aschkenasischem Brauch, auch wenn die Blutung kürzer ist) und danach sieben reine Tage, insgesamt also mindestens zwölf Tage.',
    punkte: ['Sie endet nur mit der Mikwe, nie von selbst durch die verstrichene Zeit.'],
    quelle: 'Schulchan Aruch, Jore De’a 196,11 (Rema)',
  },
  {
    id: 'tah-04',
    nr: 4,
    q: 'Ab wann beginnen die 7 Reinheitstage für eine Frau, wenn ihre Periode beginnt am:',
    sub: ['Montag früh', 'Dienstag Nacht'],
    type: 'fakt',
    kurz: 'Man zählt mindestens fünf Tage, den ersten Tag der Blutung mitgerechnet, macht am fünften Tag vor Sonnenuntergang den Hefsek Tahara und beginnt die sieben reinen Tage am Abend danach. Wichtig: Der jüdische Tag beginnt am Abend.',
    punkte: [
      'a. Montag früh: Montag ist Tag 1, Freitag Tag 5. Hefsek Tahara am Freitag vor Sonnenuntergang; die sieben reinen Tage beginnen Freitagabend (Schabbat ist Tag 1) und enden am folgenden Freitag. Das Untertauchen ist am Freitagabend nach Einbruch der Nacht.',
      'b. Dienstag Nacht (nach Einbruch der Dunkelheit): Halachisch ist das schon Mittwoch, also Mittwoch Tag 1 und Sonntag Tag 5. Hefsek Tahara am Sonntag vor Sonnenuntergang; die sieben reinen Tage sind Montag bis Sonntag, das Untertauchen Sonntagnacht.',
      'Begann die Blutung zwischen Sonnenuntergang und Einbruch der Nacht, ist der Tag zweifelhaft: dann fragt man.',
      'Hatte das Paar kurz vor der Periode Verkehr, zählen manche die fünf Tage ab dann.',
    ],
    quelle: 'Schulchan Aruch, Jore De’a 196,11 (Rema)',
    check: 'Das Rechenbeispiel bitte mit der Lehrerin prüfen; die Zählung kann nach Brauch und Uhrzeit abweichen.',
  },
  {
    id: 'tah-05',
    nr: 5,
    q: 'Was muss eine Frau tun, bevor die 7 Reinheitstage beginnen können, nachdem ihre Periode aufgehört hat?',
    kurz: 'Den Hefsek Tahara: Sie wäscht sich kurz vor Sonnenuntergang und prüft mit einem weißen Prüftuch (Ed Bedika), dass die Blutung ganz aufgehört hat. Danach zieht sie weiße, saubere Unterwäsche an und legt weiße Laken auf.',
    punkte: [
      'Viele führen danach ein Tuch ein, das bis nach Einbruch der Dunkelheit bleibt (Moch Dachuk).',
      'Ist das Tuch nicht ganz sauber, versucht sie es am nächsten Tag noch einmal; im Zweifel zeigt man es einem Rabbiner.',
    ],
    quelle: 'Schulchan Aruch, Jore De’a 196,1–6',
  },
  {
    id: 'tah-06',
    nr: 6,
    q: 'Was beachtet sie an den 7 Reinheitstagen?',
    kurz: 'Sie macht jeden Tag zwei Prüfungen (Bedikot), morgens und vor Sonnenuntergang, trägt weiße Unterwäsche, schläft auf weißen Laken und zählt die Tage. Es darf keine Blutung auftreten; sonst beginnt die Zählung neu. Die Abstand-Regeln (Frage 2) gelten weiter.',
    punkte: [
      'Mindestens die Prüfungen am ersten und am siebten Tag sind unverzichtbar.',
      'Am siebten Tag bereitet sie sich gründlich vor und taucht nach Einbruch der Nacht in der Mikwe unter (Teil 12, Fragen 32 und 35).',
    ],
    quelle: 'Schulchan Aruch, Jore De’a 196',
  },
  {
    id: 'tah-07',
    nr: 7,
    q: 'Welche Vorkehrungen muss eine Frau, die einen regelmäßigen Zyklus hat, für ihre nächste Periode treffen?',
    kurz: 'Sie berechnet den Tag, an dem die Periode zu erwarten ist (Wesset Kawua, „fester Termin“), und das Paar hält an dieser Zeit (Onat Perischa) Abstand: kein Verkehr. An diesem Tag macht sie eine Prüfung.',
    punkte: [
      'Ein fester Zyklus entsteht, wenn die Periode dreimal hintereinander nach demselben Muster kam (gleicher Tag im Monat, gleicher Abstand oder ein körperliches Zeichen).',
      'Die Onat Perischa ist entweder die Tageshälfte oder die Nachthälfte (Ona), in der die Blutung zuletzt begann.',
    ],
    quelle: 'Schulchan Aruch, Jore De’a 184 und 189',
  },
  {
    id: 'tah-08',
    nr: 8,
    q: 'Welche Vorkehrungen muss eine Frau, die einen unregelmäßigen Zyklus hat, für ihre nächste Periode treffen?',
    kurz: 'Sie hält drei mögliche Termine (Wesset sche-Eno Kawua) ein: den 30. Tag nach der letzten Periode (Ona Benonit), denselben Tag im jüdischen Monat (Wesset ha-Chodesch) und denselben Abstand wie zwischen den letzten beiden Perioden (Wesset ha-Haflaga). An jedem dieser Termine gilt Onat Perischa.',
    punkte: [
      'Man schreibt die Termine in einen Kalender oder eine App, die die Halacha berücksichtigt.',
      'Viele halten am 31. Tag ebenfalls Abstand (nach dem Chawot Da’at).',
    ],
    quelle: 'Schulchan Aruch, Jore De’a 189',
    check: 'Ob auch der 31. Tag und die volle Ona (Tag und Nacht) gehalten werden, ist Brauch: mit der Lehrerin klären.',
  },
  {
    id: 'tah-09',
    nr: 9,
    q: 'Was muss an dem Tag bzw. den Tagen der Vorkehrung getan werden?',
    kurz: 'An der Onat Perischa haben Mann und Frau keinen Verkehr; nach aschkenasischem Brauch umarmen und küssen sie sich auch nicht. Die Frau macht in dieser Zeit eine Prüfung (Bedika), ob die Periode begonnen hat.',
    punkte: [
      'Die übrigen Abstand-Regeln der Nidda gelten an diesem Tag nicht; man darf sich zum Beispiel etwas reichen.',
      'Ist die Prüfung sauber und die Ona vorbei, ist das Paar wieder erlaubt.',
    ],
    quelle: 'Schulchan Aruch, Jore De’a 184,2 (Rema) und 184,9',
  },
];
