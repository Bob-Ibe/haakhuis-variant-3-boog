// Haakhuis · naaimachine van blokjes die een QR-code wordt (gebaseerd op ibe-qr.js van IBE MOTION).
// Van opzij een naaimachine in de Haakhuis-kleuren. Kantel je hem naar bovenaanzicht, dan vormen de bovenkanten
// van de blokjes samen de QR-code en scan je hem gewoon: hij gaat naar WhatsApp.
// De QR is vooraf gemaakt met Dienstensites/tools/qrgen.py voor https://wa.me/31642977505
// (gecontroleerd met de QR-lezer van macOS). Verandert het nummer, maak de matrix dan opnieuw met dat script.
(function () {
  const QR = [
    '1111111001000010001111111',
    '1000001000101011001000001',
    '1011101010010000101011101',
    '1011101011001101101011101',
    '1011101010011010001011101',
    '1000001011110101101000001',
    '1111111010101010101111111',
    '0000000010000001000000000',
    '1011111001101101101111100',
    '0000100111011110000100010',
    '1101001100011001101111011',
    '0100110000011010011100001',
    '0010101110001101101110111',
    '1011110000100010000101010',
    '1000001011111111110111011',
    '1011010100010010100110001',
    '1001001010111100111110100',
    '0000000011001011100011000',
    '1111111001100110101010111',
    '1000001011000011100011011',
    '1011101010000101111110100',
    '1011101010111010011011111',
    '1011101010101010000001101',
    '1000001001001011110111001',
    '1111111011100100011111111',
  ];
  const Q = 3, N = QR.length, S = N + Q * 2; // 3 vakjes lichte rand eromheen, nodig om te kunnen scannen
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const dark = (x, z) => { const i = x - Q, j = z - Q; return i >= 0 && j >= 0 && i < N && j < N && QR[j][i] === '1'; };

  const INK = '#2f2630', PAPER = '#fff4fa', TABLE = '#e6d2de', TABLE_TOP = '#fff4fa';

  // Naaimachine van blokjes. Dicht model: de bovenkant van elk blokje krijgt de kleur van het QR-vakje eronder,
  // dus van boven zie je alleen de code. Van opzij zie je de machine, met de code als print erop.
  function machineModel() {
    const L = 0.82, occ = new Map(), key = (x, k, z) => x + ',' + k + ',' + z;
    const put = (x, k, z, col) => { if (x >= 0 && z >= 0 && x < S && z < S && k >= 0) occ.set(key(x, k, z), col); };
    // alleen de twee QR-kleuren (plus schaduw), zodat de overgang naar de code vloeiend is
    const WOOD = INK, BODY = PAPER, BODY2 = '#f3e2ec', STRIPE = INK, METAL = INK, WHEEL = INK, HUB = PAPER, SPOOL = INK, FLANGE = PAPER;
    const box = (x0, x1, z0, z1, k0, k1, col) => { for (let x = x0; x <= x1; x++) for (let z = z0; z <= z1; z++) for (let k = k0; k <= k1; k++) put(x, k, z, typeof col === 'function' ? col(x, k, z) : col); };
    box(4, 26, 10, 21, 0, 1, WOOD);                                  // houten voet
    box(5, 25, 11, 20, 2, 3, (x, k) => (k === 3 ? BODY : BODY2));    // bed van de machine
    box(19, 24, 12, 19, 4, 12, BODY);                                 // staander rechts
    box(6, 24, 12, 19, 13, 16, (x, k) => (k === 14 ? STRIPE : BODY)); // arm met streep
    box(5, 10, 11, 20, 7, 16, (x, k) => (k === 14 ? STRIPE : BODY));  // kop links
    box(7, 8, 15, 16, 4, 6, METAL);                                   // naaldstang
    box(6, 9, 15, 17, 4, 4, METAL);                                   // persvoet
    // handwiel rechts
    for (const x of [25, 26]) for (let z = 10; z <= 21; z++) for (let k = 3; k <= 18; k++) {
      const y = 0.3 + (k + 0.5) * L, d = Math.hypot(z - 15.5, y - 9.6);
      if (d <= 3.9 && (x === 25 || d >= 1.3)) put(x, k, z, d < 1.3 ? HUB : WHEEL);
    }
    // garenklosje boven op de arm
    for (let x = 13; x <= 17; x++) for (let z = 13; z <= 18; z++) for (let k = 17; k <= 19; k++) {
      const d = Math.hypot(x - 15, z - 15.5);
      if (k === 18 ? d <= 1.9 : d <= 2.6) put(x, k, z, k === 18 ? SPOOL : FLANGE);
    }
    const out = [];
    for (const [kk, col] of occ) {
      const [x, k, z] = kk.split(',').map(Number);
      const top = dark(x, z) ? INK : PAPER;
      out.push([x, 0.3 + k * L, z, L, col, top, { t: !occ.has(key(x, k + 1, z)), px: !occ.has(key(x + 1, k, z)), nx: !occ.has(key(x - 1, k, z)), pz: !occ.has(key(x, k, z + 1)), nz: !occ.has(key(x, k, z - 1)) }]);
    }
    // donkere vakjes op tafel die niet onder de machine liggen
    for (let z = 0; z < S; z++) for (let x = 0; x < S; x++) if (dark(x, z) && !occ.has(key(x, 0, z))) out.push([x, 0, z, 0.14, TABLE_TOP, INK]);
    return out;
  }
  let MODEL = null;

  function HHQr(wrap) {
    const canvas = wrap.querySelector('canvas'), ctx = canvas.getContext('2d'), hint = wrap.querySelector('.qr-hint');
    const blocks = MODEL = MODEL || machineModel();
    let W = 0, dpr = 1, yaw = Math.PI / 4, k = 0, from = 0, to = 0, t0 = 0, vis = false, auto = 0, last = performance.now();

    function resize() { dpr = Math.min(2, devicePixelRatio || 1); W = canvas.clientWidth; canvas.width = canvas.height = W * dpr; }
    function setTarget(v) {
      from = k; to = v; t0 = performance.now();
      if (hint) hint.innerHTML = v ? 'Scan om ons te appen · <b>klik voor de naaimachine</b>' : 'Klik op de naaimachine · <b>scan om ons te appen</b>';
      wrap.classList.toggle('is-qr', !!v);
    }

    function draw(now) {
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      if (t0) { const g = clamp((now - t0) / 1600); k = from + (to - from) * ease(g); if (g >= 1) t0 = 0; }
      // draaien als machine; naar bovenaanzicht netjes recht (veelvoud van 90 graden)
      if (to === 0 && !reduce) yaw += dt * 0.35 * (1 - k);
      else { const tgt = Math.round(yaw / (Math.PI / 2)) * (Math.PI / 2); yaw += (tgt - yaw) * Math.min(1, dt * 4); }
      const pitch = (26 + 64 * k) * Math.PI / 180;
      const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch);
      const zoom = (W / S) * (0.74 + 0.21 * k), X0 = W / 2, Y0 = W / 2 + W * 0.1 * (1 - k);
      const P = (x, y, z) => { const ux = x - S / 2, uz = z - S / 2, rx = ux * cy - uz * sy, rz = ux * sy + uz * cy; return [X0 + rx * zoom, Y0 + (rz * sp - y * cp) * zoom, rz * cp + y * sp]; };
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, W);

      const faces = [];
      const sides = [[1, 0], [-1, 0], [0, 1], [0, -1]].filter(([nx, nz]) => nx * sy + nz * cy > 0.001);
      // bovenkanten: eerst de kleur van de machine, tijdens het kantelen vloeit de QR-kleur erin
      const mix = (a, b, t) => { const p = parseInt(a.slice(1), 16), q = parseInt(b.slice(1), 16); const ch = (s) => ((((p >> s) & 255) * (1 - t) + ((q >> s) & 255) * t) | 0); return `rgb(${ch(16)},${ch(8)},${ch(0)})`; };
      const reveal = clamp((k - 0.25) / 0.6);
      const shade = (hex, f) => { const n = parseInt(hex.slice(1), 16); return `rgb(${(((n >> 16) & 255) * f) | 0},${(((n >> 8) & 255) * f) | 0},${((n & 255) * f) | 0})`; };
      function box(x, y, z, w, h, d, col, top, v) {
        const x1 = x + w, y1 = y + h, z1 = z + d;
        const depth = P(x + w / 2, y + h / 2, z + d / 2)[2];
        if (!v || v.t) faces.push({ d: depth + h * 0.001, c: top && top !== col ? mix(col, top, reveal) : col, p: [P(x, y1, z), P(x1, y1, z), P(x1, y1, z1), P(x, y1, z1)] });
        if (cp < 0.02) return;
        for (const [nx, nz] of sides) {
          if (v && !(nx > 0 ? v.px : nx < 0 ? v.nx : nz > 0 ? v.pz : v.nz)) continue;
          const f = nx ? 0.8 : 0.64;
          const q = nx > 0 ? [[x1, z], [x1, z1]] : nx < 0 ? [[x, z1], [x, z]] : nz > 0 ? [[x1, z1], [x, z1]] : [[x, z], [x1, z]];
          faces.push({ d: depth - 0.01, c: shade(col, f), p: [P(q[0][0], y1, q[0][1]), P(q[1][0], y1, q[1][1]), P(q[1][0], y, q[1][1]), P(q[0][0], y, q[0][1])] });
        }
      }
      // het tafelblad met de lichte vakjes erop
      box(0, -1.2, 0, S, 1.2, S, TABLE, TABLE_TOP);
      const base = faces.splice(0);
      for (const b of blocks) box(b[0], b[1], b[2], 1, b[3], 1, b[4], b[5] || b[4], b[6]);
      faces.sort((a, b) => a.d - b.d);
      for (const f of base.concat(faces)) {
        ctx.fillStyle = f.c; ctx.beginPath();
        ctx.moveTo(f.p[0][0], f.p[0][1]); for (let i = 1; i < 4; i++) ctx.lineTo(f.p[i][0], f.p[i][1]);
        ctx.closePath(); ctx.fill();
        if (k < 0.98) { ctx.strokeStyle = f.c; ctx.lineWidth = 0.6; ctx.stroke(); } // naadjes dicht
      }
    }
    const loop = (now) => { if (vis && !document.hidden) draw(now); requestAnimationFrame(loop); };

    resize(); draw(performance.now());
    new ResizeObserver(() => { resize(); draw(performance.now()); }).observe(canvas);
    canvas.addEventListener('click', () => { clearTimeout(auto); setTarget(to ? 0 : 1); });
    canvas.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); canvas.click(); } });
    setTarget(0);
    // eerst even de machine laten draaien, dan vanzelf naar de QR-code
    if ('IntersectionObserver' in window) {
      let first = true;
      new IntersectionObserver((en) => {
        vis = en[0].isIntersecting;
        if (vis && first) { first = false; auto = setTimeout(() => setTarget(1), 3200); }
      }, { threshold: 0.3 }).observe(canvas);
    } else { vis = true; setTarget(1); }
    requestAnimationFrame(loop);
    wrap.qrShow = (v) => { if (!v) yaw = Math.PI / 4; setTarget(v); t0 = 0; k = v; draw(performance.now()); }; // voor testen
  }

  window.HHQr = HHQr;
  const boot = () => document.querySelectorAll('.qr-machine').forEach(HHQr);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot); else boot();
})();
