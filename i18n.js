// =====================================================================
//  i18n.js, Traduccions (CA / ES / EN) i motor de canvi d'idioma.
//  Font única: construeix window.DATA (que consumeixen terminal.js i
//  site.js) i aplica els textos d'interfície marcats amb data-i18n.
//  Es carrega ABANS de terminal.js i site.js.
// =====================================================================

// --- Dades compartides (no es tradueixen) ---
const SHARED = {
  name: "Albert Mora Costillo",
  location: "Barcelona / Arenys de Mar",
  email: "albert.moracostillo@gmail.com",
  github: "https://github.com/albertm49",
  linkedin: "https://linkedin.com/in/albert-mora-costillo-219301226",
  stackOrder: ["languages", "webmobile", "backend", "tools"],
  stackItems: {
    languages: ["JavaScript", "TypeScript", "C#", "Java", "PHP", "SQL", "Bash"],
    webmobile: ["Angular", "HTML5", "CSS3", "Flutter"],
    backend: [".NET", "REST API", "PostgreSQL", "MongoDB", "MySQL"],
    tools: ["Git / GitHub", "Docker", "Postman", "AWS (Cognito, S3)"],
  },
  expCompanies: ["AZA", "Leviathan Creative Studios", "TwoNav"],
  projects: [
    { id: "aza", name: "AZA", url: "https://aza.family/", logo: "assets/Logo.png", accent: "aza", tags: ["Angular", "TypeScript", "C#", ".NET", "PostgreSQL", "AWS"] },
    { id: "softdev", name: "SoftDevArts", url: "https://www.softdevarts.com/", logo: "assets/logo_softdevarts.svg", accent: "softdev", tags: ["Web", "Software", "Consulting"] },
    { id: "owl", name: "OwlInstitute", url: "", logo: "assets/naranja_owl_footer.png", accent: "owl", tags: ["Flutter", "Dart", "Firebase"] },
    { id: "ekoora", name: "Ekoora", url: "", logo: "assets/logo_ekoora.png", accent: "ekoora", tags: ["WIP"] },
  ],
};

// --- Paquets d'idioma ---
const LANGS = {
  en: {
    label: "EN",
    role: "Full-Stack Developer · Computer Engineer",
    studies: "Computer Engineering, 4th year",
    taglines: ["web apps.", "mobile apps.", "clean architectures.", "real products."],
    about: [
      "Full-stack developer with a solid academic foundation and hands-on experience across the full lifecycle of web and mobile applications.",
      "Fast learner: proven ability to pick up new technologies in record time and ship working products for real clients.",
      "Focused on process optimization through automation and delivering under Agile/Scrum methodologies.",
      "Keen interest in applied AI and clean architectures (DDD, Event Sourcing).",
    ],
    stackCats: { languages: "Languages", webmobile: "Web / Mobile", backend: "Backend / Data", tools: "Tools / Cloud" },
    experience: [
      { role: "Full-Stack Developer", time: "University internship", points: [
        "Worked across the full SDLC under Agile/Scrum, improving sprint coordination and delivery.",
        "Built key features with Angular, TypeScript, .NET and C#, ensuring quality through unit testing.",
        "Managed complex versioning with Git, streamlining collaborative workflow in a professional setting.",
        "Implemented and maintained PostgreSQL and Cloud (AWS) integrations for scalable solutions.",
      ] },
      { role: "Junior Consultant", time: "Consultancy", points: [
        "Delivered critical projects for external clients, owning the technical work from learning phase to production.",
        "Mastered new technologies under tight deadlines, shipping stable products that still retain recurring users today.",
        "Integrated APIs and designed databases in Flutter, aligning business requirements with robust technical solutions.",
      ] },
      { role: "Systems Developer (Bash)", time: "Degree internship", points: [
        "Built and optimized Bash scripts to automate map-app deployment on end devices, removing repetitive manual tasks and reducing errors.",
        "Worked closely with the infrastructure team to optimize Linux-based workflows and operational efficiency.",
      ] },
    ],
    education: [
      "Computer Engineering, Management & Information Systems (4th year)",
      "Higher Technician in Multiplatform Application Development (DAM)",
    ],
    projects: {
      aza: { tagline: "Full-stack platform", desc: "Full-stack platform where I worked the complete product lifecycle and cloud architecture (AWS) in an Agile/Scrum environment.", badge: "Live" },
      softdev: { tagline: "Software studio", desc: "Custom software development studio: web, apps and digital solutions for clients.", badge: "Live" },
      owl: { tagline: "Psychology app", desc: "My first real-world project: a psychology app for the company OwlInstitute, built with Flutter and Firebase. It covered the patient–professional flow end to end.", badge: "Mobile app", linkLabel: "Built for OwlInstitute" },
      ekoora: { tagline: "In progress", desc: "Project under development. Screenshots and details coming soon.", badge: "Coming soon", linkLabel: "Details coming soon" },
    },
    ui: {
      navProjects: "Projects", navExperience: "Experience", navSkills: "Skills", navContact: "Contact", navTerminal: "Terminal",
      heroTagText: "Full-Stack Developer · Computer Engineer",
      heroLine1: "Hi, I'm Albert.", heroBuild: "I build",
      heroSub: "Junior who ships like it matters, real products for real clients, built fast and under Agile.",
      ctaProjects: "View projects", ctaCV: "Download CV", ctaTerminal: "Terminal mode",
      secAbout: "About", secProjects: "Selected work", secExperience: "Experience", secSkills: "Toolbox",
      contactTitle: "Let's build<br />something.",
      contactLead: "Open to junior full-stack / backend roles (frontend lover too). Fast to onboard, easy to work with.",
      contactEmail: "Email me", contactCvLabel: "Download CV:",
      footerHint: "psst… try terminal mode",
      available: "Available for work",
      projCount: (n, live) => `${n} projects · ${live} live`,
    },
  },

  es: {
    label: "ES",
    role: "Desarrollador Full-Stack · Ingeniero Informático",
    studies: "Ingeniería Informática, 4º año",
    taglines: ["apps web.", "apps móviles.", "arquitecturas limpias.", "productos reales."],
    about: [
      "Desarrollador full-stack con una base académica sólida y experiencia práctica en el ciclo de vida completo de aplicaciones web y móviles.",
      "Aprendizaje rápido: capacidad demostrada para dominar nuevas tecnologías en tiempo récord y entregar productos funcionales para clientes reales.",
      "Enfocado en la optimización de procesos mediante automatización y en la entrega bajo metodologías Agile/Scrum.",
      "Gran interés en la IA aplicada y las arquitecturas limpias (DDD, Event Sourcing).",
    ],
    stackCats: { languages: "Lenguajes", webmobile: "Web / Móvil", backend: "Backend / Datos", tools: "Herramientas / Cloud" },
    experience: [
      { role: "Desarrollador Full-Stack", time: "Prácticas universitarias", points: [
        "Participé en el ciclo de vida completo (SDLC) bajo Agile/Scrum, mejorando la coordinación y entrega de sprints.",
        "Desarrollé funcionalidades clave con Angular, TypeScript, .NET y C#, asegurando la calidad con pruebas unitarias.",
        "Gestioné el versionado complejo con Git, optimizando el flujo de trabajo colaborativo en un entorno profesional.",
        "Implementé y mantuve integraciones con PostgreSQL y servicios Cloud (AWS) para soluciones escalables.",
      ] },
      { role: "Consultor Junior", time: "Consultoría", points: [
        "Entregué proyectos críticos para clientes externos, asumiendo la responsabilidad técnica desde el aprendizaje hasta producción.",
        "Dominé nuevas tecnologías bajo plazos ajustados, logrando productos estables que aún mantienen usuarios recurrentes.",
        "Integré APIs y diseñé bases de datos en Flutter, alineando los requisitos del negocio con soluciones técnicas robustas.",
      ] },
      { role: "Desarrollador de Sistemas (Bash)", time: "Prácticas de grado", points: [
        "Desarrollé y optimicé scripts en Bash para automatizar el despliegue de apps de mapas en dispositivos, eliminando tareas manuales y reduciendo errores.",
        "Colaboré estrechamente con el equipo de infraestructura para optimizar flujos de trabajo en Linux y la eficiencia operativa.",
      ] },
    ],
    education: [
      "Ingeniería Informática, Sistemas de Gestión e Información (4º año)",
      "Técnico Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)",
    ],
    projects: {
      aza: { tagline: "Plataforma full-stack", desc: "Plataforma full-stack donde trabajé el ciclo completo del producto y la arquitectura en la nube (AWS) en un entorno Agile/Scrum.", badge: "Live" },
      softdev: { tagline: "Estudio de software", desc: "Estudio de desarrollo de software a medida: web, aplicaciones y soluciones digitales para clientes.", badge: "Live" },
      owl: { tagline: "App de psicología", desc: "Mi primer proyecto real: una app de psicología para la empresa OwlInstitute, desarrollada con Flutter y Firebase. Cubrió el flujo entre pacientes y profesionales de principio a fin.", badge: "App móvil", linkLabel: "Hecho para OwlInstitute" },
      ekoora: { tagline: "En desarrollo", desc: "Proyecto en desarrollo. Capturas y detalles disponibles pronto.", badge: "Próximamente", linkLabel: "Detalles pronto" },
    },
    ui: {
      navProjects: "Proyectos", navExperience: "Experiencia", navSkills: "Tecnologías", navContact: "Contacto", navTerminal: "Terminal",
      heroTagText: "Desarrollador Full-Stack · Ingeniero Informático",
      heroLine1: "Hola, soy Albert.", heroBuild: "Construyo",
      heroSub: "Junior que entrega como si importara, productos reales para clientes reales, rápido y bajo Agile.",
      ctaProjects: "Ver proyectos", ctaCV: "Descargar CV", ctaTerminal: "Modo terminal",
      secAbout: "Sobre mí", secProjects: "Proyectos", secExperience: "Experiencia", secSkills: "Tecnologías",
      contactTitle: "Construyamos<br />algo.",
      contactLead: "Disponible para posiciones junior full-stack / backend (también me encanta el frontend). Rápido de incorporar y fácil para trabajar.",
      contactEmail: "Escríbeme", contactCvLabel: "Descargar CV:",
      footerHint: "psst… prueba el modo terminal",
      available: "Disponible para trabajar",
      projCount: (n, live) => `${n} proyectos · ${live} online`,
    },
  },

  ca: {
    label: "CA",
    role: "Desenvolupador Full-Stack · Enginyer Informàtic",
    studies: "Enginyeria Informàtica, 4t any",
    taglines: ["apps web.", "apps mòbils.", "arquitectures netes.", "productes reals."],
    about: [
      "Desenvolupador full-stack amb una base acadèmica sòlida i experiència pràctica en el cicle de vida complet d'aplicacions web i mòbils.",
      "Aprenentatge ràpid: capacitat demostrada per dominar noves tecnologies en temps rècord i entregar productes funcionals per a clients reals.",
      "Enfocat en l'optimització de processos mitjançant l'automatització i en l'entrega sota metodologies Agile/Scrum.",
      "Gran interès en la IA aplicada i les arquitectures netes (DDD, Event Sourcing).",
    ],
    stackCats: { languages: "Llenguatges", webmobile: "Web / Mòbil", backend: "Backend / Dades", tools: "Eines / Cloud" },
    experience: [
      { role: "Desenvolupador Full-Stack", time: "Pràctiques universitàries", points: [
        "Vaig participar en el cicle de vida complet (SDLC) sota Agile/Scrum, millorant la coordinació i entrega de sprints.",
        "Vaig desenvolupar funcionalitats clau amb Angular, TypeScript, .NET i C#, assegurant la qualitat amb proves unitàries.",
        "Vaig gestionar el versionat complex amb Git, optimitzant el flux de treball col·laboratiu en un entorn professional.",
        "Vaig implementar i mantenir integracions amb PostgreSQL i serveis Cloud (AWS) per a solucions escalables.",
      ] },
      { role: "Consultor Júnior", time: "Consultoria", points: [
        "Vaig entregar projectes crítics per a clients externs, assumint la responsabilitat tècnica des de l'aprenentatge fins a producció.",
        "Vaig dominar noves tecnologies amb terminis ajustats, aconseguint productes estables que encara mantenen usuaris recurrents.",
        "Vaig integrar APIs i dissenyar bases de dades en Flutter, alineant els requisits del negoci amb solucions tècniques robustes.",
      ] },
      { role: "Desenvolupador de Sistemes (Bash)", time: "Pràctiques de grau", points: [
        "Vaig desenvolupar i optimitzar scripts en Bash per automatitzar el desplegament d'apps de mapes en dispositius, eliminant tasques manuals i reduint errors.",
        "Vaig col·laborar estretament amb l'equip d'infraestructura per optimitzar fluxos de treball en Linux i l'eficiència operativa.",
      ] },
    ],
    education: [
      "Enginyeria Informàtica, Sistemes de Gestió i Informació (4t any)",
      "Tècnic Superior en Desenvolupament d'Aplicacions Multiplataforma (DAM)",
    ],
    projects: {
      aza: { tagline: "Plataforma full-stack", desc: "Plataforma full-stack on vaig treballar el cicle complet del producte i l'arquitectura al núvol (AWS) en un entorn Agile/Scrum.", badge: "Live" },
      softdev: { tagline: "Estudi de software", desc: "Estudi de desenvolupament de software a mida: web, aplicacions i solucions digitals per a clients.", badge: "Live" },
      owl: { tagline: "App de psicologia", desc: "El meu primer projecte real: una app de psicologia per a l'empresa OwlInstitute, desenvolupada amb Flutter i Firebase. Va cobrir el flux entre pacients i professionals de principi a fi.", badge: "App mòbil", linkLabel: "Fet per a OwlInstitute" },
      ekoora: { tagline: "En desenvolupament", desc: "Projecte en desenvolupament. Captures i detalls disponibles aviat.", badge: "Aviat", linkLabel: "Detalls aviat" },
    },
    ui: {
      navProjects: "Projectes", navExperience: "Experiència", navSkills: "Tecnologies", navContact: "Contacte", navTerminal: "Terminal",
      heroTagText: "Desenvolupador Full-Stack · Enginyer Informàtic",
      heroLine1: "Hola, soc l'Albert.", heroBuild: "Construeixo",
      heroSub: "Júnior que entrega com si importés, productes reals per a clients reals, ràpid i sota Agile.",
      ctaProjects: "Veure projectes", ctaCV: "Descarregar CV", ctaTerminal: "Mode terminal",
      secAbout: "Sobre mi", secProjects: "Projectes", secExperience: "Experiència", secSkills: "Tecnologies",
      contactTitle: "Construïm<br />alguna cosa.",
      contactLead: "Disponible per a posicions júnior full-stack / backend (també m'encanta el frontend). Ràpid d'incorporar i fàcil per treballar.",
      contactEmail: "Escriu-me", contactCvLabel: "Descarregar CV:",
      footerHint: "psst… prova el mode terminal",
      available: "Disponible per treballar",
      projCount: (n, live) => `${n} projectes · ${live} online`,
    },
  },
};

// --- Motor ---
const LANG_KEY = "amc-lang";

function getLang() {
  // Base per defecte: anglès. Només s'usa una altra llengua si l'usuari l'ha triat.
  const stored = (() => { try { return localStorage.getItem(LANG_KEY); } catch { return null; } })();
  return stored && LANGS[stored] ? stored : "en";
}

function buildData(lang) {
  const L = LANGS[lang] || LANGS.en;
  const stack = {};
  SHARED.stackOrder.forEach((k) => { stack[L.stackCats[k]] = SHARED.stackItems[k]; });
  const projects = SHARED.projects.map((p) => ({ ...p, ...L.projects[p.id] }));
  const experience = L.experience.map((e, i) => ({
    role: e.role, company: SHARED.expCompanies[i], time: e.time, points: e.points,
  }));
  return {
    name: SHARED.name, role: L.role, location: SHARED.location, studies: L.studies,
    email: SHARED.email, github: SHARED.github, linkedin: SHARED.linkedin,
    about: L.about, stack, experience, education: L.education, taglines: L.taglines, projects,
  };
}

function applyUI(lang) {
  const ui = (LANGS[lang] || LANGS.en).ui;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const v = ui[el.getAttribute("data-i18n")];
    if (typeof v === "string") el.textContent = v;
  });
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const v = ui[el.getAttribute("data-i18n-html")];
    if (typeof v === "string") el.innerHTML = v;
  });
}

function setActiveSwitch(lang) {
  document.querySelectorAll(".lang-switch button").forEach((b) => {
    const on = b.getAttribute("data-lang") === lang;
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
}

function setLang(lang) {
  if (!LANGS[lang]) lang = "en";
  try { localStorage.setItem(LANG_KEY, lang); } catch {}
  document.documentElement.lang = lang;
  window.DATA = buildData(lang);
  applyUI(lang);
  setActiveSwitch(lang);
  window.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
}

// Exposa per a site.js / terminal.js
window.I18N = { langs: LANGS, getLang, setLang, buildData, uiFor: (l) => (LANGS[l] || LANGS.en).ui };

// --- Inicialització (els scripts són al final del body: el DOM ja existeix) ---
(function initI18n() {
  const lang = getLang();
  document.documentElement.lang = lang;
  window.DATA = buildData(lang);
  applyUI(lang);
  setActiveSwitch(lang);
  document.querySelectorAll(".lang-switch button").forEach((b) => {
    b.addEventListener("click", () => setLang(b.getAttribute("data-lang")));
  });
})();
