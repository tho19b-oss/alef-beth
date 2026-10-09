# Stimme

Die App spricht Hebräisch mit aufgenommenen Clips aus `audio/he/`. Erzeugt
sind sie mit ElevenLabs (Modell `eleven_v3`). Fehlt ein Clip, spricht die
Stimme des Geräts.

| Datei | Zweck |
| --- | --- |
| `werkstatt.html` | Erzeugt die Clips im Browser: Schlüssel, Stimme, Probe, alle erzeugen, anhören, Paket speichern. Per Doppelklick öffnen, kein Server nötig. |
| `werkstatt-liste.mjs` | Schreibt die Sprechtexte der App (`speechEntries()` in `data/curriculum.js`) in die Werkstatt. |
| `einbauen.mjs` | Baut ein Paket (ZIP) ein: säubert jeden Clip mit ffmpeg und schreibt `audio/he/index.json`. Braucht Node 18+ und ffmpeg. |

## Ein neues Wort bekommt seinen Clip

1. Das Wort in `data/words.js` eintragen und einer Lektion zuordnen.
2. `node tools/stimme/werkstatt-liste.mjs`: Jetzt kennt die Werkstatt das Wort.
3. `werkstatt.html` öffnen, dieselbe Stimme wählen, „Fehlende erzeugen“,
   anhören, „Paket speichern“.
4. `node tools/stimme/einbauen.mjs alef-beth-stimme.zip`: Ein Paket mit nur
   den neuen Clips ergänzt die vorhandenen.
5. In `sw.js` `VERSION` hochzählen.

Bis dahin spricht für das neue Wort die Gerätestimme.

## Wichtig

- **Nur am eigenen Anschluss erzeugen.** Mit dem Gratis-Plan sperrt ElevenLabs
  Zugriffe über Server, VPN oder Proxy – also auch aus Cloud-Umgebungen. Die
  Werkstatt schickt den Schlüssel nur an `api.elevenlabs.io`. Nach dem
  Erzeugen den Schlüssel bei ElevenLabs wieder löschen.
- **Gratis-Plan:** Die Clips sind nur nicht-kommerziell nutzbar, und
  ElevenLabs muss genannt werden. Das tun die Einstellungen der App mit dem
  Feld `herkunft` aus `index.json`. Soll die App Geld verdienen, die Clips mit
  einem bezahlten Plan neu erzeugen.
- **Der Gottesname bekommt nie einen Clip.** `speechEntries()` lässt Items mit
  `noTts` aus, und `einbauen.mjs` nimmt nur Clips zu Texten, die die App kennt.
