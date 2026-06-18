// =====================================================================
//  site.js — Landing (pàgina principal) + obertura del "Terminal mode"
//  Reutilitza l'objecte DATA definit a terminal.js (mateixa font de dades).
// =====================================================================
(function () {
  "use strict";

  const D = window.DATA || (typeof DATA !== "undefined" ? DATA : null);
  if (!D) return;

  const esc = (s) =>
    String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

  const hostname = (u) => {
    try { return new URL(u).hostname.replace(/^www\./, ""); }
    catch { return u; }
  };

  const $ = (id) => document.getElementById(id);
  const setHTML = (id, html) => { const el = $(id); if (el) el.innerHTML = html; };

  // ---------- About ----------
  setHTML("aboutText", D.about.map((p) => `<p>${esc(p)}</p>`).join(""));

  // ---------- Projects (landing + finestra del terminal) ----------
  function projCard(p) {
    const tags = p.tags.map((t) => `<span class="tag">${esc(t)}</span>`).join("");
    const isSoon = !p.url && /soon/i.test(p.badge || "");
    const cover = p.logo
      ? `<img class="proj-card__logo" src="${p.logo}" alt="${esc(p.name)} logo" loading="lazy" />`
      : `<span class="proj-card__name">${esc(p.name)}</span>`;
    const link = p.url
      ? `<span class="proj-card__link">Visit ${esc(hostname(p.url))} →</span>`
      : `<span class="proj-card__link is-soon">${esc(p.linkLabel || "Details coming soon")}</span>`;
    const inner =
      `<div class="proj-card__thumb proj-card__thumb--${p.accent}">` +
        cover +
        `<span class="proj-card__badge${isSoon ? " is-soon" : ""}">${esc(p.badge)}</span>` +
      `</div>` +
      `<div class="proj-card__body">` +
        `<h3 class="proj-card__title">${esc(p.name)} <span class="proj-card__tagline">${esc(p.tagline)}</span></h3>` +
        `<p class="proj-card__desc">${esc(p.desc)}</p>` +
        `<div class="proj-card__tags">${tags}</div>` +
        link +
      `</div>`;
    return p.url
      ? `<a class="proj-card" href="${p.url}" target="_blank" rel="noopener">${inner}</a>`
      : `<div class="proj-card proj-card--soon">${inner}</div>`;
  }
  const projectsHTML = D.projects.map(projCard).join("");
  setHTML("projGrid", projectsHTML);       // landing
  setHTML("projectsGrid", projectsHTML);   // finestra dins del terminal

  // ---------- Experience ----------
  setHTML(
    "timeline",
    D.experience
      .map(
        (job) =>
          `<div class="tl-item">` +
            `<div class="tl-dot"></div>` +
            `<div class="tl-content">` +
              `<h3 class="tl-role">${esc(job.role)} <span class="tl-company">@ ${esc(job.company)}</span></h3>` +
              `<span class="tl-time">${esc(job.time)}</span>` +
              `<ul class="tl-points">${job.points.map((pt) => `<li>${esc(pt)}</li>`).join("")}</ul>` +
            `</div>` +
          `</div>`
      )
      .join("")
  );

  // ---------- Skills ----------
  setHTML(
    "skillsList",
    Object.entries(D.stack)
      .map(
        ([cat, items]) =>
          `<div class="skill-group">` +
            `<span class="skill-cat">${esc(cat)}</span>` +
            `<div class="skill-tags">${items.map((i) => `<span class="tag">${esc(i)}</span>`).join("")}</div>` +
          `</div>`
      )
      .join("")
  );

  // ---------- Education ----------
  setHTML(
    "eduList",
    `<h3 class="edu__title">Education</h3>` +
      `<ul class="edu__list">${D.education.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>`
  );

  // ---------- Hero: paraules rotatives amb efecte màquina d'escriure ----------
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));
  const typedEl = $("heroTyped");
  if (typedEl && Array.isArray(D.taglines) && D.taglines.length) {
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      typedEl.textContent = D.taglines[0];
    } else {
      (async function loop() {
        let i = 0;
        // eslint-disable-next-line no-constant-condition
        while (true) {
          const w = D.taglines[i % D.taglines.length];
          for (let c = 1; c <= w.length; c++) { typedEl.textContent = w.slice(0, c); await wait(70); }
          await wait(1500);
          for (let c = w.length; c >= 0; c--) { typedEl.textContent = w.slice(0, c); await wait(32); }
          await wait(260);
          i++;
        }
      })();
    }
  }

  // ---------- Terminal mode (overlay) ----------
  const overlay = $("terminalOverlay");

  function openTerminal() {
    if (!overlay) return;
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("no-scroll");
    if (typeof window.ensureTerminalBooted === "function") window.ensureTerminalBooted();
    setTimeout(() => {
      if (typeof window.terminalFocusInput === "function") window.terminalFocusInput();
    }, 80);
  }

  function closeTerminal() {
    if (!overlay) return;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("no-scroll");
  }

  document.querySelectorAll(".js-open-terminal").forEach((b) => b.addEventListener("click", openTerminal));
  document.querySelectorAll(".js-close-terminal").forEach((b) => b.addEventListener("click", closeTerminal));

  // Esc tanca l'overlay (però si hi ha un modal obert, deixa que el tanqui terminal.js).
  // Fase de captura perquè s'avalui abans que terminal.js tanqui el modal.
  document.addEventListener(
    "keydown",
    (e) => {
      if (e.key !== "Escape" || !overlay || !overlay.classList.contains("open")) return;
      if (document.querySelector(".modal.open")) return; // hi ha un modal: que es tanqui ell
      e.stopPropagation();
      closeTerminal();
    },
    true
  );
})();
