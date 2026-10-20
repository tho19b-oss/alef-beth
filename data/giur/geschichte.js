// Giur-Wissen, Teil 13: Jüdische Geschichte.
//
// Fragetexte stehen wörtlich im Prüfungskatalog (offensichtliche Tippfehler
// berichtigt). Die Antworten wurden als ENTWURF geschrieben und sind noch von
// keinem Rabbiner oder Lehrer durchgesehen: Alle Fragen tragen den
// Standardstatus 'entwurf'. Erst was der Prüfbogen bestätigt oder korrigiert,
// bekommt status 'geprueft'. Unklare Fragen stehen im Feld `check`.
//
// Jahreszahlen nach jüdischer Zählung (seit der Schöpfung) und, wo üblich,
// nach allgemeiner Zählung (v. d. Z. / n. d. Z.).
//
// Felder je Frage: siehe Kopf von kaschrut.js.
//
// Nur reiner Text: Die Anzeige maskiert alles, HTML hat hier keine Wirkung.

export const GESCHICHTE = [
  {
    id: 'ges-01',
    nr: 1,
    q: 'Nenne die Patriarchen und die Matriarchinnen.',
    type: 'fakt',
    kurz: 'Die drei Väter (Awot): Awraham, Jizchak und Ja’akow. Die vier Mütter (Imahot): Sara, Riwka, Rachel und Lea.',
    punkte: [
      'Sara war Awrahams Frau, Riwka Jizchaks Frau, Rachel und Lea waren die Frauen Ja’akows.',
      'In der Amida beginnt der erste Segen mit „G’tt Awrahams, G’tt Jizchaks und G’tt Ja’akows“.',
      'Konvertiten gelten als Kinder Awrahams und Saras: „ben/bat Awraham Awinu we-Sara Imenu“.',
    ],
    quelle: '1. Mose 12–50',
  },
  {
    id: 'ges-02',
    nr: 2,
    q: 'Nenne drei wichtige Könige.',
    type: 'fakt',
    kurz: 'Scha’ul, der erste König Israels; David, der Jerusalem zur Hauptstadt machte und von dem der Maschiach abstammt; und Schlomo, Davids Sohn, der den ersten Tempel baute.',
    punkte: [
      'Unter Scha’ul, David und Schlomo war das Volk vereint. Nach Schlomos Tod zerfiel das Reich in Juda (Süden) und Israel (Norden).',
      'Weitere bekannte Könige von Juda: Chiskijahu und Joschijahu, die den Götzendienst abschafften.',
    ],
    quelle: '1. Samuel 10; 2. Samuel 5; 1. Könige 6 und 12',
  },
  {
    id: 'ges-03',
    nr: 3,
    q: 'Nenne drei wichtige Propheten.',
    type: 'fakt',
    kurz: 'Mosche, der größte aller Propheten; Schmu’el, der Scha’ul und David zu Königen salbte; und Elijahu, der gegen den Baal-Dienst kämpfte. Weitere: Jeschajahu, Jirmejahu und Jecheskel.',
    punkte: [
      'Nach dem Talmud gab es Dutzende Propheten und Prophetinnen, unter ihnen Mirjam, Dewora, Chulda und Ester.',
      'Mit Chaggai, Secharja und Maleachi endete zu Beginn des zweiten Tempels die Prophetie.',
    ],
    quelle: '5. Mose 34,10; Talmud, Megilla 14a',
  },
  {
    id: 'ges-04',
    nr: 4,
    q: 'Welches biblische Buch hat König David geschrieben?',
    type: 'fakt',
    kurz: 'Das Buch der Psalmen, Tehillim. Nach dem Talmud schrieb David es unter Mitwirkung von zehn älteren Weisen, etwa Mosche und Assaf.',
    punkte: ['Tehillim betet man in Notzeiten, für Kranke und an vielen Stellen im täglichen Gebet.'],
    hebrew: [{ label: 'Tehillim', text: 'תְּהִלִּים', translit: 'tehillim', de: 'Lobgesänge (Psalmen)' }],
    quelle: 'Talmud, Bawa Batra 14b–15a',
  },
  {
    id: 'ges-05',
    nr: 5,
    q: 'Wo und von wem haben wir die Tora erhalten? Welches Jahr?',
    type: 'fakt',
    kurz: 'Am Berg Sinai, von G’tt, durch Mosche. Nach der jüdischen Zählung im Jahr 2448 seit der Schöpfung (nach traditioneller Rechnung um 1312 v. d. Z.).',
    punkte: [
      'Das ganze Volk hörte die Zehn Gebote; die ganze Tora mit ihrer Erklärung (mündliche Lehre) erhielt Mosche in den 40 Tagen auf dem Berg.',
      'Mosche schrieb die Tora bis zu seinem Tod 40 Jahre später vollständig nieder.',
    ],
    quelle: '2. Mose 19–20; Pirkej Awot 1,1',
  },
  {
    id: 'ges-06',
    nr: 6,
    q: 'Wann und nach welchem bedeutenden Ereignis ist es passiert?',
    type: 'fakt',
    kurz: 'Am 6. Siwan (Schawuot), sieben Wochen (am 50. Tag) nach dem Auszug aus Ägypten.',
    punkte: ['Daraus kommt das Zählen des Omer von Pessach bis Schawuot.'],
    quelle: '2. Mose 19,1; Talmud, Schabbat 86b',
  },
  {
    id: 'ges-07',
    nr: 7,
    q: 'Wer hat die Kinder Israels aus Ägypten geführt?',
    type: 'fakt',
    kurz: 'Mosche, im Auftrag G’ttes, zusammen mit seinem Bruder Aharon und seiner Schwester Mirjam.',
    punkte: ['In der Haggada wird Mosche kaum genannt: Den Auszug bewirkte G’tt selbst, „nicht durch einen Engel und nicht durch einen Boten“.'],
    quelle: '2. Mose 3–14; Micha 6,4',
  },
  {
    id: 'ges-08',
    nr: 8,
    q: 'Wer war der erste Hohepriester?',
    type: 'fakt',
    kurz: 'Aharon, der Bruder Mosches. Seine Nachkommen sind die Kohanim.',
    punkte: ['Aharon galt als der, der „den Frieden liebt und dem Frieden nachjagt“ (Pirkej Awot 1,12).'],
    quelle: '2. Mose 28,1',
  },
  {
    id: 'ges-09',
    nr: 9,
    q: 'Heutzutage sind die Menschen in drei Gruppen aufgeteilt. Wie heißen sie?',
    type: 'fakt',
    kurz: 'Kohanim (Nachkommen Aharons), Lewi’im (Leviten, Nachkommen des Stammes Levi) und Jisra’elim (alle anderen Juden).',
    punkte: [
      'Die Zugehörigkeit geht über den Vater.',
      'Ein Kohen wird zuerst zur Tora aufgerufen, ein Levi als Zweiter, dann Jisra’elim. Kohanim sprechen den Priestersegen.',
      'Ein Konvertit ist immer ein Jisra’el.',
    ],
  },
  {
    id: 'ges-10',
    nr: 10,
    q: 'Nenne die 12 Stämme Israels.',
    type: 'fakt',
    kurz: 'Die zwölf Söhne Ja’akows: Re’uwen, Schim’on, Levi, Jehuda, Jissachar, Sewulun, Dan, Naftali, Gad, Ascher, Josef und Binjamin.',
    punkte: [
      'Bei der Landverteilung bekam Levi kein Gebiet, weil der Stamm dem Dienst im Heiligtum diente. Dafür wurde Josef zu zwei Stämmen: Efrajim und Menasche. So sind es wieder zwölf.',
      'Das Wort „Jude“ kommt vom Stamm Jehuda.',
    ],
    quelle: '1. Mose 29–30 und 35; 1. Mose 48,5',
  },
  {
    id: 'ges-11',
    nr: 11,
    q: 'Wer baute den ersten Tempel, und wer zerstörte ihn?',
    type: 'fakt',
    kurz: 'König Schlomo baute ihn, die Babylonier unter König Nebukadnezar zerstörten ihn am 9. Aw (nach der historischen Forschung 586 v. d. Z.).',
    punkte: ['Mehr zu beiden Tempeln: Teil 10, Frage 36.'],
    quelle: '1. Könige 6; 2. Könige 25',
  },
  {
    id: 'ges-12',
    nr: 12,
    q: 'Wer baute den zweiten Tempel, und wer zerstörte ihn?',
    type: 'fakt',
    kurz: 'Die Rückkehrer aus dem babylonischen Exil unter Serubawel, mit Erlaubnis des Perserkönigs Kyros; später ließ Herodes ihn prachtvoll ausbauen. Die Römer unter Titus zerstörten ihn am 9. Aw im Jahr 70 n. d. Z.',
    punkte: ['Esra und Nechemja bauten danach die Gemeinde und die Mauern Jerusalems wieder auf.'],
    quelle: 'Esra 1–6; Talmud, Joma 9b',
  },
  {
    id: 'ges-13',
    nr: 13,
    q: 'Nenne ein paar rabbinische Persönlichkeiten des Mittelalters.',
    kurz: 'Raschi (Frankreich, 11. Jh.), Rambam (Spanien und Ägypten, 12. Jh.), Ramban (Spanien, 13. Jh.), Rabbenu Gerschom (Mainz, um 1000), Rabbi Jehuda ha-Levi (Spanien, 12. Jh.) und der Rosch (Deutschland und Spanien, 13./14. Jh.).',
    punkte: [
      'Rabbenu Gerschom „Me’or ha-Gola“ („Licht des Exils“) verbot unter anderem für Aschkenasim die Ehe mit mehr als einer Frau.',
      'Jehuda ha-Levi schrieb das „Kusari“ und Gedichte der Sehnsucht nach Zion.',
      'Die Tossafisten, Raschis Nachkommen und Schüler, schrieben die Ergänzungen zum Talmud (Tossafot).',
      'Zu Raschi, Rambam und Ramban: Teil 14, Fragen 10 bis 12. Am Ende des Mittelalters folgten Rabbi Josef Karo und der Rema (Teil 14, Fragen 13 und 14).',
    ],
  },
  {
    id: 'ges-14',
    nr: 14,
    q: 'Nenne ein paar rabbinische Persönlichkeiten des 20. Jahrhunderts.',
    kurz: 'Der Chafez Chajim (Polen, gest. 1933), Raw Awraham Jizchak Kook (erster aschkenasischer Oberrabbiner im Land Israel), der Chason Isch (Bnei Brak), Raw Mosche Feinstein (New York), der Lubawitscher Rebbe Menachem Mendel Schneerson, Raw Josef Dow Soloveitchik und Raw Owadja Josef (sefardischer Oberrabbiner Israels).',
    punkte: [
      'Aus Deutschland, schon im 19. Jahrhundert: Rabbiner Samson Raphael Hirsch (Frankfurt, „Tora im Derech Eretz“) und Rabbiner Esriel Hildesheimer (Berliner Rabbinerseminar).',
      'Raw Mosche Feinstein ist vor allem für seine Antworten auf neue Fragen der Halacha bekannt (Iggerot Mosche).',
    ],
    check: 'Welche Persönlichkeiten das Beit Din hier erwartet (auch aus der Geschichte der deutschen Juden), bitte klären.',
  },
];
