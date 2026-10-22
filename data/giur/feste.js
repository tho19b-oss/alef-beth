// Giur-Wissen, Teil 3: Feste (allgemein).
//
// Fragetexte stehen wörtlich im Prüfungskatalog. Die Antworten wurden als ENTWURF
// geschrieben und am 22.10.2026 mit dem Prüfbogen durchgesehen: Alle 18 sind
// bestätigt und tragen status 'geprueft'. Neue oder später geänderte Antworten
// bleiben 'entwurf', bis ein Rabbiner oder Lehrer sie bestätigt hat.
//
// Die Antworten gehen vom Leben außerhalb Israels aus (zwei Festtage, „Jom Tow
// Scheni“), weil das Beit Din in Deutschland prüft.
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

const SCHEHECHEJANU = {
  label: 'Schehechejanu',
  text: `${BRACHA_KOENIG}, שֶׁהֶחֱיָנוּ וְקִיְּמָנוּ וְהִגִּיעָנוּ לַזְּמַן הַזֶּה.`,
  translit: `${BRACHA_KOENIG_UMSCHRIFT}, schehechejanu we-kijemanu we-higianu la-sman ha-se.`,
  de: `${BRACHA_KOENIG_DE}, der uns hat leben lassen, uns erhalten und uns diese Zeit hat erreichen lassen.`,
};

export const FESTE = [
  {
    id: 'fest-01',
    nr: 1,
    status: 'geprueft',
    q: 'Wie lautet das hebräische Wort für „Fest“?',
    type: 'fakt',
    kurz: 'Chag (חַג). Ein Feiertag, an dem Arbeit verboten ist, heißt auch Jom Tow („guter Tag“), die Festzeiten insgesamt Mo’adim („festgesetzte Zeiten“).',
    punkte: [
      'Der Festgruß lautet „Chag sameach“ („frohes Fest“).',
      'Die drei Wallfahrtsfeste Pessach, Schawuot und Sukkot heißen Schalosch Regalim.',
      'Die Zwischentage von Pessach und Sukkot heißen Chol ha-Mo’ed (Halbfeiertage).',
    ],
    hebrew: [
      { label: 'Fest', text: 'חַג', translit: 'chag', de: 'Fest' },
      { label: 'Feiertag', text: 'יוֹם טוֹב', translit: 'Jom Tow', de: 'guter Tag, Feiertag' },
      { label: 'Festgruß', text: 'חַג שָׂמֵחַ', translit: 'chag sameach', de: 'frohes Fest' },
    ],
  },
  {
    id: 'fest-02',
    nr: 2,
    status: 'geprueft',
    q: 'Welche Aktivitäten, die am Schabbat verboten sind, sind an Feiertagen erlaubt?',
    kurz: 'An Jom Tow sind Arbeiten erlaubt, die man für das Essen am Fest braucht („Ochel Nefesch“): kochen, backen, braten und dafür Feuer von einer bestehenden Flamme übertragen. Dazu darf man auch ohne Eruw tragen, wenn es dem Fest dient.',
    punkte: [
      'Grundlage: „Nur was jeder Mensch zum Essen braucht, das allein darf von euch gemacht werden“ (2. Mose 12,16).',
      'Feuer: Man darf an einer brennenden Flamme ein Licht oder den Herd anzünden, aber kein neues Feuer erzeugen (Streichholz, Feuerzeug).',
      'Löschen ist grundsätzlich verboten. Herunterdrehen, damit das Essen nicht anbrennt, ist teilweise erlaubt (beim Rabbiner fragen).',
      'Tragen auf der Straße ist erlaubt, wenn man das Getragene am Fest braucht (zum Beispiel Gebetbuch, Schlüssel, Essen für Gäste).',
      'Man kocht nur für den laufenden Festtag, nicht für den nächsten Tag oder den Werktag (Fragen 14 und 18).',
      'Alle anderen Arbeiten bleiben verboten: schreiben, Auto fahren, Elektrisches ein- und ausschalten, Geld benutzen.',
    ],
    quelle: '2. Mose 12,16; Schulchan Aruch, Orach Chajim 495',
  },
  {
    id: 'fest-03',
    nr: 3,
    status: 'geprueft',
    q: 'Wann beginnt ein Fest? Wann endet es? Wie findet man die genaue Uhrzeit heraus?',
    kurz: 'Wie der Schabbat beginnt ein Fest am Vorabend mit Sonnenuntergang (die Kerzen zündet man kurz davor) und endet am Abend des letzten Festtags mit Einbruch der Dunkelheit, wenn drei mittlere Sterne zu sehen sind. Die genauen Zeiten stehen im Luach (jüdischen Kalender) der eigenen Gemeinde.',
    punkte: [
      'Der jüdische Tag beginnt mit dem Abend: „Es wurde Abend und es wurde Morgen“ (1. Mose 1,5).',
      'Die Zeiten hängen vom Ort und der Jahreszeit ab. Man nimmt den Kalender der Gemeinde oder eine verlässliche Zeiten-Seite für den Wohnort.',
      'Am Ende steht die Hawdala (außer wenn direkt der Schabbat oder ein weiterer Festtag folgt).',
      'Am zweiten Festtag zündet man erst nach Einbruch der Dunkelheit (Frage 17).',
    ],
  },
  {
    id: 'fest-04',
    nr: 4,
    status: 'geprueft',
    q: 'Wie lauten die Brachot zum Entfachen der Festbeleuchtung?',
    type: 'fakt',
    kurz: 'Zwei Segenssprüche: „le-hadlik ner schel Jom Tow“ („das Festtagslicht zu zünden“) und danach „Schehechejanu“. Fällt das Fest auf Schabbat, heißt es „le-hadlik ner schel Schabbat we-schel Jom Tow“.',
    punkte: [
      'Der volle Wortlaut beider Segen steht unten zum Aufsagen.',
      'Schehechejanu entfällt an den letzten Tagen von Pessach (Frage 5).',
      'An Jom Kippur lautet der Schluss „schel Jom ha-Kippurim“.',
      'Am zweiten Abend nur von einer bestehenden Flamme zünden (Frage 17).',
      'Bei Jom Tow zünden viele Frauen erst und sprechen dann den Segen, andere sprechen zuerst den Segen und zünden dann.',
    ],
    hebrew: [
      {
        label: 'Segen über das Festtagslicht',
        text: `${BRACHA_ANFANG} לְהַדְלִיק נֵר שֶׁל יוֹם טוֹב.`,
        translit: `${BRACHA_ANFANG_UMSCHRIFT} le-hadlik ner schel Jom Tow.`,
        de: `${BRACHA_ANFANG_DE}, das Festtagslicht zu zünden.`,
      },
      SCHEHECHEJANU,
    ],
    quelle: 'Schulchan Aruch, Orach Chajim 263,5 und 514,11',
  },
  {
    id: 'fest-05',
    nr: 5,
    status: 'geprueft',
    q: 'An welchen Feiertagen entfällt das Shehecheyanu? Warum?',
    kurz: 'An den letzten beiden Tagen von Pessach (7. und 8. Tag). Sie sind kein neues Fest, sondern der Abschluss von Pessach. Das Schehechejanu für Pessach hat man schon an den ersten Abenden gesagt.',
    punkte: [
      'Schmini Azeret und Simchat Tora sind dagegen ein eigenes Fest und bekommen das Schehechejanu, obwohl sie an Sukkot anschließen.',
      'An Chanuka sagt man Schehechejanu nur am ersten Abend, an Purim bei der Megilla-Lesung.',
      'Schehechejanu dankt dafür, eine Zeit (wieder) erreicht zu haben. Es gehört zu etwas Neuem.',
    ],
  },
  {
    id: 'fest-06',
    nr: 6,
    status: 'geprueft',
    q: 'Woran erinnert uns jedes einzelne Fest?',
    kurz: 'Jedes Fest erinnert an ein Ereignis der jüdischen Geschichte oder eine Grundwahrheit des Glaubens: Pessach an den Auszug aus Ägypten, Schawuot an die Gabe der Tora, Sukkot an die Wüstenwanderung, Rosch Haschana an die Erschaffung der Welt und G’ttes Königtum, Jom Kippur an Umkehr und Vergebung, Chanuka an die Tempelweihe und Purim an die Rettung in Persien.',
    punkte: [
      'Pessach: Auszug aus Ägypten, Befreiung aus der Sklaverei.',
      'Schawuot: Offenbarung am Sinai, Gabe der Tora; dazu die Weizenernte und die Erstlingsfrüchte.',
      'Sukkot: die Hütten (oder die Wolken der Herrlichkeit), in denen G’tt das Volk in der Wüste schützte; dazu das Erntedankfest.',
      'Rosch Haschana: Erschaffung des Menschen, G’tt als König und Richter der Welt.',
      'Jom Kippur: Vergebung; Mosche brachte an diesem Tag die zweiten Tafeln.',
      'Chanuka: Sieg der Makkabäer, Wiedereinweihung des Tempels, Ölwunder.',
      'Purim: Rettung der Juden vor Haman zur Zeit Esthers.',
      'Die Tora-Feste erinnern alle auch an den Auszug aus Ägypten: „Secher li-zi’at Mizrajim“ im Kiddusch.',
    ],
  },
  {
    id: 'fest-07',
    nr: 7,
    status: 'geprueft',
    q: 'Nenne das jüdische Datum und Dauer aller Feste.',
    type: 'fakt',
    kurz: 'Rosch Haschana 1.–2. Tischri (2 Tage), Jom Kippur 10. Tischri (1 Tag), Sukkot 15.–21. Tischri (7 Tage), Schmini Azeret 22. und Simchat Tora 23. Tischri, Chanuka ab 25. Kislew (8 Tage), Purim 14. Adar (1 Tag), Pessach 15.–22. Nissan (8 Tage), Schawuot 6.–7. Siwan (2 Tage). Angaben für außerhalb Israels.',
    punkte: [
      'Rosch Haschana: 1. und 2. Tischri, auch in Israel zwei Tage.',
      'Jom Kippur: 10. Tischri, rund 25 Stunden.',
      'Sukkot: 15. bis 21. Tischri; die ersten zwei Tage Jom Tow, dann Chol ha-Mo’ed, der 21. ist Hoschana Rabba.',
      'Schmini Azeret: 22. Tischri; Simchat Tora: 23. Tischri. In Israel fallen beide auf den 22.',
      'Chanuka: 25. Kislew bis 2. oder 3. Tewet, 8 Tage.',
      'Purim: 14. Adar (im Schaltjahr Adar II), in Jerusalem Schuschan Purim am 15.',
      'Pessach: 15. bis 22. Nissan, 8 Tage (in Israel 7); erste zwei und letzte zwei Tage Jom Tow.',
      'Schawuot: 6. und 7. Siwan (in Israel nur der 6.).',
      'Dazu: Tu bi-Schwat (15. Schwat), Lag ba-Omer (18. Ijar), Fasttage wie Tischa be-Aw (9. Aw).',
    ],
  },
  {
    id: 'fest-08',
    nr: 8,
    status: 'geprueft',
    q: 'Was ist „Machzor“?',
    type: 'fakt',
    kurz: 'Der Machsor (wörtlich „Zyklus“) ist das Gebetbuch für die Feiertage. Er enthält die besonderen Festgebete, die im gewöhnlichen Siddur fehlen. Meist gibt es für jedes Fest einen eigenen Band.',
    punkte: [
      'Bekannt sind vor allem die Machsorim für Rosch Haschana und Jom Kippur mit Pijutim (religiösen Dichtungen).',
      'Der Siddur ist das Gebetbuch für Werktage und Schabbat (Frage 13b).',
    ],
    hebrew: [{ label: 'Machsor', text: 'מַחֲזוֹר', translit: 'machsor', de: 'Zyklus, Festgebetbuch' }],
  },
  {
    id: 'fest-09',
    nr: 9,
    status: 'geprueft',
    q: 'Was ist das „Hallel“ Gebet? Von welchem Buch stammt das?',
    kurz: 'Hallel („Lobpreis“) ist eine Folge von Lobpsalmen (Psalm 113 bis 118) aus dem Buch der Psalmen (Tehillim), die man an Festtagen nach der Morgen-Amida sagt, um G’tt für Rettung und Wunder zu danken.',
    punkte: [
      'Ganzes Hallel: Sukkot, Schmini Azeret, Simchat Tora, Chanuka (alle 8 Tage), Schawuot, die ersten Tage Pessach.',
      'Halbes Hallel (zwei Abschnitte ausgelassen): Rosch Chodesch und die letzten sechs Tage Pessach.',
      'Kein Hallel an Rosch Haschana und Jom Kippur (Tage des Gerichts) und an Purim (die Megilla-Lesung gilt als Lob).',
      'Am Seder-Abend sagt man Hallel in der Haggada.',
    ],
    quelle: 'Psalmen 113–118; Talmud, Arachin 10a',
    hebrew: [{ label: 'Hallel', text: 'הַלֵּל', translit: 'hallel', de: 'Lobpreis' }],
  },
  {
    id: 'fest-10',
    nr: 10,
    status: 'geprueft',
    q: 'Welches besondere Gebet wird an „Rosch Chodesh“ gesprochen?',
    kurz: 'An Rosch Chodesch (Neumond, Monatsbeginn) fügt man „Ja’ale we-jawo“ in die Amida und das Tischgebet ein, sagt nach dem Morgengebet das halbe Hallel und betet Mussaf. Dazu wird aus der Tora gelesen (4. Mose 28).',
    punkte: [
      'Ja’ale we-jawo bittet, dass G’tt sich an diesem Tag an uns erinnert (Frage 11).',
      'Halb-Hallel: Psalm 113 bis 118 ohne zwei Abschnitte (Frage 9).',
      'Mussaf: ein zusätzliches Gebet anstelle des Zusatzopfers im Tempel (Frage 12).',
      'Am Schabbat vor Rosch Chodesch wird der neue Monat in der Synagoge angesagt (Birkat ha-Chodesch).',
    ],
    hebrew: [{ label: 'Rosch Chodesch', text: 'רֹאשׁ חֹדֶשׁ', translit: 'Rosch Chodesch', de: 'Anfang des Monats' }],
  },
  {
    id: 'fest-11',
    nr: 11,
    status: 'geprueft',
    q: 'An welchen Tagen fügen wir das „Jaale Wejawo“ Gebet in das „Schemoneh Esre“ und das „Birkat Hamason“?',
    type: 'fakt',
    kurz: 'An Rosch Chodesch und an allen Tora-Festen: Pessach, Schawuot, Sukkot (jeweils auch an Chol ha-Mo’ed), Schmini Azeret, Simchat Tora und Rosch Haschana. An Jom Kippur steht es nur in der Amida, weil man fastet und kein Tischgebet spricht.',
    punkte: [
      'In der Amida steht es im Segen „Reze“ (Bitte um den Tempeldienst).',
      'Im Tischgebet steht es vor „U-wne Jeruschalajim“.',
      'Nicht an Chanuka und Purim: Dort sagt man „Al ha-Nissim“ (Teil 6, Frage 9).',
      'Wer es an Rosch Chodesch in der Amida vergisst, muss in den meisten Fällen die Amida wiederholen.',
    ],
    hebrew: [{ label: 'Ja’ale we-jawo', text: 'יַעֲלֶה וְיָבוֹא', translit: 'ja’ale we-jawo', de: 'es steige auf und komme' }],
  },
  {
    id: 'fest-12',
    nr: 12,
    status: 'geprueft',
    q: 'An welchen Tagen und Feste wird „Mussaf“ gebetet?',
    type: 'fakt',
    kurz: 'An allen Tagen, an denen im Tempel ein Zusatzopfer (Korban Mussaf) gebracht wurde: Schabbat, Rosch Chodesch, Pessach, Schawuot, Sukkot (mit Hoschana Rabba), Schmini Azeret, Simchat Tora, Rosch Haschana und Jom Kippur. Auch an Chol ha-Mo’ed.',
    punkte: [
      'Mussaf heißt „Zusatz“. Es folgt auf das Morgengebet (Schacharit) und die Toralesung.',
      'Kein Mussaf an Chanuka und Purim (außer es ist zugleich Schabbat oder Rosch Chodesch) und an Fasttagen.',
      'Die Opfer sind in 4. Mose 28 und 29 aufgezählt.',
    ],
    quelle: '4. Mose 28–29',
  },
  {
    id: 'fest-13',
    nr: 13,
    status: 'geprueft',
    q: 'Erkläre den Unterschied zwischen:',
    sub: [
      '„Kaddisch“, „Kiddusch“ und „Keduscha“',
      '„Siddur“ und „Seder“',
      '„Tefilla“ und „Tefillin“',
      '„Purim“ und „Jom Hakippurim“',
      '„Challa“ und „Kalla“',
      '„Chatan“ und „Chasan“',
      '„Erew“ und „Eruw“',
    ],
    kurz: 'Paare mit ähnlichem Klang, aber anderer Bedeutung. Die Unterschiede in Kürze stehen in den Merkpunkten, je einer pro Buchstabe.',
    punkte: [
      'a. Kaddisch: aramäisches Lobgebet („Jitgadal we-jitkadasch“), nur mit Minjan, auch Trauergebet. Kiddusch: Heiligung von Schabbat und Fest über einem Becher Wein. Keduscha: „Kadosch, kadosch, kadosch“, Teil der Wiederholung der Amida, nur mit Minjan.',
      'b. Siddur: das Gebetbuch (von „Ordnung“). Seder: „Ordnung“, vor allem der Pessach-Abend mit seiner festen Abfolge.',
      'c. Tefilla: das Gebet, besonders die Amida. Tefillin: die Gebetsriemen mit Kapseln, die Männer werktags beim Morgengebet anlegen.',
      'd. Purim: fröhliches Losfest im Adar. Jom ha-Kippurim: Versöhnungstag, Fasttag im Tischri. Die Überlieferung deutet den Namen als „Jom ke-Purim“, „ein Tag wie Purim“: Beide feiern G’ttes verborgene Rettung, der eine mit Fasten, der andere mit Freude.',
      'e. Challa: das Schabbatbrot, auch der Teigteil, der abgetrennt wird (Teil 1, Frage 32). Kalla: die Braut.',
      'f. Chatan: der Bräutigam. Chasan: der Kantor, der der Gemeinde vorbetet.',
      'g. Erew: Vorabend, der Tag vor Schabbat oder Fest. Eruw: „Vermischung“, eine rabbinische Einrichtung, die etwas erlaubt, zum Beispiel das Tragen (Eruw Chazerot) oder das Kochen für Schabbat am Fest (Eruw Tawschilin, Frage 18).',
    ],
    hebrew: [
      { label: 'Kaddisch', text: 'קַדִּישׁ', translit: 'kaddisch', de: 'Heiligung (Gebet)' },
      { label: 'Kiddusch', text: 'קִדּוּשׁ', translit: 'kiddusch', de: 'Heiligung (über Wein)' },
      { label: 'Keduscha', text: 'קְדֻשָּׁה', translit: 'keduscha', de: 'Heiligkeit (Teil der Amida)' },
    ],
  },
  {
    id: 'fest-14',
    nr: 14,
    status: 'geprueft',
    q: 'Was ist am Ende des ersten Tages von Jom Tow, beginnend ab Sonnenuntergang bis zur Dunkelheit, verboten?',
    kurz: 'Man darf noch nichts für den zweiten Festtag vorbereiten: weder die Kerzen zünden noch kochen, den Tisch decken oder spülen. Am ersten Tag darf man nicht für den zweiten arbeiten (Hachana), deshalb wartet man bis zur Dunkelheit.',
    punkte: [
      'Zwischen Sonnenuntergang und Dunkelheit (Bejn ha-Schmaschot) ist der erste Tag noch nicht sicher vorbei.',
      'Erst nach Einbruch der Dunkelheit zündet man die Kerzen für den zweiten Abend (Frage 17) und beginnt mit dem Kochen.',
      'Viele sagen vorher „Baruch ha-mawdil bejn kodesch le-kodesch“ (Frage 15).',
      'Gleiches gilt, wenn Schabbat direkt in Jom Tow übergeht: Vorbereiten erst nach Schabbat-Ausgang.',
    ],
    hebrew: [{ label: 'Vorbereiten', text: 'הֲכָנָה', translit: 'hachana', de: 'Vorbereitung (für einen anderen Tag)' }],
  },
  {
    id: 'fest-15',
    nr: 15,
    status: 'geprueft',
    q: 'Welchen Spruch sagt man nach der Dunkelheit um wieder mit den Aktivitäten beginnen zu dürfen?',
    kurz: 'Nach Schabbat oder Fest, bevor man die Hawdala gehört hat: „Baruch ha-mawdil bejn kodesch le-chol“ („Gesegnet, der zwischen Heiligem und Alltäglichem scheidet“). Vom ersten zum zweiten Festtag: „Baruch ha-mawdil bejn kodesch le-kodesch“ („zwischen Heiligem und Heiligem“).',
    punkte: [
      'Der Spruch wird ohne G’ttesnamen gesagt. Er ersetzt die Hawdala nicht, die man später noch macht.',
      'Frauen, die die Kerzen für den zweiten Abend zünden, sagen ihn vorher (Frage 17).',
      'In der Abend-Amida sagt man stattdessen „Atta chonantanu“ (am Fest-Ausgang „wa-todi’enu“).',
    ],
    hebrew: [
      { label: 'Zum Werktag', text: 'בָּרוּךְ הַמַּבְדִּיל בֵּין קֹדֶשׁ לְחוֹל', translit: 'baruch ha-mawdil bejn kodesch le-chol', de: 'Gesegnet, der zwischen Heiligem und Alltäglichem scheidet' },
      { label: 'Zum zweiten Festtag', text: 'בָּרוּךְ הַמַּבְדִּיל בֵּין קֹדֶשׁ לְקֹדֶשׁ', translit: 'baruch ha-mawdil bejn kodesch le-kodesch', de: 'Gesegnet, der zwischen Heiligem und Heiligem scheidet' },
    ],
  },
  {
    id: 'fest-16',
    nr: 16,
    status: 'geprueft',
    q: 'Was ist nicht Mukze an Jom Tow aber Mukze am Schabbat?',
    kurz: 'Alles, was man nur durch eine an Jom Tow erlaubte Arbeit benutzen kann: vor allem rohe Lebensmittel, die gekocht werden müssen (rohes Fleisch, rohe Kartoffeln, Mehl), und unangezündete Kerzen, die man an einer bestehenden Flamme anzünden darf.',
    punkte: [
      'Mukze heißt „beiseitegelegt“: Dinge, die man am Schabbat nicht bewegen darf (Teil 2).',
      'Weil Kochen an Jom Tow erlaubt ist (Frage 2), sind Lebensmittel zum Kochen nicht mehr „beiseitegelegt“.',
      'Was an Jom Tow trotzdem Mukze bleibt: Geld, Stifte, Werkzeug, Elektrogeräte, die man nicht benutzen darf.',
    ],
  },
  {
    id: 'fest-17',
    nr: 17,
    status: 'geprueft',
    q: 'Welche besondere Vorsichtsmaßnahme müssen wir am zweiten Abend beim Kerzen anzünden treffen?',
    kurz: 'Erst nach Einbruch der Dunkelheit zünden, nicht vor Sonnenuntergang wie am ersten Abend, und nur an einer bestehenden Flamme, nicht mit einem neuen Streichholz. Das Streichholz oder den Span danach nicht auspusten, sondern ablegen und ausbrennen lassen.',
    punkte: [
      'Deshalb lässt man vor dem Fest eine Kerze brennen, die bis zum zweiten Abend reicht (zum Beispiel eine 48-Stunden-Kerze) oder den Gasherd an.',
      'Vorher sagt man „Baruch ha-mawdil bejn kodesch le-kodesch“ (Frage 15).',
      'Folgt der zweite Festtag auf Schabbat, zündet man erst nach Schabbat-Ausgang.',
    ],
  },
  {
    id: 'fest-18',
    nr: 18,
    status: 'geprueft',
    q: 'Was ist eine „Eruw Tavschillin“?',
    kurz: 'Eruw Tawschilin („Vermischung der Speisen“) erlaubt es, an einem Feiertag für den folgenden Schabbat zu kochen. Fällt Jom Tow auf Donnerstag oder Freitag, legt man am Vortag ein gekochtes Gericht und ein Brot oder eine Mazza beiseite, spricht einen Segen und eine Erklärung. So gilt das Kochen am Fest als Fortsetzung einer Vorbereitung, die vor dem Fest begann.',
    punkte: [
      'Ohne Eruw Tawschilin darf man an Jom Tow nicht für den Schabbat kochen (Frage 14).',
      'Das beiseitegelegte Essen isst man am Schabbat.',
      'Nach dem Segen sagt man eine aramäische Erklärung („Be-den Eruwa …“), die man verstehen muss, zur Not auf Deutsch.',
      'Der Rabbiner der Gemeinde macht einen Eruw auch für die, die es vergessen haben.',
    ],
    hebrew: [{
      label: 'Segen über den Eruw Tawschilin',
      text: `${BRACHA_ANFANG} עַל מִצְוַת עֵרוּב.`,
      translit: `${BRACHA_ANFANG_UMSCHRIFT} al mizwat eruw.`,
      de: `${BRACHA_ANFANG_DE}, das Gebot des Eruw.`,
    }],
    quelle: 'Schulchan Aruch, Orach Chajim 527',
  },
];
