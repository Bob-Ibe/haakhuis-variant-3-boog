/* ===================================================================
   Haakhuis · scènes tussen secties
   - Stofgolf  [data-wave="kleur"]  golvende stofrand onderaan een sectie
   - Rits      [data-zip]           blok ritst open terwijl je scrolt
   - Knip      footer               schaar knipt, de footer valt open
   Alles loopt mee met het scrollen; bij "minder beweging" blijft het stil.
   =================================================================== */
window.addEventListener('hh:ready', () => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const vh = () => window.innerHeight;
  const updaters = [];

  /* ---------- Stofgolf ---------- */
  const waves = [...document.querySelectorAll('[data-wave]')].map((host) => {
    const el = document.createElement('div');
    el.className = 'fabric-wave'; el.setAttribute('aria-hidden', 'true');
    el.innerHTML = `<svg viewBox="0 0 1200 100" preserveAspectRatio="none"><path class="w-back"/><path class="w-mid"/><path class="w-front" style="fill:${host.dataset.wave}"/></svg>`;
    host.appendChild(el);
    const w = { el, paths: el.querySelectorAll('path'), vis: true };
    if ('IntersectionObserver' in window) new IntersectionObserver((en) => { w.vis = en[0].isIntersecting; }).observe(el);
    return w;
  });
  const wavePath = (t, base, amp, ph, len) => {
    let d = `M0 100 L0 ${base}`;
    for (let x = 0; x <= 1200; x += 40) d += ` L${x} ${(base + Math.sin(x / len + t + ph) * amp + Math.sin(x / (len * .45) + t * .7 + ph) * amp * .3).toFixed(1)}`;
    return d + ' L1200 100 Z';
  };
  function drawWaves(now) {
    const t = now / 1000, s = window.scrollY * 0.004;
    waves.forEach((w) => {
      if (!w.vis) return;
      w.paths[0].setAttribute('d', wavePath(t * .9 + s, 42, 13, 1.6, 170));
      w.paths[1].setAttribute('d', wavePath(t * 1.1 + s * 1.3, 54, 10, .8, 130));
      w.paths[2].setAttribute('d', wavePath(t * 1.3 + s * 1.6, 66, 8, 0, 150));
    });
  }
  if (waves.length) {
    if (reduced) drawWaves(0);
    else (function loop(now) { drawWaves(now); requestAnimationFrame(loop); })(performance.now());
  }

  /* ---------- Rits ----------
     Fase 1: het trekkertje loopt langs de tandjes naar beneden; erboven gaat de rits in een V open.
     Fase 2: de twee helften schuiven opzij. */
  if (!reduced) document.querySelectorAll('[data-zip]').forEach((card) => {
    const cover = document.createElement('div');
    cover.className = 'zip-cover'; cover.setAttribute('aria-hidden', 'true');
    cover.innerHTML = `<div class="zip-half zl"><svg><path class="zip-teeth"/></svg><span class="zip-tag">Trek de rits open</span></div>
      <div class="zip-half zr"><svg><path class="zip-teeth"/></svg></div><div class="zip-pull"><i></i></div>`;
    card.appendChild(cover);
    const [l, r, pull] = cover.children;
    const ls = l.querySelector('svg'), rs = r.querySelector('svg'), lt = ls.firstChild, rt = rs.firstChild;
    const T = 5; // halve breedte van een tandenrij
    updaters.push(() => {
      const box = card.getBoundingClientRect(), W = box.width, H = box.height, cx = W / 2;
      const p = clamp((vh() * .86 - box.top) / (vh() * .62));
      const pa = clamp(p / .62), pb = clamp((p - .62) / .38);
      const ea = pa < .5 ? 2 * pa * pa : 1 - Math.pow(-2 * pa + 2, 2) / 2;
      const eb = pb < .5 ? 2 * pb * pb : 1 - Math.pow(-2 * pb + 2, 2) / 2;
      const py = ea * H;                                  // positie van het trekkertje
      const off = Math.min(cx, py * .32);                 // hoe ver de rits bovenaan open staat
      [ls, rs].forEach((svg) => svg.setAttribute('viewBox', `0 0 ${W} ${H}`));
      l.style.clipPath = `polygon(0 0, ${cx - off}px 0, ${cx}px ${py}px, ${cx}px ${H}px, 0 ${H}px)`;
      r.style.clipPath = `polygon(${cx + off}px 0, ${W}px 0, ${W}px ${H}px, ${cx}px ${H}px, ${cx}px ${py}px)`;
      // tandjes net binnen de rand van elke helft; onder het trekkertje grijpen ze in elkaar
      lt.setAttribute('d', `M${cx - off - T} -4 L${cx - T} ${py} L${cx - T} ${H + 4}`);
      rt.setAttribute('d', `M${cx + off + T} -4 L${cx + T} ${py} L${cx + T} ${H + 4}`);
      l.style.transform = `translateX(${-eb * (cx + 20)}px)`;
      r.style.transform = `translateX(${eb * (cx + 20)}px)`;
      pull.style.transform = `translate(${cx - 13 - eb * 0}px, ${py - 14}px)`;
      pull.style.opacity = pb > 0 ? 1 - pb * 3 : 1;
      cover.classList.toggle('is-open', p >= 1);
    });
  });

  /* ---------- Knip naar de footer ---------- */
  const foot = document.querySelector('.site-foot');
  if (foot && !reduced) {
    const last = [...document.querySelectorAll('main > section')].pop();
    const bg = last ? getComputedStyle(last).backgroundColor : '';
    const cover = document.createElement('div');
    cover.className = 'cut-cover'; cover.setAttribute('aria-hidden', 'true');
    if (bg && bg !== 'rgba(0, 0, 0, 0)') cover.style.setProperty('--cut-bg', bg);
    cover.innerHTML = `<div class="cut-half ct"></div><div class="cut-half cb"></div><div class="cut-slit"></div><div class="cut-dash"></div>
      <svg class="cut-scissors" viewBox="0 0 80 50" fill="none" stroke-linecap="round">
        <g class="blade-a"><path d="M30 25 L76 21" stroke="#9aa0a8" stroke-width="4"/><path d="M30 25 C22 29 16 34 10 36" stroke="#8f6482" stroke-width="4"/><ellipse cx="8" cy="38" rx="7" ry="5.5" stroke="#B98BAB" stroke-width="4"/></g>
        <g class="blade-b"><path d="M30 25 L76 29" stroke="#c4c6cc" stroke-width="4"/><path d="M30 25 C22 21 16 16 10 14" stroke="#8f6482" stroke-width="4"/><ellipse cx="8" cy="12" rx="7" ry="5.5" stroke="#B98BAB" stroke-width="4"/></g>
        <circle cx="30" cy="25" r="3" fill="#d9d9df" stroke="#55555e" stroke-width="1.2"/>
      </svg>`;
    foot.appendChild(cover);
    foot.classList.add('has-cut');
    const [ct, cb, slit, dash, sc] = cover.children;
    let lastX = 0;
    updaters.push(() => {
      const top = foot.getBoundingClientRect().top, h = foot.offsetHeight;
      const L = Math.min(h * .5, 150);                                  // kniplijn vlak onder de bovenrand
      cover.style.setProperty('--cut-y', L + 'px');
      const lineY = top + L, start = vh() * .97;
      const end = Math.max(vh() - h + L, vh() * .45) + 6;              // waar de lijn staat als je onderaan bent
      const p = clamp((start - lineY) / Math.max(1, start - end));
      const p1 = clamp(p / .62), p2 = clamp((p - .62) / .38);
      const e2 = p2 < .5 ? 2 * p2 * p2 : 1 - Math.pow(-2 * p2 + 2, 2) / 2;
      const x = p1 * 104 - 4;
      sc.style.left = `${x}%`;
      slit.style.width = `${clamp(x / 100) * 100}%`;
      dash.style.left = `${clamp(x / 100) * 100}%`;
      ct.style.transform = `translateY(${-e2 * 101}%)`;
      cb.style.transform = `translateY(${e2 * 101}%)`;
      sc.style.opacity = p2 > 0 ? 1 - p2 * 2.5 : 1;
      sc.classList.toggle('is-cutting', Math.abs(x - lastX) > .05 && p1 < 1);
      lastX = x;
      cover.classList.toggle('is-open', p >= 1);
    });
  }

  /* één scroll-lus voor rits en knip */
  if (updaters.length) {
    let ticking = false;
    const run = () => { updaters.forEach((u) => u()); ticking = false; };
    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(run); } };
    addEventListener('scroll', req, { passive: true });
    addEventListener('resize', req);
    run();
  }
});
