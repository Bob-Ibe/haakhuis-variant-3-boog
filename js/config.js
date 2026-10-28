/* =========================================================
   Haakhuis · instellingen
   Alles wat Haakhuis (of Bob) aanpast staat in dit ene bestand:
   contact, verstelrooster, workshops, carnaval en patronen.
   Datums altijd als 'JJJJ-MM-DD', tijden als 'UU:MM'.
   ========================================================= */

window.HH = {

  /* true = dunne balk bovenaan "conceptversie". Op false zetten bij livegang. */
  concept: true,

  bedrijf: {
    naam: 'Haakhuis',
    ondertitel: 'Naaiatelier & haakstudio',
    eigenaar: 'Doris',
    straat: 'Wachtendonckstraat 28',
    postcode: '6371 VW',
    plaats: 'Landgraaf',
    email: 'info@haakhuis.nl',
    tel: '06 42 97 75 05',
    telIntl: '31642977505',
    kaart: { lat: 50.8988968, lon: 6.0212302 },
    openingstijden: 'Alleen op afspraak',
  },

  /* WhatsApp-knoppen staan uit tot Haakhuis er klaar voor is. Zet op true en
     overal verschijnt naast "verstuur per mail" ook "verstuur via WhatsApp". */
  whatsapp: false,

  socials: {
    facebook: 'https://www.facebook.com/haakhuis',
    instagram: '',   // bv. 'https://www.instagram.com/haakhuis' (leeg = verborgen)
    ravelry: 'https://www.ravelry.com/designers/doris-desiree-van-der-waals',
  },

  /* ---------- Afspraken bij contact (home) ----------
     Gebruikt hetzelfde rooster als verstelwerk hieronder, dus beschikbaarheid hoef je maar op één plek bij te houden. */
  afspraken: {
    soorten: ['Verstelwerk brengen', 'Carnavalspak passen of maat nemen', 'Iets ophalen', 'Advies over een idee', 'Haakmaterialen of een patroonvraag'],
  },

  /* ---------- Verstelwerk ---------- */
  verstelwerk: {
    /* Vaste verstel-dagen per weekdag (0 = zondag, 1 = maandag ... 6 = zaterdag)
       met de tijden waarop iemand kan langskomen. */
    rooster: {
      2: ['10:00', '10:30', '11:00', '13:30', '14:00', '14:30'],   // dinsdag
      4: ['10:00', '10:30', '11:00', '13:30', '14:00', '14:30'],   // donderdag
      6: ['10:00', '10:30', '11:00'],                               // zaterdag
    },
    /* Dagen dat het rooster niet geldt (vakantie, druk met carnaval) */
    gesloten: ['2026-12-24', '2026-12-26', '2026-12-31'],
    /* Losse extra dagen buiten het rooster */
    extra: {
      // '2026-11-17': ['18:30', '19:00'],
    },
    vooruitWeken: 8,      // hoe ver vooruit je kunt kiezen
    minDagenVooruit: 1,   // 1 = niet op dezelfde dag boeken
    soorten: [
      'Broek inkorten', 'Rits vervangen', 'Innemen of uitleggen', 'Zoom (jurk of rok)',
      'Mouwen inkorten', 'Scheur of gat repareren', 'Knopen of drukkers', 'Voering vervangen',
      'Carnavalspak aanpassen', 'Iets anders',
    ],
  },

  /* ---------- Workshops ---------- */
  /* bezet = aantal plekken dat al vergeven is. Vol? Dan kun je die datum niet kiezen. */
  workshops: [
    {
      id: 'haken-start',
      type: 'haken',
      titel: 'Leren haken: de basis',
      tekst: 'Je eerste steken, een ring, toeren tellen en een patroon leren lezen. Je gaat naar huis met een klein werkstuk en een kaart met alle steken.',
      niveau: 'Beginner',
      duur: '3 uur',
      prijs: 35,
      inbegrepen: 'Garen, haaknaald, koffie en thee',
      max: 6,
      data: [
        { datum: '2026-11-14', tijd: '13:00 - 16:00', bezet: 4 },
        { datum: '2026-11-28', tijd: '13:00 - 16:00', bezet: 1 },
        { datum: '2026-12-12', tijd: '13:00 - 16:00', bezet: 6 },
      ],
    },
    {
      id: 'haak-tas',
      type: 'haken',
      titel: 'Haak je eigen tas',
      tekst: 'In twee middagen haak je een tas naar een patroon van Haakhuis, met tips die niet in het patroon staan.',
      niveau: 'Je kunt al haken',
      duur: '2 middagen van 3 uur',
      prijs: 65,
      inbegrepen: 'Patroon, garen en voering',
      max: 6,
      data: [
        { datum: '2026-11-21', tijd: '13:00 - 16:00', bezet: 2 },
        { datum: '2027-01-16', tijd: '13:00 - 16:00', bezet: 0 },
      ],
    },
    {
      id: 'naaien-start',
      type: 'naaien',
      titel: 'Naaimachine de baas',
      tekst: 'Draad inrijgen, spoel opwinden, rechte naden en een zoom. Je naait een kussenhoes en weet daarna precies wat je machine kan.',
      niveau: 'Beginner',
      duur: '3 uur',
      prijs: 40,
      inbegrepen: 'Stof, machine (of neem je eigen mee)',
      max: 4,
      data: [
        { datum: '2026-11-19', tijd: '19:00 - 22:00', bezet: 3 },
        { datum: '2026-12-03', tijd: '19:00 - 22:00', bezet: 0 },
      ],
    },
    {
      id: 'carnaval-pimpen',
      type: 'naaien',
      titel: 'Pimp je carnavalspak',
      tekst: 'Neem je oude pak mee en geef het een nieuw leven: applicaties, pailletten, kraag of kap erbij. Precies op tijd voor de Vastelaovend.',
      niveau: 'Voor iedereen',
      duur: '3 uur',
      prijs: 35,
      inbegrepen: 'Fournituren om mee te beginnen',
      max: 6,
      data: [
        { datum: '2027-01-09', tijd: '13:00 - 16:00', bezet: 0 },
        { datum: '2027-01-23', tijd: '13:00 - 16:00', bezet: 0 },
      ],
    },
  ],

  /* ---------- Carnaval ---------- */
  carnaval: {
    seizoenStart: '2026-11-11',
    carnaval: '2027-02-07',
    planning: [
      { datum: '2026-11-11', titel: 'Start van het seizoen', tekst: 'Vanaf nu kun je een pak op maat aanvragen.' },
      { datum: '2026-12-01', titel: 'Ontwerp en stof kiezen', tekst: 'Vraag je voor deze datum aan, dan is er nog volop keuze in stoffen.' },
      { datum: '2027-01-04', titel: 'Laatste aanvragen maatwerk', tekst: 'Daarna alleen nog aanpassen en losse verkoop.' },
      { datum: '2027-01-24', titel: 'Passen en afhalen', tekst: 'Je pak is klaar, je past het en neemt het mee.' },
      { datum: '2027-02-07', titel: 'Alaaf!', tekst: 'Carnaval 2027: 7, 8 en 9 februari.' },
    ],
    /* Losse verkoop: kant-en-klare stukken. foto = pad naar afbeelding (leeg = illustratie) */
    losseVerkoop: [
      { naam: 'Narrenkap', maat: 'One size', prijs: 25, kleur: 'magenta', foto: 'assets/img/gen/narrenkap.png' },
      { naam: 'Kinderjasje harlekijn', maat: '110 - 116', prijs: 45, kleur: 'blauw', foto: 'assets/img/gen/harlekijnjas.png' },
      { naam: 'Gehaakte kraag', maat: 'One size', prijs: 20, kleur: 'roze', foto: 'assets/img/gen/gehaakte-kraag.png' },
      { naam: 'Boerenkiel met applicatie', maat: 'M', prijs: 55, kleur: 'blauw', foto: 'assets/img/gen/boerenkiel.png' },
    ],
    /* Link naar de online pak-samensteller zodra die live staat (leeg = "binnenkort") */
    configurator: '',
  },

  /* ---------- Haakpatronen (ontwerpen van Haakhuis op Ravelry) ---------- */
  ravelryWinkel: 'https://www.ravelry.com/stores/doris-desiree-van-der-waals-designs',
  patronen: [
    { naam: 'Diamond Dress', soort: 'kleding', talen: 'NL', tekst: 'Zomerjurk met ruitenmotief, ontworpen voor Durable.',
      url: 'https://www.ravelry.com/patterns/library/diamond-dress-3', kleur: 'blauw' },
    { naam: 'Endless Times Cape Shawl', soort: 'omslagdoeken', talen: 'NL · EN', prijs: 4.95,
      tekst: 'Cape-omslagdoek uit een haak-samen-actie van zes weken.',
      url: 'https://www.ravelry.com/patterns/library/endless-times-cape-shawl-cal', kleur: 'paars' },
    { naam: 'CAL Cape Shawl', soort: 'omslagdoeken', talen: 'NL · EN', tekst: 'De eerste cape-omslagdoek, met clusters en V-steken.', url: '', kleur: 'roze' },
    { naam: 'Boho Ibiza Cardigan', soort: 'kleding', talen: 'NL · EN', tekst: 'Luchtig vest met boho-uitstraling.', url: '', kleur: 'zand' },
    { naam: 'Norwool Cable Sweater', soort: 'kleding', talen: 'NL · EN', tekst: 'Warme trui met kabels, voor de koude maanden.', url: '', kleur: 'blauw' },
    { naam: 'Whirl Top', soort: 'kleding', talen: 'NL · EN', tekst: 'Top in een kleurverloop van Scheepjes Whirl.', url: '', kleur: 'paars' },
    { naam: 'Strawberrie Top', soort: 'kleding', talen: 'NL · EN', tekst: 'Zomertop met frisse uitstraling.', url: '', kleur: 'roze' },
    { naam: 'Leilani Flower Shawl', soort: 'omslagdoeken', talen: 'NL · EN', tekst: 'Omslagdoek vol bloemmotieven.', url: '', kleur: 'zand' },
  ],

  /* ---------- Google-reviews ----------
     Korte stukjes uit echte Google-reviews (google.com/maps, Haakhuis Landgraaf).
     tag bepaalt op welke pagina een review ook los verschijnt: verstel, workshop, carnaval. */
  reviews: {
    score: 4.5,
    aantal: 44,
    url: 'https://www.google.com/maps?cid=18015221377923114563',
    items: [
      { tekst: 'Kwaliteit van reparatie en aanpas werk aan kleding is zeer goed.', naam: 'Google-review', tag: 'verstel' },
      { tekst: 'Mevrouw heeft mijn jurk binnen één dag perfect vermaakt.', naam: 'Google-review', tag: 'verstel' },
      { tekst: 'Doris heeft de jasjes voor ons team op maat gemaakt … snel gehandeld tegen een faire prijs.', naam: 'Niels D.', tag: 'carnaval' },
      { tekst: 'Wat begon met een pakketje brengen, groeide uit tot gezellige naailessen.', naam: 'Kelly K.', tag: 'workshop' },
    ],
  },

  /* ---------- Reacties van klanten (leeg laten = blok verborgen) ---------- */
  reacties: [
    // { naam: 'Anja uit Kerkrade', tekst: 'Mijn broek past weer als gegoten.' },
  ],
};
