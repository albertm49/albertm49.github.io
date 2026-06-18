// =====================================================================
//  Portfolio en mode terminal - Albert Mora Costillo
//  Edita l'objecte DATA per actualitzar el contingut. El motor és a sota.
// =====================================================================

// Dades: construïdes per i18n.js segons l'idioma actiu (font única de contingut).
// Es reassigna en canviar d'idioma perquè la terminal també reflecteixi el canvi.
let DATA = window.DATA;
window.addEventListener("langchange", () => { DATA = window.DATA; });

const ASCII = String.raw`
   ___    __ __              __
  / _ |  / // /  ___  ____  / /_
 / __ | / // _ \/ -_)/ __/ / __/
/_/ |_|/_//_.__/\__//_/    \__/
`;

// Logo compacte (inicial "A") per a la sortida estil neofetch
const ASCII_MINI = String.raw`   ___
  / _ |
 / __ |
/_/ |_|`;

const output = document.getElementById("output");
const input = document.getElementById("cmdInput");
const terminal = document.getElementById("terminal");

let history = [];
let historyIndex = -1;

// ---------- Utilitats per imprimir ----------
function print(html = "", className = "") {
  const div = document.createElement("div");
  div.className = "line " + className;
  div.innerHTML = html;
  output.appendChild(div);
  scrollDown();
  return div;
}

function scrollDown() {
  output.scrollTop = output.scrollHeight;
}

function esc(str) {
  return String(str).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
}

// ---------- Comandes ----------
const COMMANDS = {
  help() {
    print('<span class="yellow bold">Available commands:</span>');
    const list = [
      ["help", "show this help"],
      ["about", "who I am"],
      ["skills", "my tech stack"],
      ["experience", "work & project experience"],
      ["projects", "open the projects window"],
      ["education", "my studies"],
      ["contact", "how to reach me"],
      ["whoami", "quick info"],
      ["deploy", "deploy --target=job"],
      ["clear", "clear the screen"],
    ];
    list.forEach(([cmd, desc]) =>
      print(`  <span class="green bold">${cmd.padEnd(12)}</span><span class="muted">${desc}</span>`)
    );
    print('\n<span class="muted">Tip: use ↑ ↓ for history and Tab to autocomplete.</span>');
  },

  about() {
    // Capçalera estil neofetch: logo ASCII + taula de dades
    const rows = [
      ["Role", DATA.role],
      ["Focus", "Backend · loves frontend"],
      ["Place", DATA.location],
      ["Study", DATA.studies],
      ["Email", DATA.email],
    ];
    const info = rows
      .map(([k, v]) => `<div class="nf-row"><span class="nf-key">${k}</span><span class="nf-val">${esc(v)}</span></div>`)
      .join("");

    print(
      `<div class="neofetch">` +
        `<pre class="neofetch__logo">${ASCII_MINI}</pre>` +
        `<div class="neofetch__info">` +
          `<div class="neofetch__name">${esc(DATA.name)}</div>` +
          `<div class="neofetch__rule"></div>` +
          info +
        `</div>` +
      `</div>`
    );

    print('<span class="yellow bold">// About me</span>');
    DATA.about.forEach((l) => print(`<span class="muted">•</span> ${esc(l)}`, "bullet"));
  },

  skills() {
    print('<span class="yellow bold">// Tech stack</span>');
    for (const [cat, items] of Object.entries(DATA.stack)) {
      const chips = items.map((i) => `<span class="chip">${esc(i)}</span>`).join("");
      print(
        `<span class="nf-key cyan bold">${esc(cat)}</span><span class="chips">${chips}</span>`,
        "kv-row"
      );
    }
  },

  experience() {
    print('<span class="yellow bold">// Experience</span>');
    DATA.experience.forEach((job) => {
      print(
        `<span class="green bold">●</span> <span class="green bold">${esc(job.role)}</span> <span class="muted">@ ${esc(job.company)}</span>`,
        "xp-head"
      );
      print(`<span class="purple">${esc(job.time)}</span>`, "xp-time");
      job.points.forEach((p, i) => {
        const branch = i === job.points.length - 1 ? "└" : "├";
        print(`<span class="muted">${branch}</span> ${esc(p)}`, "xp-point");
      });
    });
  },

  education() {
    print('<span class="yellow bold">// Education</span>');
    DATA.education.forEach((e) => print(`<span class="cyan bold">●</span> ${esc(e)}`, "edu-row"));
  },

  projects() {
    print('<span class="muted">Opening Projects window...</span>');
    const m = document.getElementById("projectsModal");
    if (m) openModal(m);
  },

  contact() {
    print('<span class="yellow bold">// Contact</span>');
    const rows = [
      ["Email", `<a href="mailto:${DATA.email}">${esc(DATA.email)}</a>`],
      ["GitHub", `<a href="${DATA.github}" target="_blank" rel="noopener">${esc(DATA.github)}</a>`],
      ["LinkedIn", `<a href="${DATA.linkedin}" target="_blank" rel="noopener">${esc(DATA.linkedin)}</a>`],
    ];
    rows.forEach(([k, v]) =>
      print(`<span class="nf-key cyan bold">${k}</span><span class="nf-val">${v}</span>`, "kv-row")
    );
  },

  whoami() {
    print(`<span class="green bold">${esc(DATA.name)}</span>`);
    print(`<span class="muted">${esc(DATA.role)}</span>`);
    print(`<span class="muted">${esc(DATA.location)} · ${esc(DATA.studies)}</span>`);
  },

  async deploy() {
    print('<span class="muted">C:\\Users\\albert&gt; deploy --target=job</span>');
    const bar = print('<span class="green">[                    ]</span> 0%');
    for (let i = 1; i <= 20; i++) {
      await sleep(60);
      bar.innerHTML = `<span class="green">[${"#".repeat(i)}${" ".repeat(20 - i)}]</span> ${i * 5}%`;
      scrollDown();
    }
    print('<span class="green bold">Status: Ready.</span> <span class="muted">// Let\'s build something great together.</span>');
  },

  clear() {
    output.innerHTML = "";
  },
};

// Àlies
const ALIASES = {
  ls: "help",
  "?": "help",
  cls: "clear",
  work: "experience",
  studies: "education",
  links: "contact",
};

// ---------- Executar una comanda ----------
async function runCommand(raw) {
  const cmd = raw.trim().toLowerCase();
  print(
    `<span class="prompt"><span class="prompt__user">visitant@albert</span>:<span class="prompt__path">~</span>$ </span>${esc(raw)}`,
    "cmd-echo"
  );

  if (!cmd) return;
  history.push(raw);
  historyIndex = history.length;

  const resolved = ALIASES[cmd] || cmd;
  if (COMMANDS[resolved]) {
    await COMMANDS[resolved]();
  } else {
    print(`<span class="red">command not found: ${esc(cmd)}</span>`);
    print('<span class="muted">Type <span class="green">help</span> to see the options.</span>');
  }
}

// ---------- Teclat ----------
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    const value = input.value;
    input.value = "";
    runCommand(value);
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    if (historyIndex > 0) {
      historyIndex--;
      input.value = history[historyIndex];
    }
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    if (historyIndex < history.length - 1) {
      historyIndex++;
      input.value = history[historyIndex];
    } else {
      historyIndex = history.length;
      input.value = "";
    }
  } else if (e.key === "Tab") {
    e.preventDefault();
    const partial = input.value.trim().toLowerCase();
    if (!partial) return;
    const match = Object.keys(COMMANDS).find((c) => c.startsWith(partial));
    if (match) input.value = match;
  } else if (e.key === "l" && e.ctrlKey) {
    e.preventDefault();
    COMMANDS.clear();
  }
});

// Manté el focus a l'input quan es fa clic dins la terminal
terminal.addEventListener("click", () => input.focus());

// ---------- Pantalla d'arrencada del sistema (full screen) ----------
async function bootScreen() {
  const screen = document.getElementById("bootscreen");
  const log = document.getElementById("bootLog");
  const bar = document.getElementById("bootBar");
  if (!screen || !log) return;

  const steps = [
    "Loading kernel modules",
    "Mounting /home/albert",
    "Starting network manager",
    "Starting portfolio.service",
    "Loading projects & experience",
    "Initializing desktop environment",
    "Reached target Graphical Interface",
  ];

  for (let i = 0; i < steps.length; i++) {
    const line = document.createElement("div");
    line.innerHTML = `<span class="boot-ok">[  OK  ]</span> ${steps[i]}`;
    log.appendChild(line);
    if (bar) bar.style.width = `${Math.round(((i + 1) / steps.length) * 100)}%`;
    await sleep(260);
  }

  await sleep(550);
  screen.classList.add("hide"); // fosa
  await sleep(650);
  screen.style.display = "none";
}

// ---------- Arrencada: pantalla de sistema -> benvinguda de la consola ----------
async function boot() {
  // 1) Inicialització del sistema a pantalla completa
  await bootScreen();

  // 2) Banner ASCII a la consola ja visible
  const asciiDiv = document.createElement("div");
  asciiDiv.className = "line ascii";
  asciiDiv.textContent = ASCII;
  output.appendChild(asciiDiv);
  scrollDown();

  const bootLines = [
    `<span class="green bold">${esc(DATA.name)}</span>`,
    `<span class="muted">${esc(DATA.role)}</span>`,
    `<span class="muted">${esc(DATA.location)} · ${esc(DATA.studies)}</span>`,
    "",
    `Type <span class="green bold">help</span> and press Enter to start.`,
    "",
  ];

  for (const l of bootLines) {
    print(l);
    await sleep(120);
  }
  input.focus();
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ---------- Hero: efecte màquina d'escriure ----------
async function typeText(el, text, speed = 55) {
  el.classList.add("typing");
  for (let i = 0; i < text.length; i++) {
    el.textContent += text[i];
    await sleep(speed);
  }
  el.classList.remove("typing");
}

// ---------- Aparició suau del contingut en fer scroll (reutilitzat per la landing) ----------
if ("IntersectionObserver" in window) {
  const animObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in");
      });
    },
    { threshold: 0.35 }
  );
  document.querySelectorAll(".anim").forEach((el) => animObs.observe(el));
} else {
  document.querySelectorAll(".anim").forEach((el) => el.classList.add("in"));
}

// ---------- Rellotge del panel (estil escriptori) ----------
const clock = document.getElementById("clock");
function tick() {
  if (!clock) return;
  const now = new Date();
  const hh = String(now.getHours()).padStart(2, "0");
  const mm = String(now.getMinutes()).padStart(2, "0");
  clock.textContent = `${hh}:${mm}`;
}
tick();
setInterval(tick, 1000 * 20);

// ---------- Popups (foto i CV) ----------
function openModal(modal) {
  if (!modal) return;
  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
}
function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
}
function closeAllModals() {
  document.querySelectorAll(".modal.open").forEach(closeModal);
}

const photoIcon = document.getElementById("photoIcon");
const cvIcon = document.getElementById("cvIcon");
const projectsIcon = document.getElementById("projectsIcon");
if (photoIcon) photoIcon.addEventListener("click", () => openModal(document.getElementById("photoModal")));
if (cvIcon) cvIcon.addEventListener("click", () => openModal(document.getElementById("cvModal")));
if (projectsIcon) projectsIcon.addEventListener("click", () => openModal(document.getElementById("projectsModal")));

// Qualsevol element amb data-close tanca el seu popup (creueta o fons)
document.querySelectorAll("[data-close]").forEach((el) =>
  el.addEventListener("click", () => closeModal(el.closest(".modal")))
);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllModals();
});

// Arrenca la terminal un sol cop, quan s'obre el "Terminal mode" (cridat des de site.js)
let booted = false;
function ensureTerminalBooted() {
  if (booted) return;
  booted = true;
  boot();
}
// Exposa funcions per a site.js (landing)
window.ensureTerminalBooted = ensureTerminalBooted;
window.terminalFocusInput = () => input && input.focus();