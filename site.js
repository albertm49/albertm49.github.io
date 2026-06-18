// =====================================================================
//  site.js - Landing rendering + expressive motion + Terminal mode
//  Reads window.DATA (built per language by i18n.js). Re-renders on
//  'langchange'. Motion enhances an always-visible default; reduced
//  motion / no-JS keep everything readable.
// =====================================================================

const reduceMotion =
  window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer =
  window.matchMedia && window.matchMedia("(hover: hover) and (pointer: fine)").matches;

const esc = (s) =>
  String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
const hostname = (u) => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch { return u; } };
const $ = (id) => document.getElementById(id);
const setHTML = (id, html) => { const el = $(id); if (el) el.innerHTML = html; };
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

let lenis = null;       // instància de scroll suau (Locomotive-style)

// ---------- Content rendering (re-runnable on language change) ----------
function projCard(p, i) {
  const tags = p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("");
  const isSoon = !p.url && /soon|aviat|próx|prox/i.test(p.badge || "");
  const cover = p.logo
    ? `<img class="proj-card__logo" src="${p.logo}" alt="${esc(p.name)} logo" loading="lazy" />`
    : `<span class="proj-card__name">${esc(p.name)}</span>`;
  const link = p.url
    ? `<span class="proj-card__link">Visit ${esc(hostname(p.url))} <span aria-hidden="true">→</span></span>`
    : `<span class="proj-card__link is-soon">${esc(p.linkLabel || "")}</span>`;
  const inner =
    `<div class="proj-card__thumb proj-card__thumb--${p.accent}">${cover}` +
      `<span class="proj-card__badge${isSoon ? " is-soon" : ""}">${esc(p.badge)}</span></div>` +
    `<div class="proj-card__body">` +
      `<h3 class="proj-card__title">${esc(p.name)} <span class="proj-card__tagline">${esc(p.tagline)}</span></h3>` +
      `<p class="proj-card__desc">${esc(p.desc)}</p>` +
      `<div class="proj-card__tags">${tags}</div>${link}</div>`;
  const attrs = `data-reveal data-tilt style="--i:${i}"`;
  return p.url
    ? `<a class="proj-card" href="${p.url}" target="_blank" rel="noopener" ${attrs}>${inner}</a>`
    : `<div class="proj-card proj-card--soon" ${attrs}>${inner}</div>`;
}

function renderContent() {
  const D = window.DATA;
  if (!D) return;

  setHTML("aboutText", D.about.map((p, i) => `<p data-reveal style="--i:${i}">${esc(p)}</p>`).join(""));

  const cards = D.projects.map(projCard).join("");
  setHTML("projGrid", cards);
  setHTML("projectsGrid", cards);

  const ui = window.I18N ? window.I18N.uiFor(window.I18N.getLang()) : null;
  const live = D.projects.filter((p) => p.url).length;
  const pc = $("projCount");
  if (pc) pc.textContent = ui ? ui.projCount(D.projects.length, live) : `${D.projects.length} · ${live}`;

  setHTML(
    "timeline",
    D.experience
      .map(
        (job, i) =>
          `<div class="tl-item" data-reveal style="--i:${i}">` +
            `<div class="tl-dot"></div>` +
            `<div class="tl-content">` +
              `<h3 class="tl-role">${esc(job.role)} <span class="tl-company">@ ${esc(job.company)}</span></h3>` +
              `<span class="tl-time">${esc(job.time)}</span>` +
              `<ul class="tl-points">${job.points.map((pt) => `<li>${esc(pt)}</li>`).join("")}</ul>` +
            `</div></div>`
      )
      .join("")
  );

  setHTML(
    "skillsList",
    Object.entries(D.stack)
      .map(
        ([cat, items], i) =>
          `<div class="skill-group" data-reveal style="--i:${i}">` +
            `<span class="skill-cat">${esc(cat)}</span>` +
            `<div class="skill-tags">${items.map((s) => `<span class="tag">${esc(s)}</span>`).join("")}</div>` +
          `</div>`
      )
      .join("")
  );

  setHTML(
    "eduList",
    `<h3 class="edu__title">Education</h3>` +
      `<ul class="edu__list">${D.education.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>`
  );
}

// ---------- Hero: rotating typed word (reads current language live) ----------
let typedGen = 0; // s'incrementa en canviar d'idioma per reiniciar la paraula a l'instant
const typedEl = $("heroTyped");
if (typedEl) {
  if (reduceMotion) {
    const tl = (window.DATA && window.DATA.taglines) || [""];
    typedEl.textContent = tl[0];
  } else {
    (async function loop() {
      let i = 0;
      while (true) {
        const my = typedGen;
        const tl = (window.DATA && window.DATA.taglines) || [""];
        const w = tl[i % tl.length];
        for (let c = 1; c <= w.length && typedGen === my; c++) { typedEl.textContent = w.slice(0, c); await wait(68); }
        if (typedGen !== my) { typedEl.textContent = ""; i = 0; continue; }
        await wait(1500);
        for (let c = w.length; c >= 0 && typedGen === my; c--) { typedEl.textContent = w.slice(0, c); await wait(30); }
        if (typedGen !== my) { typedEl.textContent = ""; i = 0; continue; }
        await wait(240);
        i++;
      }
    })();
  }
}

// ---------- Reveal on scroll ----------
let revealObserver = null;
function observeReveals() {
  if (reduceMotion || !("IntersectionObserver" in window)) {
    document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(
      (entries, obs) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); obs.unobserve(e.target); } }),
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
  }
  document.querySelectorAll("[data-reveal]:not(.is-in)").forEach((el) => revealObserver.observe(el));
}

// ---------- Card interactions: tilt + cursor spotlight (re-bindable) ----------
function bindCards() {
  if (!(finePointer && !reduceMotion)) return;
  document.querySelectorAll("[data-tilt]").forEach((el) => {
    if (el._bound) return;
    el._bound = true;
    const MAX = 7;
    el.addEventListener("pointerenter", () => { el.style.transition = "transform 0.12s ease-out"; });
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `perspective(900px) rotateX(${(-py * MAX).toFixed(2)}deg) rotateY(${(px * MAX).toFixed(2)}deg) translateY(-4px)`;
      el.style.setProperty("--mx", `${((px + 0.5) * 100).toFixed(1)}%`);
      el.style.setProperty("--my", `${((py + 0.5) * 100).toFixed(1)}%`);
    });
    el.addEventListener("pointerleave", () => {
      el.style.transition = "transform 0.6s cubic-bezier(0.16,1,0.3,1)";
      el.style.transform = "";
    });
  });
}

// ---------- Magnetic buttons (static, bind once) ----------
function bindMagnetic() {
  if (!(finePointer && !reduceMotion)) return;
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    if (el._bound) return;
    el._bound = true;
    const strength = 0.32;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - (r.left + r.width / 2)) * strength}px, ${(e.clientY - (r.top + r.height / 2)) * strength}px)`;
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  });
}

// ---------- Background parallax ----------
function bindParallax() {
  if (!(finePointer && !reduceMotion)) return;
  const mesh = document.querySelector(".bg-fx__mesh");
  if (!mesh) return;
  let raf = 0;
  window.addEventListener("pointermove", (e) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      mesh.style.translate = `${(e.clientX / window.innerWidth - 0.5) * 26}px ${(e.clientY / window.innerHeight - 0.5) * 26}px`;
      raf = 0;
    });
  }, { passive: true });
}

// ---------- Nav compact + reading progress + hero parallax + scroll velocity ----------
function bindScroll() {
  const nav = document.querySelector(".nav");
  const progress = $("scrollProgress");
  const heroInner = document.querySelector(".hero__inner");
  let raf = 0;
  const onScroll = () => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      const y = window.scrollY;
      if (nav) nav.classList.toggle("nav--scrolled", y > 24);
      if (progress) {
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      }
      // Parallax del hero: el contingut deriva i s'esvaeix lleugerament en baixar
      if (heroInner && !reduceMotion && y < window.innerHeight * 1.15) {
        heroInner.style.transform = `translateY(${(y * 0.14).toFixed(1)}px)`;
        heroInner.style.opacity = String(Math.max(0, 1 - y / (window.innerHeight * 0.85)));
      }
      raf = 0;
    });
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
}

// ---------- Text "shuffle" (barreja les lletres de la PRÒPIA paraula i la recompon) ----------
function scrambleText(el, steps = 6, total = 300) {
  if (reduceMotion || !el || el.children.length || !el.textContent.trim()) return; // només text pla
  const original = el.dataset.orig || el.textContent;
  el.dataset.orig = original;
  const chars = [...original];
  // Posicions i lletres (sense espais): es barrejaran entre elles
  const idx = [];
  const letters = [];
  chars.forEach((c, i) => { if (!/\s/.test(c)) { idx.push(i); letters.push(c); } });
  clearInterval(el._scr);
  let step = 0;
  el._scr = setInterval(() => {
    step++;
    if (step >= steps) {
      clearInterval(el._scr);
      el._scr = null;
      el.textContent = original;
      delete el.dataset.orig;
      return;
    }
    const pool = letters.slice();
    for (let i = pool.length - 1; i > 0; i--) { // Fisher-Yates
      const j = (Math.random() * (i + 1)) | 0;
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const out = chars.slice();
    idx.forEach((p, k) => { out[p] = pool[k]; });
    el.textContent = out.join("");
  }, total / steps);
}

function restoreScramble(el) {
  if (el._scr) {
    clearInterval(el._scr);
    el._scr = null;
    if (el.dataset.orig) { el.textContent = el.dataset.orig; delete el.dataset.orig; }
  }
}

// Hover dels enllaços del menú
function bindNavShuffle() {
  document.querySelectorAll(".nav__links a").forEach((a) => {
    if (a._shufBound) return;
    a._shufBound = true;
    a.addEventListener("mouseenter", () => scrambleText(a));
    a.addEventListener("mouseleave", () => restoreScramble(a));
  });
}

// En canviar d'idioma: tot el text pla fa el mateix scramble, en cascada
function scrambleAll() {
  if (reduceMotion) return;
  const sel = ".nav__links a, .hero__line-inner, .section__title, .about p, .skill-cat, .tl-time, .proj-card__desc, .proj-card__tagline, .edu__list li";
  document.querySelectorAll(sel).forEach((el, i) => setTimeout(() => scrambleText(el), Math.min(i, 30) * 16));
}

// ---------- Smooth scroll amb inèrcia (Lenis, via CDN; degrada amb gràcia) ----------
async function initSmooth() {
  if (reduceMotion) return;
  try {
    const mod = await import("https://cdn.jsdelivr.net/npm/lenis@1.1.14/+esm");
    const Lenis = mod.default || mod.Lenis;
    lenis = new Lenis({ duration: 0.9, smoothWheel: true, touchMultiplier: 1.6 });
    const raf = (time) => { if (lenis) { lenis.raf(time); requestAnimationFrame(raf); } };
    requestAnimationFrame(raf);
  } catch (e) {
    lenis = null; // sense CDN: scroll natiu (CSS smooth), tot segueix funcionant
  }
}

// ---------- Enllaços interns: scroll suau a través de Lenis quan està actiu ----------
function bindAnchors() {
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (!id || id.length < 2) return;
      const target = document.querySelector(id);
      if (target && lenis) { e.preventDefault(); lenis.scrollTo(target, { offset: -70 }); }
    });
  });
}

// ---------- Terminal mode (overlay) ----------
function bindTerminal() {
  const overlay = $("terminalOverlay");
  const open = () => {
    if (!overlay) return;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    if (lenis) lenis.stop();
    if (typeof window.ensureTerminalBooted === "function") window.ensureTerminalBooted();
    setTimeout(() => { if (typeof window.terminalFocusInput === "function") window.terminalFocusInput(); }, 80);
  };
  const close = () => {
    if (!overlay) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    if (lenis) lenis.start();
  };
  document.querySelectorAll(".js-open-terminal").forEach((b) => b.addEventListener("click", open));
  document.querySelectorAll(".js-close-terminal").forEach((b) => b.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || !overlay || !overlay.classList.contains("open")) return;
    if (document.querySelector(".modal.open")) return;
    e.stopPropagation();
    close();
  }, true);
}

// ---------- Init ----------
renderContent();
observeReveals();
bindCards();
bindMagnetic();
bindParallax();
bindScroll();
bindAnchors();
bindTerminal();
bindNavShuffle();
initSmooth();

// Deep-link: re-apply hash scroll after content is injected
if (location.hash && location.hash.length > 1) {
  const target = document.querySelector(location.hash);
  if (target) requestAnimationFrame(() => target.scrollIntoView({ block: "start" }));
}

// Re-render and re-wire when the language changes
window.addEventListener("langchange", () => {
  typedGen++; // reinicia la paraula del hero amb el nou idioma
  renderContent();
  // language toggle should not re-animate: reveal injected content immediately
  document.querySelectorAll("[data-reveal]").forEach((el) => el.classList.add("is-in"));
  bindCards();
  scrambleAll(); // tot el text pla fa el shuffle estil Locomotive
  if (reduceMotion && typedEl && window.DATA) typedEl.textContent = window.DATA.taglines[0];
});
