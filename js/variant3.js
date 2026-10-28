/* ===================================================================
   Variant 3 · boog
   Teller van 000 naar 100 terwijl carnavalsitems een boog vormen.
   Bij 100 vloeit het atelier in als achtergrond en blijft de boog draaien.
   Slepen draait de boog mee.
   =================================================================== */
(function () {
  const hero = document.querySelector('.arch-hero');
  if (!hero) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const ring = hero.querySelector('.arch-ring'), counter = hero.querySelector('.arch-count b');
  const ITEMS = [
    ['harlekijnjas', 'Harlekijnjas'], ['narrenkap', 'Narrenkap'], ['prinsensteek', 'Prinsensteek'], ['pailletten-cape', 'Pailletten-cape'],
    ['boerenkiel', 'Boerenkiel'], ['gehaakte-kraag', 'Gehaakte kraag'], ['tule-rok', 'Tule rok'], ['pailletten-vest', 'Pailletten-vest'],
  ];
  const N = 16, STEP = 360 / N;                       // volle cirkel; de bovenste helft is zichtbaar
  const cards = [];
  for (let i = 0; i < N; i++) {
    const [f, n] = ITEMS[i % ITEMS.length];
    const el = document.createElement('figure');
    el.className = 'arch-card';
    el.innerHTML = `<img src="assets/img/gen/${f}.png" alt="${i < ITEMS.length ? n : ''}" draggable="false"><figcaption>${n}</figcaption>`;
    ring.appendChild(el);
    cards.push({ el, base: 90 + i * STEP, born: 0 });
  }

  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  let W, H, R, cx, cy, cw, phi = 0, vel = 0, drag = null, t0 = performance.now(), loaded = false;

  function measure() {
    const r = hero.getBoundingClientRect(); W = r.width; H = r.height;
    if (W < 700) {                                   // mobiel: bredere boog, minder kaarten tegelijk, ruimte voor de tekst
      cw = Math.max(70, W * .2); R = W * .78; cx = W / 2; cy = H * .66;
    } else {
      cw = Math.max(86, Math.min(150, W * .085)); R = Math.min(W * .44, H * .62); cx = W / 2; cy = H * .8;
    }
    hero.style.setProperty('--cw', cw + 'px');
  }

  // laadvolgorde: van links boven via de top naar rechts, zoals een kaartspel dat uitwaaiert
  const order = cards.map((c, i) => i).sort((a, b) => Math.abs(((cards[a].base - 180 + 540) % 360) - 180) - Math.abs(((cards[b].base - 180 + 540) % 360) - 180));
  order.forEach((idx, k) => { cards[idx].born = 250 + k * 140; });

  function frame(now) {
    const t = now - t0;
    // teller: niet lineair, met kleine haperingen zoals een echte loader
    const lp = clamp(t / 2800), shown = Math.round(100 * (lp < .5 ? 2 * lp * lp : 1 - Math.pow(-2 * lp + 2, 2) / 2));
    if (counter) counter.textContent = String(shown).padStart(3, '0');
    if (!loaded && lp >= 1) { loaded = true; hero.classList.add('is-loaded'); document.documentElement.classList.remove('arch-lock'); }

    if (!drag) { vel += ((loaded ? .012 : 0) - vel) * .04; phi += vel * 16; }
    for (const c of cards) {
      const a = (c.base + phi) * Math.PI / 180;
      const x = cx + Math.cos(a) * R, y = cy - Math.sin(a) * R;
      const p = reduced ? 1 : ease(clamp((t - c.born) / 900));
      const sx = cx, sy = H + cw;                                  // start: stapel onder in beeld
      const px = sx + (x - sx) * p, py = sy + (y - sy) * p;
      const rot = (90 - (c.base + phi)) * p;
      const below = Math.sin(a);                                   // < 0: onder de horizon
      const fade = clamp((below + .18) / .3);
      c.el.style.transform = `translate(${(px - cw / 2).toFixed(1)}px, ${(py - cw * .625).toFixed(1)}px) rotate(${rot.toFixed(2)}deg) scale(${(.6 + .4 * p).toFixed(3)})`;
      c.el.style.opacity = (p * fade).toFixed(3);
    }
    requestAnimationFrame(frame);
  }

  // slepen draait de boog
  hero.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button')) return;
    drag = { x: e.clientX, phi, last: e.clientX, t: performance.now() };
    hero.setPointerCapture(e.pointerId); hero.classList.add('is-drag');
  });
  hero.addEventListener('pointermove', (e) => {
    if (!drag) return;
    phi = drag.phi - (e.clientX - drag.x) * .12;
    const now = performance.now(); vel = -(e.clientX - drag.last) * .12 / Math.max(1, now - drag.t) * 1; drag.last = e.clientX; drag.t = now;
  });
  const end = () => { drag = null; hero.classList.remove('is-drag'); };
  hero.addEventListener('pointerup', end); hero.addEventListener('pointercancel', end);

  document.documentElement.classList.add('arch-lock');
  measure(); addEventListener('resize', measure);
  requestAnimationFrame(frame);
  setTimeout(() => document.documentElement.classList.remove('arch-lock'), 4500); // vangnet
})();
