# Mail-Vorlagen

Die Vorlagen trägst du im Supabase-Dashboard unter Authentication, Emails ein. Der Betreff steht dort in einem eigenen Feld.

| Vorlage im Dashboard | Datei | Betreff |
|---|---|---|
| Magic Link | `anmelden.html` | `{{ .Token }} ist dein Alef-Beth-Code` |
| Change Email Address | `konto-sichern.html` | `{{ .Token }} ist dein Alef-Beth-Code` |

Der Code steht am Anfang des Betreffs. So erkennt Gmail auf Android ihn als Einmal-Code und zeigt in der Benachrichtigung "Code kopieren" an. In der App fügt der Knopf "Code einfügen" ihn dann ein, und die App bestätigt ihn sofort.
