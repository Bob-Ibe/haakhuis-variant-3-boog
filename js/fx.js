/* ===================================================================
   Haakhuis · kaart-effecten
   - Spotlight: lichtvlek en rand die de muis volgen (.fx-spot)
   - Kantelen met glans (.fx-tilt)
   - Pixel-hover: roze pixels groeien vanaf de muis over de kaart ([data-pixel])
   - Scroll-tekst: woorden lichten op terwijl je scrolt, met logo aan het eind ([data-scrolltext])
   =================================================================== */
window.addEventListener('hh:ready', () => {
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));

  /* welke kaarten wat krijgen; zo hoeft de HTML niet aangepast */
  const SPOT = '.ws-card, .pattern, .product, .route, .step, .stat, .service, .info, .quote, .contact-card, .qr-card, .panel, .faq details';
  const TILT = '.pattern, .product, .route';
  const PIXEL = '';   // pixel-hover alleen waar het de leesbaarheid niet schaadt (variant 2: collectie)

  function bind(root = document) {
    root.querySelectorAll(SPOT).forEach((el) => {
      if (el.dataset.fxSpot) return; el.dataset.fxSpot = 1; el.classList.add('fx-spot');
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });
    if (fine && !reduced) root.querySelectorAll(TILT).forEach((el) => {
      if (el.dataset.fxTilt) return; el.dataset.fxTilt = 1; el.classList.add('fx-tilt');
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(900px) rotateX(${-py * 7}deg) rotateY(${px * 9}deg) translateY(-4px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
    if (PIXEL && fine && !reduced) root.querySelectorAll(PIXEL).forEach((el) => {
      if (el.dataset.fxPixel) return; el.dataset.fxPixel = 1;
      pixelHover(el);
    });
  }

  /* ---------- Pixel-hover ---------- */
  const COLS = ['237,11,240', '185,139,171', '214,176,200', '143,100,130', '255,255,255'];
  function pixelHover(el) {
    let cv, ctx, cells = [], raf = 0, on = false, t0 = 0, origin = [0, 0], w = 0, h = 0, level = 0;
    const SIZE = 7;
    function setup() {
      if (!cv) {
        cv = document.createElement('canvas'); cv.className = 'fx-pixels'; cv.setAttribute('aria-hidden', 'true');
        el.appendChild(cv); ctx = cv.getContext('2d');
      }
      const r = el.getBoundingClientRect(), dpr = Math.min(2, devicePixelRatio || 1);
      w = r.width; h = r.height; cv.width = w * dpr; cv.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cells = [];
      for (let y = 0; y < h; y += SIZE) for (let x = 0; x < w; x += SIZE) {
        if (Math.random() > .42) continue;                       // niet elk vakje, dan blijft het luchtig
        cells.push({ x, y, c: COLS[(Math.random() * COLS.length) | 0], a: .25 + Math.random() * .6, tw: Math.random() * 6.28, sp: 2 + Math.random() * 5, jit: Math.random() * .35 });
      }
    }
    function frame(now) {
      const t = (now - t0) / 1000;
      level += ((on ? 1 : 0) - level) * .12;
      ctx.clearRect(0, 0, w, h);
      const maxD = Math.hypot(w, h), reach = (on ? t * 1.6 : 1) * maxD;
      for (const c of cells) {
        const d = Math.hypot(c.x - origin[0], c.y - origin[1]) / maxD;
        const vis = on ? clamp((reach / maxD - d) * 4 + c.jit) : level;
        if (vis <= .01) continue;
        const flick = .55 + .45 * Math.sin(now / 1000 * c.sp + c.tw);
        ctx.fillStyle = `rgba(${c.c},${(c.a * flick * vis * (on ? 1 : level)).toFixed(3)})`;
        ctx.fillRect(c.x, c.y, SIZE - 1, SIZE - 1);
      }
      if (on || level > .01) raf = requestAnimationFrame(frame); else { ctx.clearRect(0, 0, w, h); raf = 0; }
    }
    el.addEventListener('pointerenter', (e) => {
      setup();
      const r = el.getBoundingClientRect(); origin = [e.clientX - r.left, e.clientY - r.top];
      on = true; t0 = performance.now(); level = 1;
      if (!raf) raf = requestAnimationFrame(frame);
    });
    el.addEventListener('pointerleave', () => { on = false; if (!raf) raf = requestAnimationFrame(frame); });
  }

  /* ---------- Scroll-tekst ---------- */
  document.querySelectorAll('[data-scrolltext]').forEach((sec) => {
    const target = sec.querySelector('.st-text');
    const words = target.textContent.trim().split(/\s+/);
    target.innerHTML = words.map((w) => `<span class="st-w">${w}</span>`).join(' ');
    const spans = [...target.children], logo = sec.querySelector('.st-logo');
    const update = () => {
      const r = sec.getBoundingClientRect(), total = r.height - innerHeight;
      const p = reduced ? 1 : clamp(-r.top / Math.max(1, total));
      const wp = clamp(p / .78) * spans.length;
      spans.forEach((s, i) => { s.style.opacity = (.14 + .86 * clamp(wp - i)).toFixed(3); });
      if (logo) { const lp = clamp((p - .8) / .16); logo.style.opacity = lp; logo.style.transform = `translateY(${(1 - lp) * 24}px) scale(${.92 + lp * .08})`; }
      sec.style.setProperty('--st', p.toFixed(3));
    };
    addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); update();
  });

  /* ---------- Stappen: liggen eerst als een stapel in het midden en waaieren naast elkaar uit ---------- */
  document.querySelectorAll('.steps.fan').forEach((wrap) => {
    const cards = [...wrap.children], mid = (cards.length - 1) / 2;
    const update = () => {
      if (innerWidth < 900 || reduced) { cards.forEach((c) => { c.style.transform = ''; }); return; }
      const r = wrap.getBoundingClientRect();
      const p = clamp((innerHeight * .92 - r.top) / (innerHeight * .5));
      const e = 1 - Math.pow(1 - p, 3);
      cards.forEach((c, i) => {
        const w = c.offsetWidth + parseFloat(getComputedStyle(wrap).columnGap || 0);
        c.style.transform = `translateX(${((mid - i) * w * (1 - e)).toFixed(1)}px) translateY(${((1 - e) * Math.abs(i - mid) * 10).toFixed(1)}px) rotate(${((i - mid) * -5 * (1 - e)).toFixed(2)}deg)`;
        c.style.zIndex = String(10 - Math.round(Math.abs(i - mid) * (1 - e) * 2));
      });
    };
    addEventListener('scroll', update, { passive: true }); addEventListener('resize', update); update();
  });

  bind();
  // kaarten die later door de modules worden gemaakt (workshops, patronen, producten)
  new MutationObserver(() => bind()).observe(document.querySelector('main') || document.body, { childList: true, subtree: true });
});
