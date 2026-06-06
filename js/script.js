(function () {
    "use strict";

    const CONFIG = {
        email: 'isma021m@gmail.com',
        formspreeId: 'xbdqqjbn',
        cvFiles: { es: 'Ismael_Parras_CV_ES.pdf', en: 'Ismael_Parras_CV_EN.pdf' },
        socialLinks: {
            github: 'https://github.com/IsmaParras',
            linkedin: 'https://www.linkedin.com/in/ismaelparrasresino/'
        },
        projects: [
            {
                id: 'lead-auditor-pro',
                featured: true,
                badgeKey: 'proj1_badge',
                title: 'Lead Auditor Pro',
                tags: ['Python', 'Google Maps API', 'Web Scraping', 'Lead Generation'],
                // image: 'assets/img/lead-auditor-pro.png',
                problemKey: 'proj1_problem',
                solutionKey: 'proj1_solution',
                results: [
                    { es: 'Prospección 100% automática', en: '100% automated prospecting' },
                    { es: 'Auditoría digital completa',  en: 'Full digital audit' },
                    { es: 'En desarrollo',               en: 'In development' }
                ],
                ctaKey: 'proj_cta_info',
                ctaUrl: '#contact'
            },
            {
                id: 'citamatic',
                featured: false,
                badgeKey: 'proj2_badge',
                title: 'CitaMatic',
                tags: ['Botpress', 'Make', 'Google Calendar API', 'IA Conversacional'],
                // image: 'assets/img/citamatic.png',
                problemKey: 'proj2_problem',
                solutionKey: 'proj2_solution',
                results: [
                    { es: 'Disponible 24/7',       en: 'Available 24/7' },
                    { es: '0 intervención manual', en: '0 manual intervention' },
                    { es: 'En producción',         en: 'In production' }
                ],
                ctaKey: 'proj_cta_info',
                ctaUrl: '#contact'
            }
        ],
        techSkills: [
            // ─────────────── AUTOMATIZACIÓN / IA ───────────────
            { name: "UiPath", icon: "uipath", color: "FA4616", area: ["automatizacion"], cert: true,
              certUrl: "assets/diploma_uipath.pdf",
              desc: "RPA de nivel enterprise — Training oficial UiPath Academy", desc_en: "Enterprise-grade RPA — official UiPath Academy training", tags: ["rpa", "enterprise", "training"] },
            { name: "Power Automate", icon: "microsoftpowerautomate", color: "0066FF", area: ["automatizacion"],
              desc: "Automatización de procesos en el ecosistema Microsoft 365", desc_en: "Process automation across the Microsoft 365 ecosystem", tags: ["rpa", "microsoft"] },
            { name: "Druid AI", color: "6C2DC7", area: ["automatizacion"],
              iconSvg: `<svg viewBox="0 0 40 40" width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="#6C2DC7"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="16" fill="#fff">D</text></svg>`,
              desc: "Agentes conversacionales en producción (Teams, web y voz)", desc_en: "Conversational agents in production (Teams, web, voice)", tags: ["ia", "agentes", "conversacional"] },
            { name: "LangChain", icon: "langchain", color: "1C3C3C", area: ["automatizacion"],
              desc: "Orquestación de LLMs y automatización del ServiceDesk de un organismo público", desc_en: "LLM orchestration and ServiceDesk automation for a public-sector body", tags: ["ia", "llm", "orquestación"] },
            { name: "n8n", icon: "n8n", color: "EA4B71", area: ["automatizacion"],
              desc: "Orquestación de flujos de trabajo y automatización low-code", desc_en: "Workflow orchestration and low-code automation", tags: ["automatizacion", "workflows"] },
            { name: "Make", icon: "make", color: "6D00CC", area: ["automatizacion"],
              desc: "Integraciones entre apps y automatización visual de procesos", desc_en: "App integrations and visual process automation", tags: ["automatizacion", "integraciones"] },
            { name: "Botpress", color: "00AEF3", area: ["automatizacion"],
              iconSvg: `<svg viewBox="0 0 40 40" width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="#00AEF3"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#fff">BP</text></svg>`,
              desc: "Chatbots e IA conversacional (proyecto CitaMatic)", desc_en: "Chatbots and conversational AI (CitaMatic project)", tags: ["ia", "chatbots"] },
            { name: "ElevenLabs", color: "0F172A", area: ["automatizacion"],
              iconSvg: `<svg viewBox="0 0 40 40" width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="#0F172A"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="15" fill="#fff">11</text></svg>`,
              desc: "Síntesis de voz por IA integrada en flujos automatizados", desc_en: "AI voice synthesis integrated into automated workflows", tags: ["ia", "voz", "tts"] },
            { name: "LLMs", color: "00D4FF", area: ["automatizacion"],
              iconSvg: `<svg viewBox="0 0 40 40" width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="#0f172a"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#00d4ff">LLM</text></svg>`,
              desc: "Integración de Large Language Models en soluciones reales", desc_en: "Integrating Large Language Models into real-world solutions", tags: ["ia", "nlp"] },
            { name: "NLP", color: "0E7490", area: ["automatizacion"],
              iconSvg: `<svg viewBox="0 0 40 40" width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="#0e7490"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="13" fill="#fff">NLP</text></svg>`,
              desc: "Procesamiento del lenguaje natural en agentes conversacionales", desc_en: "Natural language processing for conversational agents", tags: ["ia", "lenguaje"] },
            { name: "Prompt Engineering", color: "7C3AED", area: ["automatizacion"],
              iconSvg: `<svg viewBox="0 0 40 40" width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="#7c3aed"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="20" fill="#fff">&gt;_</text></svg>`,
              desc: "Diseño de prompts para fiabilidad y control de modelos generativos", desc_en: "Prompt design for reliability and control of generative models", tags: ["ia", "generativa"] },
            { name: "Generative AI", color: "6366F1", area: ["automatizacion"],
              iconSvg: `<svg viewBox="0 0 40 40" width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="#6366f1"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="11" fill="#fff">GenAI</text></svg>`,
              desc: "Aplicación de IA generativa a casos de uso de negocio", desc_en: "Applying generative AI to business use cases", tags: ["ia", "generativa"] },

            // ─────────────── CLOUD Y SISTEMAS ───────────────
            { name: "Microsoft Azure", icon: "microsoftazure", color: "0078D4", area: ["cloud"],
              desc: "Servicios cloud para desplegar automatizaciones e IA", desc_en: "Cloud services for deploying automations and AI", tags: ["cloud", "microsoft"] },
            { name: "Azure AI", icon: "microsoftazure", color: "0078D4", area: ["cloud"], cert: true,
              certUrl: "https://www.credly.com/badges/372e9788-f701-435a-8575-c7fc5702a3aa/linked_in_profile",
              desc: "Servicios cognitivos de Azure — Certificado AI Fundamentals", desc_en: "Azure cognitive services — AI Fundamentals certified", tags: ["ia", "cloud", "certificado"] },
            { name: "PowerShell", icon: "powershell", color: "5391FE", area: ["cloud"], cert: true,
              certUrl: "assets/diploma_powershell.pdf",
              desc: "Scripting de automatización en Windows y Azure — Certificado", desc_en: "Automation scripting on Windows and Azure — certified", tags: ["scripting", "windows", "certificado"] },
            { name: "Active Directory", color: "0078D4", area: ["cloud"],
              iconSvg: `<svg viewBox="0 0 40 40" width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="#0078D4"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="16" fill="#fff">AD</text></svg>`,
              desc: "Gestión de usuarios e identidades en entornos Windows", desc_en: "User and identity management in Windows environments", tags: ["sistemas", "windows"] },
            { name: "Linux", icon: "linux", color: "FCC624", area: ["cloud"],
              desc: "Administración básica y despliegue en entornos Ubuntu", desc_en: "Basic administration and deployment on Ubuntu", tags: ["sistemas", "servidores"] },
            { name: "Docker", icon: "docker", color: "2496ED", area: ["cloud"],
              desc: "Containerización y despliegue reproducible de aplicaciones", desc_en: "Containerization and reproducible app deployment", tags: ["devops", "contenedores"] },

            // ─────────────── DESARROLLO, INTEGRACIÓN Y DATOS ───────────────
            { name: "Python", icon: "python", color: "3776AB", area: ["software"],
              desc: "Backend, automatización, scraping y análisis de datos", desc_en: "Backend, automation, scraping and data analysis", tags: ["lenguaje", "automatizacion"] },
            { name: "Java", icon: "openjdk", color: "437291", area: ["software"],
              desc: "Programación orientada a objetos — base del ciclo DAM", desc_en: "Object-oriented programming — foundation of my DAM degree", tags: ["lenguaje", "oop"] },
            { name: "JavaScript", icon: "javascript", color: "F7DF1E", area: ["software"],
              desc: "Scripting, automatización web y desarrollo front-end", desc_en: "Scripting, web automation and front-end development", tags: ["lenguaje", "frontend"] },
            { name: "REST APIs", icon: "postman", color: "FF6C37", area: ["software"],
              desc: "Diseño e integración de servicios web — Jira, EasyVista y más", desc_en: "Designing and integrating web services — Jira, EasyVista and more", tags: ["integraciones", "backend"] },
            { name: "EasyVista", color: "00A88E", area: ["software"],
              iconSvg: `<svg viewBox="0 0 40 40" width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="#00A88E"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="16" fill="#fff">EV</text></svg>`,
              desc: "ITSM e integración de gestión de servicios vía API", desc_en: "ITSM and service-management integration via API", tags: ["itsm", "integraciones"] },
            { name: "Jira", icon: "jira", color: "0052CC", area: ["software"],
              desc: "Gestión ágil de proyectos e integración de incidencias", desc_en: "Agile project management and issue integration", tags: ["agile", "gestión"] },
            { name: "MySQL", icon: "mysql", color: "4479A1", area: ["software"],
              desc: "Bases de datos relacionales y consultas", desc_en: "Relational databases and queries", tags: ["datos", "sql"] },
            { name: "PostgreSQL", icon: "postgresql", color: "4169E1", area: ["software"],
              desc: "Bases de datos relacionales avanzadas", desc_en: "Advanced relational databases", tags: ["datos", "sql"] },
            { name: "Git", icon: "git", color: "F05032", area: ["software"],
              desc: "Control de versiones y colaboración en código", desc_en: "Version control and code collaboration", tags: ["devops", "versionado"] }
        ]
    };

    // ─────────────── REFERENCIAS DOM ───────────────
    const navbar = document.getElementById('navbar');
    const menuBtn = document.getElementById('menuBtn');
    const navLinksContainer = document.getElementById('navLinks');
    const langToggle = document.getElementById('langToggle');
    const themeToggle = document.getElementById('themeToggle');
    const typewriterEl = document.getElementById('typewriter');
    const timelineLine = document.getElementById('timelineLine');
    const timeline = document.getElementById('timeline');
    const downloadCvBtn = document.getElementById('downloadCvBtn');
    const contactForm = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');
    const formError = document.getElementById('formError');
    const formSubmitBtn = document.getElementById('formSubmitBtn');

    let currentLang = navigator.language.startsWith('es') ? 'es' : 'en';
    let typewriterTimeout = null;
    let cursorAnimFrame = null;
    let rerenderSkills = null; // se asigna en initTechSkills; re-pinta las tarjetas sin re-vincular listeners

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const translations = {
        es: {
            skip_link: "Saltar al contenido",
            nav_home: "Inicio", nav_about: "Sobre mí", nav_skills: "Habilidades", nav_projects: "Proyectos", nav_contact: "Contacto",
            hero_greeting: "Hola, soy",
            hero_tagline: "Automatizo procesos de negocio de extremo a extremo con RPA e IA: agentes conversacionales, integraciones API y flujos inteligentes que ahorran horas de trabajo manual.",
            hero_location: "Leganés, Madrid", hero_availability: "Presencial · Híbrido · Remoto",
            btn_projects: "Ver proyectos", btn_cv: "Descargar CV",
            about_title: "Sobre mí & Experiencia",
            about_p1: "Soy desarrollador especializado en hiperautomatización e Inteligencia Artificial. Actualmente, en Sermicro, diseño y pongo en producción agentes conversacionales y automatizaciones RPA para clientes de administración pública, consultoría y servicios IT.",
            about_p2: "Mi trabajo consiste en convertir procesos manuales y repetitivos en flujos autónomos: agentes con Druid AI y LangChain, bots de UiPath y Power Automate, e integraciones vía API REST con sistemas como Jira o EasyVista. Me formé como Técnico Superior en Desarrollo de Aplicaciones Multiplataforma y estoy certificado en UiPath, Azure AI y PowerShell.",
            edu_title: "Formación",
            edu1_degree: "Técnico Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)",
            edu2_degree: "Bachillerato de Ciencias",
            exp_title: "Trayectoria", exp_present: "Actualidad",
            exp1_role: "Técnico de Hiperautomatización e IA",
            exp1_desc: "Desarrollo y puesta en producción de agentes conversacionales con Druid AI (Teams, web y voz), automatización de procesos con UiPath y Power Automate, automatización del ServiceDesk de un organismo público con LangChain e integraciones vía API REST con Jira y EasyVista.",
            exp2_role: "Equipo de Operaciones (Prácticas)",
            exp2_desc: "Resolución de incidencias de hardware y software con Jira Service Desk y Confluence, mantenimiento preventivo de equipos y documentación de procedimientos.",
            techskills_title: "Habilidades Técnicas",
            techskills_subtitle: "El stack que uso a diario para construir automatizaciones, agentes de IA e integraciones.",
            techskills_search: "Buscar habilidades...", techskills_filter_label: "Filtrar por área",
            techskills_showing: "Mostrando", techskills_of: "de", techskills_skills: "habilidades",
            techskills_reset: "Resetear filtros", techskills_active_filters: "Filtros activos:",
            techskills_no_results: "No se encontraron habilidades con esos filtros",
            techskills_area_auto: "Automatización / IA", techskills_area_cloud: "Cloud & Sistemas", techskills_area_software: "Desarrollo & Datos",
            cert_view: "Ver credencial", cert_label: "Certificado",
            projects_title: "Proyectos Destacados",
            projects_subtitle: "Una selección de soluciones reales de automatización e IA en las que estoy trabajando.",
            proj1_badge: "🚀 Producto propio · En desarrollo",
            proj1_problem: "La prospección de leads B2B locales es lenta, manual y poco escalable. Identificar qué negocios de una zona tienen o no presencia digital requiere horas de búsqueda manual.",
            proj1_solution: "Herramienta en Python con interfaz visual conectada a la API de Google Maps. Detecta automáticamente qué negocios carecen de web y audita los que sí la tienen: extrae email, redes sociales, formularios, WhatsApp y mide el rendimiento de carga.",
            proj2_badge: "🤖 En producción",
            proj2_problem: "Una clínica de belleza gestionaba sus reservas manualmente por teléfono y WhatsApp, con pérdida de citas fuera del horario de atención.",
            proj2_solution: "Agente conversacional construido con Botpress y Make, integrado con Google Calendar. Gestiona y confirma reservas de forma autónoma las 24 horas sin intervención del equipo.",
            proj_cta_info: "Más información", proj_cta_demo: "Ver demo",
            case_challenge: "El reto", case_solution: "La solución", case_results: "Resultados", proj_img_soon: "Screenshot próximamente",
            contact_title: "Hablemos",
            contact_text: "¿Tienes un proceso que se puede automatizar, una idea de agente conversacional o una vacante donde encaje mi perfil? Escríbeme y lo vemos.",
            form_name: "Nombre", form_email: "Email", form_subject: "Asunto", form_message: "Mensaje",
            form_subj_default: "Selecciona una opción", form_subj_1: "Oportunidad laboral", form_subj_2: "Proyecto de automatización", form_subj_3: "Lead Auditor Pro", form_subj_4: "Otro",
            form_btn: "Enviar mensaje", form_success: "¡Mensaje enviado correctamente! Te responderé pronto.", form_error: "Hubo un error al enviar. Revisa los datos e inténtalo de nuevo.",
            footer_tagline: "RPA & AI Automation Developer",
            flag: "🇬🇧"
        },
        en: {
            skip_link: "Skip to content",
            nav_home: "Home", nav_about: "About", nav_skills: "Skills", nav_projects: "Projects", nav_contact: "Contact",
            hero_greeting: "Hi, I'm",
            hero_tagline: "I automate business processes end to end with RPA and AI: conversational agents, API integrations and intelligent workflows that save hours of manual work.",
            hero_location: "Leganés, Madrid (Spain)", hero_availability: "On-site · Hybrid · Remote",
            btn_projects: "View projects", btn_cv: "Download CV",
            about_title: "About Me & Experience",
            about_p1: "I'm a developer specialized in hyperautomation and Artificial Intelligence. At Sermicro I design and ship conversational agents and RPA automations into production for clients in public administration, consulting and IT services.",
            about_p2: "My job is turning manual, repetitive processes into autonomous workflows: agents with Druid AI and LangChain, UiPath and Power Automate bots, and REST API integrations with systems like Jira or EasyVista. I trained as a Higher Technician in Cross-Platform Application Development and I'm certified in UiPath, Azure AI and PowerShell.",
            edu_title: "Education",
            edu1_degree: "Higher Technician in Cross-Platform Application Development (DAM)",
            edu2_degree: "Baccalaureate in Sciences",
            exp_title: "Experience", exp_present: "Present",
            exp1_role: "Hyperautomation & AI Technician",
            exp1_desc: "Building and shipping conversational agents with Druid AI (Teams, web and voice), automating processes with UiPath and Power Automate, automating the ServiceDesk of a public body with LangChain, and REST API integrations with Jira and EasyVista.",
            exp2_role: "Operations Team (Internship)",
            exp2_desc: "Resolving hardware and software incidents with Jira Service Desk and Confluence, preventive equipment maintenance and procedure documentation.",
            techskills_title: "Technical Skills",
            techskills_subtitle: "The stack I use every day to build automations, AI agents and integrations.",
            techskills_search: "Search skills...", techskills_filter_label: "Filter by area",
            techskills_showing: "Showing", techskills_of: "of", techskills_skills: "skills",
            techskills_reset: "Reset filters", techskills_active_filters: "Active filters:",
            techskills_no_results: "No skills found with these filters",
            techskills_area_auto: "Automation / AI", techskills_area_cloud: "Cloud & Systems", techskills_area_software: "Development & Data",
            cert_view: "View credential", cert_label: "Certified",
            projects_title: "Featured Projects",
            projects_subtitle: "A selection of real automation and AI solutions I'm working on.",
            proj1_badge: "🚀 Own product · In development",
            proj1_problem: "B2B local lead prospecting is slow, manual and hard to scale. Identifying which businesses in an area lack a digital presence requires hours of manual searching.",
            proj1_solution: "A Python tool with a visual interface connected to the Google Maps API. It automatically detects businesses with no website and audits those that have one: extracting email, social media, forms, WhatsApp and measuring load performance.",
            proj2_badge: "🤖 In production",
            proj2_problem: "A beauty clinic was managing bookings manually by phone and WhatsApp, losing appointments made outside business hours.",
            proj2_solution: "A conversational agent built with Botpress and Make, integrated with Google Calendar. It autonomously manages and confirms bookings around the clock with no staff intervention.",
            proj_cta_info: "Learn more", proj_cta_demo: "View demo",
            case_challenge: "The challenge", case_solution: "The solution", case_results: "Results", proj_img_soon: "Screenshot coming soon",
            contact_title: "Let's talk",
            contact_text: "Got a process worth automating, a conversational-agent idea, or a role my profile fits? Drop me a line and let's look at it.",
            form_name: "Name", form_email: "Email", form_subject: "Subject", form_message: "Message",
            form_subj_default: "Select an option", form_subj_1: "Job opportunity", form_subj_2: "Automation project", form_subj_3: "Lead Auditor Pro", form_subj_4: "Other",
            form_btn: "Send message", form_success: "Message sent successfully! I'll get back to you soon.", form_error: "There was an error sending. Please check the details and try again.",
            footer_tagline: "RPA & AI Automation Developer",
            flag: "🇪🇸"
        }
    };

    const typeTexts = {
        es: ["RPA & AI Automation Developer", "Especialista en Hiperautomatización", "Desarrollador de Agentes IA", "Integraciones & API REST"],
        en: ["RPA & AI Automation Developer", "Hyperautomation Specialist", "AI Agent Developer", "Integrations & REST APIs"]
    };

    // ─────────────── CONTENIDO DINÁMICO ───────────────
    function socialMarkup(size) {
        return `<a href="${CONFIG.socialLinks.github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg></a><a href="${CONFIG.socialLinks.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>`;
    }

    function updateDynamicContent() {
        const emailLink = document.getElementById('contactEmailLink');
        if (emailLink) { emailLink.href = `mailto:${CONFIG.email}`; emailLink.textContent = CONFIG.email; }

        const heroSocial = document.getElementById('socialIcons');
        if (heroSocial) heroSocial.innerHTML = socialMarkup(24);
        const contactSocial = document.getElementById('contactSocialIcons');
        if (contactSocial) contactSocial.innerHTML = socialMarkup(32);

        const projectsGrid = document.getElementById('projectsGrid');
        if (projectsGrid) projectsGrid.innerHTML = CONFIG.projects.map(proj => {
            const t = translations[currentLang];
            const featuredClass = proj.featured ? 'featured' : '';
            const badge = `<div class="project-badge" data-i18n="${proj.badgeKey}">${t[proj.badgeKey] || ''}</div>`;
            const imgHtml = proj.image
                ? `<img src="${proj.image}" alt="${proj.title}" loading="lazy" class="project-img">`
                : `<div class="project-img-placeholder" aria-hidden="true">
                     <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10.5" r="1.5"/><path d="m21 15-5-5L5 19"/></svg>
                     <span data-i18n="proj_img_soon">${t.proj_img_soon || 'Screenshot próximamente'}</span>
                   </div>`;
            const tagsHtml = proj.tags.map(tag => `<span>${tag}</span>`).join('');
            const resultsHtml = (proj.results || []).map(r => `<span class="result-chip">${r[currentLang] || r.es}</span>`).join('');
            const ctaBtn = proj.ctaUrl ? `<a href="${proj.ctaUrl}" class="btn btn-primary project-cta" data-i18n="${proj.ctaKey}">${t[proj.ctaKey] || ''}</a>` : '';
            return `<article class="project-card ${featuredClass} reveal" id="proj-${proj.id}">
              <div class="project-inner">
                <div class="project-media">${imgHtml}</div>
                <div class="project-content">
                  ${badge}
                  <h3 class="project-title">${proj.title}</h3>
                  <div class="case-block">
                    <span class="case-label" data-i18n="case_challenge">${t.case_challenge || 'El reto'}</span>
                    <p data-i18n="${proj.problemKey}"></p>
                  </div>
                  <div class="case-block">
                    <span class="case-label" data-i18n="case_solution">${t.case_solution || 'La solución'}</span>
                    <p data-i18n="${proj.solutionKey}"></p>
                  </div>
                  <div class="result-chips" aria-label="${t.case_results || 'Resultados'}">${resultsHtml}</div>
                  <div class="project-tags">${tagsHtml}</div>
                  <div class="project-actions">${ctaBtn}</div>
                </div>
              </div>
            </article>`;
        }).join('');

        if (contactForm) contactForm.action = (CONFIG.formspreeId && CONFIG.formspreeId !== 'YOUR_FORMSPREE_ID') ? `https://formspree.io/f/${CONFIG.formspreeId}` : '#';

        const footerYear = document.getElementById('footerYear');
        if (footerYear) footerYear.textContent = new Date().getFullYear();
    }

    const navLinks = document.querySelectorAll('.nav-links a');

    // ─────────────── IDIOMA ───────────────
    function updateLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const val = translations[lang][key];
            if (val !== undefined) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = val;
                else el.textContent = val;
            }
        });
        if (langToggle) langToggle.textContent = translations[lang].flag;
        resetTypewriter();
    }

    // ─────────────── TYPEWRITER ───────────────
    let typewriterWordIdx = 0, charIdx = 0, isDeleting = false;
    function typeEffect() {
        const words = typeTexts[currentLang];
        if (!words.length || !typewriterEl) return;
        const currentWord = words[typewriterWordIdx];
        typewriterEl.textContent = currentWord.substring(0, isDeleting ? charIdx - 1 : charIdx + 1);
        charIdx += isDeleting ? -1 : 1;
        let typeSpeed = isDeleting ? 50 : 100;
        if (!isDeleting && charIdx === currentWord.length) { typeSpeed = 2000; isDeleting = true; }
        else if (isDeleting && charIdx === 0) { isDeleting = false; typewriterWordIdx = (typewriterWordIdx + 1) % words.length; typeSpeed = 500; }
        typewriterTimeout = setTimeout(typeEffect, typeSpeed);
    }
    function resetTypewriter() {
        if (typewriterTimeout) clearTimeout(typewriterTimeout);
        typewriterWordIdx = charIdx = 0; isDeleting = false;
        if (!typewriterEl) return;
        if (prefersReducedMotion) { typewriterEl.textContent = typeTexts[currentLang][0]; return; }
        typewriterEl.textContent = '';
        typewriterTimeout = setTimeout(typeEffect, 200);
    }

    // ─────────────── TEMA ───────────────
    const sunIconSVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    const moonIconSVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (themeToggle) themeToggle.innerHTML = theme === 'dark' ? sunIconSVG : moonIconSVG;
        try { localStorage.setItem('theme', theme); } catch (e) {}
        // Sincronizar theme-color de la barra del navegador en móvil
        const tcDark  = document.getElementById('theme-color-dark');
        const tcLight = document.getElementById('theme-color-light');
        if (tcDark)  tcDark.setAttribute('content',  theme === 'dark'  ? '#0a0a0f' : '#fdfbf7');
        if (tcLight) tcLight.setAttribute('content', theme === 'light' ? '#fdfbf7' : '#0a0a0f');
    }
    function initTheme() {
        let saved = 'dark';
        try { saved = localStorage.getItem('theme') || 'dark'; } catch (e) {}
        setTheme(saved);
        if (themeToggle) themeToggle.addEventListener('click', () => {
            setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
        });
    }

    // ─────────────── NAVEGACIÓN ───────────────
    function initNav() {
        const sections = [];
        document.querySelectorAll('.section[id]').forEach(section => {
            const link = document.querySelector(`.nav-links a[href="#${section.id}"]`);
            if (link) sections.push({ section, link });
        });
        if (!sections.length) return;

        // Mientras dura un scroll por clic, ignoramos el "spy" para que no parpadee
        // marcando secciones intermedias por las que pasa la animación.
        let lockUntil = 0;

        function setActive(id) {
            sections.forEach(({ link, section }) => {
                const isActive = section.id === id;
                link.classList.toggle('active', isActive);
                if (isActive) link.setAttribute('aria-current', 'page');
                else link.removeAttribute('aria-current');
            });
        }

        function computeActiveId() {
            const doc = document.documentElement;
            // ¿Estamos al final de la página? → marca siempre la última sección,
            // aunque no haya llegado a la parte superior del viewport.
            if (window.innerHeight + window.scrollY >= doc.scrollHeight - 2) {
                return sections[sections.length - 1].section.id;
            }
            const probe = 140; // línea de sondeo, justo debajo del nav fijo
            let currentId = sections[0].section.id;
            for (const { section } of sections) {
                if (section.getBoundingClientRect().top <= probe) currentId = section.id;
            }
            return currentId;
        }

        function updateActiveLink() {
            if (performance.now() < lockUntil) return;
            setActive(computeActiveId());
        }

        navLinks.forEach(link => link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            const targetEl = href && href.startsWith('#') ? document.querySelector(href) : null;
            if (targetEl) {
                e.preventDefault();
                setActive(targetEl.id);                 // marca al instante el enlace pulsado
                lockUntil = performance.now() + 800;     // y bloquea el spy durante el scroll
                targetEl.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
            }
            navLinksContainer.classList.remove('open');
            menuBtn.classList.remove('open');
            menuBtn.setAttribute('aria-expanded', 'false');
        }));

        window.addEventListener('scroll', updateActiveLink, { passive: true });
        updateActiveLink();
    }

    function initRevealObserver() {
        const revealAll = () => document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
        if (prefersReducedMotion) { revealAll(); return; }
        const observer = new IntersectionObserver(
            entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
            { threshold: 0, rootMargin: '0px 0px 80px 0px' }
        );
        document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
        // Fallback: si algún reveal queda invisible tras 600ms (p.ej. modo claro, nav clic), forzar visible
        setTimeout(() => {
            document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
                const r = el.getBoundingClientRect();
                if (r.top < window.innerHeight + 200) el.classList.add('visible');
            });
        }, 600);
    }

    function updateTimelineOnScroll() {
        if (timeline && timelineLine) {
            const rect = timeline.getBoundingClientRect();
            if (rect.top < window.innerHeight) timelineLine.style.height = Math.min(timeline.offsetHeight, window.innerHeight - rect.top) + 'px';
        }
    }
    function handleScroll() {
        if (navbar) navbar.classList.toggle('scrolled', window.scrollY > 50);
        updateTimelineOnScroll();
    }
    let ticking = false;
    function onScrollHandler() {
        if (!ticking) { requestAnimationFrame(() => { handleScroll(); ticking = false; }); ticking = true; }
    }

    // ─────────────── CURSOR PERSONALIZADO (degrada con elegancia) ───────────────
    function initCustomCursor() {
        const cursor = document.getElementById('cursor');
        if (!cursor || !window.matchMedia('(hover: hover) and (pointer: fine)').matches || prefersReducedMotion) return;
        document.body.classList.add('custom-cursor'); // sólo entonces ocultamos el cursor nativo
        let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
        document.addEventListener('mousemove', e => {
            mouseX = e.clientX; mouseY = e.clientY;
            if (!cursorAnimFrame) cursorAnimFrame = requestAnimationFrame(function u() {
                cursorX = mouseX; cursorY = mouseY;
                cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
                cursorAnimFrame = null;
            });
        });
        document.addEventListener('mousedown', () => cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) scale(0.7)`);
        document.addEventListener('mouseup', () => cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%) scale(1)`);
    }

    // ─────────────── CV ───────────────
    function downloadCV() {
        const a = document.createElement('a');
        a.href = `assets/${CONFIG.cvFiles[currentLang] || CONFIG.cvFiles.es}`;
        a.download = CONFIG.cvFiles[currentLang] || CONFIG.cvFiles.es;
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }

    // ─────────────── FORMULARIO ───────────────
    let hideFeedbackTimeout;
    function showFeedback(el, ok) {
        if (hideFeedbackTimeout) clearTimeout(hideFeedbackTimeout);
        [formSuccess, formError].forEach(f => { f.classList.remove('success', 'error'); f.style.display = 'none'; });
        el.classList.add(ok ? 'success' : 'error');
        el.style.display = 'block';
        hideFeedbackTimeout = setTimeout(() => { el.classList.remove('success', 'error'); el.style.display = 'none'; }, 6000);
    }
    async function handleFormSubmit(e) {
        e.preventDefault();
        const isDemo = contactForm.action === '#' || contactForm.action.includes('YOUR_FORMSPREE_ID');
        const orig = formSubmitBtn.textContent;
        formSubmitBtn.disabled = true;
        formSubmitBtn.textContent = currentLang === 'es' ? 'Enviando...' : 'Sending...';
        try {
            if (isDemo) { await new Promise(r => setTimeout(r, 700)); showFeedback(formSuccess, true); fireConfetti(); contactForm.reset(); }
            else {
                const resp = await fetch(contactForm.action, { method: 'POST', body: new FormData(contactForm), headers: { Accept: 'application/json' } });
                if (resp.ok) { showFeedback(formSuccess, true); fireConfetti(); contactForm.reset(); } else throw new Error();
            }
        } catch { showFeedback(formError, false); }
        finally { formSubmitBtn.disabled = false; formSubmitBtn.textContent = orig; }
    }
    function fireConfetti() {
        if (prefersReducedMotion) return;
        for (let i = 0; i < 50; i++) {
            const c = document.createElement('div'); c.className = 'confetti';
            c.style.left = Math.random() * 100 + 'vw';
            c.style.animationDuration = (Math.random() * 2 + 1) + 's';
            c.style.backgroundColor = Math.random() > 0.5 ? 'var(--primary)' : 'var(--secondary)';
            document.body.appendChild(c); setTimeout(() => c.remove(), 3000);
        }
    }

    // ─────────────── MENÚ MÓVIL ───────────────
    function initMobileMenu() {
        if (!menuBtn || !navLinksContainer) return;
        menuBtn.addEventListener('click', e => { e.stopPropagation(); const o = navLinksContainer.classList.toggle('open'); menuBtn.classList.toggle('open'); menuBtn.setAttribute('aria-expanded', o); });
        navLinks.forEach(l => l.addEventListener('click', () => { navLinksContainer.classList.remove('open'); menuBtn.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); }));
        document.addEventListener('click', e => { if (!navLinksContainer.contains(e.target) && !menuBtn.contains(e.target)) { navLinksContainer.classList.remove('open'); menuBtn.classList.remove('open'); menuBtn.setAttribute('aria-expanded', 'false'); } });
    }

    // ─────────────── HABILIDADES ───────────────
    function initTechSkills() {
        const skills = CONFIG.techSkills;
        const grid = document.getElementById('techSkillsGrid');
        const searchInput = document.getElementById('techSkillsSearch');
        const clearBtn = document.getElementById('clearSearchBtn');
        const resetBtn = document.getElementById('resetFiltersBtn');
        const countSpan = document.getElementById('techSkillsCount');
        const totalSpan = document.getElementById('techSkillsTotal');
        const activeContainer = document.getElementById('activeFiltersContainer');
        const chipsDiv = document.getElementById('activeFiltersChips');
        const filterPills = document.querySelectorAll('.filter-pill');
        if (!grid) return;
        let activeFilters = new Set();
        let searchTerm = '';
        let debounce;

        const areaLabel = (f) => ({
            automatizacion: translations[currentLang].techskills_area_auto,
            cloud: translations[currentLang].techskills_area_cloud,
            software: translations[currentLang].techskills_area_software
        }[f] || f);

        function createCard(s) {
            const art = document.createElement('article');
            art.className = 'skill-card reveal visible';
            art.dataset.name = s.name.toLowerCase();
            art.dataset.areas = s.area.join(' ');
            art.dataset.searchable = (s.name + ' ' + (s.desc_en || '') + ' ' + s.desc + ' ' + s.tags.join(' ')).toLowerCase();

            const color = s.color === 'FFFFFF' ? '000000' : s.color;
            const desc = (currentLang === 'en' && s.desc_en) ? s.desc_en : s.desc;

            const iconWrapper = document.createElement('div');
            iconWrapper.className = 'skill-icon';
            if (s.iconSvg) {
                iconWrapper.innerHTML = s.iconSvg;
            } else {
                const img = document.createElement('img');
                img.src = `https://cdn.simpleicons.org/${s.icon}/${color}`;
                img.alt = `${s.name}`;
                img.loading = 'lazy';
                img.width = 40; img.height = 40;
                img.addEventListener('error', () => {
                    const abbr = s.name.replace(/[^A-Za-z0-9]/g, '').substring(0, 2).toUpperCase();
                    iconWrapper.innerHTML = `<svg viewBox="0 0 40 40" width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="#${color}"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#fff">${abbr}</text></svg>`;
                });
                iconWrapper.appendChild(img);
            }

            const head = document.createElement('div');
            head.className = 'skill-head';
            const h3 = document.createElement('h3');
            h3.className = 'skill-name';
            h3.textContent = s.name;
            head.appendChild(h3);
            if (s.cert) {
                if (s.certUrl) {
                    const a = document.createElement('a');
                    a.className = 'skill-cert is-link';
                    a.href = s.certUrl; a.target = '_blank'; a.rel = 'noopener noreferrer';
                    a.textContent = '✔ ' + translations[currentLang].cert_view;
                    a.setAttribute('aria-label', `${s.name} — ${translations[currentLang].cert_view}`);
                    head.appendChild(a);
                } else {
                    const span = document.createElement('span');
                    span.className = 'skill-cert';
                    span.textContent = '✔ ' + translations[currentLang].cert_label;
                    head.appendChild(span);
                }
            }

            const p = document.createElement('p');
            p.className = 'skill-desc';
            p.textContent = desc;

            const tagsDiv = document.createElement('div');
            tagsDiv.className = 'skill-tags';
            tagsDiv.innerHTML = s.tags.map(t => `<span class="skill-tag">${t}</span>`).join('');

            art.appendChild(iconWrapper);
            art.appendChild(head);
            art.appendChild(p);
            art.appendChild(tagsDiv);
            return art;
        }

        function applyFilters() {
            const cards = grid.querySelectorAll('.skill-card');
            let vis = 0;
            cards.forEach(c => {
                const areas = c.dataset.areas.split(' ');
                const matchesFilter = activeFilters.size ? areas.some(a => activeFilters.has(a)) : true;
                const matchesSearch = searchTerm ? c.dataset.searchable.includes(searchTerm.toLowerCase()) : true;
                const show = matchesFilter && matchesSearch;
                c.classList.toggle('hidden', !show);
                if (show) vis++;
            });
            countSpan.textContent = vis;
            resetBtn.style.display = (activeFilters.size || searchTerm) ? 'inline-block' : 'none';
            updateChips();
            handleEmpty(vis);
        }
        function handleEmpty(vis) {
            const old = grid.querySelector('.empty-state');
            if (vis === 0) {
                if (!old) {
                    const d = document.createElement('div'); d.className = 'empty-state';
                    d.innerHTML = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><p>${translations[currentLang].techskills_no_results}</p><button class="reset-filters-btn" id="emptyReset">${translations[currentLang].techskills_reset}</button>`;
                    grid.appendChild(d);
                    document.getElementById('emptyReset').addEventListener('click', resetAll);
                }
            } else if (old) old.remove();
        }
        function updateChips() {
            const chips = [];
            activeFilters.forEach(f => chips.push({ type: 'filter', value: f, label: areaLabel(f) }));
            if (searchTerm) chips.push({ type: 'search', value: searchTerm, label: `"${searchTerm}"` });
            if (chips.length) {
                activeContainer.style.display = 'block';
                chipsDiv.innerHTML = chips.map(c => `<span class="filter-chip">${c.label}<button data-remove-type="${c.type}" data-remove-value="${c.value}" aria-label="Quitar filtro">×</button></span>`).join('');
                chipsDiv.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
                    if (b.dataset.removeType === 'filter') { activeFilters.delete(b.dataset.removeValue); updatePills(); }
                    else { searchInput.value = ''; searchTerm = ''; clearBtn.style.display = 'none'; }
                    applyFilters();
                }));
            } else { activeContainer.style.display = 'none'; chipsDiv.innerHTML = ''; }
        }
        function updatePills() {
            filterPills.forEach(p => { const f = p.dataset.filter; const act = activeFilters.has(f); p.classList.toggle('active', act); p.setAttribute('aria-pressed', act); });
        }
        function resetAll() {
            activeFilters.clear(); searchInput.value = ''; searchTerm = ''; clearBtn.style.display = 'none';
            updatePills(); applyFilters();
        }

        searchInput?.addEventListener('input', e => {
            clearBtn.style.display = e.target.value ? 'flex' : 'none';
            clearTimeout(debounce);
            debounce = setTimeout(() => { searchTerm = e.target.value.trim(); applyFilters(); }, 200);
        });
        clearBtn?.addEventListener('click', () => { searchInput.value = ''; searchTerm = ''; clearBtn.style.display = 'none'; applyFilters(); });
        filterPills.forEach(p => p.addEventListener('click', () => {
            const f = p.dataset.filter;
            activeFilters.has(f) ? activeFilters.delete(f) : activeFilters.add(f);
            updatePills(); applyFilters();
        }));
        resetBtn?.addEventListener('click', resetAll);

        // Función de render reutilizable (re-pinta en el idioma actual sin re-vincular listeners)
        rerenderSkills = function () {
            grid.innerHTML = '';
            skills.forEach(s => grid.appendChild(createCard(s)));
            totalSpan.textContent = skills.length;
            applyFilters();
        };
        rerenderSkills();
    }

    // ─────────────── INIT ───────────────
    function init() {
        updateDynamicContent();
        updateLanguage(currentLang);
        if (langToggle) langToggle.addEventListener('click', () => {
            updateLanguage(currentLang === 'es' ? 'en' : 'es');
            updateDynamicContent();           // re-pinta proyectos (badges/CTA) en el nuevo idioma
            updateLanguage(currentLang);       // re-aplica data-i18n a los nodos recién creados
            if (rerenderSkills) rerenderSkills(); // re-pinta skills sin duplicar listeners
        });
        initTheme();
        initNav();
        initRevealObserver();
        // Pausa la animación del grid cuando el usuario cambia de pestaña
        const bgGrid = document.querySelector('.bg-grid');
        if (bgGrid && !prefersReducedMotion) {
            document.addEventListener('visibilitychange', () => {
                bgGrid.classList.toggle('is-paused', document.hidden);
            });
        }
        window.addEventListener('scroll', onScrollHandler, { passive: true });
        if (downloadCvBtn) downloadCvBtn.addEventListener('click', downloadCV);
        if (contactForm) contactForm.addEventListener('submit', handleFormSubmit);
        initCustomCursor();
        initMobileMenu();
        initTechSkills();
        handleScroll();
    }

    init();
})();
