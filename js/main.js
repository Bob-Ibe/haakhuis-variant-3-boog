/* ===================================================================
   Haakhuis · gedeelde onderdelen
   Header, footer, menu, iconen, reveal, tellers, countdown,
   tabs en de berichten-helpers (mail / WhatsApp / kopiëren).
   =================================================================== */
const HHUI = (() => {
  const C = window.HH;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- iconen (lijn, currentColor) ---------- */
  const svg = (d, vb = 48, sw = 2.6) => `<svg viewBox="0 0 ${vb} ${vb}" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${d}</svg>`;
  const ICON = {
    haak: svg('<circle cx="20" cy="29" r="13"/><path d="M8.5 23.5c6 2.5 15 2 23-3.5M7.5 31.5c8 1.5 17-.5 24.5-6.5M13 40c5-6.5 13-10.5 19.5-11"/><path d="M30 19 41.5 6"/><path d="M41.5 6c1.6-1.7 4 .4 2.3 2.1l-1.6 1.2"/>'),
    carnaval: svg('<path d="M9 35c0-9-2-15-4-19 7 2 12 6 14 12 1-8 3-15 5-20 2 5 4 12 5 20 2-6 7-10 14-12-2 4-4 10-4 19"/><path d="M9 35h30v6H9z"/><circle cx="5" cy="13.5" r="2.6"/><circle cx="24" cy="5.5" r="2.6"/><circle cx="43" cy="13.5" r="2.6"/><path d="M16 38h.01M24 38h.01M32 38h.01"/>'),
    verstel: svg('<circle cx="12" cy="36" r="5.5"/><circle cx="27" cy="36" r="5.5"/><path d="M15.5 31.5 31 8M23.5 31.5 8 8"/><path d="M41 6v34"/><ellipse cx="41" cy="10" rx="1.2" ry="3"/><path d="M41 13c-4 3-5 8-2 12s2 9-3 12"/>'),
    workshop: svg('<path d="M5 41h38"/><path d="M36 41V17a6 6 0 0 0-6-6H15a6 6 0 0 0-6 6v6h7"/><path d="M12.5 23v7"/><path d="M10 34h6"/><circle cx="27" cy="22" r="4"/><path d="M22 11V6"/><circle cx="22" cy="5" r="2"/>'),
    tas: svg('<circle cx="24" cy="29" r="14"/><circle cx="24" cy="29" r="7"/><path d="M15 18.5C15 11 19 6 24 6s9 5 9 12.5"/>'),
    jurk: svg('<path d="M18 6l-2 8 4 4-9 24h26l-9-24 4-4-2-8"/><path d="M18 6c2 3.5 10 3.5 12 0"/><path d="M15 32l4-4 5 5 5-5 4 4"/>'),
    omslagdoek: svg('<path d="M5 12h38L24 43z"/><path d="M12 19h24M17 26.5h14M21 34h6"/>'),
    trui: svg('<path d="M17 7 6 13l4 10 4-2v20h20V21l4 2 4-10-11-6c-1 3-4 5-7 5s-6-2-7-5z"/><path d="M14 35h20"/>'),
    jas: svg('<path d="M17 7 6 13l4 10 4-2v20h20V21l4 2 4-10-11-6c-1 3-4 5-7 5s-6-2-7-5z"/><path d="M24 12v29"/><path d="M21 20h.01M21 27h.01M21 34h.01"/>'),
    kraag: svg('<path d="M8 14c4 11 10 15 16 15s12-4 16-15"/><path d="M8 14c-2 7 0 13 7 17M40 14c2 7 0 13-7 17"/><circle cx="24" cy="34" r="3"/>'),
    mail: svg('<rect x="5" y="10" width="38" height="28" rx="5"/><path d="m7 13 17 13 17-13"/>', 48, 2.8),
    tel: svg('<path d="M14 6h-4a4 4 0 0 0-4 4c0 18 14 32 32 32a4 4 0 0 0 4-4v-4l-9-4-4 4c-5-2-9-6-11-11l4-4z"/>', 48, 2.8),
    pin: svg('<path d="M24 43s14-12 14-24a14 14 0 0 0-28 0c0 12 14 24 14 24z"/><circle cx="24" cy="19" r="5"/>', 48, 2.8),
    klok: svg('<circle cx="24" cy="24" r="18"/><path d="M24 14v10l7 5"/>', 48, 2.8),
    kalender: svg('<rect x="6" y="9" width="36" height="32" rx="5"/><path d="M6 19h36M16 5v8M32 5v8"/>', 48, 2.8),
    euro: svg('<path d="M35 13a13 13 0 1 0 0 22"/><path d="M8 21h20M8 28h18"/>', 48, 2.8),
    mensen: svg('<circle cx="18" cy="16" r="6"/><path d="M6 40c0-7 5-12 12-12s12 5 12 12"/><circle cx="34" cy="17" r="5"/><path d="M33 28c6 0 10 5 10 11"/>', 48, 2.8),
    wereld: svg('<circle cx="24" cy="24" r="18"/><path d="M6 24h36M24 6c6 6 6 30 0 36M24 6c-6 6-6 30 0 36"/>', 48, 2.8),
    check: svg('<path d="m10 25 9 9 19-20"/>', 48, 3.4),
    schaar: svg('<circle cx="12" cy="36" r="5.5"/><circle cx="27" cy="36" r="5.5"/><path d="M15.5 31.5 31 8M23.5 31.5 8 8"/>', 48, 2.8),
    naald: svg('<path d="M10 40 38 8"/><ellipse cx="36" cy="10" rx="1.4" ry="3.4" transform="rotate(41 36 10)"/><path d="M34 14c-8 4-14 2-18 8s-2 12-8 14"/>', 48, 2.8),
    rits: svg('<path d="M24 4v40"/><path d="M19 9h10M19 15h10M19 21h10"/><rect x="19" y="26" width="10" height="12" rx="3"/>', 48, 2.8),
    knoop: svg('<circle cx="24" cy="24" r="17"/><circle cx="19" cy="19" r="2"/><circle cx="29" cy="19" r="2"/><circle cx="19" cy="29" r="2"/><circle cx="29" cy="29" r="2"/>', 48, 2.8),
    whatsapp: svg('<path d="M8 40l2.5-8.5A17 17 0 1 1 17 38z"/><path d="M18 17c0 7 6 13 13 13l2.5-3-4-2-2 1.5c-2-1-4-3-5-5l1.5-2-2-4z"/>', 48, 2.6),
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.5-1.5h1.6V4.4c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 3.9v2.3H7.9v3h2.6V21z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6" fill="currentColor"/></svg>',
    ravelry: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M9.5 17V7.5h3.2a2.6 2.6 0 0 1 0 5.2H9.5m3.2 0L15 17"/></svg>',
  };

  /* ---------- datums ---------- */
  const DAGEN = ['zondag', 'maandag', 'dinsdag', 'woensdag', 'donderdag', 'vrijdag', 'zaterdag'];
  const MAANDEN = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];
  const parse = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
  const iso = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  const today = () => { const t = new Date(); t.setHours(0, 0, 0, 0); return t; };
  const fmt = {
    lang: (d) => `${DAGEN[d.getDay()]} ${d.getDate()} ${MAANDEN[d.getMonth()]} ${d.getFullYear()}`,
    kort: (d) => `${DAGEN[d.getDay()].slice(0, 2)} ${d.getDate()} ${MAANDEN[d.getMonth()].slice(0, 3)}`,
    dagMaand: (d) => `${d.getDate()} ${MAANDEN[d.getMonth()]}`,
    maandKort: (d) => MAANDEN[d.getMonth()].slice(0, 3),
    dagKort: (d) => DAGEN[d.getDay()].slice(0, 2),
  };
  const euro = (n) => '€ ' + (Number.isInteger(n) ? n : n.toFixed(2).replace('.', ','));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- berichten naar Haakhuis ---------- */
  const msg = {
    mailto(subject, body) {
      return `mailto:${C.bedrijf.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    },
    wa(body) { return `https://wa.me/${C.bedrijf.telIntl}?text=${encodeURIComponent(body)}`; },
    async copy(text) {
      try { await navigator.clipboard.writeText(text); toast('Bericht gekopieerd'); }
      catch { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); toast('Bericht gekopieerd'); }
    },
    /* knoppen die een bericht versturen; geeft HTML terug */
    buttons(id) {
      return `<a class="btn btn-block magnetic" data-send="mail" data-for="${id}" href="#">${ICON.mail.replace('<svg', '<svg width="18" height="18"')} Verstuur per mail <i>→</i></a>
        ${C.whatsapp ? `<a class="btn btn-wa btn-block" data-send="wa" data-for="${id}" href="#" target="_blank" rel="noopener">${ICON.whatsapp.replace('<svg', '<svg width="18" height="18"')} Verstuur via WhatsApp</a>` : ''}
        <button class="copy-btn" type="button" data-send="copy" data-for="${id}">Geen mailprogramma? Kopieer het bericht</button>`;
    },
    /* koppel de knoppen aan een functie die {subject, body} teruggeeft */
    bind(id, build, onSent) {
      document.querySelectorAll(`[data-for="${id}"]`).forEach((el) => {
        el.addEventListener('click', (e) => {
          const m = build();
          if (!m) { e.preventDefault(); return; }
          if (el.dataset.send === 'mail') { el.href = msg.mailto(m.subject, m.body); onSent && onSent('mail'); }
          else if (el.dataset.send === 'wa') { el.href = msg.wa(m.body); onSent && onSent('wa'); }
          else { e.preventDefault(); msg.copy(`Aan: ${C.bedrijf.email}\nOnderwerp: ${m.subject}\n\n${m.body}`); onSent && onSent('copy'); }
        });
      });
    },
  };

  /* ---------- toast ---------- */
  let toastEl, toastT;
  function toast(text) {
    if (!toastEl) { toastEl = document.createElement('div'); toastEl.className = 'toast'; toastEl.setAttribute('role', 'status'); document.body.appendChild(toastEl); }
    toastEl.textContent = text; toastEl.classList.add('is-visible');
    clearTimeout(toastT); toastT = setTimeout(() => toastEl.classList.remove('is-visible'), 2600);
  }

  /* ---------- header, menu, footer ---------- */
  const NAV = [
    { href: 'haakpatronen.html', id: 'haakpatronen', label: 'Haakpatronen', sub: 'Eigen ontwerpen', cls: 'p-haak', c: '#c493b4' },
    { href: 'carnaval.html', id: 'carnaval', label: 'Carnaval', sub: 'Op maat en losse verkoop', cls: 'p-carnaval', c: '#ED0BF0' },
    { href: 'verstelwerk.html', id: 'verstelwerk', label: 'Verstelwerk', sub: 'Kies een dag en tijd', cls: 'p-verstel', c: '#2b5c94' },
    { href: 'workshops.html', id: 'workshops', label: 'Workshops', sub: 'Haken en naaien', cls: 'p-workshop', c: '#B98BAB' },
  ];

  /* klein bolletje wol: draden die bij hover horizontaal en verticaal doorlopen */
  function yarnBall() {
    const v = [-10, -5, 0, 5, 10, 15, 20, 25].map((x) => `<path d="M${x} -2 Q${x + 4} 10 ${x} 22"/>`).join('');
    const h = [-10, -5, 0, 5, 10, 15, 20, 25].map((y) => `<path d="M-2 ${y} Q10 ${y + 3.5} 22 ${y}"/>`).join('');
    return `<span class="yarn-dot" aria-hidden="true"><svg viewBox="0 0 20 20"><g class="yb-v">${v}</g><g class="yb-h">${h}</g><path class="yb-tail" d="M15 17 q4 2 6 0"/></svg></span>`;
  }

  function chrome() {
    const page = document.body.dataset.page;
    const b = C.bedrijf;
    const home = page === 'home' ? '' : 'index.html';

    if (C.concept) {
      const bar = document.createElement('div');
      bar.className = 'concept-bar';
      bar.innerHTML = '<b>Conceptversie</b> · workshops, data en prijzen zijn voorbeelden';
      document.body.prepend(bar);
    }

    const head = document.querySelector('[data-site-head]');
    if (head) {
      head.className = 'site-head';
      head.innerHTML = `
        <a class="brand" href="index.html">
          <img src="assets/img/haakhuis-logo.png" alt="" width="40" height="40">
          <span><b>haakhuis</b><small>${b.ondertitel} · ${b.plaats}</small></span>
        </a>
        <nav class="main-nav" aria-label="Hoofdmenu">
          ${NAV.map((n) => `<a href="${n.href}" style="--c:${n.c}" ${page === n.id ? 'aria-current="page"' : ''}>${yarnBall()}${n.label}</a>`).join('')}
          <a href="${home}#contact">Contact</a>
        </nav>
        <a class="btn btn-sm head-cta magnetic" href="verstelwerk.html#boeken">Afspraak maken <i>→</i></a>
        <button class="menu-btn" aria-label="Menu openen" aria-expanded="false" aria-controls="mobileMenu"><span></span><span></span><span></span></button>`;

      const mm = document.createElement('div');
      mm.className = 'mobile-menu'; mm.id = 'mobileMenu';
      mm.innerHTML = `${NAV.map((n) => `<a class="mm-link" href="${n.href}"><span class="mm-hoop ${n.cls}"></span><span>${n.label}<small>${n.sub}</small></span></a>`).join('')}
        <a class="mm-link" href="${home}#contact"><span class="mm-hoop" style="--pattern:#fff"></span><span>Contact<small>${b.straat}, ${b.plaats}</small></span></a>
        <a class="btn btn-block" href="verstelwerk.html#boeken">Afspraak maken <i>→</i></a>`;
      head.after(mm);
      const btn = head.querySelector('.menu-btn');
      const toggle = (open) => {
        if (open) mm.style.top = head.getBoundingClientRect().bottom + 'px';
        document.body.classList.toggle('menu-open', open);
        btn.setAttribute('aria-expanded', open);
        btn.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
      };
      btn.addEventListener('click', () => toggle(!document.body.classList.contains('menu-open')));
      mm.addEventListener('click', (e) => { if (e.target.closest('a')) toggle(false); });
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') toggle(false); });
    }

    const foot = document.querySelector('[data-site-foot]');
    if (foot) {
      const s = C.socials;
      foot.className = 'site-foot';
      foot.innerHTML = `
        <div class="wrap">
          <div class="foot-grid">
            <div>
              <div class="foot-brand"><img src="assets/img/haakhuis-logo.png" alt=""><b>haakhuis</b></div>
              <p>Haakpatronen, carnavalskleding op maat, verstelwerk en workshops. Alles met draad, onder één dak in ${b.plaats}.</p>
              <div class="socials">
                ${s.facebook ? `<a href="${s.facebook}" target="_blank" rel="noopener" aria-label="Haakhuis op Facebook">${ICON.facebook}</a>` : ''}
                ${s.instagram ? `<a href="${s.instagram}" target="_blank" rel="noopener" aria-label="Haakhuis op Instagram">${ICON.instagram}</a>` : ''}
                ${s.ravelry ? `<a href="${s.ravelry}" target="_blank" rel="noopener" aria-label="Haakhuis-patronen op Ravelry">${ICON.ravelry}</a>` : ''}
              </div>
            </div>
            <div>
              <h4>Haakhuis</h4>
              <ul>${NAV.map((n) => `<li><a href="${n.href}">${n.label}</a></li>`).join('')}</ul>
            </div>
            <div>
              <h4>Contact</h4>
              <ul>
                <li><a href="mailto:${b.email}">${b.email}</a></li>
                <li><a href="tel:+${b.telIntl}">${b.tel}</a></li>
                <li>${b.straat}<br>${b.postcode} ${b.plaats}</li>
              </ul>
            </div>
            <div>
              <h4>Bezoek</h4>
              <ul>
                <li>${b.openingstijden}</li>
                <li><a href="verstelwerk.html#boeken">Afspraak verstelwerk</a></li>
                <li><a href="workshops.html">Workshop boeken</a></li>
              </ul>
            </div>
          </div>
          <div class="foot-bottom"><span>© ${new Date().getFullYear()} Haakhuis · ${b.plaats}</span><span>Website door IBE MOTION</span></div>
        </div>`;
    }

    /* mobiele actiebalk */
    const bar = document.createElement('div');
    bar.className = 'mobile-bar';
    const cta = page === 'workshops' ? '<a class="btn" href="#agenda">Kies een datum</a>'
      : page === 'carnaval' ? '<a class="btn" href="#aanvraag">Pak aanvragen</a>'
      : page === 'haakpatronen' ? `<a class="btn" href="${C.ravelryWinkel}" target="_blank" rel="noopener">Naar Ravelry</a>`
      : `<a class="btn" href="${page === 'verstelwerk' ? '' : 'verstelwerk.html'}#boeken">Afspraak maken</a>`;
    bar.innerHTML = `${cta}<a class="btn btn-ghost" href="mailto:${b.email}">Mail ons</a>`;
    document.body.appendChild(bar);
    window.addEventListener('scroll', () => { bar.classList.toggle('is-visible', window.scrollY > 420); }, { passive: true });
  }

  /* ---------- micro-interacties (v2, zonder GSAP) ---------- */
  function magnetic(root = document) {
    if (!fine || reduced) return;
    root.querySelectorAll('.magnetic').forEach((btn) => {
      if (btn.dataset.mag) return; btn.dataset.mag = 1;
      btn.addEventListener('pointermove', (e) => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px, ${(e.clientY - r.top - r.height / 2) * .25}px)`;
      });
      btn.addEventListener('pointerleave', () => { btn.style.transform = ''; });
    });
  }

  function reveal(root = document) {
    const els = root.querySelectorAll('[data-reveal]:not(.is-in)');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } });
    }, { rootMargin: '0px 0px -6% 0px', threshold: .06 });
    els.forEach((e, i) => { e.style.transitionDelay = `${(i % 4) * 70}ms`; io.observe(e); });
  }

  /* cijfers die optellen: <b data-count="19987" data-prefix="±"> */
  function counters() {
    const els = document.querySelectorAll('[data-count]');
    const run = (el) => {
      const end = parseFloat(el.dataset.count), dec = (el.dataset.count.split('.')[1] || '').length;
      const pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
      const show = (v) => { el.textContent = pre + v.toLocaleString('nl-NL', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf; };
      if (reduced) return show(end);
      const t0 = performance.now(), dur = 1600;
      (function tick(t) { const p = Math.min(1, (t - t0) / dur); show(end * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); })(t0);
    };
    const io = new IntersectionObserver((en) => en.forEach((x) => { if (x.isIntersecting) { run(x.target); io.unobserve(x.target); } }), { threshold: .5 });
    els.forEach((e) => io.observe(e));
  }

  /* <div data-countdown="2026-11-11"> met b[data-u="d|h|m|s"] */
  function countdowns() {
    document.querySelectorAll('[data-countdown]').forEach((el) => {
      const target = parse(el.dataset.countdown);
      const set = (u, v) => { const b = el.querySelector(`[data-u="${u}"]`); if (b) b.textContent = String(v).padStart(2, '0'); };
      const tick = () => {
        let s = Math.max(0, Math.floor((target - new Date()) / 1000));
        set('d', Math.floor(s / 86400)); s %= 86400;
        set('h', Math.floor(s / 3600)); s %= 3600;
        set('m', Math.floor(s / 60)); set('s', s % 60);
      };
      tick(); setInterval(tick, 1000);
    });
  }

  /* tabs die items filteren: <div class="tabs" data-tabs="naam"> + [data-filter-group="naam"] */
  function tabs(root = document) {
    root.querySelectorAll('[data-tabs]').forEach((t) => {
      if (t.dataset.bound) return; t.dataset.bound = 1;
      const group = t.dataset.tabs;
      t.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-filter]'); if (!btn) return;
        t.querySelectorAll('button').forEach((b) => b.setAttribute('aria-selected', b === btn));
        const f = btn.dataset.filter;
        document.querySelectorAll(`[data-filter-group="${group}"] [data-filter-item]`).forEach((it) => {
          it.classList.toggle('is-hidden', f !== 'alles' && !it.dataset.filterItem.split(' ').includes(f));
          it.classList.add('is-in');
        });
      });
    });
  }

  /* draaiende tekst rond de borduurringen */
  function orbits() {
    const rings = [];
    document.querySelectorAll('[data-orbit]').forEach((ring, i) => {
      const txt = ring.dataset.orbit;
      // tekst op een cirkel buiten de houten ring; textLength laat hem precies één keer rond lopen
      ring.insertAdjacentHTML('beforeend', `<svg class="orbit" viewBox="0 0 200 200" aria-hidden="true"><defs><path id="orb${i}" d="M100,100 m-90,0 a90,90 0 1,1 180,0 a90,90 0 1,1 -180,0"/></defs><text><textPath href="#orb${i}" textLength="560" lengthAdjust="spacing">${esc(txt)}  ✦  ${esc(txt)}  ✦  </textPath></text></svg>`);
      const host = ring.closest('a, .hoop') || ring;
      const r = { svg: ring.querySelector('.orbit'), angle: 0, speed: 0, target: 0, dir: i % 2 ? -1 : 1 };
      host.addEventListener('pointerenter', () => { r.target = 1; });
      host.addEventListener('pointerleave', () => { r.target = 0; });
      host.addEventListener('focus', () => { r.target = 1; });
      host.addEventListener('blur', () => { r.target = 0; });
      rings.push(r);
    });
    if (!rings.length || reduced) return;
    let last = performance.now();
    (function loop(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      rings.forEach((r) => {
        r.speed += (r.target - r.speed) * Math.min(1, dt * 3.2);    // zacht optrekken en uitrollen
        if (r.speed > 0.001) { r.angle = (r.angle + r.dir * r.speed * 38 * dt) % 360; r.svg.style.transform = `rotate(${r.angle}deg)`; }
      });
      requestAnimationFrame(loop);
    })(last);
  }

  /* vult [data-fill="email"] e.d. met gegevens uit de config */
  function fills() {
    const b = C.bedrijf;
    const map = { email: b.email, tel: b.tel, adres: `${b.straat}, ${b.postcode} ${b.plaats}`, open: b.openingstijden };
    document.querySelectorAll('[data-fill]').forEach((el) => { el.textContent = map[el.dataset.fill] || ''; });
    document.querySelectorAll('[data-href="mail"]').forEach((a) => { a.href = `mailto:${b.email}`; });
    document.querySelectorAll('[data-href="tel"]').forEach((a) => { a.href = `tel:+${b.telIntl}`; });
    document.querySelectorAll('[data-href="wa"]').forEach((a) => { a.href = `https://wa.me/${b.telIntl}`; });
    document.querySelectorAll('[data-icon]').forEach((el) => { el.innerHTML = ICON[el.dataset.icon] || ''; });
  }

  function init() {
    chrome(); fills(); orbits(); magnetic(); reveal(); counters(); countdowns(); tabs();
  }

  return { C, ICON, fmt, parse, iso, today, euro, esc, msg, toast, reveal, magnetic, tabs, init, DAGEN, MAANDEN };
})();

document.addEventListener('DOMContentLoaded', () => { HHUI.init(); window.dispatchEvent(new Event('hh:ready')); });
