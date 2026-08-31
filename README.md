# Alef Beth – Hebräisch lesen lernen 📖

Eine Lern-App im Stil von Duolingo/Drops, mit der du das hebräische Alphabet
lernst und Schritt für Schritt Hebräisch lesen übst – vom Alef-Bet über die
Vokalzeichen (Nikud) bis zu echten Wörtern aus Siddur und Alltag.

## Starten

**Doppelklick auf `App starten.bat`** – das startet einen kleinen lokalen
Webserver und öffnet die App im Browser unter `http://localhost:8351/`.

(Hintergrund: Die Offline-Funktion der App braucht einen Webserver;
einfaches Öffnen der `index.html` per Doppelklick reicht dafür nicht.)

## Was die App kann

- **Einheit 1 – Das Alef-Bet:** alle 22 Buchstaben, die 5 Endformen und ein
  Verwechsler-Training für ähnliche Buchstaben (ב/כ, ד/ר, …)
- **Einheit 2 – Nikud:** alle Vokalzeichen mit Silben-Lesedrills
- **Einheit 3 – Wörter lesen:** Wörter aus Siddur, Schma und Alltag bis zur
  Bracha-Formel
- **Übungstypen:** Multiple Choice (beide Richtungen), Paare zuordnen,
  Hören & Wählen (Sprachausgabe), Lese-Drills
- **Spaced Repetition:** Der „Üben“-Tab zeigt fällige Karten – richtig
  beantwortete Karten kommen in immer größeren Abständen wieder
  (1 → 3 → 7 → 14 → 30 → 90 Tage). Ist gerade nichts fällig, gibt es „freies
  Üben“: Das holt Wackelkandidaten zurück nach vorn, schiebt aber keine
  Termine nach hinten.
- **Motivation:** XP, Tages-Serie (Streak), Gesamtfortschritt und Fortschritt
  pro Lektion
- **Nachschlagen:** Alphabet- und Nikud-Tabelle mit Sprachausgabe
- **Am Rechner:** Tasten 1–4 wählen eine Antwort, Enter geht weiter
- **Offline & installierbar:** Nach dem ersten Laden funktioniert die App ohne
  Internet und lässt sich „Zum Startbildschirm hinzufügen“ (PWA)

Der Lernfortschritt wird lokal im Browser gespeichert (localStorage) –
es gibt kein Konto und es verlassen keine Daten das Gerät.

## Aufs Handy bringen

Die App ist eine reine statische Website. Lege die Dateien z.B. auf
**GitHub Pages** oder **Netlify** (kostenlos), öffne die Adresse am Handy
und wähle im Browser-Menü **„Zum Startbildschirm hinzufügen“** – dann
verhält sie sich wie eine installierte App und funktioniert offline.

## Sprachausgabe

Die App nutzt die eingebaute Sprachausgabe des Browsers (`he-IL`).
Findet sie keine hebräische Stimme, bleibt sie bewusst stumm – eine deutsche
Stimme würde hebräische Buchstaben als Kauderwelsch vorlesen. Alles andere
funktioniert ohne Audio genauso. So bekommst du eine hebräische Stimme:

- **Windows:** Microsoft Edge verwenden (bringt Online-Stimmen mit) oder unter
  *Einstellungen → Zeit und Sprache → Sprache* das hebräische Sprachpaket
  installieren
- **Android/iOS:** Hebräisch ist in der Regel vorhanden

Hinweis: Der Gottesname wird in der App nach üblicher Praxis nicht
ausgeschrieben (ה׳) und nie von der Sprachausgabe gesprochen.

## Technik / Inhalte erweitern

Vanilla HTML/CSS/JS ohne Build-Schritt und ohne Abhängigkeiten.

| Pfad | Inhalt |
| --- | --- |
| `data/letters.js` | Buchstaben & Endformen (Name, Laut, Eselsbrücke …) |
| `data/nikud.js` | Vokalzeichen & Lesesilben |
| `data/words.js` | Wortschatz (Hebräisch, Umschrift, Bedeutung) |
| `data/curriculum.js` | Einheiten & Lektionen, Item-Registry |
| `js/lesson.js` | Lektions-Player & Übungs-Warteschlangen |
| `js/exercises.js` | Übungstypen |
| `js/srs.js` | Spaced-Repetition-Logik |
| `js/theme.js` | Hell/Dunkel inkl. Farbe der Statusleiste |
| `sw.js` | Offline-Cache – **nach Änderungen `VERSION` hochzählen!** |

Neue Wörter hinzufügen: Eintrag in `data/words.js` ergänzen und die ID in
einer Lektion in `data/curriculum.js` eintragen – fertig.

Beim Ändern von Dateien: Der Service Worker liefert aus dem Cache, ein Reload
allein zeigt die Änderung also nicht. Entweder `VERSION` in `sw.js` hochzählen
(dann erscheint in der App der Hinweis „Neue Version verfügbar“) oder in den
Entwicklertools unter *Application → Storage* den Cache leeren. Wird eine
Item-ID gelöscht oder umbenannt, räumt die App gespeicherte Fortschritte dazu
beim nächsten Start selbst auf.
