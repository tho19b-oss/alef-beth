// Grüße für die Begrüßung und die Stimme beim Start. Welcher gilt, entscheiden
// greetingFor (js/screens.js) und holidayFor (js/kalender.js).
// Der Name in Kleinbuchstaben benennt die Audiodatei (audio/he/gruss-bokertov.mp3).
// Schalom und Chag sameach sind zugleich Lernwörter und klingen mit deren Clips.

export const GREETINGS = {
  bokerTov: { he: 'בֹּקֶר טוֹב', translit: 'Boker tov', de: 'Guten Morgen' },
  shalom: { he: 'שָׁלוֹם', translit: 'Schalom', de: 'Hallo' },
  erevTov: { he: 'עֶרֶב טוֹב', translit: 'Erev tov', de: 'Guten Abend' },
  lailaTov: { he: 'לַיְלָה טוֹב', translit: 'Laila tov', de: 'Gute Nacht' },
  shabbatShalom: { he: 'שַׁבָּת שָׁלוֹם', translit: 'Schabbat Schalom', de: 'Einen friedlichen Schabbat' },
  shavuaTov: { he: 'שָׁבוּעַ טוֹב', translit: 'Schawua tov', de: 'Eine gute Woche' },
  chagSameach: { he: 'חַג שָׂמֵחַ', translit: 'Chag sameach', de: 'Frohes Fest' },
  shanaTova: { he: 'שָׁנָה טוֹבָה', translit: 'Schana tova', de: 'Ein gutes neues Jahr' },
  gmarChatima: { he: 'גְּמַר חֲתִימָה טוֹבָה', translit: "G'mar chatima tova", de: 'Eine gute Besiegelung' },
  chanukkaSameach: { he: 'חֲנֻכָּה שָׂמֵחַ', translit: 'Chanukka sameach', de: 'Frohes Chanukka' },
  purimSameach: { he: 'פּוּרִים שָׂמֵחַ', translit: 'Purim sameach', de: 'Frohes Purim' },
};
