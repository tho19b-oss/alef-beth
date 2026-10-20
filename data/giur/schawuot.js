// Giur-Wissen, Teil 9: Schawuot.
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

export const SCHAWUOT = [
  {
    id: 'schaw-01',
    nr: 1,
    q: 'Was bedeutet „Schawuot“?',
    type: 'fakt',
    kurz: 'Schawuot heißt „Wochen“: Das Fest kommt nach sieben Wochen Omer-Zählung, am 50. Tag nach Pessach (3. Mose 23,15–16). Daher auch der griechische Name Pfingsten („der Fünfzigste“).',
    punkte: [
      'Weitere Namen: Chag ha-Kazir (Fest der Ernte), Jom ha-Bikkurim (Tag der Erstlingsfrüchte), Seman Matan Toratenu (Zeit der Gabe unserer Tora, Frage 3).',
    ],
    hebrew: [{ label: 'Schawuot', text: 'שָׁבוּעוֹת', translit: 'schawu’ot', de: 'Wochen' }],
    quelle: '3. Mose 23,15–21; 5. Mose 16,9–10',
  },
  {
    id: 'schaw-02',
    nr: 2,
    q: 'Wann wird Schawuot gefeiert?',
    type: 'fakt',
    kurz: 'Am 6. Siwan, außerhalb Israels auch am 7. Siwan, am Tag nach dem 49. Tag des Omer-Zählens.',
    punkte: ['Die Tora nennt kein Datum, nur das Zählen (Frage 1). Weil der Kalender heute feststeht, fällt es immer auf den 6. Siwan.'],
  },
  {
    id: 'schaw-03',
    nr: 3,
    q: 'Warum wird Schawuot die „Zeit unserer Gesetzgebung“ genannt?',
    kurz: 'Weil G’tt nach der Überlieferung am 6. Siwan am Berg Sinai die Zehn Gebote gab und damit die Tora offenbarte. Im Gebet heißt das Fest „Seman Matan Toratenu“, „Zeit der Gabe unserer Tora“.',
    punkte: [
      'Das Volk antwortete „Na’asse we-nischma“: „Wir werden tun und wir werden hören“ (2. Mose 24,7).',
      'Am Sinai wurde Israel zum Volk G’ttes; jeder Ger (Übertretende) nimmt diesen Bund auf sich.',
    ],
    hebrew: [{ label: 'Zeit der Gabe unserer Tora', text: 'זְמַן מַתַּן תּוֹרָתֵנוּ', translit: 'seman matan toratenu', de: 'Zeit der Gabe unserer Tora' }],
    quelle: '2. Mose 19–20; Talmud, Schabbat 86b',
  },
  {
    id: 'schaw-04',
    nr: 4,
    q: 'Wie viele Tage feiert man Schawuot?',
    type: 'fakt',
    kurz: 'Außerhalb Israels zwei Tage (6. und 7. Siwan), in Israel einen Tag.',
    punkte: ['Am zweiten Tag sagt man Jiskor (Gedenkgebet für Verstorbene).'],
  },
  {
    id: 'schaw-05',
    nr: 5,
    q: 'Nenne die Zehn Gebote.',
    type: 'fakt',
    kurz: '1. Ich bin der Ewige, dein G’tt, der dich aus Ägypten geführt hat. 2. Du sollst keine anderen Götter haben und dir kein Götzenbild machen. 3. Du sollst den Namen G’ttes nicht missbrauchen. 4. Gedenke des Schabbat, ihn zu heiligen. 5. Ehre deinen Vater und deine Mutter. 6. Du sollst nicht morden. 7. Du sollst nicht ehebrechen. 8. Du sollst nicht stehlen. 9. Du sollst kein falsches Zeugnis ablegen. 10. Du sollst nicht begehren, was deinem Nächsten gehört.',
    punkte: [
      'Die jüdische Zählung beginnt mit „Ich bin der Ewige“ als erstem Gebot (an G’tt glauben).',
      '„Nicht stehlen“ meint nach dem Talmud hier den Menschenraub (Sanhedrin 86a).',
      'Die Gebote stehen zweimal in der Tora, mit kleinen Unterschieden (zum Beispiel „Gedenke“ und „Hüte“ den Schabbat).',
      'Bei der Lesung am Schawuot steht die Gemeinde.',
    ],
    hebrew: [{ label: 'Zehn Gebote', text: 'עֲשֶׂרֶת הַדִּבְּרוֹת', translit: 'asseret ha-dibrot', de: 'die Zehn Worte' }],
    quelle: '2. Mose 20,2–14; 5. Mose 5,6–18',
  },
  {
    id: 'schaw-06',
    nr: 6,
    q: 'Was waren die „Zwei Tafeln des Gesetzes“?',
    kurz: 'Zwei Steintafeln, auf die G’tt selbst die Zehn Gebote schrieb (2. Mose 31,18). Mosche zerbrach die ersten, als er das Goldene Kalb sah. Nach 40 Tagen des Betens bekam er zweite Tafeln, die er an Jom Kippur brachte. Sie lagen in der Bundeslade (Aron ha-Brit) im Allerheiligsten.',
    punkte: [
      'Die zweiten Tafeln meißelte Mosche selbst aus, G’tt schrieb darauf (2. Mose 34,1).',
      'Nach dem Talmud lagen auch die Bruchstücke der ersten Tafeln in der Lade (Berachot 8b).',
    ],
    hebrew: [{ label: 'Tafeln des Bundes', text: 'לוּחוֹת הַבְּרִית', translit: 'luchot ha-brit', de: 'Tafeln des Bundes' }],
    quelle: '2. Mose 31,18; 32,19; 34,1–4; 5. Mose 10,1–5',
  },
  {
    id: 'schaw-07',
    nr: 7,
    q: 'Was stand auf sie geschrieben?',
    kurz: 'Die Zehn Gebote (Frage 5), auf jeder Tafel fünf. Auf der ersten Tafel stehen die Gebote zwischen Mensch und G’tt (1 bis 5, mit dem Ehren der Eltern, die am Leben mitwirken), auf der zweiten die zwischen Mensch und Mensch (6 bis 10).',
    punkte: [
      'Die Schrift war von beiden Seiten lesbar und ging durch den Stein hindurch (Talmud, Schabbat 104a).',
      'Die Gebote stehen für alle 613 Mizwot, die in ihnen angelegt sind (Raw Sa’adja Ga’on).',
    ],
    quelle: '2. Mose 32,15–16',
  },
  {
    id: 'schaw-08',
    nr: 8,
    q: 'Nenne paar Gebräuche von Schawuot.',
    kurz: 'Man lernt die erste Nacht hindurch Tora (Tikkun Leil Schawuot), hört am Morgen die Zehn Gebote, schmückt Synagoge und Wohnung mit Grün und Blumen, isst Milchspeisen und liest das Buch Rut.',
    punkte: [
      'Tikkun Leil Schawuot: Die Israeliten verschliefen nach dem Midrasch den Morgen der Offenbarung – das macht man wett.',
      'Aschkenasim singen vor der Toralesung „Akdamut“, ein aramäisches Lied.',
      'Kinder werden besonders zur Synagoge gebracht, um die Zehn Gebote zu hören.',
      'Am zweiten Tag Jiskor.',
      'Gebräuche zu Essen, Schmuck und Megilla: Fragen 9 bis 11.',
    ],
    quelle: 'Schir ha-Schirim Rabba 1,57; Mischna Berura 494',
  },
  {
    id: 'schaw-09',
    nr: 9,
    q: 'Welche Nahrungsmittel essen wir an Schawuot?',
    kurz: 'Milchspeisen wie Käsekuchen, Blintzes (gefüllte Pfannkuchen) und Käse, oft als eigene milchige Mahlzeit vor der Fleischmahlzeit. Dazu gehören auch zwei Challot, die an die zwei Weizenbrote des Tempels (Schtej ha-Lechem) erinnern.',
    punkte: [
      'Eine Erklärung: Nach der Tora-Gabe galten die Gesetze der Kaschrut; die Israeliten hatten kein koscheres Fleisch und Geschirr und aßen Milchiges.',
      'Die Tora wird mit Milch verglichen: „Honig und Milch unter deiner Zunge“ (Schir ha-Schirim 4,11).',
      'Der Zahlenwert von „Chalaw“ (Milch) ist 40, wie die 40 Tage Mosches auf dem Sinai.',
      'Zwischen Milch- und Fleischmahlzeit beachtet man die Regeln von Teil 1 (Kaschrut).',
    ],
    quelle: 'Rema, Orach Chajim 494,3',
  },
  {
    id: 'schaw-10',
    nr: 10,
    q: 'Warum schmücken wir die Synagoge und unser Heim mit Blumen und Pflanzen an Schawuot?',
    kurz: 'Zur Erinnerung daran, dass der Berg Sinai nach dem Midrasch bei der Offenbarung grünte und blühte. Außerdem wird an Schawuot über die Früchte der Bäume entschieden, und man brachte die Erstlingsfrüchte (Bikkurim) in den Tempel.',
    punkte: [
      'Die Tora sagt, dass am Berg kein Vieh weiden durfte (2. Mose 34,3) – also gab es dort Gras.',
      '„An Schawuot wird über die Baumfrüchte gerichtet“ (Mischna, Rosch Haschana 1,2).',
      'Manche Gelehrte (der Gaon von Wilna) lehnten Bäume in der Synagoge ab.',
    ],
    quelle: 'Mischna Berura 494,10; Mischna, Rosch Haschana 1,2',
    check: 'Ob die Gemeinde mit Blumen, Zweigen oder Bäumen schmückt, ist Brauch.',
  },
  {
    id: 'schaw-11',
    nr: 11,
    q: 'Welche Megilla wird an Schawuot gelesen? Warum?',
    kurz: 'Das Buch Rut. Rut, eine Moabiterin, schloss sich dem jüdischen Volk an („Dein Volk ist mein Volk, dein G’tt ist mein G’tt“, Rut 1,16) – so wie Israel am Sinai die Tora annahm. Die Geschichte spielt zur Zeit der Ernte, und ihr Urenkel König David wurde nach der Überlieferung an Schawuot geboren und starb an Schawuot.',
    punkte: [
      'Rut gilt als Vorbild für jeden Giur: Sie nahm die Mizwot aus freiem Willen und aus Liebe an.',
      'Das Buch zeigt Chessed (Güte): Rut zu Noomi, Boas zu Rut.',
      'Am Ende steht der Stammbaum bis zu David (Rut 4,17–22).',
    ],
    quelle: 'Rut 1,16–17; Talmud Jeruschalmi, Chagiga 2,3',
  },
];
