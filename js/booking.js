/* ===================================================================
   Haakhuis · modules per pagina
   Verstel-agenda, workshops, carnaval-aanvraag, patronen.
   Er wordt niets online opgeslagen: elke aanvraag wordt een kant-en-klaar
   bericht dat de klant per mail (of later WhatsApp) naar Haakhuis stuurt.
   =================================================================== */
window.addEventListener('hh:ready', () => {
  const { C, ICON, fmt, parse, iso, today, euro, esc, msg } = HHUI;

  /* ---------- hulpfuncties ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const val = (form, name) => (form.elements[name]?.value || '').trim();

  function checkContact(form) {
    let ok = true;
    const naam = form.elements.naam, mail = form.elements.email, tel = form.elements.telefoon;
    const setErr = (el, bad) => { el.closest('.field').classList.toggle('has-error', bad); if (bad) ok = false; };
    setErr(naam, !naam.value.trim());
    const geen = !mail.value.trim() && !tel.value.trim();
    const mailFout = mail.value.trim() && !/^\S+@\S+\.\S+$/.test(mail.value.trim());
    setErr(mail, geen || mailFout);
    setErr(tel, geen);
    if (!ok) form.querySelector('.has-error input')?.focus();
    return ok;
  }
  const contactBlok = (form) => [
    `Naam: ${val(form, 'naam')}`,
    val(form, 'telefoon') && `Telefoon: ${val(form, 'telefoon')}`,
    val(form, 'email') && `E-mail: ${val(form, 'email')}`,
  ].filter(Boolean).join('\n');
  const contactFields = (extra = '') => `
    <div class="fields">
      <div class="field"><label for="f-naam-${extra}">Naam</label><input id="f-naam-${extra}" name="naam" autocomplete="name" required><span class="err">Vul je naam in</span></div>
      <div class="field"><label for="f-tel-${extra}">Telefoon</label><input id="f-tel-${extra}" name="telefoon" type="tel" autocomplete="tel" inputmode="tel"><span class="err">Vul een telefoonnummer of e-mail in</span></div>
      <div class="field full"><label for="f-mail-${extra}">E-mail</label><input id="f-mail-${extra}" name="email" type="email" autocomplete="email"><span class="err">Vul een geldig e-mailadres of telefoonnummer in</span></div>
    </div>`;

  /* ===================================================================
     KALENDER (verstelwerk)
     =================================================================== */
  function slotsFor(d) {
    const v = C.verstelwerk, k = iso(d);
    if (v.gesloten.includes(k)) return [];
    if (v.extra[k]) return v.extra[k];
    return v.rooster[d.getDay()] || [];
  }
  function bounds() {
    const min = today(); min.setDate(min.getDate() + C.verstelwerk.minDagenVooruit);
    const max = today(); max.setDate(max.getDate() + C.verstelwerk.vooruitWeken * 7);
    return { min, max };
  }

  function calendar(el, onPick) {
    const { min, max } = bounds();
    let view = new Date(min.getFullYear(), min.getMonth(), 1), picked = null;
    function render() {
      const y = view.getFullYear(), m = view.getMonth();
      const first = new Date(y, m, 1), days = new Date(y, m + 1, 0).getDate();
      const offset = (first.getDay() + 6) % 7; // maandag eerst
      const prevOk = new Date(y, m, 0) >= new Date(min.getFullYear(), min.getMonth(), 0) && new Date(y, m, 1) > min;
      const nextOk = new Date(y, m + 1, 1) <= max;
      let cells = ['ma', 'di', 'wo', 'do', 'vr', 'za', 'zo'].map((d) => `<div class="cal-dow">${d}</div>`).join('');
      for (let i = 0; i < offset; i++) cells += '<div></div>';
      const t = today();
      for (let n = 1; n <= days; n++) {
        const d = new Date(y, m, n), k = iso(d);
        const open = d >= min && d <= max && slotsFor(d).length > 0;
        const cls = ['cal-day', open && 'is-open', picked === k && 'is-active', +d === +t && 'is-today'].filter(Boolean).join(' ');
        cells += open
          ? `<button type="button" class="${cls}" data-day="${k}" aria-label="${fmt.lang(d)}, ${slotsFor(d).length} tijden vrij" aria-pressed="${picked === k}">${n}</button>`
          : `<div class="${cls}" aria-hidden="true">${n}</div>`;
      }
      el.innerHTML = `
        <div class="cal-head"><b>${HHUI.MAANDEN[m]} ${y}</b>
          <div class="cal-nav"><button type="button" data-nav="-1" aria-label="Vorige maand" ${prevOk ? '' : 'disabled'}>‹</button><button type="button" data-nav="1" aria-label="Volgende maand" ${nextOk ? '' : 'disabled'}>›</button></div>
        </div>
        <div class="cal-grid">${cells}</div>
        <div class="cal-legend"><span><i></i> Verstel-dag</span><span><i class="off"></i> Geen verstel-dag</span></div>`;
    }
    el.addEventListener('click', (e) => {
      const nav = e.target.closest('[data-nav]');
      if (nav) { view.setMonth(view.getMonth() + Number(nav.dataset.nav)); render(); return; }
      const day = e.target.closest('[data-day]');
      if (day) { picked = day.dataset.day; render(); onPick(parse(picked)); el.querySelector(`[data-day="${picked}"]`)?.focus(); }
    });
    render();
    return { reset() { picked = null; render(); } };
  }

  /* ===================================================================
     VERSTELWERK
     =================================================================== */
  const vb = $('#verstelBooker');
  if (vb) {
    // zelfde module op twee plekken: verstelwerk (klussen) en contact (soort afspraak); beide gebruiken hetzelfde rooster
    const contact = vb.dataset.mode === 'contact';
    const state = { klussen: [], toelichting: '', dag: null, tijd: null };
    const form = $('#verstelForm');
    const soorten = $('#soorten');
    soorten.innerHTML = (contact ? C.afspraken.soorten : C.verstelwerk.soorten).map((s, i) => `<label class="chip"><input type="checkbox" name="klus" value="${esc(s)}" id="k${i}"><span>${esc(s)}</span></label>`).join('');

    const steps = $$('.bstep', vb), stepLis = $$('.stepper li', vb);
    let cur = 0;
    function go(i, scroll = true) {
      cur = i;
      steps.forEach((s, n) => s.classList.toggle('is-active', n === i));
      stepLis.forEach((li, n) => { li.classList.toggle('is-active', n === i); li.classList.toggle('is-done', n < i); li.querySelector('button').disabled = n > maxStep(); });
      if (scroll && window.innerWidth < 900) vb.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    const maxStep = () => (!state.klussen.length ? 0 : !state.tijd ? 1 : 3);
    stepLis.forEach((li, n) => li.querySelector('button').addEventListener('click', () => { if (n <= maxStep()) go(n); }));

    soorten.addEventListener('change', () => {
      state.klussen = $$('input:checked', soorten).map((i) => i.value);
      $('#toStep2').disabled = !state.klussen.length;
      update();
    });
    form.elements.toelichting.addEventListener('input', (e) => { state.toelichting = e.target.value.trim(); });
    $('#toStep2').addEventListener('click', () => go(1));

    const slotsEl = $('#slots');
    calendar($('#cal'), (d) => {
      state.dag = d; state.tijd = null;
      const s = slotsFor(d);
      $('#slotsTitle').textContent = `Tijden op ${fmt.lang(d)}`;
      slotsEl.innerHTML = s.map((t) => `<button type="button" class="slot" data-t="${t}">${t}</button>`).join('');
      $('#toStep3').disabled = true;
      update();
    });
    slotsEl.addEventListener('click', (e) => {
      const b = e.target.closest('.slot'); if (!b) return;
      state.tijd = b.dataset.t;
      $$('.slot', slotsEl).forEach((x) => x.classList.toggle('is-active', x === b));
      $('#toStep3').disabled = false;
      update();
    });
    $('#back1').addEventListener('click', () => go(0));
    $('#toStep3').addEventListener('click', () => go(2));
    $('#back2').addEventListener('click', () => go(1));
    $('#toStep4').addEventListener('click', () => { if (checkContact(form)) { go(3); update(); } });
    $('#back3').addEventListener('click', () => go(2));
    form.addEventListener('input', () => update());

    function build() {
      return {
        subject: `${contact ? 'Afspraak atelier' : 'Afspraak verstelwerk'} · ${fmt.kort(state.dag)} ${state.tijd}`,
        body: `Hallo Haakhuis,\n\nIk wil graag een afspraak maken${contact ? ' in het atelier' : ' voor verstelwerk'}.\n\n${contact ? 'Waarvoor' : 'Wat'}: ${state.klussen.join(', ')}${state.toelichting ? `\nToelichting: ${state.toelichting}` : ''}\nDatum: ${fmt.lang(state.dag)}\nTijd: ${state.tijd}\n\n${contactBlok(form)}\n\nKunnen jullie de afspraak bevestigen?\n\nGroetjes,\n${val(form, 'naam')}`,
      };
    }
    $('#sendVerstel').innerHTML = msg.buttons('verstel');
    msg.bind('verstel', build, () => { $('#verstelDone').classList.add('is-visible'); });
    HHUI.magnetic(vb);

    function update() {
      const v = (t) => t ? `<span class="v">${esc(t)}</span>` : '<span class="v empty">nog niet gekozen</span>';
      $('#sumList').innerHTML = `
        <li><span class="k">${contact ? 'Waarvoor' : 'Klus'}</span>${v(state.klussen.join(', '))}</li>
        <li><span class="k">Dag</span>${v(state.dag && fmt.lang(state.dag))}</li>
        <li><span class="k">Tijd</span>${v(state.tijd)}</li>
        <li><span class="k">Naam</span>${v(val(form, 'naam'))}</li>`;
      stepLis.forEach((li, n) => { li.querySelector('button').disabled = n > maxStep(); });
    }
    update(); go(0, false);
  }

  /* ===================================================================
     WORKSHOPS
     =================================================================== */
  const vrij = (w, d) => Math.max(0, w.max - d.bezet);
  const komende = (w) => w.data.filter((d) => parse(d.datum) >= today());
  function wsCard(w, compact = false) {
    const dates = komende(w);
    const first = dates.find((d) => vrij(w, d) > 0) || dates[0];
    const fd = first ? parse(first.datum) : null;
    return `<article class="ws-card" data-type="${w.type}" data-filter-item="${w.type}" id="${w.id}" data-reveal>
      <div class="ws-top">
        ${fd ? `<div class="ws-date" aria-hidden="true"><small>${fmt.maandKort(fd)}</small><b>${fd.getDate()}</b><span>${fmt.dagKort(fd)}</span></div>` : ''}
        <div class="ws-title"><span class="pill type-${w.type}">${w.type === 'haken' ? 'Haken' : 'Naaien'}</span><h3>${esc(w.titel)}</h3></div>
      </div>
      <p class="ws-text">${esc(w.tekst)}</p>
      <div class="ws-meta"><span class="pill">${ICON.klok.replace('<svg', '<svg width="14" height="14"')} ${esc(w.duur)}</span><span class="pill">${esc(w.niveau)}</span><span class="pill">${ICON.mensen.replace('<svg', '<svg width="14" height="14"')} max ${w.max}</span></div>
      ${compact ? '' : `<div>
        <p class="muted" style="font-size:13px;margin-bottom:8px">Kies een datum</p>
        <div class="ws-dates" role="radiogroup" aria-label="Data voor ${esc(w.titel)}">
          ${dates.map((d) => { const f = vrij(w, d), dd = parse(d.datum); return `<button type="button" class="date-chip ${f > 0 && f <= 2 ? 'is-low' : ''} ${d === first && f > 0 ? 'is-active' : ''}" role="radio" aria-checked="${d === first && f > 0}" data-ws="${w.id}" data-datum="${d.datum}" ${f === 0 ? 'disabled' : ''}>
              <b>${fmt.kort(dd)} · ${d.tijd.split(' ')[0]}</b>
              <span class="bar"><i style="width:${(d.bezet / w.max) * 100}%"></i></span>
              <span class="seats">${f === 0 ? 'Vol' : f === 1 ? 'Nog 1 plek' : `Nog ${f} plekken`}</span>
            </button>`; }).join('') || '<span class="muted">Nieuwe data volgen snel.</span>'}
        </div>
      </div>`}
      <div class="ws-foot">
        <span class="price">${euro(w.prijs)}<small>p.p. · betalen in het atelier</small></span>
        ${compact ? `<a class="btn btn-sm" href="workshops.html#${w.id}">Bekijk data <i>→</i></a>`
          : `<button class="btn btn-sm magnetic" data-inschrijven="${w.id}" ${dates.some((d) => vrij(w, d) > 0) ? '' : 'disabled'}>Plek reserveren <i>→</i></button>`}
      </div>
      ${w.inbegrepen && !compact ? `<p class="muted" style="font-size:12.5px;margin-top:-4px">Inbegrepen: ${esc(w.inbegrepen)}</p>` : ''}
    </article>`;
  }

  /* home: de eerstvolgende twee */
  const wsPreview = $('#wsPreview');
  if (wsPreview) {
    const next = C.workshops.filter((w) => komende(w).length)
      .sort((a, b) => parse(komende(a)[0].datum) - parse(komende(b)[0].datum)).slice(0, 2);
    wsPreview.innerHTML = next.map((w) => wsCard(w, true)).join('');
    HHUI.reveal(wsPreview);
  }

  const wsList = $('#wsList');
  if (wsList) {
    const ws = C.workshops.filter((w) => komende(w).length);
    const count = (t) => ws.filter((w) => t === 'alles' || w.type === t).length;
    $('#wsTabs').innerHTML = ['alles', 'haken', 'naaien'].map((t, i) => `<button type="button" role="tab" data-filter="${t}" aria-selected="${i === 0}">${t[0].toUpperCase() + t.slice(1)}<span class="count">${count(t)}</span></button>`).join('');
    wsList.innerHTML = ws.map((w) => wsCard(w)).join('');
    HHUI.tabs(); HHUI.reveal(wsList); HHUI.magnetic(wsList);

    const chosen = {};
    ws.forEach((w) => { const f = komende(w).find((d) => vrij(w, d) > 0); if (f) chosen[w.id] = f.datum; });
    wsList.addEventListener('click', (e) => {
      const chip = e.target.closest('.date-chip');
      if (chip && !chip.disabled) {
        chosen[chip.dataset.ws] = chip.dataset.datum;
        $$(`.date-chip[data-ws="${chip.dataset.ws}"]`).forEach((c) => { c.classList.toggle('is-active', c === chip); c.setAttribute('aria-checked', c === chip); });
      }
      const btn = e.target.closest('[data-inschrijven]');
      if (btn) openModal(ws.find((w) => w.id === btn.dataset.inschrijven), chosen[btn.dataset.inschrijven]);
    });

    /* modal */
    const modal = $('#wsModal'), box = $('.modal-box', modal);
    let lastFocus = null, aantal = 1, current = null, datum = null;
    function openModal(w, dKey) {
      current = w; datum = w.data.find((d) => d.datum === dKey); aantal = 1;
      const dd = parse(datum.datum), max = vrij(w, datum);
      box.innerHTML = `
        <button class="modal-close" type="button" aria-label="Sluiten">×</button>
        <span class="eyebrow">Plek reserveren</span>
        <h3 id="wsModalTitle">${esc(w.titel)}</h3>
        <div class="modal-sum">
          <div class="ws-date"><small>${fmt.maandKort(dd)}</small><b>${dd.getDate()}</b><span>${fmt.dagKort(dd)}</span></div>
          <div><b>${fmt.lang(dd)}</b><span class="muted">${esc(datum.tijd)} · nog ${max} ${max === 1 ? 'plek' : 'plekken'}</span></div>
        </div>
        <form id="wsForm" novalidate>
          <div class="field" style="margin-bottom:16px"><label>Aantal personen</label>
            <div class="qty"><button type="button" data-q="-1" aria-label="Minder">−</button><output id="qtyOut">1</output><button type="button" data-q="1" aria-label="Meer">+</button></div>
          </div>
          ${contactFields('ws')}
          <div class="field full" style="margin-top:14px"><label for="f-opm-ws">Opmerking <small>(optioneel)</small></label><textarea id="f-opm-ws" name="opmerking" rows="2" placeholder="Bijvoorbeeld: ik neem mijn eigen naaimachine mee"></textarea></div>
          <div class="modal-total"><span class="muted">Totaal</span><span class="price" id="wsTotal">${euro(w.prijs)}</span></div>
          <p class="muted" style="font-size:13px;margin-bottom:16px">We bevestigen je plek. Betalen gaat daarna via een betaalverzoek per mail of WhatsApp, of in het atelier.</p>
          <div class="send-box" id="wsSend">${msg.buttons('ws')}</div>
          <div class="done-msg" id="wsDone"><div class="check">${ICON.check}</div><b>Bijna klaar</b><p class="muted">Druk in je mail nog op versturen. We laten je weten of je plek vaststaat.</p></div>
        </form>`;
      const f = $('#wsForm', box);
      const setQty = (n) => {
        aantal = Math.min(max, Math.max(1, n));
        $('#qtyOut', box).textContent = aantal;
        $('#wsTotal', box).textContent = euro(w.prijs * aantal);
        $('[data-q="-1"]', box).disabled = aantal <= 1;
        $('[data-q="1"]', box).disabled = aantal >= max;
      };
      box.onclick = (e) => { const q = e.target.closest('[data-q]'); if (q) setQty(aantal + Number(q.dataset.q)); };
      setQty(1);
      msg.bind('ws', () => {
        if (!checkContact(f)) return null;
        return {
          subject: `Inschrijving workshop · ${w.titel} · ${fmt.kort(dd)}`,
          body: `Hallo Haakhuis,\n\nIk wil me graag inschrijven voor een workshop.\n\nWorkshop: ${w.titel}\nDatum: ${fmt.lang(dd)}, ${datum.tijd}\nAantal personen: ${aantal}\nTotaal: ${euro(w.prijs * aantal)}${val(f, 'opmerking') ? `\nOpmerking: ${val(f, 'opmerking')}` : ''}\n\n${contactBlok(f)}\n\nHoor graag of er plek is.\n\nGroetjes,\n${val(f, 'naam')}`,
        };
      }, () => $('#wsDone', box).classList.add('is-visible'));
      $('.modal-close', box).addEventListener('click', closeModal);
      lastFocus = document.activeElement;
      modal.classList.add('is-open'); modal.setAttribute('aria-hidden', 'false'); document.body.classList.add('has-modal');
      setTimeout(() => $('input[name="naam"]', box).focus(), 80);
    }
    function closeModal() {
      modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true'); document.body.classList.remove('has-modal');
      lastFocus && lastFocus.focus();
    }
    $('.modal-bg', modal).addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('is-open')) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'Tab') { // focus binnen de modal houden
        const f = $$('button, input, textarea, a[href]', box).filter((x) => !x.disabled && x.offsetParent);
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f.at(-1).focus(); }
        else if (!e.shiftKey && document.activeElement === f.at(-1)) { e.preventDefault(); f[0].focus(); }
      }
    });
  }

  /* ===================================================================
     CARNAVAL
     =================================================================== */
  const tl = $('#timeline');
  if (tl) {
    const items = C.carnaval.planning, t = today();
    const nextIdx = items.findIndex((p) => parse(p.datum) >= t);
    tl.innerHTML = items.map((p, i) => `<div class="tl-item ${parse(p.datum) < t ? 'is-past' : ''} ${i === nextIdx ? 'is-next' : ''}" data-reveal>
      <small>${fmt.dagMaand(parse(p.datum))}</small><h4>${esc(p.titel)}</h4><p>${esc(p.tekst)}</p></div>`).join('');
    const pct = nextIdx <= 0 ? (nextIdx === -1 ? 100 : 0) : ((nextIdx - .5) / (items.length - 1)) * 100;
    tl.style.setProperty('--progress', pct + '%');
    HHUI.reveal(tl);
  }

  const prod = $('#products');
  if (prod) {
    const iconFor = (n) => /kap/i.test(n) ? ICON.carnaval : /kraag/i.test(n) ? ICON.kraag : /kiel|trui/i.test(n) ? ICON.trui : ICON.jas;
    prod.innerHTML = C.carnaval.losseVerkoop.map((p, i) => `<article class="product c-${p.kleur}" data-reveal>
      <div class="thumb">${p.foto ? `<img src="${esc(p.foto)}" alt="${esc(p.naam)}" loading="lazy">` : iconFor(p.naam)}</div>
      <h4>${esc(p.naam)}</h4>
      <div class="meta"><span>Maat ${esc(p.maat)}</span><b>${euro(p.prijs)}</b></div>
      <a class="btn btn-sm btn-ghost" href="#" data-interesse="${i}">Reserveren om te passen</a>
    </article>`).join('');
    prod.addEventListener('click', (e) => {
      const a = e.target.closest('[data-interesse]'); if (!a) return;
      const p = C.carnaval.losseVerkoop[a.dataset.interesse];
      a.href = msg.mailto(`Interesse: ${p.naam}`, `Hallo Haakhuis,\n\nIk wil graag de ${p.naam} (maat ${p.maat}, ${euro(p.prijs)}) reserveren om te passen in het atelier. Is die nog beschikbaar?\n\nGroetjes,\n`);
    });
    HHUI.reveal(prod);
  }

  const cf = $('#carnavalForm');
  if (cf) {
    cf.querySelector('[data-contact]').innerHTML = contactFields('cv');
    $('#cvSend').innerHTML = msg.buttons('cv');
    msg.bind('cv', () => {
      const voor = $$('input[name="voor"]:checked', cf).map((i) => i.value);
      const wat = $$('input[name="wat"]:checked', cf).map((i) => i.value);
      if (!voor.length || !wat.length) { HHUI.toast('Kies voor wie en wat je zoekt'); cf.querySelector('fieldset').scrollIntoView({ behavior: 'smooth', block: 'center' }); return null; }
      if (!checkContact(cf)) return null;
      return {
        subject: `Aanvraag carnavalskleding op maat · ${wat.join(', ')}`,
        body: `Hallo Haakhuis,\n\nIk wil graag carnavalskleding op maat laten maken.\n\nVoor: ${voor.join(', ')}\nWat: ${wat.join(', ')}\nAantal: ${val(cf, 'aantal') || '1'}\nKlaar voor: ${val(cf, 'klaar') ? fmt.lang(parse(val(cf, 'klaar'))) : 'carnaval 2027'}${val(cf, 'idee') ? `\n\nMijn idee:\n${val(cf, 'idee')}` : ''}\n\n${contactBlok(cf)}\n\nGroetjes,\n${val(cf, 'naam')}`,
      };
    }, () => $('#cvDone').classList.add('is-visible'));
    const klaar = cf.elements.klaar; klaar.min = iso(today()); klaar.max = C.carnaval.carnaval;
  }

  const teaserBtn = $('#configBtn');
  if (teaserBtn) {
    if (C.carnaval.configurator) { teaserBtn.href = C.carnaval.configurator; teaserBtn.innerHTML = 'Stel je pak samen <i>→</i>'; }
    else teaserBtn.href = msg.mailto('Hou me op de hoogte: pak samenstellen', 'Hallo Haakhuis,\n\nLaten jullie het weten zodra ik mijn carnavalspak online kan samenstellen?\n\nGroetjes,\n');
  }

  /* ===================================================================
     GOOGLE-REVIEWS
     =================================================================== */
  const R = C.reviews;
  const stars = (n) => '★★★★★'.slice(0, Math.round(n));
  const revCard = (r) => `<figure class="review" data-reveal><span class="review-stars" aria-label="5 sterren">★★★★★</span><blockquote>“${esc(r.tekst)}”</blockquote><figcaption><span class="g-dot" aria-hidden="true">G</span>${esc(r.naam)}</figcaption></figure>`;
  const revWrap = $('#reviews');
  if (R && revWrap) {
    revWrap.innerHTML = `<div class="rev-score" data-reveal><b>${String(R.score).replace('.', ',')}</b><span class="review-stars big" aria-hidden="true">${stars(R.score)}</span><p>Gemiddeld uit ${R.aantal} reviews op Google</p><a class="link-arrow" href="${R.url}" target="_blank" rel="noopener">Lees alle reviews <i>↗</i></a></div><div class="rev-grid">${R.items.map(revCard).join('')}</div>`;
    HHUI.reveal(revWrap);
  }
  document.querySelectorAll('[data-reviews]').forEach((el) => {
    const list = R ? R.items.filter((r) => r.tag === el.dataset.reviews) : [];
    if (!list.length) { el.remove(); return; }
    el.innerHTML = `<div class="rev-strip"><div class="rev-mini"><b>${String(R.score).replace('.', ',')} ★</b><span>${R.aantal} Google-reviews</span></div>${list.map(revCard).join('')}</div>`;
    HHUI.reveal(el);
  });

  /* ===================================================================
     HAAKPATRONEN
     =================================================================== */
  const pg = $('#patterns');
  if (pg) {
    const iconFor = (s) => ({ tassen: ICON.tas, kleding: ICON.jurk, omslagdoeken: ICON.omslagdoek }[s] || ICON.haak);
    const nice = { tassen: 'Tassen', kleding: 'Kleding', omslagdoeken: 'Omslagdoeken' };
    const lijst = C.patronen;
    const cats = ['alles', ...new Set(lijst.map((p) => p.soort))];
    $('#patTabs').innerHTML = cats.map((c, i) => `<button type="button" role="tab" data-filter="${c}" aria-selected="${i === 0}">${c === 'alles' ? 'Alles' : nice[c] || c}<span class="count">${c === 'alles' ? lijst.length : lijst.filter((p) => p.soort === c).length}</span></button>`).join('');
    pg.innerHTML = lijst.map((p) => `<article class="pattern c-${p.kleur}" data-filter-item="${p.soort}" data-reveal>
      <div class="cover">${/trui|sweater|jumper|cardigan/i.test(p.naam) ? ICON.trui : iconFor(p.soort)}<span class="pill">${nice[p.soort] || p.soort}</span></div>
      <div class="body">
        <span class="lang">${esc(p.talen)}</span>
        <h3>${esc(p.naam)}</h3>
        <p>${esc(p.tekst)}</p>
        <div class="foot">
          ${p.prijs ? `<span class="price" style="font-size:19px">${euro(p.prijs)}</span>` : '<span class="muted" style="font-size:13px">Prijs op Ravelry</span>'}
          <a class="link-arrow" href="${p.url || C.socials.ravelry}" target="_blank" rel="noopener">Ravelry <i>↗</i></a>
        </div>
      </div>
    </article>`).join('');
    HHUI.tabs(); HHUI.reveal(pg);
  }
});
