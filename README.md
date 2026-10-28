# Variant 3 · Boog

Gebaseerd op de referentie *Ui-element*. Teller van 000 naar 100 terwijl fotorealistische carnavalsitems een boog vormen (circa 7 in de breedte, met ruimte ertussen). Bij 100 vloeit het atelier in als achtergrond en blijft de boog draaien; slepen draait mee.

- Code: `js/variant3.js`, stijl onderaan `css/style.css` (VARIANT 3)

---

# Haakhuis · website

Plain HTML/CSS/JS, geen betaalsysteem en geen database. Elke afspraak, inschrijving of aanvraag wordt een kant-en-klaar bericht dat de klant per mail naar Doris stuurt (WhatsApp staat klaar, maar uit).

Huisstijl: dezelfde tokens als de Carnaval Atelier v2 (`Documents/websites/haakhuis-v2`).

## Pagina's

| Bestand | Inhoud |
|---|---|
| `index.html` | Hero met de vier rondjes (borduurringen), over Doris, stappen, aftellen naar 11-11, workshops, FAQ, contact + kaart |
| `verstelwerk.html` | Diensten, boekmodule in 4 stappen (klus, dag+tijd, gegevens, versturen) |
| `workshops.html` | Agenda met filter, datumkeuze met vrije plekken, inschrijf-popup |
| `carnaval.html` | Aftellen, planning, losse verkoop, teaser pak-samensteller, aanvraagformulier maatwerk |
| `haakpatronen.html` | Patronen met filter, alles linkt naar Ravelry |

## Scènes tussen secties (`js/scenes.js`)

- **Stofgolf**: zet `data-wave="kleur"` op een sectie; de kleur is die van de sectie eronder. Staat onder elke hero.
- **Rits**: zet `data-zip` op een donker blok; het ritst open als je ernaartoe scrolt. Staat op het carnavalsblok (home) en "Stel je pak online samen" (carnaval).
- **Knip**: gaat vanzelf naar de footer op elke pagina.
- Bij "minder beweging" in de systeeminstellingen staan rits en knip uit en ligt de golf stil.

## WhatsApp-QR (`js/haakhuis-qr.js`)

Naaimachine van blokjes die een QR-code naar WhatsApp wordt (contactsectie op de home). Ander nummer? Maak de matrix opnieuw met `Documents/IBE MOTION/Dienstensites/tools/qrgen.py`.

## Alles aanpassen in één bestand: `js/config.js`

- **Verstel-dagen**: `verstelwerk.rooster` (weekdag → tijden), `gesloten` (vrije dagen), `extra` (losse extra dagen)
- **Workshops**: titel, prijs, max. plekken en per datum `bezet` (vol = niet meer te kiezen)
- **Carnaval**: planning, losse verkoop (met `foto` als er een foto is), `configurator` = link naar de pak-samensteller zodra die live is
- **Patronen**: lijst met Ravelry-links (leeg `url` = link naar de designerpagina)
- **WhatsApp aan**: `whatsapp: true`
- **Livegang**: `concept: false` (haalt de conceptbalk weg)

Na een wijziging het versienummer `?v=2` in de HTML-bestanden ophogen, dan zien bezoekers direct de nieuwe versie.

## Bekijken

```bash
python3 -m http.server 8797
```

## Nog nodig van Doris

- Foto's: Doris in haar werkruimte, patronen, losse verkoop
- Echte verstel-dagen en -tijden, workshops met data en prijzen
- Regels voor annuleren, cadeaubonnen en groepsworkshops (staan nu als voorstel in de FAQ)
- Instagram-link (als die er is)
