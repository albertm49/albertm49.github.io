// =====================================================================
//  app.js — renders content from window.DATA (i18n.js) and runs the
//  interactions: ink hero, word-by-word statement, card sphere, project
//  panel, experience table, menu and the optional terminal mode.
// =====================================================================
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const reduced = document.documentElement.classList.contains("reduced");
const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
if (!finePointer) document.documentElement.classList.add("no-hover");

// Strings that only this layout needs (the rest live in i18n.js)
const T = {
  en: { menu: "Menu", close: "Close", reveal: "Move the cursor to reveal. Click anywhere to feed the koi.", based: "Based in Barcelona & Arenys de Mar", field: "Web & mobile development",
        role: "Full-stack developer", big: ["Products", "built end", "to end."], drag: "Drag to spin", click: "Click a project to open it",
        thNo: "No.", thCompany: "Company", thRole: "Role", thPeriod: "Context", open: "Open", prev: "Previous", next: "Next", kind: "Type", aboutL: "About", stackL: "Stack", app: "Mobile app", scrollMore: "Scroll for more", howTitle: "How it works" },
  ca: { menu: "Menú", close: "Tancar", reveal: "Mou el cursor per revelar. Clica on vulguis per donar menjar a les carpes.", based: "Entre Barcelona i Arenys de Mar", field: "Desenvolupament web i mòbil",
        role: "Desenvolupador full-stack", big: ["Productes", "fets de cap", "a cap."], drag: "Arrossega per girar", click: "Clica un projecte per obrir-lo",
        thNo: "Núm.", thCompany: "Empresa", thRole: "Rol", thPeriod: "Context", open: "Obrir", prev: "Anterior", next: "Següent", kind: "Tipus", aboutL: "Sobre el projecte", stackL: "Stack", app: "App mòbil", scrollMore: "Baixa per veure més", howTitle: "Com funciona" },
  es: { menu: "Menú", close: "Cerrar", reveal: "Mueve el cursor para revelar. Haz clic donde quieras para dar de comer a las carpas.", based: "Entre Barcelona y Arenys de Mar", field: "Desarrollo web y móvil",
        role: "Desarrollador full-stack", big: ["Productos", "hechos de", "principio a fin."], drag: "Arrastra para girar", click: "Haz clic en un proyecto para abrirlo",
        thNo: "Nº", thCompany: "Empresa", thRole: "Rol", thPeriod: "Contexto", open: "Abrir", prev: "Anterior", next: "Siguiente", kind: "Tipo", aboutL: "Sobre el proyecto", stackL: "Stack", app: "App móvil", scrollMore: "Baja para ver más", howTitle: "Cómo funciona" },
};
const lang = () => window.I18N.getLang();
const t = () => T[lang()] || T.en;
const ui = () => window.I18N.uiFor(lang());
// Preview images per project (screenshots of the live sites). Projects
// without a photo show their logo on a warm tile instead.
const PREVIEW = {
  aza: "assets/previews/aza.jpg",
  softdev: "assets/previews/softdev.jpg",
  ekoora: "assets/previews/ekoora.jpg",
};
const TILE = { owl: "#FFE9DC", tryvo: "#EEEDFC" };
// App screenshots shown as a strip of phones at the top of the deep dive
const SHOTS = {
  tryvo: ["01_inici", "02_resum", "04_pla", "05_diners", "06_colla"].map((f) => `assets/screens/tryvo/${f}.webp`),
  ekoora: ["02-inici", "03-cami", "05-joc-questionari", "06-joc-vertader-fals", "09-ranquing"].map((f) => `assets/screens/ekoora/${f}.webp`),
};
// Case-study colours: each project is painted in its own brand world
const THEME = {
  tryvo: { sb: "#5753D6", sf: "#FFFFFF" },
  aza: { sb: "#F6E2C4", sf: "#2E2724" },
  softdev: { sb: "#EBA900", sf: "#111111" },
  owl: { sb: "#E8772E", sf: "#1B0D04" },
  ekoora: { sb: "#17121F", sf: "#F3EEFF" },
};
const host = (u) => u.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

// ---------------------------------------------------------------------
//  Render
// ---------------------------------------------------------------------
function render() {
  const D = window.DATA, S = t(), U = ui();
  $$("[data-t]").forEach((el) => { const v = S[el.dataset.t]; if (typeof v === "string") el.textContent = v; });
  $("#heroBig").innerHTML = S.big.map((l) => `<span>${esc(l)}</span>`).join("");

  // statement: one span per word so they can light up while scrolling
  $("#statement").innerHTML = D.about[0].split(/\s+/).map((w) => `<span class="w">${esc(w)}</span>`).join(" ");
  $("#facts").innerHTML = D.about.slice(1).map((a) => `<li>${esc(a)}</li>`).join("");

  // project rows
  $("#projects").innerHTML = D.projects.map((p, i) =>
    `<li><button class="prow" type="button" data-p="${i}">` +
      `<span class="prow__no">${String(i + 1).padStart(2, "0")}</span>` +
      `<span class="prow__name">${esc(p.name)}</span>` +
      `<span class="prow__muted">${esc(p.tagline)}. ${esc(p.tags.join(", "))}</span>` +
      `<span class="prow__open">${esc(S.open)}</span></button></li>`).join("");

  // experience table
  $("#expRows").innerHTML = D.experience.map((j, i) =>
    `<div class="erow-wrap" role="row">` +
      `<button class="erow" type="button" aria-expanded="false" aria-controls="exp-${i}" data-e="${i}">` +
        `<span class="erow__no" role="cell">${String(i + 1).padStart(2, "0")}</span>` +
        `<span class="erow__co" role="cell">${esc(j.company)}</span>` +
        `<span class="erow__role" role="cell">${esc(j.role)}</span>` +
        `<span class="erow__time" role="cell">${esc(j.time)}</span>` +
        `<span class="erow__plus" aria-hidden="true"></span></button>` +
      `<div class="erow__detail" id="exp-${i}"><div><ul>` +
        `<li class="erow__mobile-meta">${esc(j.role)}, ${esc(j.time)}</li>` +
        j.points.map((x) => `<li>${esc(x)}</li>`).join("") +
      `</ul></div></div></div>`).join("");
  // education: one row per study, current ones flagged
  $("#studyList").innerHTML = (D.eduItems || []).map((e) =>
    `<li class="study">` +
      `<p class="study__time">${esc(e.time)}</p>` +
      `<div class="study__main"><h3 class="study__title">${esc(e.title)}</h3>` +
        `<p class="study__school">${esc(e.school)}</p>` +
        (e.note ? `<p class="study__note">${esc(e.note)}</p>` : "") + `</div>` +
      `<p class="study__status${e.now ? " is-now" : ""}">${e.now ? '<span class="dot" aria-hidden="true"></span>' : ""}${esc(e.status)}</p>` +
    `</li>`).join("");

  // toolbox
  $("#toolList").innerHTML = Object.entries(D.stack).map(([cat, items]) =>
    `<div><dt>${esc(cat)}</dt><dd>${items.map(esc).join(", ")}</dd></div>`).join("");

  // terminal "Projects" window keeps its own card style (terminal.css)
  const pg = $("#projectsGrid");
  if (pg) pg.innerHTML = D.projects.map((p) => {
    const body =
      `<div class="pcard__thumb pcard__thumb--${p.accent}">` +
        `<img class="pcard__logo" src="${p.logo}" alt="${esc(p.name)} logo" loading="lazy" />` +
        `<span class="pcard__badge">${esc(p.badge)}</span></div>` +
      `<div class="pcard__body"><h3 class="pcard__title">${esc(p.name)}</h3>` +
        `<p class="pcard__desc">${esc(p.desc)}</p><div class="pcard__tags">${esc(p.tags.join(" · "))}</div></div>`;
    return p.url ? `<a class="pcard" href="${p.url}" target="_blank" rel="noopener">${body}</a>` : `<div class="pcard pcard--soon">${body}</div>`;
  }).join("");

  // hover preview track: one slide per project
  $("#ppeekTrack").innerHTML = D.projects.map((p) => PREVIEW[p.id]
    ? `<div class="ppeek__slide"><img src="${PREVIEW[p.id]}" alt="" loading="lazy" /></div>`
    : `<div class="ppeek__slide ppeek__slide--logo" style="background:${TILE[p.id] || "var(--paper)"}"><img src="${p.logo}" alt="" loading="lazy" /></div>`).join("");

  buildCabinet();
  buildSphere();
  lightWords();
}

// ---------------------------------------------------------------------
//  Filing cabinet: one folder per project. Tabs stay in place; only the
//  folder in front changes, opening down from its tab.
// ---------------------------------------------------------------------
let zTop = 1;
function buildCabinet() {
  const D = window.DATA;
  $("#cabinet").innerHTML = D.projects.map((p, i) => {
    const th = THEME[p.id] || { sb: "#2A2926", sf: "#ECEAE4" };
    return `<div class="folder" data-i="${i}" style="--i:${i};--fc:${th.sb};--ff:${th.sf}">` +
      `<div class="folder__body"></div>` +
      `<button class="folder__tab" type="button" role="tab" id="tab-${i}" aria-controls="folderContent" aria-selected="false" data-i="${i}">` +
        `<img src="${p.logo}" alt="" decoding="async" /><span>${esc(p.name)}</span></button>` +
    `</div>`;
  }).join("");
  if (!panel.hidden) markFront(current, false);
}
function markFront(i, animate) {
  $$("#cabinet .folder").forEach((f) => {
    const on = +f.dataset.i === i;
    const tab = $(".folder__tab", f);
    tab.setAttribute("aria-selected", String(on));
    tab.tabIndex = on ? 0 : -1;
    if (on) {
      f.style.zIndex = ++zTop;
      if (animate && !reduced) {
        f.classList.add("is-pulling");
        requestAnimationFrame(() => f.classList.add("is-front"));
        f.addEventListener("transitionend", function done(e) {
          if (e.propertyName !== "clip-path") return;
          f.removeEventListener("transitionend", done);
          f.classList.remove("is-pulling");
          // the folder now behind folds back down to its tab, unseen
          $$("#cabinet .folder.is-front").forEach((o) => { if (o !== f) o.classList.remove("is-front"); });
        });
      } else {
        f.classList.add("is-front");
      }
    } else if (!animate || reduced) {
      f.classList.remove("is-front", "is-pulling");
    }
  });
  $("#folderContent").setAttribute("aria-labelledby", "tab-" + i);
}
$("#cabinet").addEventListener("click", (e) => {
  const t = e.target.closest(".folder__tab");
  if (t) goToProject(+t.dataset.i);
});
// arrow keys move between tabs, as in any tab list
$("#cabinet").addEventListener("keydown", (e) => {
  if (!e.target.closest(".folder__tab")) return;
  if (e.key === "Home") { e.preventDefault(); goToProject(0, true); }
  if (e.key === "End") { e.preventDefault(); goToProject(window.DATA.projects.length - 1, true); }
});

// ---------------------------------------------------------------------
//  Project hover preview: follows the cursor, tilts with its speed and
//  slides its photo track to the hovered project
// ---------------------------------------------------------------------
const pp = $("#ppeek");
let ppOn = false, ppX = innerWidth / 2, ppY = innerHeight / 2, ppTX = ppX, ppTY = ppY, ppRot = 0;
function showPreview(i) {
  const p = window.DATA.projects[i];
  $("#ppeekTrack").style.transform = `translateY(${-i * 100}%)`;
  $("#ppeekName").textContent = p.name;
  $("#ppeekTag").textContent = p.tagline;
  if (!ppOn) { ppX = ppTX; ppY = ppTY; }
  ppOn = true; pp.classList.add("on");
}
function hidePreview() { ppOn = false; pp.classList.remove("on"); }
function initPreview() {
  if (!finePointer) return;
  addEventListener("pointermove", (e) => { ppTX = e.clientX; ppTY = e.clientY; });
  (function loopPreview() {
    requestAnimationFrame(loopPreview);
    const dx = ppTX - ppX;
    ppX += dx * 0.14; ppY += (ppTY - ppY) * 0.14;
    ppRot += (Math.max(-10, Math.min(10, dx * 0.06)) - ppRot) * 0.12;
    // keep it on screen: flip to the left of the cursor near the right edge
    const w = pp.offsetWidth, flip = ppX + w + 40 > innerWidth;
    pp.style.transform = `translate(${flip ? ppX - w - 28 : ppX + 28}px, ${ppY - w * 0.32}px) rotate(${reduced ? 0 : ppRot}deg)`;
  })();
  $("#projects").addEventListener("pointerover", (e) => { const b = e.target.closest(".prow"); if (b) showPreview(+b.dataset.p); });
  $("#projects").addEventListener("pointerleave", hidePreview);
  stage.addEventListener("pointerover", (e) => {
    const c = e.target.closest(".card--project");
    if (c && !drag) showPreview(+c.dataset.p); else if (!c) hidePreview();
  });
  stage.addEventListener("pointerleave", hidePreview);
}

// ---------------------------------------------------------------------
//  Smooth scroll + anchors
// ---------------------------------------------------------------------
let lenis = null;
if (!reduced && finePointer && window.Lenis) {
  lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
  const raf = (tm) => { lenis.raf(tm); requestAnimationFrame(raf); };
  requestAnimationFrame(raf);
}
function scrollToEl(el) {
  const y = el.getBoundingClientRect().top + scrollY;
  if (lenis) lenis.scrollTo(y, { duration: 1.4 }); else scrollTo({ top: y, behavior: reduced ? "auto" : "smooth" });
}
document.addEventListener("click", (e) => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const el = $(a.getAttribute("href"));
  if (!el) return;
  e.preventDefault();
  if (menuOpen) toggleMenu(false);
  scrollToEl(el);
});

// ---------------------------------------------------------------------
//  Menu
// ---------------------------------------------------------------------
const menu = $("#menu"), menuBtn = $("#menuBtn");
let menuOpen = false;
function toggleMenu(open = !menuOpen) {
  menuOpen = open;
  menuBtn.setAttribute("aria-expanded", String(open));
  menuBtn.firstElementChild.textContent = open ? t().close : t().menu;
  if (open) {
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add("is-open"));
    lenis && lenis.stop();
    setTimeout(() => $("a", menu).focus({ preventScroll: true }), 300);
  } else {
    menu.classList.remove("is-open");
    lenis && lenis.start();
    setTimeout(() => { if (!menuOpen) menu.hidden = true; }, reduced ? 0 : 900);
  }
}
menuBtn.addEventListener("click", () => toggleMenu());

// ---------------------------------------------------------------------
//  Clock + top state
// ---------------------------------------------------------------------
const fmt = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Madrid" });
const tick = () => ($("#clock").textContent = fmt.format(new Date()));
tick(); setInterval(tick, 15000);

// ---------------------------------------------------------------------
//  Statement words light up as it crosses the viewport
// ---------------------------------------------------------------------
function lightWords() {
  const st = $("#statement");
  const words = $$(".w", st);
  if (!words.length) return;
  const r = st.getBoundingClientRect();
  const k = Math.max(0, Math.min(1, (innerHeight * 0.85 - r.top) / (r.height + innerHeight * 0.35)));
  const n = Math.round(k * words.length);
  words.forEach((w, i) => w.classList.toggle("on", i < n));
}
addEventListener("scroll", () => {
  document.documentElement.classList.toggle("scrolled", scrollY > 40);
  lightWords();
}, { passive: true });

// ---------------------------------------------------------------------
//  Card sphere around "Work"
// ---------------------------------------------------------------------
const stage = $("#stage"), sphere = $("#sphere");
let cards = [], rotY = 0.4, rotX = -0.18, velY = 0, sphereVisible = false;

function buildSphere() {
  const D = window.DATA;
  const items = [];
  D.projects.forEach((p, i) => items.push({ kind: "project", p: i }));
  items.push({ kind: "photo" });
  const phone = innerWidth < 700;
  Object.values(D.stack).flat().slice(0, phone ? 6 : 12).forEach((w) => items.push({ kind: "word", w }));
  if (!phone) {
    D.projects.forEach((p, i) => items.push({ kind: "project", p: i }));
    items.push({ kind: "photo" });
  }
  // interleave so projects spread over the whole sphere
  const order = items.map((it, i) => [it, (i * 7) % items.length]).sort((a, b) => a[1] - b[1]).map((x) => x[0]);

  sphere.innerHTML = "";
  cards = order.map((it, i) => {
    const el = document.createElement("div");
    el.className = "card card--" + it.kind;
    if (it.kind === "project") {
      const p = D.projects[it.p];
      el.dataset.p = it.p;
      el.style.background = "var(--paper)";
      el.innerHTML = `<img src="${p.logo}" alt="" draggable="false" loading="lazy" decoding="async" />`;
    } else if (it.kind === "photo") {
      el.innerHTML = `<img src="assets/AlbertImage.jpg" alt="" draggable="false" loading="lazy" decoding="async" />`;
    } else {
      el.textContent = it.w;
      el.style.background = i % 3 ? "var(--paper)" : "#2A2926";
      if (!(i % 3)) el.style.color = "var(--paper)";
    }
    // Fibonacci sphere: even spread
    const y = 1 - (i / (order.length - 1)) * 2;
    const rr = Math.sqrt(1 - y * y), th = i * 2.39996;
    sphere.appendChild(el);
    return { el, x: Math.cos(th) * rr, y, z: Math.sin(th) * rr };
  });
  sizeSphere();
}

let R = 300;
function sizeSphere() {
  R = Math.min(innerWidth * 0.36, innerHeight * 0.36, 380);
  const w = Math.round(Math.max(80, R * 0.36));
  cards.forEach((c) => c.el.style.setProperty("--w", w + "px"));
}
addEventListener("resize", sizeSphere);

function placeCards() {
  const cy = Math.cos(rotY), sy = Math.sin(rotY), cx = Math.cos(rotX), sx = Math.sin(rotX);
  for (const c of cards) {
    // rotate around Y, then X
    let x = c.x * cy + c.z * sy, z = -c.x * sy + c.z * cy, y = c.y;
    const y2 = y * cx - z * sx; z = y * sx + z * cx; y = y2;
    const yaw = Math.atan2(x, z), pitch = -Math.asin(Math.max(-1, Math.min(1, y)));
    c.el.style.transform = `translate3d(${x * R}px, ${y * R}px, ${z * R}px) rotateY(${yaw}rad) rotateX(${pitch}rad)`;
    c.el.style.opacity = (0.2 + 0.8 * Math.max(0, (z + 0.4) / 1.4)).toFixed(3);
  }
}

let drag = null;
stage.addEventListener("pointerdown", (e) => {
  drag = { x: e.clientX, y: e.clientY, moved: 0, lx: e.clientX };
  stage.classList.add("dragging");
});
addEventListener("pointermove", (e) => {
  if (!drag) return;
  const dx = e.clientX - drag.lx;
  drag.lx = e.clientX; drag.moved += Math.abs(dx);
  velY = dx * 0.005;
  rotY += velY;
});
addEventListener("pointerup", (e) => {
  if (!drag) return;
  stage.classList.remove("dragging");
  const card = e.target.closest && e.target.closest(".card--project");
  if (drag.moved < 6 && card) openPanel(+card.dataset.p, e.clientX, e.clientY);
  drag = null;
});
addEventListener("pointercancel", () => { drag = null; stage.classList.remove("dragging"); });
new IntersectionObserver(([en]) => { sphereVisible = en.isIntersecting; }).observe(stage);

let sphereLast = 0;
function loopSphere(now) {
  requestAnimationFrame(loopSphere);
  if (!sphereVisible || !cards.length) return;
  if (!finePointer && now - sphereLast < 1000 / 30 - 2) return;
  sphereLast = now;
  if (!drag) { velY *= 0.95; rotY += velY + (reduced ? 0 : 0.0022); }
  placeCards();
}

// project rows open the same panel
$("#projects").addEventListener("click", (e) => {
  const b = e.target.closest(".prow");
  if (b) { const r = b.getBoundingClientRect(); openPanel(+b.dataset.p, r.left + 80, r.top + r.height / 2); }
});

// ---------------------------------------------------------------------
//  Project panel
// ---------------------------------------------------------------------
const panel = $("#panel");
let panelReturn = null;
let current = 0;
function fillPanel(i) {
  const D = window.DATA, p = D.projects[i], U = ui(), S = t(), th = THEME[p.id] || { sb: "#141414", sf: "#ECEAE4" };
  current = i;
  panel.style.setProperty("--sb", th.sb); panel.style.setProperty("--sf", th.sf);
  const photo = PREVIEW[p.id];
  $("#mockScreen").classList.toggle("is-logo", !photo);
  $("#mockScreen").style.background = photo ? "#fff" : (TILE[p.id] || "#fff");
  $("#panelLogo").src = photo || p.logo;
  $("#panelLogo").alt = photo ? `${p.name} website` : `${p.name} logo`;
  $("#mockUrl").textContent = p.url ? host(p.url) : (p.id === "owl" ? S.app : p.name.toLowerCase());
  // name split into letters for the staggered rise
  $("#panelName").setAttribute("aria-label", p.name);
  $("#panelName").innerHTML = `<span class="mask" aria-hidden="true">${[...p.name].map((c, k) => `<span class="c" style="--i:${k}">${c === " " ? "&nbsp;" : esc(c)}</span>`).join("")}</span>`;
  $("#panelTag").textContent = p.tagline;
  $("#panelDesc").textContent = p.desc;
  $("#panelTags").innerHTML = p.tags.map((tg) => `<li>${esc(tg)}</li>`).join("");
  // deeper dive for projects that have highlights
  const more = $("#sheetMore");
  const shots = SHOTS[p.id] || [];
  more.hidden = !p.highlights && !shots.length;
  const shotsEl = $("#sheetShots");
  shotsEl.hidden = !shots.length;
  shotsEl.innerHTML = shots.map((src, k) => `<figure class="shot" style="--i:${k}"><img src="${src}" alt="${esc(p.name)} screen ${k + 1}" loading="lazy" decoding="async" width="540" height="${p.id === "tryvo" ? 1169 : 1090}" /></figure>`).join("");
  $("#sheetFeatures").innerHTML = (p.highlights || []).map(([h, x]) => `<article class="feat"><h5>${esc(h)}</h5><p>${esc(x)}</p></article>`).join("");
  $("#folderContent").scrollTop = 0;
  $("#panelLink").innerHTML = p.url
    ? `<a class="pill" href="${esc(p.url)}" target="_blank" rel="noopener">${esc(U.visit || "Visit")} ${esc(host(p.url))}</a>`
    : `<p class="sheet__soon">${esc(p.linkLabel || "")}</p>`;
}
function openPanel(i, x, y) {
  panelReturn = document.activeElement;
  panel.style.setProperty("--px", x + "px"); panel.style.setProperty("--py", y + "px");
  hidePreview();
  fillPanel(i);
  markFront(i, false);
  panel.hidden = false;
  requestAnimationFrame(() => { panel.classList.add("is-open"); requestAnimationFrame(() => panel.classList.add("is-in")); });
  lenis && lenis.stop();
  pond && pond.pause(true);
  setTimeout(() => $("#panelClose").focus({ preventScroll: true }), 200);
}
// switch folders without closing: content drops out, the chosen folder
// opens down from its tab over the current one, new content rises in
let swapping = false;
function goToProject(next, focusTab) {
  if (swapping || panel.hidden || next === current) return;
  if (reduced) { fillPanel(next); markFront(next, false); if (focusTab) $("#tab-" + next).focus(); return; }
  swapping = true;
  panel.classList.add("is-swapping");
  panel.classList.remove("is-in");
  markFront(next, true);
  setTimeout(() => {
    fillPanel(next);
    $("#folderContent").scrollTop = 0;
    panel.classList.remove("is-swapping");
    requestAnimationFrame(() => requestAnimationFrame(() => { panel.classList.add("is-in"); swapping = false; }));
  }, 420);
  if (focusTab) $("#tab-" + next).focus({ preventScroll: true });
}
function stepPanel(dir) {
  const n = window.DATA.projects.length;
  goToProject((current + dir + n) % n);
}
function closePanel() {
  panel.classList.remove("is-open", "is-in");
  lenis && lenis.start();
  pond && pond.pause(false);
  setTimeout(() => { panel.hidden = true; }, reduced ? 0 : 1000);
  panelReturn && panelReturn.focus && panelReturn.focus({ preventScroll: true });
}
$("#sheetPrev").addEventListener("click", () => stepPanel(-1));
$("#sheetNext").addEventListener("click", () => stepPanel(1));
document.addEventListener("keydown", (e) => {
  if (panel.hidden) return;
  const onTab = e.target.closest && e.target.closest(".folder__tab");
  const n = window.DATA.projects.length;
  if (e.key === "ArrowRight") goToProject((current + 1) % n, onTab);
  if (e.key === "ArrowLeft") goToProject((current - 1 + n) % n, onTab);
});
// the frame tilts toward the cursor
if (finePointer && !reduced) panel.addEventListener("pointermove", (e) => {
  const kx = e.clientX / innerWidth - 0.5, ky = e.clientY / innerHeight - 0.5;
  $("#mock").style.setProperty("--ry", (kx * 14).toFixed(2) + "deg");
  $("#mock").style.setProperty("--rx", (-ky * 10).toFixed(2) + "deg");
});
$("#panelClose").addEventListener("click", closePanel);

// ---------------------------------------------------------------------
//  Experience rows: expand on click, cursor preview on hover
// ---------------------------------------------------------------------
const peek = $("#peek");
let peekX = 0, peekY = 0, peekTX = 0, peekTY = 0;
$("#expRows").addEventListener("click", (e) => {
  const b = e.target.closest(".erow");
  if (!b) return;
  const open = b.getAttribute("aria-expanded") !== "true";
  b.setAttribute("aria-expanded", String(open));
  $("#" + b.getAttribute("aria-controls")).classList.toggle("open", open);
  peek.classList.remove("on");
});
if (finePointer) {
  $("#expRows").addEventListener("pointerover", (e) => {
    const b = e.target.closest(".erow");
    if (!b || b.getAttribute("aria-expanded") === "true") return;
    const j = window.DATA.experience[+b.dataset.e];
    peek.innerHTML = `<b>${esc(j.role)}</b>${esc(j.points[0])}`;
    peek.classList.add("on");
  });
  $("#expRows").addEventListener("pointerout", (e) => { if (!e.relatedTarget || !e.relatedTarget.closest || !e.relatedTarget.closest(".erow")) peek.classList.remove("on"); });
  addEventListener("pointermove", (e) => { peekTX = e.clientX; peekTY = e.clientY; });
  (function loopPeek() {
    requestAnimationFrame(loopPeek);
    peekX += (peekTX - peekX) * 0.18; peekY += (peekTY - peekY) * 0.18;
    peek.style.left = peekX + "px"; peek.style.top = peekY + "px";
  })();
}

// ---------------------------------------------------------------------
//  Ink hero
// ---------------------------------------------------------------------
let ink = null;
async function startInk() {
  try {
    const { createInk } = await import("./ink.js");
    ink = createInk($("#ink"), {
      src: "assets/AlbertImage.jpg",
      reduced,
      // portrait frame: centre-right on desktop, top half on mobile
      rect: (W, H) => {
        if (W < 900) { const s = Math.min(W * 0.9, H * 0.48); return { x: (W - s) / 2, y: 70, w: s, h: s }; }
        const s = Math.min(H * 0.82, W * 0.42);
        return { x: W * 0.36 - s / 2, y: H * 0.08, w: s, h: s };
      },
    });
  } catch (e) { ink = null; }
}

// ---------------------------------------------------------------------
//  Koi pond: fixed behind the page; a click on empty space drops food
// ---------------------------------------------------------------------
let pond = null;
async function startPond() {
  try {
    const { createPond } = await import("./koi.js");
    pond = createPond($("#pond"), { reduced });
  } catch (e) { pond = null; }
}
document.addEventListener("click", (e) => {
  if (!pond || e.target.closest("a, button, input, .card, #stage, .sheet, .menu, .terminal-overlay, .erow-wrap")) return;
  pond.feed(e.clientX, e.clientY);
});

// ---------------------------------------------------------------------
//  Terminal overlay (optional mode, behaviour from terminal.js)
// ---------------------------------------------------------------------
function terminal() {
  const overlay = $("#terminalOverlay");
  let lastFocus = null;
  const open = () => {
    if (menuOpen) toggleMenu(false);
    lastFocus = document.activeElement;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    lenis && lenis.stop();
    ink && ink.pause(true);
    pond && pond.pause(true);
    if (typeof window.ensureTerminalBooted === "function") window.ensureTerminalBooted();
    setTimeout(() => window.terminalFocusInput && window.terminalFocusInput(), 80);
  };
  const close = () => {
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
    lenis && lenis.start();
    ink && ink.pause(false);
    pond && pond.pause(false);
    lastFocus && lastFocus.focus && lastFocus.focus();
  };
  $$(".js-open-terminal").forEach((b) => b.addEventListener("click", open));
  $$(".js-close-terminal").forEach((b) => b.addEventListener("click", close));
  document.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (overlay.classList.contains("open")) { if (!$(".modal.open")) { e.stopPropagation(); close(); } return; }
    if (!panel.hidden) closePanel();
    else if (menuOpen) { toggleMenu(false); menuBtn.focus(); }
  }, true);
  if (location.hash === "#terminal") open();
}

// ---------------------------------------------------------------------
//  Init
// ---------------------------------------------------------------------
render();
initPreview();
terminal();
startInk();
startPond();
loopSphere();
addEventListener("langchange", () => {
  render();
  menuBtn.firstElementChild.textContent = menuOpen ? t().close : t().menu;
});
if (location.hash.length > 1 && location.hash !== "#terminal") {
  const el = document.querySelector(location.hash);
  if (el) requestAnimationFrame(() => scrollTo(0, el.getBoundingClientRect().top + scrollY));
}
