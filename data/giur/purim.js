// Giur-Wissen, Teil 7: Purim.
//
// Fragetexte stehen wörtlich im Prüfungskatalog. Die Antworten wurden als ENTWURF
// geschrieben und sind noch von keinem Rabbiner oder Lehrer durchgesehen: Alle
// Fragen tragen den Standardstatus 'entwurf'. Erst was der Prüfbogen bestätigt
// oder korrigiert, bekommt status 'geprueft'. Bräuche, die je nach Gemeinde
// abweichen, und unklare Fragen stehen im Feld `check`.
//
// Der Katalog hat in Teil 7 einen Punkt 11 ohne Frage („NOTIZEN“); er ist nicht
// aufgenommen.
//
// Felder je Frage: siehe Kopf von kaschrut.js.
//
// Nur reiner Text: Die Anzeige maskiert alles, HTML hat hier keine Wirkung.

export const PURIM = [
  {
    id: 'pur-01',
    nr: 1,
    q: 'An welchen Tagen des jüdischen Kalenders feiern wir Purim?',
    type: 'fakt',
    kurz: 'Am 14. Adar, im Schaltjahr am 14. Adar II. In Städten, die schon zur Zeit Josuas eine Mauer hatten (heute vor allem Jerusalem), feiert man am 15. Adar Schuschan Purim (Frage 5).',
    punkte: [
      'Am Tag davor, dem 13. Adar, ist der Fasttag Ta’anit Esther.',
      'Im Schaltjahr ist der 14. Adar I „Purim Katan“ (kleines Purim), ohne die Purim-Gebote.',
    ],
    quelle: 'Esther 9,17–21',
  },
  {
    id: 'pur-02',
    nr: 2,
    q: 'Was bedeutet das Wort Purim?',
    type: 'fakt',
    kurz: 'Purim heißt „Lose“. Haman warf das Los (Pur), um den Tag zu bestimmen, an dem die Juden vernichtet werden sollten (Esther 3,7; 9,24–26).',
    punkte: ['Das Los fiel auf den 13. Adar – an genau diesem Tag wendete sich das Schicksal.'],
    hebrew: [{ label: 'Purim', text: 'פּוּרִים', translit: 'purim', de: 'Lose' }],
    quelle: 'Esther 3,7; 9,26',
  },
  {
    id: 'pur-03',
    nr: 3,
    q: 'Was gedenkt Purim? Warum feiern wir es?',
    kurz: 'Purim erinnert an die Rettung der Juden im Perserreich unter König Achaschwerosch: Der Minister Haman wollte alle Juden an einem Tag töten lassen. Königin Esther und ihr Onkel Mordechai wendeten das ab. Wir feiern, dass G’tt das Volk gerettet hat, auch wenn Sein Name im Buch Esther gar nicht vorkommt.',
    punkte: [
      'Das Wunder von Purim geschah verborgen, durch scheinbare Zufälle („Hester Panim“, verborgenes Angesicht).',
      'Esther fastete drei Tage mit dem Volk und ging ungerufen zum König.',
      'Haman wurde an dem Galgen gehängt, den er für Mordechai gebaut hatte.',
      'Am 13. Adar durften sich die Juden verteidigen und besiegten ihre Feinde; am 14. ruhten sie und feierten.',
    ],
    quelle: 'Buch Esther',
  },
  {
    id: 'pur-04',
    nr: 4,
    q: 'Wann wird Megillat Esther gelesen?',
    type: 'fakt',
    kurz: 'Zweimal: am Abend, mit dem Beginn von Purim, und am Morgen des Purim-Tages. Man muss jedes Wort hören, Männer wie Frauen.',
    punkte: [
      'Vor der Lesung spricht der Vorleser drei Segen: „al mikra Megilla“, „sche-asa nissim“ und Schehechejanu.',
      'Beim Namen Haman macht man Lärm (mit Rasseln oder Füßestampfen), um ihn „auszulöschen“.',
      'Die Megilla ist eine handgeschriebene Rolle auf Pergament.',
    ],
    quelle: 'Talmud, Megilla 4a; Schulchan Aruch, Orach Chajim 687–692',
  },
  {
    id: 'pur-05',
    nr: 5,
    q: 'Wann ist Schushan Purim?',
    type: 'fakt',
    kurz: 'Am 15. Adar, einen Tag nach Purim. In Schuschan, der Hauptstadt, kämpften die Juden auch am 14. und ruhten erst am 15. Deshalb feiern Städte, die seit der Zeit Josuas eine Mauer hatten (vor allem Jerusalem), an diesem Tag.',
    punkte: [
      'Außerhalb dieser Städte ist Schuschan Purim ein Tag mit etwas Freude, ohne die Purim-Gebote.',
      'Man sagt kein Tachanun.',
    ],
    quelle: 'Esther 9,18–19; Mischna, Megilla 1,1',
  },
  {
    id: 'pur-06',
    nr: 6,
    q: 'Nenne die Mizwot die wir an Purim vollbringen sollen?',
    type: 'fakt',
    kurz: 'Vier: die Megilla hören (abends und morgens), Mischloach Manot (Speisen an Freunde schicken), Matanot la-Ewjonim (Gaben an mindestens zwei Arme) und die Se’udat Purim (Festmahl).',
    punkte: [
      'Die drei letzten stehen in Esther 9,22: „Tage des Festmahls und der Freude, an denen man einander Speisen schickt und den Armen Gaben gibt“.',
      'Matanot la-Ewjonim: an zwei Bedürftige je eine Gabe, Geld oder Essen. Man soll mehr für die Armen ausgeben als für Mischloach Manot.',
      'Dazu „Al ha-Nissim“ im Gebet und Tischgebet und eine Toralesung (2. Mose 17,8–16).',
      'Frauen sind zu allen vier Geboten verpflichtet.',
    ],
    quelle: 'Esther 9,22; Rambam, Hilchot Megilla 2,17',
  },
  {
    id: 'pur-07',
    nr: 7,
    q: 'Wie viele Mischloach Manot sollen wir unseren Freunden an Purim schicken?',
    type: 'fakt',
    kurz: 'Mindestens eine Sendung an einen Menschen, mit mindestens zwei verschiedenen Speisen, die man gleich essen kann (zum Beispiel Gebäck und ein Getränk). Mehr zu schicken ist lobenswert.',
    punkte: [
      'Man gibt sie am Purim-Tag, nicht in der Nacht davor.',
      'Gern über einen Boten („schicken“ steht im Text).',
      'Sie sollen Freundschaft stärken: das Gegenteil von Hamans Vorwurf, die Juden seien „zerstreut und getrennt“ (Esther 3,8).',
    ],
    quelle: 'Talmud, Megilla 7a; Schulchan Aruch, Orach Chajim 695,4',
  },
  {
    id: 'pur-08',
    nr: 8,
    q: 'Was ist Seudat Purim?',
    kurz: 'Das festliche Mahl am Purim-Tag, meist am Nachmittag, mit Brot, Fleisch und Wein, Familie und Gästen. Es ist eines der vier Purim-Gebote. Man soll so fröhlich feiern, dass man „nicht mehr unterscheidet zwischen ‚Verflucht sei Haman‘ und ‚Gesegnet sei Mordechai‘“ (Talmud, Megilla 7b).',
    punkte: [
      'Das Mahl beginnt vor Sonnenuntergang und kann in die Nacht hinein dauern.',
      'Viele Gelehrte sagen, man solle nur etwas mehr als gewohnt trinken und dann schlafen. Niemand darf sich oder andere gefährden.',
      'Im Tischgebet sagt man „Al ha-Nissim“.',
    ],
    quelle: 'Talmud, Megilla 7b; Schulchan Aruch und Rema, Orach Chajim 695',
    check: 'Wie die Gemeinde das Trinken an Purim versteht, bitte beim Lehrer klären.',
  },
  {
    id: 'pur-09',
    nr: 9,
    q: 'Was ist Paraschat Sachor? Welche Mizva wird da vollbracht? Warum ist es wichtig?',
    kurz: 'Paraschat Sachor („Erinnere dich“) ist eine zusätzliche Toralesung am Schabbat vor Purim: 5. Mose 25,17–19, wie Amalek die Israeliten auf dem Weg aus Ägypten von hinten überfiel. Wer sie hört, erfüllt das Tora-Gebot, sich an Amalek zu erinnern. Haman stammte von Amalek ab, deshalb liest man sie vor Purim.',
    punkte: [
      'Für Männer gilt es als Gebot der Tora, die Lesung in der Synagoge zu hören. Viele Frauen kommen auch.',
      'Amalek steht für grundlosen Hass auf das jüdische Volk und auf G’tt.',
      'Haman war ein Nachkomme des Amalekiter-Königs Agag (Esther 3,1).',
      'Paraschat Sachor ist eine der vier besonderen Lesungen vor Pessach (Arba Paraschijot).',
    ],
    quelle: '5. Mose 25,17–19; Schulchan Aruch, Orach Chajim 685,7',
  },
  {
    id: 'pur-10',
    nr: 10,
    q: 'Was bedeutet Purim Meschulasch? Wo feiert man das?',
    kurz: '„Dreifaches Purim“: Fällt Schuschan Purim (15. Adar) auf Schabbat, verteilt Jerusalem die Gebote auf drei Tage. Freitag (14.): Megilla und Gaben an Arme. Schabbat (15.): Al ha-Nissim und die Purim-Toralesung. Sonntag (16.): Festmahl und Mischloach Manot. Das gilt nur in Jerusalem und anderen Städten mit Mauer aus Josuas Zeit.',
    punkte: [
      'Am Schabbat liest man die Megilla nicht, damit niemand sie durch öffentlichen Raum trägt.',
      'Das kommt selten vor, etwa alle paar Jahre.',
    ],
    quelle: 'Schulchan Aruch, Orach Chajim 688,6',
  },
];
