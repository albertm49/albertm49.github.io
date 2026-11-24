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
  stackOrder: ["languages", "webmobile", "backend", "ai", "tools"],
  stackItems: {
    ai: ["n8n", "AI Agents", "Claude", "OpenAI Codex", "Prompt Engineering", "API integration"],
    languages: ["JavaScript", "TypeScript", "C#", "Java", "PHP", "SQL", "Bash"],
    webmobile: ["Angular", "HTML5", "CSS3", "Flutter"],
    backend: [".NET", "REST API", "PostgreSQL", "MongoDB", "MySQL"],
    tools: ["Git / GitHub", "Docker", "Postman", "AWS (Cognito, S3)"],
  },
  expCompanies: ["Sofa Events", "Codelearn", "SoftDevArts", "Leviathan Creative Studios", "TwoNav"],
  projects: [
    { id: "tryvo", name: "Tryvo", url: "", logo: "assets/logo_tryvo.svg", accent: "tryvo", tags: ["Flutter", "Dart", "Riverpod", "Supabase", "PostgreSQL", "Edge Functions", "Gemini"] },
    { id: "aza", name: "AZA", url: "https://aza.family/", logo: "assets/Logo.webp", accent: "aza", tags: ["Angular", "TypeScript", "C#", ".NET", "PostgreSQL", "AWS"] },
    { id: "softdev", name: "SoftDevArts", url: "https://www.softdevarts.com/", logo: "assets/logo_softdevarts.svg", accent: "softdev", tags: ["Web", "Responsive", "SEO"] },
    { id: "owl", name: "OwlInstitute", url: "", logo: "assets/naranja_owl_footer.png", accent: "owl", tags: ["Flutter", "Dart", "Firebase"] },
    { id: "ekoora", name: "Ekoora", url: "", logo: "assets/logo_ekoora_sm.webp", accent: "ekoora", tags: ["EdTech", "Gamification", "Real-time", "Supabase / Firestore"] },
  ],
};

// --- Paquets d'idioma ---
const LANGS = {
  en: {
    label: "EN",
    cv: "assets/CvAlbertMoraEng.pdf",
    role: "Full-Stack Developer · Computer Engineer",
    studies: "Computer Engineering, 4th year",
    taglines: ["web apps.", "mobile apps.", "clean architectures.", "real products."],
    about: [
      "Full-stack developer with a solid academic foundation and hands-on experience across the full lifecycle of web and mobile applications.",
      "Fast learner: proven ability to pick up new technologies in record time and ship working products for real clients.",
      "Focused on process optimization through automation and delivering under Agile/Scrum methodologies.",
      "Keen interest in applied AI and clean architectures (DDD, Event Sourcing).",
    ],
    stackCats: { languages: "Languages", webmobile: "Web / Mobile", backend: "Backend / Data", ai: "AI / Automation", tools: "Tools / Cloud" },
    experience: [
      { role: "AI Software Engineer (Intern)", time: "Internship, Sept 2026 to now", points: [
        "Building automated workflows with n8n and AI agents that speed up the company's daily tasks.",
        "Integrating APIs and AI models (Claude, OpenAI Codex) into internal processes.",
        "Maintaining the company's infrastructure and making sure everything runs smoothly.",
        "On site in Vilassar de Dalt.",
      ] },
      { role: "STEM Instructor: Robotics, Coding & 3D Design", time: "Summer camp, Aug 2026", points: [
        "Taught robotics and 3D design to young kids at a summer camp in Premià de Mar.",
        "Built and programmed robots with LEGO Mindstorms, and introduced 3D design with Tinkercad so they could print their own creations.",
        "Kept it fun and hands-on, sparking curiosity about technology and teamwork.",
      ] },
      { role: "Full-Stack Developer", time: "University internship", points: [
        "Worked on AZA, a full-stack platform, across the full SDLC under Agile/Scrum, improving sprint coordination and delivery.",
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
    eduItems: [
      { title: "Degree in Computer Engineering, Management and Information Systems", school: "TecnoCampus", time: "4th year", status: "In progress", note: "Final degree project: Tryvo", now: true },
      { title: "Developer 10x with AI: Software Development with AI", school: "Instituto de Inteligencia Artificial", time: "Oct 2026 to Jan 2027", status: "In progress", note: "AI-assisted development, prompt engineering, AI agents and automation", now: true },
      { title: "Higher Technician in Multiplatform Application Development (DAM)", school: "Higher vocational training (CFGS)", time: "", status: "Completed", note: "Web, desktop and mobile development" },
    ],
    education: [
      "Developer 10x with AI: Software Development with AI, Instituto de Inteligencia Artificial (Oct 2026 to Jan 2027, in progress)",
      "Computer Engineering, Management & Information Systems (4th year)",
      "Higher Technician in Multiplatform Application Development (DAM)",
    ],
    projects: {
      tryvo: { tagline: "Group trip planner, final degree project", badge: "In progress", linkLabel: "Final degree project, in progress",
        desc: "A mobile app for Android and iOS that helps a group of friends plan a trip together, from choosing the destination to settling the last expense. Its engineering core is an optimizer that orders each day's activities so the group walks as little as possible.",
        highlights: [
          ["Decide together", "The group votes the destination, finds the dates that work for everyone and votes activity ideas. Only the approved ones reach the day-by-day calendar."],
          ["Route optimizer", "Orders each day to minimise walking without moving activities with a fixed time. A TSP variant solved with nearest neighbour plus 2-opt, measured against the exact optimum by brute force up to 8 stops."],
          ["Real-time and secure", "Supabase with Row Level Security on every table: nobody can read a trip they are not part of. Changes reach the whole group instantly, and third-party APIs are only called from Edge Functions."],
          ["Shared money", "Expenses stored in integer cents, balances always computed from the data and a settlement with the fewest possible transfers. AI reads a receipt and splits it by lines."],
          ["During the trip", "A live mode with the current and next activity, weather, tasks, a shared packing and shopping list, and a final trip summary to share."],
          ["Built to last", "4,105 automated tests, WCAG AA contrast, screens checked at 2x text size and a domain layer in pure Dart."],
        ] },
      aza: { tagline: "Full-stack platform, built at SoftDevArts", desc: "A platform that helps families build better relationships, designed with psychologists. I built it at SoftDevArts, working across the whole product lifecycle and the AWS cloud architecture in an Agile/Scrum team.", badge: "Live" },
      softdev: { tagline: "Company website", desc: "The website of SoftDevArts, a custom software studio: what they do, their services and projects, and how to get in touch.", badge: "Live" },
      owl: { tagline: "Psychology app", desc: "My first real-world project: a psychology app for the company OwlInstitute, built with Flutter and Firebase. It covered the patient–professional flow end to end.", badge: "Mobile app", linkLabel: "Built for OwlInstitute" },
      ekoora: { tagline: "Gamified learning app, on hold", badge: "On hold", linkLabel: "Project on hold",
        desc: "It started as Verbum Quest, a role-playing game to learn Catalan verb conjugation that won the popular vote at the Wapps Awards 2022. Today it is a gamified learning platform for students aged 11 to 15, where teachers create, assign and follow classroom activities as missions. The look is modern and playful without being childish: flat toy colours, clear type and sticker-style buttons.",
        highlights: [
          ["From Verbum Quest to Ekoora", "Verbum Quest was born at Escola Pia Santa Anna de Mataró so children could learn verbs by playing. With our team, Dragon Factory (now Leviathan Creative Studios), it won the popular vote at the Wapps Awards 2022 by Fundació .cat, and that success became Ekoora."],
          ["Worlds, topics and missions", "Each subject is a world, split into topics, and each topic into a path of missions that students solve in order."],
          ["Safe sign-in for kids", "Teachers sign in with email or Google. Students join with a class code, pick their avatar and set a secret 4-digit PIN. One profile, as many classes as they need."],
          ["Teacher control panel", "Create classes and students, write questions with a live preview of the phone screen, unlock missions by date or stars, and follow progress on a dashboard."],
          ["Four game modes", "Multiple choice, connected-letter words, mobile crosswords and timed true or false where a false answer must also be justified, so guessing doesn't pay."],
          ["Practice and exam", "Practice gives coins, up to three stars and access to the theory sheet. Exam mode hides answers, adds a timer and sends the grade straight to the teacher."],
          ["Ethical gamification", "Anonymous leaderboards based on XP, never on grades; cooperative class challenges; and gentler review paths that open automatically when a student gets stuck, with an alert for the teacher."],
        ] },
    },
    statement: ["Hi, I'm Albert", {img:1}, "a full-stack developer who builds", {pill:"web", c:"tomato"}, "and", {pill:"mobile", c:"sun"}, "products for real clients. Fast, clean and", {pill:"Agile", c:"pink"}, "."],
    ui: {
      skip: "Skip to content",
      navWork: "Work", navAbout: "About", navExperience: "Experience", navStack: "Toolbox", navContact: "Contact", navTerminal: "Terminal",
      heroRole: "Full-stack developer and computer engineer, between Barcelona and Arenys de Mar.",
      heroHint: "Move the cursor through the name. Keep scrolling: it changes shape with the story.",
      ctaWork: "See my work", ctaCV: "Download CV",
      secAbout: "About", secWork: "Selected work", secExperience: "Experience", secStack: "Toolbox",
      expHint: "Keep scrolling: the track runs sideways.",
      stackHint: "Grab a piece and throw it.",
      secPlace: "Based on the Maresme coast",
      placeText: "Barcelona to Arenys de Mar: 40 km of coastline and one train line. Open to remote, hybrid or on-site roles.",
      visit: "Visit",
      eduTitle: "Education",
      contactTitle: "Let's build<br />something.",
      contactLead: "Open to junior full-stack and backend roles, with a soft spot for frontend. Quick to onboard, easy to work with.",
      contactEmail: "Email me", contactCvLabel: "CV in",
      footerHint: "Prefer a shell? Open the terminal",
      available: "Available for work",
      projCount: (n, live) => `${n} projects, ${live} live`,
    },
  },

  es: {
    label: "ES",
    cv: "assets/AlbertMoraCvEsp.pdf",
    role: "Desarrollador Full-Stack · Ingeniero Informático",
    studies: "Ingeniería Informática, 4º año",
    taglines: ["apps web.", "apps móviles.", "arquitecturas limpias.", "productos reales."],
    about: [
      "Desarrollador full-stack con una base académica sólida y experiencia práctica en el ciclo de vida completo de aplicaciones web y móviles.",
      "Aprendizaje rápido: capacidad demostrada para dominar nuevas tecnologías en tiempo récord y entregar productos funcionales para clientes reales.",
      "Enfocado en la optimización de procesos mediante automatización y en la entrega bajo metodologías Agile/Scrum.",
      "Gran interés en la IA aplicada y las arquitecturas limpias (DDD, Event Sourcing).",
    ],
    stackCats: { languages: "Lenguajes", webmobile: "Web / Móvil", backend: "Backend / Datos", ai: "IA / Automatización", tools: "Herramientas / Cloud" },
    experience: [
      { role: "AI Software Engineer (prácticas)", time: "Prácticas, sept. 2026 hasta hoy", points: [
        "Construyo flujos automatizados con n8n y agentes de IA que agilizan las tareas diarias de la empresa.",
        "Integro APIs y modelos de IA (Claude, OpenAI Codex) en los procesos internos.",
        "Me encargo del mantenimiento de la infraestructura de la empresa para que todo funcione sin problemas.",
        "Presencial en Vilassar de Dalt.",
      ] },
      { role: "Monitor STEM: robótica, programación y diseño 3D", time: "Campus de verano, ago. 2026", points: [
        "Enseñé robótica y diseño 3D a niños en un campus de verano en Premià de Mar.",
        "Construimos y programamos robots con LEGO Mindstorms, y les introduje al diseño 3D con Tinkercad para imprimir sus propias creaciones.",
        "El objetivo era aprender jugando, despertar la curiosidad por la tecnología y trabajar en equipo.",
      ] },
      { role: "Desarrollador Full-Stack", time: "Prácticas universitarias", points: [
        "Trabajé en AZA, una plataforma full-stack, durante todo el ciclo de vida (SDLC) bajo Agile/Scrum, mejorando la coordinación y entrega de sprints.",
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
    eduItems: [
      { title: "Grado en Ingeniería Informática de Gestión y Sistemas de Información", school: "TecnoCampus", time: "4º curso", status: "En curso", note: "Trabajo de Fin de Grado: Tryvo", now: true },
      { title: "Desarrollador 10x con IA: Software Development with AI", school: "Instituto de Inteligencia Artificial", time: "oct. 2026 a ene. 2027", status: "En curso", note: "Desarrollo asistido por IA, prompt engineering, agentes de IA y automatización", now: true },
      { title: "Técnico Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)", school: "Ciclo formativo de grado superior (CFGS)", time: "", status: "Completado", note: "Desarrollo web, de escritorio y móvil" },
    ],
    education: [
      "Desarrollador 10x con IA: Software Development with AI, Instituto de Inteligencia Artificial (oct. 2026 a ene. 2027, en curso)",
      "Ingeniería Informática, Sistemas de Gestión e Información (4º año)",
      "Técnico Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)",
    ],
    projects: {
      tryvo: { tagline: "Planificador de viajes en grupo, TFG", badge: "En desarrollo", linkLabel: "Trabajo de Fin de Grado, en curso",
        desc: "Una app móvil para Android e iOS que ayuda a un grupo de amigos a organizar un viaje juntos, desde elegir el destino hasta cuadrar la última cuenta. Su núcleo de ingeniería es un optimizador que ordena las actividades de cada día para caminar lo mínimo posible.",
        highlights: [
          ["Decidir en grupo", "El grupo vota el destino, encuentra las fechas que van bien a todos y vota las ideas de actividades. Solo las aprobadas pasan al calendario por días."],
          ["Optimizador de rutas", "Ordena cada día para caminar lo mínimo sin mover las actividades con hora fija. Una variante del TSP resuelta con vecino más cercano y 2-opt, comparada con el óptimo exacto por fuerza bruta hasta 8 paradas."],
          ["Tiempo real y seguro", "Supabase con Row Level Security en todas las tablas: nadie puede leer un viaje del que no forma parte. Los cambios llegan al instante a todo el grupo y las APIs externas solo se llaman desde Edge Functions."],
          ["Dinero compartido", "Gastos guardados en céntimos enteros, balances calculados siempre desde los datos y una liquidación con el mínimo de transferencias. La IA lee un tique y lo reparte por líneas."],
          ["Durante el viaje", "Un modo en vivo con la actividad de ahora y la siguiente, el tiempo, tareas, mochila y lista de la compra compartidas, y un resumen final del viaje para compartir."],
          ["Hecho para durar", "4.105 pruebas automáticas, contraste WCAG AA, pantallas probadas con el texto a 2x y un dominio en Dart puro."],
        ] },
      aza: { tagline: "Plataforma full-stack, hecha en SoftDevArts", desc: "Una plataforma que ayuda a las familias a mejorar sus relaciones, diseñada con psicólogos. La desarrollé en SoftDevArts, trabajando todo el ciclo del producto y la arquitectura en la nube (AWS) en un equipo Agile/Scrum.", badge: "Live" },
      softdev: { tagline: "Web de la empresa", desc: "La web de SoftDevArts, un estudio de software a medida: qué hacen, sus servicios y proyectos, y cómo contactar.", badge: "Live" },
      owl: { tagline: "App de psicología", desc: "Mi primer proyecto real: una app de psicología para la empresa OwlInstitute, desarrollada con Flutter y Firebase. Cubrió el flujo entre pacientes y profesionales de principio a fin.", badge: "App móvil", linkLabel: "Hecho para OwlInstitute" },
      ekoora: { tagline: "App educativa gamificada, en pausa", badge: "En pausa", linkLabel: "Proyecto en pausa",
        desc: "Empezó como Verbum Quest, un juego de rol para aprender a conjugar verbos en catalán que ganó el voto popular en los Premios Wapps 2022. Hoy es una plataforma educativa gamificada para alumnos de 11 a 15 años, donde el profesorado crea, asigna y sigue las actividades de clase como misiones. Estética moderna y lúdica sin ser infantil: colores planos de juguete, letras claras y botones tipo sticker.",
        highlights: [
          ["De Verbum Quest a Ekoora", "Verbum Quest nació en la Escola Pia Santa Anna de Mataró para que los niños aprendieran verbos jugando. Con nuestro equipo, Dragon Factory (hoy Leviathan Creative Studios), ganó el voto popular en los Premios Wapps 2022 de la Fundació .cat, y de ese éxito salió Ekoora."],
          ["Mundos, temas y misiones", "Cada asignatura es un mundo, dividido en temas, y cada tema en un camino de misiones que el alumno resuelve en orden."],
          ["Acceso seguro para menores", "El profesorado entra con correo o Google. El alumnado se une con un código de aula, elige su avatar y fija un PIN secreto de 4 cifras. Un solo perfil para todas sus clases."],
          ["Panel del profesor", "Crear clases y alumnos, redactar preguntas con vista previa en tiempo real del móvil, desbloquear misiones por fecha o estrellas y seguir el progreso en un dashboard."],
          ["Cuatro modos de juego", "Test de opción múltiple, palabra conectada, crucigrama móvil y verdadero o falso con tiempo, donde una respuesta falsa también se debe justificar para que el azar no cuente."],
          ["Práctica y examen", "La práctica da monedas, hasta tres estrellas y acceso a la teoría. El modo examen oculta las respuestas, añade un temporizador y envía la nota directamente al profesor."],
          ["Gamificación ética", "Rankings anónimos basados en XP y nunca en notas, retos cooperativos de clase y caminos de repaso más guiados que se abren solos cuando un alumno se atasca, con aviso al profesor."],
        ] },
    },
    statement: ["Hola, soy Albert", {img:1}, "un desarrollador full-stack que construye productos", {pill:"web", c:"tomato"}, "y", {pill:"móviles", c:"sun"}, "para clientes reales. Rápido, limpio y", {pill:"Agile", c:"pink"}, "."],
    ui: {
      skip: "Saltar al contenido",
      navWork: "Proyectos", navAbout: "Sobre mí", navExperience: "Experiencia", navStack: "Herramientas", navContact: "Contacto", navTerminal: "Terminal",
      heroRole: "Desarrollador full-stack e ingeniero informático, entre Barcelona y Arenys de Mar.",
      heroHint: "Pasa el cursor por el nombre. Sigue bajando: cambia de forma con la historia.",
      ctaWork: "Ver proyectos", ctaCV: "Descargar CV",
      secAbout: "Sobre mí", secWork: "Proyectos", secExperience: "Experiencia", secStack: "Herramientas",
      expHint: "Sigue bajando: el recorrido avanza de lado.",
      stackHint: "Coge una pieza y lánzala.",
      secPlace: "Desde la costa del Maresme",
      placeText: "De Barcelona a Arenys de Mar: 40 km de costa y una sola línea de tren. Abierto a remoto, híbrido o presencial.",
      visit: "Visitar",
      eduTitle: "Formación",
      contactTitle: "Construyamos<br />algo.",
      contactLead: "Disponible para posiciones junior full-stack y backend, con debilidad por el frontend. Rápido de incorporar y fácil para trabajar.",
      contactEmail: "Escríbeme", contactCvLabel: "CV en",
      footerHint: "¿Prefieres una shell? Abre la terminal",
      available: "Disponible para trabajar",
      projCount: (n, live) => `${n} proyectos, ${live} online`,
    },
  },

  ca: {
    label: "CA",
    cv: "assets/AlbertMoraCvCat.pdf",
    role: "Desenvolupador Full-Stack · Enginyer Informàtic",
    studies: "Enginyeria Informàtica, 4t any",
    taglines: ["apps web.", "apps mòbils.", "arquitectures netes.", "productes reals."],
    about: [
      "Desenvolupador full-stack amb una base acadèmica sòlida i experiència pràctica en el cicle de vida complet d'aplicacions web i mòbils.",
      "Aprenentatge ràpid: capacitat demostrada per dominar noves tecnologies en temps rècord i entregar productes funcionals per a clients reals.",
      "Enfocat en l'optimització de processos mitjançant l'automatització i en l'entrega sota metodologies Agile/Scrum.",
      "Gran interès en la IA aplicada i les arquitectures netes (DDD, Event Sourcing).",
    ],
    stackCats: { languages: "Llenguatges", webmobile: "Web / Mòbil", backend: "Backend / Dades", ai: "IA / Automatització", tools: "Eines / Cloud" },
    experience: [
      { role: "AI Software Engineer (pràctiques)", time: "Pràctiques, set. 2026 fins avui", points: [
        "Construeixo fluxos automatitzats amb n8n i agents d'IA que agilitzen les tasques diàries de l'empresa.",
        "Integro APIs i models d'IA (Claude, OpenAI Codex) als processos interns.",
        "M'encarrego del manteniment de la infraestructura de l'empresa perquè tot funcioni sense problemes.",
        "Presencial a Vilassar de Dalt.",
      ] },
      { role: "Monitor STEM: robòtica, programació i disseny 3D", time: "Casal d'estiu, ag. 2026", points: [
        "Vaig ensenyar robòtica i disseny 3D a infants en un casal d'estiu a Premià de Mar.",
        "Vam construir i programar robots amb LEGO Mindstorms, i els vaig introduir al disseny 3D amb Tinkercad per imprimir les seves pròpies creacions.",
        "L'objectiu era aprendre jugant, despertar la curiositat per la tecnologia i treballar en equip.",
      ] },
      { role: "Desenvolupador Full-Stack", time: "Pràctiques universitàries", points: [
        "Vaig treballar a AZA, una plataforma full-stack, durant tot el cicle de vida (SDLC) sota Agile/Scrum, millorant la coordinació i entrega de sprints.",
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
    eduItems: [
      { title: "Grau en Enginyeria Informàtica de Gestió i Sistemes d'Informació", school: "TecnoCampus", time: "4t curs", status: "En curs", note: "Treball de Fi de Grau: Tryvo", now: true },
      { title: "Desenvolupador 10x amb IA: Software Development with AI", school: "Instituto de Inteligencia Artificial", time: "oct. 2026 a gen. 2027", status: "En curs", note: "Desenvolupament assistit per IA, prompt engineering, agents d'IA i automatització", now: true },
      { title: "Tècnic Superior en Desenvolupament d'Aplicacions Multiplataforma (DAM)", school: "Cicle formatiu de grau superior (CFGS)", time: "", status: "Completat", note: "Desenvolupament web, d'escriptori i mòbil" },
    ],
    education: [
      "Desenvolupador 10x amb IA: Software Development with AI, Instituto de Inteligencia Artificial (oct. 2026 a gen. 2027, en curs)",
      "Enginyeria Informàtica, Sistemes de Gestió i Informació (4t any)",
      "Tècnic Superior en Desenvolupament d'Aplicacions Multiplataforma (DAM)",
    ],
    projects: {
      tryvo: { tagline: "Planificador de viatges en grup, TFG", badge: "En desenvolupament", linkLabel: "Treball de Fi de Grau, en curs",
        desc: "Una app mòbil per a Android i iOS que ajuda una colla d'amics a organitzar un viatge junts, des de triar el destí fins a quadrar l'últim compte. El nucli d'enginyeria és un optimitzador que ordena les activitats de cada dia per caminar el mínim possible.",
        highlights: [
          ["Decidir en grup", "La colla vota el destí, troba les dates que van bé a tothom i vota les idees d'activitats. Només les aprovades passen al calendari per dies."],
          ["Optimitzador de rutes", "Ordena cada dia per caminar el mínim sense moure les activitats amb hora fixa. Una variant del TSP resolta amb el veí més proper i 2-opt, comparada amb l'òptim exacte per força bruta fins a 8 parades."],
          ["Temps real i segur", "Supabase amb Row Level Security a totes les taules: ningú no pot llegir un viatge del qual no forma part. Els canvis arriben a l'instant a tota la colla i les APIs externes només es criden des d'Edge Functions."],
          ["Diners compartits", "Despeses desades en cèntims enters, balanços calculats sempre a partir de les dades i una liquidació amb el mínim de transferències. La IA llegeix un tiquet i el reparteix per línies."],
          ["Durant el viatge", "Un mode en viu amb l'activitat d'ara i la següent, la meteo, tasques, motxilla i llista de la compra compartides, i un resum final del viatge per compartir."],
          ["Fet per durar", "4.105 proves automàtiques, contrast WCAG AA, pantalles provades amb el text a 2x i un domini en Dart pur."],
        ] },
      aza: { tagline: "Plataforma full-stack, feta a SoftDevArts", desc: "Una plataforma que ajuda les famílies a millorar les seves relacions, dissenyada amb psicòlegs. La vaig desenvolupar a SoftDevArts, treballant tot el cicle del producte i l'arquitectura al núvol (AWS) en un equip Agile/Scrum.", badge: "Live" },
      softdev: { tagline: "Web de l'empresa", desc: "La web de SoftDevArts, un estudi de software a mida: què fan, els seus serveis i projectes, i com contactar-hi.", badge: "Live" },
      owl: { tagline: "App de psicologia", desc: "El meu primer projecte real: una app de psicologia per a l'empresa OwlInstitute, desenvolupada amb Flutter i Firebase. Va cobrir el flux entre pacients i professionals de principi a fi.", badge: "App mòbil", linkLabel: "Fet per a OwlInstitute" },
      ekoora: { tagline: "App educativa gamificada, en pausa", badge: "En pausa", linkLabel: "Projecte en pausa",
        desc: "Va començar com a Verbum Quest, un joc de rol per aprendre a conjugar verbs en català que va guanyar el vot popular als Premis Wapps 2022. Avui és una plataforma educativa gamificada per a alumnes d'11 a 15 anys, on el professorat crea, assigna i segueix les activitats de classe com a missions. Estètica moderna i lúdica sense ser infantil: colors plans de joguina, lletres clares i botons estil sticker.",
        highlights: [
          ["De Verbum Quest a Ekoora", "Verbum Quest va néixer a l'Escola Pia Santa Anna de Mataró perquè els nens aprenguessin verbs jugant. Amb el nostre equip, Dragon Factory (avui Leviathan Creative Studios), va guanyar el vot popular als Premis Wapps 2022 de la Fundació .cat, i d'aquell èxit en va sortir Ekoora."],
          ["Mons, temes i missions", "Cada assignatura és un món, dividit en temes, i cada tema en un camí de missions que l'alumne resol en ordre."],
          ["Accés segur per a menors", "El professorat entra amb correu o Google. L'alumnat s'uneix amb un codi d'aula, tria el seu avatar i fixa un PIN secret de 4 xifres. Un sol perfil per a totes les seves classes."],
          ["Panell del professor", "Crear classes i alumnes, redactar preguntes amb previsualització en temps real del mòbil, desbloquejar missions per data o estrelles i seguir el progrés en un dashboard."],
          ["Quatre modes de joc", "Qüestionari de resposta múltiple, paraula connectada, mots encreuats per a mòbil i vertader o fals amb temps, on una resposta falsa també s'ha de justificar perquè l'atzar no compti."],
          ["Pràctica i examen", "La pràctica dona monedes, fins a tres estrelles i accés a la teoria. El mode examen amaga les respostes, afegeix un temporitzador i envia la nota directament al professor."],
          ["Gamificació ètica", "Rànquings anònims basats en XP i mai en notes, reptes cooperatius de classe i camins de repàs més guiats que s'obren sols quan un alumne s'encalla, amb avís al professor."],
        ] },
    },
    statement: ["Hola, soc l'Albert", {img:1}, "un desenvolupador full-stack que construeix productes", {pill:"web", c:"tomato"}, "i", {pill:"mòbils", c:"sun"}, "per a clients reals. Ràpid, net i", {pill:"Agile", c:"pink"}, "."],
    ui: {
      skip: "Salta al contingut",
      navWork: "Projectes", navAbout: "Sobre mi", navExperience: "Experiència", navStack: "Eines", navContact: "Contacte", navTerminal: "Terminal",
      heroRole: "Desenvolupador full-stack i enginyer informàtic, entre Barcelona i Arenys de Mar.",
      heroHint: "Passa el cursor pel nom. Continua baixant: canvia de forma amb la història.",
      ctaWork: "Veure projectes", ctaCV: "Descarregar CV",
      secAbout: "Sobre mi", secWork: "Projectes", secExperience: "Experiència", secStack: "Eines",
      expHint: "Continua baixant: el recorregut avança de costat.",
      stackHint: "Agafa una peça i llança-la.",
      secPlace: "Des de la costa del Maresme",
      placeText: "De Barcelona a Arenys de Mar: 40 km de costa i una sola línia de tren. Obert a remot, híbrid o presencial.",
      visit: "Visitar",
      eduTitle: "Formació",
      contactTitle: "Construïm<br />alguna cosa.",
      contactLead: "Disponible per a posicions júnior full-stack i backend, amb debilitat pel frontend. Ràpid d'incorporar i fàcil per treballar.",
      contactEmail: "Escriu-me", contactCvLabel: "CV en",
      footerHint: "Prefereixes una shell? Obre la terminal",
      available: "Disponible per treballar",
      projCount: (n, live) => `${n} projectes, ${live} online`,
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
    about: L.about, statement: L.statement, stack, experience, education: L.education, eduItems: L.eduItems, taglines: L.taglines, projects,
  };
}

function applyUI(lang) {
  const ui = (LANGS[lang] || LANGS.en).ui;
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const v = ui[el.getAttribute("data-i18n")];
    if (typeof v === "string") el.textContent = v;
  });
  document.querySelectorAll("[data-cv]").forEach((el) => { el.setAttribute("href", (LANGS[lang] || LANGS.en).cv); });
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
