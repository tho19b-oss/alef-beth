// Giur-Wissen, Teil 11: Ethik.
//
// Fragetexte stehen wörtlich im Prüfungskatalog. Die Antworten wurden als ENTWURF
// geschrieben und sind noch von keinem Rabbiner oder Lehrer durchgesehen: Alle
// Fragen tragen den Standardstatus 'entwurf'. Erst was der Prüfbogen bestätigt
// oder korrigiert, bekommt status 'geprueft'. Bräuche, die je nach Gemeinde
// abweichen, und unklare Fragen stehen im Feld `check`.
//
// Frage 1 verlangt 43 Begriffe (im Katalog mit א bis מג gezählt). Jeder Begriff
// ist eine eigene Karte mit der Nummer 1.1 bis 1.43 und der ID eth-01-01 bis
// eth-01-43, damit man sie einzeln lernen und beurteilen kann. Der lange
// Einleitungssatz des Katalogs („Erkläre die folgenden Mizwot und ethische
// Terminologien:“) ist dafür auf „Erkläre den Begriff:“ gekürzt.
//
// Felder je Frage: siehe Kopf von kaschrut.js.
//
// Nur reiner Text: Die Anzeige maskiert alles, HTML hat hier keine Wirkung.

const FRAGE_1 = 'Erkläre den Begriff:';

// Ein Begriff aus Frage 1. n = laufende Nummer (א = 1 … מג = 43).
function begriff(n, name, hebr, de, kurz, mehr = {}) {
  const nn = String(n).padStart(2, '0');
  return {
    id: `eth-01-${nn}`,
    nr: `1.${n}`,
    q: `${FRAGE_1} ${name}`,
    kurz,
    hebrew: [{ label: name, text: hebr, translit: name.toLowerCase(), de }],
    ...mehr,
  };
}

export const ETHIK = [
  begriff(1, 'Lifnim Mischurat Hadin', 'לִפְנִים מִשּׁוּרַת הַדִּין', 'innerhalb der Linie des Rechts',
    'Mehr tun, als das Gesetz verlangt: auf ein Recht verzichten oder großzügiger handeln, als man müsste, aus Güte und um das Richtige zu tun.',
    {
      punkte: [
        'Der Talmud sagt, Jerusalem wurde zerstört, weil man nur nach dem strengen Recht urteilte und nicht darüber hinausging (Bawa Mezia 30b).',
        'Vorbild: G’tt selbst handelt mit den Menschen mehr aus Gnade als nach strengem Recht.',
      ],
      quelle: 'Talmud, Bawa Mezia 30b; Raschi zu 2. Mose 18,20',
    }),
  begriff(2, 'Hakarat Hatow', 'הַכָּרַת הַטּוֹב', 'das Gute anerkennen',
    'Dankbarkeit: erkennen und zeigen, was man von G’tt und von Menschen Gutes bekommen hat.',
    {
      punkte: [
        'Mosche schlug den Nil nicht selbst, weil er ihn als Baby beschützt hatte; das tat Aharon (Raschi zu 2. Mose 7,19).',
        'Der Name „Jehudi“ (Jude) kommt von Jehuda: Lea nannte ihn so, um G’tt zu danken (1. Mose 29,35).',
        'Jeden Morgen sagt man als Erstes „Mode ani“, „Ich danke Dir“.',
      ],
    }),
  begriff(3, 'Teschuwa', 'תְּשׁוּבָה', 'Umkehr, Rückkehr',
    'Umkehr: ein Unrecht bereuen, es lassen, vor G’tt bekennen und sich vornehmen, es nicht wieder zu tun. Sie ist immer möglich, besonders in den Zehn Tagen der Umkehr.',
    { punkte: ['Die einzelnen Stufen: Frage 2.', 'Bei Unrecht gegen Menschen muss man zuerst den Betroffenen um Verzeihung bitten und Schaden ersetzen.'] }),
  begriff(4, 'Midat Harachamim', 'מִדַּת הָרַחֲמִים', 'Eigenschaft des Erbarmens',
    'G’ttes Eigenschaft der Barmherzigkeit, mit der Er nachsichtig ist und vergibt. Nach der Überlieferung steht dafür der vierbuchstabige Gottesname (Ha-Schem).',
    {
      punkte: [
        'Gegenstück: Midat ha-Din, die Eigenschaft des strengen Rechts (Begriff 1.18).',
        'Nach Raschi wollte G’tt die Welt zuerst nach strengem Recht erschaffen, sah aber, dass sie so nicht bestehen kann, und verband es mit Erbarmen (zu 1. Mose 1,1).',
        'Die dreizehn Eigenschaften des Erbarmens (2. Mose 34,6–7) sagt man in den Selichot.',
      ],
    }),
  begriff(5, 'Schechinah', 'שְׁכִינָה', 'das Wohnen, die Gegenwart',
    'Die Gegenwart G’ttes in der Welt, die man spüren kann: im Stiftszelt, im Tempel, unter Menschen, die gemeinsam beten oder lernen.',
    {
      punkte: [
        '„Sie sollen Mir ein Heiligtum machen, und Ich werde in ihrer Mitte wohnen“ (2. Mose 25,8).',
        'Wo zehn beten oder zwei gemeinsam Tora lernen, ist die Schechina bei ihnen (Pirkej Awot 3,6).',
        'Wer einen Konvertiten aufnimmt, bringt ihn „unter die Flügel der Schechina“.',
      ],
    }),
  begriff(6, 'Chilul Haschem', 'חִלּוּל הַשֵּׁם', 'Entweihung des Namens',
    'Etwas tun, durch das G’tt, die Tora oder das jüdische Volk in schlechtem Licht erscheinen, besonders wenn ein Jude, der als religiös gilt, öffentlich unehrlich oder unanständig handelt. Es gilt als eine der schwersten Sünden.',
    { punkte: ['„Ihr sollt Meinen heiligen Namen nicht entweihen“ (3. Mose 22,32).'], quelle: '3. Mose 22,32; Talmud, Joma 86a' }),
  begriff(7, 'Kiddusch Hashem', 'קִדּוּשׁ הַשֵּׁם', 'Heiligung des Namens',
    'Durch sein Handeln G’ttes Namen heiligen: so ehrlich und freundlich leben, dass andere die Tora achten. Im äußersten Fall heißt es, lieber zu sterben, als Götzendienst, Mord oder verbotene Beziehungen zu begehen.',
    {
      punkte: [
        '„Ich werde geheiligt inmitten der Kinder Israels“ (3. Mose 22,32).',
        'Viele Märtyrer, von Rabbi Akiwa bis in die Verfolgungen der Neuzeit, starben „al Kiddusch ha-Schem“.',
      ],
      quelle: '3. Mose 22,32; Rambam, Hilchot Jessodej ha-Tora 5',
    }),
  begriff(8, 'Anawa', 'עֲנָוָה', 'Demut',
    'Demut: die eigenen Fähigkeiten als Geschenk G’ttes sehen, sich nicht über andere erheben und offen sein für Kritik.',
    { punkte: ['„Mosche war sehr demütig, mehr als alle Menschen auf der Erde“ (4. Mose 12,3).', 'Demut heißt nicht, sich klein zu machen, sondern den eigenen Platz richtig zu sehen.'] }),
  begriff(9, 'Kawana', 'כַּוָּנָה', 'Ausrichtung, Absicht',
    'Die innere Absicht und Konzentration beim Beten und beim Erfüllen von Mizwot: wissen, was man tut, und es für G’tt tun.',
    { punkte: ['Beim ersten Satz des Sch’ma und beim ersten Segen der Amida ist Kawana besonders wichtig.', '„Der Barmherzige will das Herz“ (Talmud, Sanhedrin 106b).'] }),
  begriff(10, 'Kibud Aw Waem', 'כִּבּוּד אָב וָאֵם', 'Ehrung von Vater und Mutter',
    'Das Gebot, Vater und Mutter zu ehren (fünftes der Zehn Gebote): für sie sorgen, ihnen Respekt zeigen, nicht auf ihrem Platz sitzen, ihnen nicht widersprechen und sie nicht beim Vornamen nennen.',
    {
      punkte: [
        '„Ehre deinen Vater und deine Mutter, damit deine Tage lang werden“ (2. Mose 20,12). Dazu gehört auch die Ehrfurcht (Mora, 3. Mose 19,3).',
        'Ein Konvertit gilt rechtlich wie neugeboren, soll aber seine nichtjüdischen Eltern weiterhin ehren und nicht verachten (Rambam, Hilchot Mamrim 5,11).',
        'Verlangen die Eltern etwas gegen die Tora, muss man nicht gehorchen (3. Mose 19,3: „Ich bin der Ewige“).',
      ],
      quelle: '2. Mose 20,12; 3. Mose 19,3; Talmud, Kidduschin 31b',
    }),
  begriff(11, 'Derech Eretz', 'דֶּרֶךְ אֶרֶץ', 'Weg des Landes',
    'Gutes Benehmen und Anstand im Umgang mit Menschen. Es kann auch die Arbeit für den Lebensunterhalt meinen.',
    { punkte: ['„Derech Eretz kam vor der Tora“: Erst muss man ein anständiger Mensch sein (Wajikra Rabba 9,3).', '„Schön ist Tora-Lernen zusammen mit Derech Eretz“ (Pirkej Awot 2,2), hier im Sinn von Beruf.'] }),
  begriff(12, 'Gemilut Chassadim', 'גְּמִילוּת חֲסָדִים', 'Erweisen von Güte',
    'Liebevolle Taten für andere, mit dem Körper und nicht nur mit Geld: Kranke besuchen, Gäste aufnehmen, Brautleute erfreuen, Tote begleiten, Trauernde trösten, zinslos leihen.',
    {
      punkte: [
        'Eine der drei Säulen der Welt, neben Tora und Gottesdienst (Pirkej Awot 1,2).',
        'Sie ist größer als Zedaka: Sie gilt für Arme und Reiche, Lebende und Tote (Talmud, Sukka 49b).',
      ],
    }),
  begriff(13, 'Jezer Hara', 'יֵצֶר הָרָע', 'der böse Trieb',
    'Der Trieb im Menschen zum Bösen und zur Selbstsucht. Er ist nicht nur schlecht: Ohne ihn würde niemand ein Haus bauen, heiraten oder Kinder haben. Die Aufgabe ist, ihn zu beherrschen und für Gutes zu nutzen.',
    { punkte: ['„Wer ist stark? Wer seinen Trieb bezwingt“ (Pirkej Awot 4,1).', 'G’tt gab den Trieb und die Tora als Gegenmittel (Talmud, Kidduschin 30b).'] }),
  begriff(14, 'Jezer Tow', 'יֵצֶר טוֹב', 'der gute Trieb',
    'Der Trieb zum Guten, das Gewissen, das den Menschen zu Mizwot und richtigem Handeln zieht. Nach der Überlieferung kommt er mit der Bar/Bat Mizwa zur vollen Kraft.',
    { punkte: ['Der Mensch entscheidet frei zwischen beiden (Frage 9).'] }),
  begriff(15, 'Zniut', 'צְנִיעוּת', 'Bescheidenheit, Sittsamkeit',
    'Bescheidenheit und Zurückhaltung in Kleidung, Sprache und Benehmen, für Männer und Frauen: nicht auffallen wollen, die eigene Würde und die Privatsphäre achten.',
    {
      punkte: [
        '„Gehe bescheiden mit deinem G’tt“ (Micha 6,8).',
        'Bei der Kleidung gibt es feste Regeln (zum Beispiel bedeckte Schultern, Ellenbogen und Knie bei Frauen, Kopfbedeckung verheirateter Frauen).',
      ],
      check: 'Die genauen Kleidungsregeln richten sich nach der Gemeinde: bitte klären.',
    }),
  begriff(16, 'Mechiza', 'מְחִיצָה', 'Trennwand',
    'Die Trennwand oder der Vorhang zwischen Männern und Frauen in der Synagoge, damit jeder beim Beten ganz bei G’tt ist. Ohne Mechiza ist eine Synagoge nach orthodoxer Halacha nicht für das Gebet geeignet.',
    { punkte: ['Vorbild ist die Trennung im Tempel bei der Feier des Wasserschöpfens an Sukkot (Talmud, Sukka 51b).', 'Der Frauenbereich dahinter heißt Esrat Naschim (Begriff 1.17).'] }),
  begriff(17, 'Esrat Nashim', 'עֶזְרַת נָשִׁים', 'Vorhof der Frauen',
    'Der Bereich der Frauen in der Synagoge, hinter der Mechiza oder auf einer Empore. Ursprünglich hieß so ein Vorhof im Tempel in Jerusalem, den auch Frauen betreten durften.',
    {}),
  begriff(18, 'Midat Hadin', 'מִדַּת הַדִּין', 'Eigenschaft des Rechts',
    'G’ttes Eigenschaft des strengen Rechts und der Gerechtigkeit, mit der jede Tat ihre Folge hat. Nach der Überlieferung steht dafür der Name Elokim.',
    { punkte: ['Gegenstück: Midat ha-Rachamim (Begriff 1.4). G’tt verbindet beide, damit die Welt bestehen kann.'] }),
  begriff(19, 'Ben Adam Lamakom', 'בֵּין אָדָם לַמָּקוֹם', 'zwischen Mensch und G’tt',
    'Gebote zwischen dem Menschen und G’tt („ha-Makom“, der Ort, ist ein Name G’ttes): zum Beispiel Schabbat, Kaschrut, Gebet, Tefillin.',
    { punkte: ['An Jom Kippur werden Sünden gegen G’tt vergeben, Sünden gegen Menschen erst, wenn man den anderen versöhnt hat (Mischna, Joma 8,9).'] }),
  begriff(20, 'Ben Adam Lechavero', 'בֵּין אָדָם לַחֲבֵרוֹ', 'zwischen Mensch und Mitmensch',
    'Gebote zwischen Menschen: ehrlich handeln, nicht stehlen, nicht schlecht reden, helfen, Zedaka geben.',
    { punkte: ['„Liebe deinen Nächsten wie dich selbst“ (3. Mose 19,18): Für Rabbi Akiwa ist das ein großer Grundsatz der Tora.', 'Hillel: „Was dir verhasst ist, tu deinem Nächsten nicht an“ (Talmud, Schabbat 31a).'] }),
  begriff(21, 'Ben Adam Leazmo', 'בֵּין אָדָם לְעַצְמוֹ', 'zwischen dem Menschen und sich selbst',
    'Die Pflichten gegenüber sich selbst: auf die Gesundheit achten, sich nicht selbst schaden, an den eigenen Eigenschaften arbeiten.',
    { punkte: ['„Hütet euch sehr um eurer Seelen willen“ (5. Mose 4,15).', 'Hillel: „Wenn ich nicht für mich bin, wer ist dann für mich?“ (Pirkej Awot 1,14).'] }),
  begriff(22, 'Neshama', 'נְשָׁמָה', 'Seele, Atem',
    'Die Seele, die G’tt dem Menschen eingehaucht hat (1. Mose 2,7). Sie ist rein, lebt nach dem Tod weiter und kehrt zu G’tt zurück.',
    { punkte: ['Jeden Morgen sagt man „Elokaj, neschama sche-natata bi tehora hi“, „Mein G’tt, die Seele, die Du mir gegeben hast, ist rein“.'] }),
  begriff(23, 'Zedaka', 'צְדָקָה', 'Gerechtigkeit, Wohltätigkeit',
    'Geld oder Hilfe für Bedürftige. Das Wort heißt „Gerechtigkeit“: Geben ist keine Gnade, sondern Pflicht, weil das Vermögen von G’tt anvertraut ist.',
    {
      punkte: [
        'Man gibt mindestens ein Zehntel (Ma’asser) des Einkommens, höchstens ein Fünftel.',
        'Auch wer selbst von Zedaka lebt, soll etwas geben.',
        'Die höchste Stufe nach Rambam: Frage 3.',
      ],
    }),
  begriff(24, 'Hachnassat Orchim', 'הַכְנָסַת אוֹרְחִים', 'Aufnahme von Gästen',
    'Gastfreundschaft: Gäste einladen, bewirten, ihnen einen Schlafplatz geben und sie beim Abschied ein Stück begleiten.',
    { punkte: ['Vorbild ist Awraham, der im Zelt nach allen Seiten offen saß und den drei Fremden entgegenlief (1. Mose 18).', 'Gastfreundschaft ist größer als die Gegenwart der Schechina zu empfangen (Talmud, Schabbat 127a).'] }),
  begriff(25, 'Bitachon', 'בִּטָּחוֹן', 'Vertrauen',
    'Vertrauen auf G’tt: sich ehrlich bemühen und gleichzeitig wissen, dass das Ergebnis in G’ttes Hand liegt und alles, was Er tut, letztlich zum Guten ist.',
    { punkte: ['„Wirf auf den Ewigen deine Last, Er wird dich versorgen“ (Psalm 55,23).', 'Emuna ist der Glaube, Bitachon das Vertrauen im Alltag (Begriff 1.26).'] }),
  begriff(26, 'Emuna', 'אֱמוּנָה', 'Glaube, Treue',
    'Der Glaube an G’tt, der einzig ist, die Welt erschuf und lenkt und die Tora gab. Rambam fasst ihn in dreizehn Glaubensgrundsätzen zusammen (Ani Ma’amin).',
    { punkte: ['Das erste der Zehn Gebote: „Ich bin der Ewige, dein G’tt“ (2. Mose 20,2).', 'Emuna hängt mit „Amen“ zusammen: fest, verlässlich.'] }),
  begriff(27, 'Maschiach', 'מָשִׁיחַ', 'der Gesalbte',
    'Der von G’tt bestimmte König aus dem Haus Davids, der das jüdische Volk ins Land Israel zurückführt, den Tempel wieder baut und Frieden in die Welt bringt. Er ist ein Mensch, kein G’tt (Frage 4).',
    { punkte: ['Der Glaube an sein Kommen ist der zwölfte von Rambams Glaubensgrundsätzen.', 'Woran man ihn erkennt, beschreibt Rambam in Hilchot Melachim 11–12.'] }),
  begriff(28, 'Bikkur Cholim', 'בִּקּוּר חוֹלִים', 'Krankenbesuch',
    'Kranke besuchen: Ihnen Gesellschaft leisten, fragen, was sie brauchen, und für sie beten. Wer einen Kranken besucht, nimmt ihm nach dem Talmud ein Sechzigstel seines Leidens.',
    { punkte: ['G’tt selbst besuchte Awraham nach seiner Beschneidung (1. Mose 18,1).', 'Man betet dort, wo der Kranke ist, auch in der Sprache, die man versteht.'], quelle: 'Talmud, Nedarim 39b–40a' }),
  begriff(29, 'Schlom Bajit', 'שְׁלוֹם בַּיִת', 'Frieden im Haus',
    'Frieden und Harmonie in der Ehe und in der Familie. Er ist so wichtig, dass man ihm zuliebe eine kleine Wahrheit verschweigen darf.',
    { punkte: ['G’tt änderte Saras Worte, als Er sie Awraham wiederholte, um Frieden zu wahren (1. Mose 18,12–13).', 'Die Schabbatkerzen sollen nach dem Talmud auch Schlom Bajit bringen (Schabbat 23b).'] }),
  begriff(30, 'Mozi Schem Ra', 'מוֹצִיא שֵׁם רַע', 'einen schlechten Namen verbreiten',
    'Verleumdung: Falsches und Schlechtes über einen anderen erzählen. Das ist noch schlimmer als Laschon ha-Ra, weil es zusätzlich gelogen ist.',
    { punkte: ['Laschon ha-Ra ist wahr, Mozi Schem Ra ist erfunden (Begriff 1.31).'] }),
  begriff(31, 'Laschon Hara', 'לָשׁוֹן הָרָע', 'die böse Zunge',
    'Etwas Schlechtes über einen anderen erzählen, auch wenn es wahr ist, ohne dass es nötig ist. Es ist verboten, es zu sagen und es zu hören.',
    {
      punkte: [
        '„Du sollst nicht als Verleumder umhergehen in deinem Volk“ (3. Mose 19,16).',
        'Erlaubt oder geboten ist es nur mit nützlichem Ziel, etwa um jemanden vor Schaden zu warnen.',
        'Der Chafez Chajim schrieb ein ganzes Buch über diese Gesetze.',
      ],
      quelle: '3. Mose 19,16; Rambam, Hilchot De’ot 7',
    }),
  begriff(32, 'Rechilut', 'רְכִילוּת', 'Klatsch, Zuträgerei',
    'Jemandem erzählen, was ein anderer über ihn gesagt oder getan hat („Er hat über dich gesagt …“). Das sät Streit, auch wenn es stimmt.',
    { punkte: ['Verbot aus demselben Vers wie Laschon ha-Ra (3. Mose 19,16, „rachil“).'] }),
  begriff(33, 'Sinat Chinam', 'שִׂנְאַת חִנָּם', 'grundloser Hass',
    'Hass ohne Grund zwischen Juden. Nach dem Talmud wurde der zweite Tempel wegen Sinat Chinam zerstört, obwohl man damals Tora lernte und Mizwot hielt.',
    { punkte: ['Gegenmittel ist Ahawat Chinam, Liebe ohne Grund (Raw Kook).', 'Die Geschichte von Kamza und Bar Kamza (Talmud, Gittin 55b–56a).'], quelle: 'Talmud, Joma 9b' }),
  begriff(34, 'Nissajon', 'נִסָּיוֹן', 'Prüfung, Versuchung',
    'Eine Prüfung, in die G’tt einen Menschen stellt, damit er seine Kräfte zeigt und wächst. Awraham bestand zehn Prüfungen, die letzte war die Bindung Jizchaks.',
    { punkte: ['„G’tt prüfte Awraham“ (1. Mose 22,1).', 'Nach der Überlieferung gibt G’tt niemandem eine Prüfung, die er nicht bestehen kann.'], quelle: '1. Mose 22,1; Pirkej Awot 5,3' }),
  begriff(35, 'Jirat Schamajim', 'יִרְאַת שָׁמַיִם', 'Ehrfurcht vor dem Himmel',
    'Ehrfurcht vor G’tt: im Bewusstsein leben, dass G’tt alles sieht, und deshalb das Richtige tun, auch wenn kein Mensch zuschaut.',
    { punkte: ['„Alles liegt in der Hand des Himmels, außer der Ehrfurcht vor dem Himmel“ (Talmud, Berachot 33b): Sie ist die eigene Entscheidung des Menschen.'] }),
  begriff(36, 'Jirat Chet', 'יִרְאַת חֵטְא', 'Furcht vor der Sünde',
    'Die Angst, etwas Falsches zu tun, die einen vorsichtig macht, schon bevor man in Versuchung kommt. Sie ist eine Stufe auf dem Weg zur Heiligkeit.',
    { punkte: ['„Wessen Furcht vor der Sünde seiner Weisheit vorangeht, dessen Weisheit hat Bestand“ (Pirkej Awot 3,9).'] }),
  begriff(37, 'Zadeket', 'צַדֶּקֶת', 'Gerechte (Frau)',
    'Eine gerechte, fromme Frau. Vorbilder sind die vier Mütter Sara, Riwka, Rachel und Lea, aber auch Rut, die Konvertitin, deren Urenkel König David war.',
    {}),
  begriff(38, 'Zadik', 'צַדִּיק', 'Gerechter',
    'Ein gerechter Mensch, der G’tt dient und gut zu den Menschen ist. Auch besonders verehrte Rabbiner und Lehrer werden so genannt.',
    { punkte: ['„Der Gerechte lebt durch seinen Glauben“ (Chawakuk 2,4).', 'Nichtjuden, die die sieben noahidischen Gebote halten, heißen „Chassidej Umot ha-Olam“, Fromme der Völker.'] }),
  begriff(39, 'Refua Schlema', 'רְפוּאָה שְׁלֵמָה', 'vollständige Heilung',
    'Der Wunsch an einen Kranken: „Gute Besserung“, wörtlich „eine vollständige Heilung“ an Körper und Seele. Für Kranke betet man in der Amida und bei der Toralesung (Mi sche-Berach) mit ihrem hebräischen Namen und dem Namen der Mutter.',
    {}),
  begriff(40, 'Baruch Haschem', 'בָּרוּךְ הַשֵּׁם', 'gesegnet sei G’tt',
    '„Gelobt sei G’tt“, „G’tt sei Dank“: Man sagt es, wenn man erzählt, wie es einem geht, oder über etwas Gutes, um zu zeigen, dass alles von G’tt kommt.',
    {}),
  begriff(41, 'Bli Neder', 'בְּלִי נֶדֶר', 'ohne Gelübde',
    '„Ohne Gelübde“: Man fügt es einem Versprechen hinzu (etwa „Ich komme morgen, bli neder“), damit es nicht als bindendes Gelübde gilt, falls man es nicht halten kann.',
    { punkte: ['Gelübde nimmt die Tora sehr ernst: „Er soll sein Wort nicht brechen“ (4. Mose 30,3).', 'Auch eine gute Gewohnheit, die man dreimal getan hat, kann wie ein Gelübde gelten, wenn man nicht „bli neder“ gesagt hat.'] }),
  begriff(42, 'Im Jirze Haschem', 'אִם יִרְצֶה הַשֵּׁם', 'wenn G’tt will',
    '„So G’tt will“: Man sagt es bei Plänen für die Zukunft, weil alles von G’ttes Willen abhängt.',
    {}),
  begriff(43, 'Chas Weschalom', 'חַס וְשָׁלוֹם', 'Erbarmen und Frieden',
    '„G’tt bewahre“, „um Himmels willen“: Man sagt es, wenn man von etwas Schlimmem spricht, das hoffentlich nie geschieht.',
    {}),
  {
    id: 'eth-02',
    nr: 2,
    q: 'Was sind die Stufen von Teschuwa?',
    kurz: 'Nach Rambam: die Sünde erkennen und aufgeben (Asiwat ha-Chet), sie ehrlich bereuen (Charata), sie mit Worten vor G’tt bekennen (Widuj) und sich fest vornehmen, sie nie wieder zu tun (Kabbala le-Atid).',
    punkte: [
      'Vollständige Teschuwa: Man kommt wieder in dieselbe Lage und tut es nicht mehr, aus Überzeugung und nicht aus Schwäche.',
      'Bei Unrecht gegen Menschen: zuerst den Schaden ersetzen und um Verzeihung bitten, notfalls dreimal (Hilchot Teschuwa 2,9).',
      'Teschuwa ist jederzeit möglich, besonders aber in den Zehn Tagen zwischen Rosch Haschana und Jom Kippur.',
    ],
    quelle: 'Rambam, Hilchot Teschuwa 1–2',
  },
  {
    id: 'eth-03',
    nr: 3,
    q: 'Gemäß Rambam, was ist die höchste Form von Zedaka?',
    kurz: 'Einem Menschen zu helfen, bevor er arm wird, so dass er sich selbst versorgen kann: ihm ein Geschenk oder Darlehen geben, ihn als Partner nehmen oder ihm Arbeit verschaffen.',
    punkte: [
      'Rambam zählt acht Stufen. Danach kommen: geben, ohne dass Geber und Empfänger sich kennen; der Geber kennt den Empfänger, aber nicht umgekehrt; der Empfänger kennt den Geber, aber nicht umgekehrt; geben, bevor man gebeten wird; geben, nachdem man gebeten wurde; weniger geben als angemessen, aber freundlich; mit Widerwillen geben.',
      '„Halte ihn, deinen Bruder, … dass er bei dir leben kann“ (3. Mose 25,35).',
    ],
    quelle: 'Rambam, Hilchot Matnot Anijim 10,7–14',
  },
  {
    id: 'eth-04',
    nr: 4,
    q: 'Wird Maschiach göttlich sein?',
    kurz: 'Nein. Der Maschiach ist ein Mensch, ein Nachkomme König Davids, der die Tora lernt und hält. Er hat keine göttliche Natur, und man betet nicht zu ihm.',
    punkte: [
      'Nach Rambam ist er ein König, der das Volk zur Tora führt, die Verbannten sammelt und den Tempel baut. Wer dabei scheitert oder stirbt, war nicht der Maschiach.',
      'Er muss keine Wunder tun, um anerkannt zu werden.',
      'Darin liegt ein Grundunterschied zum Christentum, das Jesus als göttlich sieht.',
    ],
    quelle: 'Rambam, Hilchot Melachim 11,3–4 und 12',
  },
  {
    id: 'eth-05',
    nr: 5,
    q: 'Wann wird die Tora ersetzt?',
    kurz: 'Nie. Die Tora ist ewig und wird nicht ausgetauscht oder durch eine andere ersetzt. Das ist der neunte von Rambams dreizehn Glaubensgrundsätzen.',
    punkte: [
      '„Die verborgenen Dinge gehören dem Ewigen, … die offenbarten uns und unseren Kindern für ewig, damit wir alle Worte dieser Tora tun“ (5. Mose 29,28).',
      '„Ihr sollt nichts hinzufügen und nichts davon wegnehmen“ (5. Mose 13,1).',
      'Auch in der Zeit des Maschiach bleibt die Tora gültig.',
    ],
    quelle: '5. Mose 13,1 und 29,28; Rambam, Hilchot Jessodej ha-Tora 9,1',
  },
  {
    id: 'eth-06',
    nr: 6,
    q: 'Ist Judentum nur eine Religion?',
    kurz: 'Nein. Das jüdische Volk ist eine Religion und ein Volk zugleich, eine Familie mit gemeinsamer Herkunft, Geschichte, Sprache und einem Bund mit G’tt. Wer übertritt, nimmt den Glauben an und wird Teil des Volkes.',
    punkte: [
      'Rut sagte: „Dein Volk ist mein Volk, und dein G’tt ist mein G’tt“ (Rut 1,16): erst das Volk, dann G’tt.',
      'Auch ein Jude, der die Gebote nicht hält, bleibt Jude: „Auch wenn er gesündigt hat, ist er Israel“ (Talmud, Sanhedrin 44a).',
      'Ein Konvertit wird Sohn oder Tochter von Awraham und Sara.',
    ],
    quelle: 'Rut 1,16; Talmud, Sanhedrin 44a',
  },
  {
    id: 'eth-07',
    nr: 7,
    q: 'Glauben Juden an ein Leben nach dem Tod?',
    kurz: 'Ja. Die Seele lebt nach dem Tod weiter und wird für ihre Taten belohnt (Gan Eden) oder gereinigt (Gehinnom). Dazu kommen die kommende Welt (Olam ha-Ba) und die Auferstehung der Toten (Techijat ha-Metim) in der Zeit des Maschiach.',
    punkte: [
      'Die Auferstehung ist der dreizehnte von Rambams Glaubensgrundsätzen und steht im zweiten Segen der Amida („mechaje ha-metim“).',
      '„Ganz Israel hat Anteil an der kommenden Welt“ (Mischna, Sanhedrin 10,1). Auch die Gerechten der Völker haben Anteil.',
      'Die Tora richtet den Blick vor allem auf das Leben in dieser Welt: „Ein Augenblick in Teschuwa und guten Taten in dieser Welt ist schöner als die ganze kommende Welt“ (Pirkej Awot 4,17).',
    ],
    quelle: 'Mischna, Sanhedrin 10,1; Rambam, Hilchot Teschuwa 8',
  },
  {
    id: 'eth-08',
    nr: 8,
    q: 'Warum ist es untersagt, jemanden in der Öffentlichkeit zu blamieren?',
    kurz: 'Wer einen Menschen öffentlich beschämt, gilt nach dem Talmud fast wie ein Mörder: Das Blut weicht aus seinem Gesicht, er wird bleich (Halbanat Panim). Jeder Mensch ist im Ebenbild G’ttes geschaffen, seine Würde zu verletzen ist schwere Sünde.',
    punkte: [
      '„Lieber werfe sich ein Mensch in einen Feuerofen, als dass er seinen Nächsten öffentlich beschämt“, gelernt von Tamar, die Jehuda nicht bloßstellte (1. Mose 38,25).',
      'Wer andere öffentlich beschämt, verliert nach der Mischna seinen Anteil an der kommenden Welt (Pirkej Awot 3,11).',
      'Selbst wer jemanden zurechtweisen muss, soll es unter vier Augen und sanft tun (3. Mose 19,17).',
      'Auch den Konvertiten an seine Herkunft zu erinnern, um ihn zu kränken, ist verboten (Ona’at Dewarim, 3. Mose 25,17).',
    ],
    quelle: 'Talmud, Bawa Mezia 58b–59a; Pirkej Awot 3,11',
  },
  {
    id: 'eth-09',
    nr: 9,
    q: 'Ist es des Menschen freier Wille, über Gut oder Böse zu entscheiden?',
    kurz: 'Ja. Jeder Mensch hat die freie Wahl (Bechira Chofschit) zwischen Gut und Böse. Deshalb ist er für seine Taten verantwortlich und kann belohnt werden.',
    punkte: [
      '„Leben und Tod habe Ich dir vorgelegt, Segen und Fluch, so wähle das Leben“ (5. Mose 30,19).',
      '„Alles liegt in der Hand des Himmels, außer der Ehrfurcht vor dem Himmel“ (Talmud, Berachot 33b).',
      'Rambam: Wäre der Mensch nicht frei, wären Gebote, Lohn und Strafe sinnlos (Hilchot Teschuwa 5).',
      'G’tt weiß alles im Voraus, und doch ist der Mensch frei: Beides gilt, auch wenn wir es nicht ganz verstehen (Pirkej Awot 3,15).',
    ],
    quelle: '5. Mose 30,19; Rambam, Hilchot Teschuwa 5',
  },
];
