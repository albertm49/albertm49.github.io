// =====================================================================
//  koi.js — a pond of pixel koi behind the page.
//  Each fish is a chain of segments that follows its head; the body is
//  rasterised onto a screen grid of square cells, so they read as a
//  mosaic. They drift, shy away from the cursor and swim to food
//  dropped with a click. Plain 2D canvas, no dependencies.
// =====================================================================
const PALETTE = {
  orange: "#E8642C",
  bone: "#E6E1D6",
  blue: "#4A62C8",
  ink: "#1A1A1A",
};
// koi varieties: base colour + patch colour
const VARIETIES = [
  { base: PALETTE.bone, patch: PALETTE.orange },   // kohaku
  { base: PALETTE.orange, patch: PALETTE.bone },
  { base: PALETTE.blue, patch: PALETTE.orange },   // like the reference's blue koi
  { base: PALETTE.bone, patch: PALETTE.blue },
];

const rand = (a, b) => a + Math.random() * (b - a);
const wrapAngle = (a) => Math.atan2(Math.sin(a), Math.cos(a));

function makeFish(W, H, C) {
  const v = VARIETIES[(Math.random() * VARIETIES.length) | 0];
  const n = 11 + ((Math.random() * 5) | 0);           // segments
  const x = rand(W * 0.1, W * 0.9), y = rand(H * 0.1, H * 0.9), a = rand(0, Math.PI * 2);
  const gap = C * 1.05;
  const segs = Array.from({ length: n }, (_, i) => ({ x: x - Math.cos(a) * i * gap, y: y - Math.sin(a) * i * gap }));
  const patches = Array.from({ length: 2 + ((Math.random() * 3) | 0) }, () => ({ u: rand(0.08, 0.8), v: rand(-0.8, 0.8), ru: rand(0.08, 0.18), rv: rand(0.6, 1.2) }));
  return {
    segs, a, gap, v, patches,
    speed: rand(0.5, 0.9), base: rand(0.5, 0.9), turn: 0,
    rmax: C * rand(2.2, 3.1), phase: rand(0, 10),
    wanderT: rand(0, 1000),
  };
}

export function createPond(canvas, { reduced = false } = {}) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  let W = 0, H = 0, DPR = 1, C = 12, fish = [], food = [], ripples = [];
  let mx = -9999, my = -9999, running = true, t = 0;

  function resize() {
    W = innerWidth; H = innerHeight; DPR = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    C = W < 700 ? 8 : 11;
    const count = W < 700 ? 4 : 7;
    if (fish.length !== count) fish = Array.from({ length: count }, () => makeFish(W, H, C));
    if (reduced) draw();
  }

  function steer(f) {
    const h = f.segs[0];
    let desired = f.a + Math.sin(t * 0.4 + f.wanderT) * 0.6 + Math.sin(t * 0.13 + f.wanderT * 2) * 0.8;
    let urgency = 0.02, boost = 0;

    // food: swim to the nearest pellet
    let best = null, bd = 1100;
    for (const p of food) { const d = Math.hypot(p.x - h.x, p.y - h.y); if (d < bd) { bd = d; best = p; } }
    if (best) { desired = Math.atan2(best.y - h.y, best.x - h.x); urgency = 0.06; boost = 0.9; if (bd < C * 1.4) { best.eaten = true; } }

    // cursor: shy away when it comes close
    const dm = Math.hypot(mx - h.x, my - h.y);
    if (dm < 130) { desired = Math.atan2(h.y - my, h.x - mx); urgency = 0.09; boost = Math.max(boost, 1.6 * (1 - dm / 130)); }

    // stay inside the pond
    const m = 70;
    if (h.x < m || h.x > W - m || h.y < m || h.y > H - m) {
      desired = Math.atan2(H / 2 - h.y, W / 2 - h.x); urgency = Math.max(urgency, 0.05);
    }
    f.a += wrapAngle(desired - f.a) * urgency;
    f.speed += (f.base + boost - f.speed) * 0.05;
  }

  function move(f) {
    const h = f.segs[0];
    const wig = Math.sin(t * 7 * f.speed + f.phase) * 0.35;      // body undulation
    h.x += Math.cos(f.a + wig * 0.3) * f.speed;
    h.y += Math.sin(f.a + wig * 0.3) * f.speed;
    for (let i = 1; i < f.segs.length; i++) {
      const p = f.segs[i - 1], s = f.segs[i];
      const dx = s.x - p.x, dy = s.y - p.y, d = Math.hypot(dx, dy) || 1;
      s.x = p.x + (dx / d) * f.gap; s.y = p.y + (dy / d) * f.gap;
    }
  }

  // body radius along the fish (0 = head, 1 = tail)
  const profile = (u) => (u < 0.3 ? 0.62 + u * 1.3 : Math.max(0.12, 1 - (u - 0.3) * 1.25));

  function stampFish(f, cells) {
    const n = f.segs.length;
    for (let i = 0; i < n; i++) {
      const s = f.segs[i], u = i / (n - 1);
      const r = f.rmax * profile(u);
      const nx = f.segs[Math.max(0, i - 1)], dirx = nx.x - s.x, diry = nx.y - s.y, dl = Math.hypot(dirx, diry) || 1;
      const ox = -diry / dl, oy = dirx / dl;                  // lateral normal
      const x0 = Math.floor((s.x - r) / C), x1 = Math.floor((s.x + r) / C);
      const y0 = Math.floor((s.y - r) / C), y1 = Math.floor((s.y + r) / C);
      for (let gx = x0; gx <= x1; gx++) for (let gy = y0; gy <= y1; gy++) {
        const cx = gx * C + C / 2, cy = gy * C + C / 2;
        const dx = cx - s.x, dy = cy - s.y;
        const d2 = dx * dx + dy * dy;
        if (d2 > r * r) {
          // faint halo just outside the body
          if (d2 < (r + C * 0.9) ** 2) { const key = gx + "," + gy; if (!cells.has(key)) cells.set(key, { c: f.v.base, a: 0.14 }); }
          continue;
        }
        const v = (dx * ox + dy * oy) / r;
        const edge = Math.sqrt(d2) / r;
        let col = f.v.base;
        for (const p of f.patches) if (((u - p.u) / p.ru) ** 2 + ((v - p.v) / p.rv) ** 2 < 1) { col = f.v.patch; break; }
        cells.set(gx + "," + gy, { c: col, a: edge > 0.78 ? 0.72 : 1 });
      }
      // pectoral fins
      if (i === Math.round(n * 0.22)) {
        const flap = 1.6 + Math.sin(t * 4 + f.phase) * 0.4;
        for (const side of [-1, 1]) for (let k = 1; k <= 2; k++) {
          const fx = s.x + ox * side * (r + k * C * 0.8) - (dirx / dl) * k * C * 0.6 * flap;
          const fy = s.y + oy * side * (r + k * C * 0.8) - (diry / dl) * k * C * 0.6 * flap;
          const key = Math.floor(fx / C) + "," + Math.floor(fy / C);
          if (!cells.has(key)) cells.set(key, { c: f.v.base, a: 0.45 });
        }
      }
      // tail fin
      if (i === n - 1) {
        const sweep = Math.sin(t * 6 * f.speed + f.phase) * 0.5;
        for (const side of [-1, 1]) for (let k = 1; k <= 4; k++) {
          const ang = Math.atan2(-diry, -dirx) + side * (0.35 + k * 0.05) + sweep;
          const fx = s.x + Math.cos(ang) * k * C * 0.9, fy = s.y + Math.sin(ang) * k * C * 0.9;
          const key = Math.floor(fx / C) + "," + Math.floor(fy / C);
          if (!cells.has(key)) cells.set(key, { c: f.v.base, a: 0.5 - k * 0.07 });
        }
      }
    }
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const pad = Math.max(1, Math.round(C * 0.14));
    // ripples: rings of faint cells
    for (const r of ripples) {
      ctx.fillStyle = `rgba(230,225,214,${(0.22 * (1 - r.k)).toFixed(3)})`;
      const rad = r.k * 90, steps = Math.max(10, Math.round(rad / (C * 0.6)));
      const seen = new Set();
      for (let i = 0; i < steps; i++) {
        const a = (i / steps) * Math.PI * 2;
        const gx = Math.floor((r.x + Math.cos(a) * rad) / C), gy = Math.floor((r.y + Math.sin(a) * rad) / C);
        const key = gx + "," + gy; if (seen.has(key)) continue; seen.add(key);
        ctx.fillRect(gx * C + pad, gy * C + pad, C - pad * 2, C - pad * 2);
      }
    }
    // food pellets
    ctx.fillStyle = PALETTE.orange;
    for (const p of food) {
      const gx = Math.floor(p.x / C), gy = Math.floor(p.y / C), s = Math.round(C * 0.4);
      ctx.fillRect(gx * C + (C - s) / 2, gy * C + (C - s) / 2, s, s);
    }
    // fish
    for (const f of fish) {
      const cells = new Map();
      stampFish(f, cells);
      for (const [key, cell] of cells) {
        const [gx, gy] = key.split(",").map(Number);
        ctx.globalAlpha = cell.a;
        ctx.fillStyle = cell.c;
        ctx.fillRect(gx * C + pad, gy * C + pad, C - pad * 2, C - pad * 2);
      }
      ctx.globalAlpha = 1;
    }
  }

  function frame() {
    requestAnimationFrame(frame);
    if (!running || document.hidden) return;
    t += 1 / 60;
    for (const f of fish) { steer(f); move(f); }
    food = food.filter((p) => !p.eaten && (p.life -= 1) > 0);
    ripples = ripples.filter((r) => (r.k += 0.018) < 1);
    draw();
  }

  addEventListener("resize", resize);
  addEventListener("pointermove", (e) => { if (e.pointerType === "mouse") { mx = e.clientX; my = e.clientY; } }, { passive: true });
  document.addEventListener("pointerleave", () => { mx = my = -9999; });
  resize();
  if (!reduced) requestAnimationFrame(frame);

  return {
    // drop food at a screen point; the nearest fish come to eat it
    feed(x, y) {
      if (reduced) return;
      for (let i = 0; i < 4; i++) food.push({ x: x + rand(-18, 18), y: y + rand(-18, 18), life: 60 * 14 });
      ripples.push({ x, y, k: 0 });
    },
    pause(p) { running = !p; },
  };
}
