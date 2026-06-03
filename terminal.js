// =====================================================================
//  Portfolio en mode terminal — Albert Mora Costillo
//  Edita l'objecte DATA per actualitzar el contingut. El motor és a sota.
// =====================================================================

const DATA = {
  name: "Albert Mora Costillo",
  role: "Junior Full-Stack Developer (Frontend focus)",
  location: "Barcelona / Arenys de Mar",
  studies: "Computer Engineering — 4th year",
  email: "albert.moracostillo@gmail.com",
  github: "https://github.com/albertm49",
  linkedin: "https://linkedin.com/in/albert-mora-costillo-219301226",

  about: [
    "Junior Full-Stack Developer specializing in Frontend. Solid background in Multiplatform Application Development (DAM).",
    "Versatile junior developer with a strong focus on frontend and expanding backend expertise.",
    "Extensive experience in DAM, including 1 year of technical leadership in consulting, managing real-world projects for external clients.",
    "Hands-on experience with the full development lifecycle of a mobile-first PWA (Full-stack Angular/TypeScript and .NET/C#).",
    "Proficient in designing REST API endpoints, working with SQL databases (PostgreSQL), and integrating cloud services (AWS Cognito, S3).",
    "Deep interest in applied Artificial Intelligence, including the supervised use of AI agents to learn advanced architectures",
    "(DDD, Event Sourcing).",
  ],

  stack: {
    Languages: ["Java", "PHP", "C# (basic)", "JavaScript", "SQL", "REST API Development", "Bash"],
    Databases: ["MySQL", "MongoDB (basic)", "PostgreSQL"],
    Tools: ["Git / GitHub", "Fork", "Docker", "Postman"],
    Mobile: ["Flutter", "Java"],
    Web: ["HTML", "CSS"],
  },

  experience: [
    {
      role: "Frontend Developer / Technical Lead",
      company: "Leviathan Creative Studios",
      time: "1 year · Consultancy",
      points: [
        "Worked on 3 projects for external companies (web & mobile apps).",
        "Developed applications using Flutter.",
        "Database design and API integration.",
      ],
    },
    {
      role: "Junior Bash Developer",
      company: "TwoNav",
      time: "6 months · Internship",
      points: [
        "Developed and maintained Bash scripts to automate sysadmin tasks.",
        "Collaborated with the technical team to optimize Linux-based workflows.",
      ],
    },
    {
      role: "Full-Stack Developer",
      company: "AZA",
      time: "4 months · Internship",
      points: [
        "Full-stack dev (Angular, HTML, CSS, TypeScript, C#, PostgreSQL) in an Agile environment.",
        "Covered the full product lifecycle and cloud architecture (AWS).",
        "Version control with GitHub, Agile methodologies, and optimization through AI.",
      ],
    },
  ],

  education: [
    "Bachelor's Degree in Computer Engineering (Information Systems specialization) — 4th year",
    "Higher Technician in Multiplatform Application Development (DAM)",
  ],
};

const ASCII = String.raw`
   ___    __ __              __
  / _ |  / // /  ___  ____  / /_
 / __ | / // _ \/ -_)/ __/ / __/
/_/ |_|/_//_.__/\__//_/    \__/
`;

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
    print('<span class="yellow bold">// About me</span>');
    DATA.about.forEach((l) => print(esc(l)));
  },

  skills() {
    print('<span class="yellow bold">// Tech stack</span>');
    for (const [cat, items] of Object.entries(DATA.stack)) {
      print(`  <span class="cyan bold">${cat.padEnd(11)}</span> ${items.join(" · ")}`);
    }
  },

  experience() {
    print('<span class="yellow bold">// Experience</span>');
    DATA.experience.forEach((job) => {
      print(`\n  <span class="green bold">${esc(job.role)}</span> <span class="muted">@ ${esc(job.company)}</span>`);
      print(`  <span class="purple">${esc(job.time)}</span>`);
      job.points.forEach((p) => print(`    <span class="muted">-</span> ${esc(p)}`));
    });
  },

  education() {
    print('<span class="yellow bold">// Education</span>');
    DATA.education.forEach((e) => print(`  <span class="muted">·</span> ${esc(e)}`));
  },

  contact() {
    print('<span class="yellow bold">// Contact</span>');
    print(`  Email:    <a href="mailto:${DATA.email}">${DATA.email}</a>`);
    print(`  GitHub:   <a href="${DATA.github}" target="_blank" rel="noopener">${DATA.github}</a>`);
    print(`  LinkedIn: <a href="${DATA.linkedin}" target="_blank" rel="noopener">${DATA.linkedin}</a>`);
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
  projects: "experience",
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

// ---------- Aparició suau del contingut de cada pantalla ----------
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

// ---------- Navegació pantalla a pantalla (un gest = una pantalla) ----------
// Controla el scroll de roda/trackpad perquè s'aturi sempre a cada pantalla
// i no se'n salti cap per inèrcia.
const snapEl = document.querySelector(".snap");
const sections = Array.from(document.querySelectorAll(".snap > section"));
let current = 0;
let isAnimating = false;
let animTimer = null;

function goTo(index) {
  index = Math.max(0, Math.min(sections.length - 1, index));
  current = index;
  isAnimating = true;
  snapEl.scrollTo({ top: index * window.innerHeight, behavior: "smooth" });
  clearTimeout(animTimer);
  animTimer = setTimeout(() => (isAnimating = false), 800);
}

if (snapEl && sections.length) {
  // Mantén "current" sincronitzat si l'usuari arriba per altres mitjans (tàctil, enllaços)
  snapEl.addEventListener("scroll", () => {
    if (!isAnimating) current = Math.round(snapEl.scrollTop / window.innerHeight);
  });

  // Roda / trackpad
  snapEl.addEventListener(
    "wheel",
    (e) => {
      const lastIndex = sections.length - 1;

      // A la terminal: deixa el scroll natural dins la finestra,
      // però si fas scroll amunt i ja ets a dalt, torna a la pantalla anterior.
      if (current >= lastIndex) {
        if (e.deltaY < 0) {
          const body = document.getElementById("output");
          if (!body || body.scrollTop <= 0) {
            e.preventDefault();
            goTo(current - 1);
          }
        }
        return;
      }

      // A les pantalles d'intro: un gest mou exactament una pantalla
      e.preventDefault();
      if (isAnimating) return;
      if (e.deltaY > 20) goTo(current + 1);
      else if (e.deltaY < -20) goTo(current - 1);
    },
    { passive: false }
  );

  // Teclat (fletxes, espai, Re Pàg/Av Pàg) quan no escrius a la terminal
  document.addEventListener("keydown", (e) => {
    if (document.activeElement === document.getElementById("cmdInput")) return;
    if (["ArrowDown", "PageDown", " "].includes(e.key)) {
      e.preventDefault();
      goTo(current + 1);
    } else if (["ArrowUp", "PageUp"].includes(e.key)) {
      e.preventDefault();
      goTo(current - 1);
    }
  });
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
if (photoIcon) photoIcon.addEventListener("click", () => openModal(document.getElementById("photoModal")));
if (cvIcon) cvIcon.addEventListener("click", () => openModal(document.getElementById("cvModal")));

// Qualsevol element amb data-close tanca el seu popup (creueta o fons)
document.querySelectorAll("[data-close]").forEach((el) =>
  el.addEventListener("click", () => closeModal(el.closest(".modal")))
);
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAllModals();
});

// Arrenca la terminal només quan la secció entra a la vista (un sol cop)
let booted = false;
const section = document.querySelector(".terminal-section");

if (section && "IntersectionObserver" in window) {
  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !booted) {
          booted = true;
          boot();
          obs.disconnect();
        }
      });
    },
    { threshold: 0.4 }
  );
  obs.observe(section);
} else {
  boot();
}