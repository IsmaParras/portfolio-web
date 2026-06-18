(function () {
    "use strict";

    // ─────────────── ESTADO DEL MÓDULO ───────────────
    let CONFIG       = {};   // profile.json
    let translations = {};   // i18n.json
    let typeTexts    = {};   // i18n.json

    let currentLang = navigator.language.startsWith('es') ? 'es' : 'en';
    let rerenderSkills  = null;
    let revealObserver  = null;   // module-level so dynamic renders can register elements

    function observeNewReveals(container) {
        if (!revealObserver || !container) return;
        container.querySelectorAll('.reveal:not(.visible)').forEach(el => revealObserver.observe(el));
    }
    let typewriterTimeout = null;
    let cursorAnimFrame   = null;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ─────────────── CARGA DE DATOS ───────────────
    async function loadData() {
        const base = document.querySelector('base')?.href || './';
        const get  = url => fetch(url).then(r => { if (!r.ok) throw new Error(url); return r.json(); });
        const [profile, projects, skills, i18n] = await Promise.all([
            get('data/profile.json'),
            get('data/projects.json'),
            get('data/skills.json'),
            get('data/i18n.json'),
        ]);
        CONFIG = { ...profile, projects, techSkills: skills };
        translations = { es: i18n.es, en: i18n.en };
        typeTexts    = i18n.typeTexts;
    }

    function showLoadError() {
        const t = translations[currentLang] || {};
        ['projectsGrid','techSkillsGrid'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = `<p class="load-error">${t.load_error || 'Error al cargar el contenido. Recarga la página.'}</p>`;
        });
    }

    function showSkeletons() {
        // Si el contenido viene prerenderizado (build C4), no lo pisamos con
        // skeletons: evita el flash contenido-real → skeleton → contenido-real.
        const pg = document.getElementById('projectsGrid');
        if (pg && !pg.children.length) pg.innerHTML = '<div class="skeleton-card skeleton"></div><div class="skeleton-card skeleton"></div>';
        const sg = document.getElementById('techSkillsGrid');
        if (sg && !sg.children.length) sg.innerHTML = Array(6).fill('<div class="skeleton-skill skeleton"></div>').join('');
    }

    // ─────────────── REFERENCIAS DOM ───────────────
    const navbar           = document.getElementById('navbar');
    const menuBtn          = document.getElementById('menuBtn');
    const navLinksContainer= document.getElementById('navLinks');
    const langToggle       = document.getElementById('langToggle');
    const themeToggle      = document.getElementById('themeToggle');
    const typewriterEl     = document.getElementById('typewriter');
    const timelineLine     = document.getElementById('timelineLine');
    const timeline         = document.getElementById('timeline');
    const downloadCvBtn    = document.getElementById('downloadCvBtn');
    const contactForm      = document.getElementById('contactForm');
    const formSuccess      = document.getElementById('formSuccess');
    const formError        = document.getElementById('formError');
    const formSubmitBtn    = document.getElementById('formSubmitBtn');
    const navLinks         = document.querySelectorAll('.nav-links a');

    // ─────────────── SOCIAL / PROYECTOS / FOOTER ───────────────
    function socialMarkup(size) {
        return `<a href="${CONFIG.socialLinks.github}" target="_blank" rel="noopener noreferrer" aria-label="GitHub"><svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path></svg></a><a href="${CONFIG.socialLinks.linkedin}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg></a>`;
    }

    function updateDynamicContent() {
        const t = translations[currentLang];
        const emailLink = document.getElementById('contactEmailLink');
        if (emailLink) { emailLink.href = `mailto:${CONFIG.email}`; emailLink.textContent = CONFIG.email; }

        const heroSocial    = document.getElementById('socialIcons');
        const contactSocial = document.getElementById('contactSocialIcons');
        if (heroSocial)    heroSocial.innerHTML    = socialMarkup(24);
        if (contactSocial) contactSocial.innerHTML = socialMarkup(32);

        const projectsGrid = document.getElementById('projectsGrid');
        if (projectsGrid) {
            projectsGrid.innerHTML = CONFIG.projects.map(proj => {
                const tagsHtml    = proj.tags.map(tag => `<span>${tag}</span>`).join('');
                const resultsHtml = (proj.results || []).map(r => `<span class="result-chip">${r[currentLang] || r.es}</span>`).join('');
                const ctaBtn      = proj.ctaUrl ? `<a href="${proj.ctaUrl}" class="btn btn-primary project-cta" data-i18n="${proj.ctaKey}">${t[proj.ctaKey] || ''}</a>` : '';
                const badgeHtml   = proj.badgeKey ? `<div class="project-badge" data-i18n="${proj.badgeKey}">${t[proj.badgeKey] || ''}</div>` : '';
                return `<article class="project-card${proj.featured ? ' featured' : ''} reveal visible" id="proj-${proj.id}">
                  ${badgeHtml}
                  <h3 class="project-title">${proj.title}</h3>
                  <p class="project-desc" data-i18n="${proj.descKey}"></p>
                  <div class="result-chips">${resultsHtml}</div>
                  <div class="project-tags">${tagsHtml}</div>
                  <div class="project-actions">${ctaBtn}</div>
                </article>`;
            }).join('');
            // Registra en el observer cualquier reveal dinámico restante
            observeNewReveals(projectsGrid);
        }

        if (contactForm) contactForm.action = (CONFIG.formspreeId && CONFIG.formspreeId !== 'YOUR_FORMSPREE_ID')
            ? `https://formspree.io/f/${CONFIG.formspreeId}` : '#';

        const footerYear = document.getElementById('footerYear');
        if (footerYear) footerYear.textContent = new Date().getFullYear();
    }

    // ─────────────── IDIOMA ───────────────
    function updateLanguage(lang) {
        currentLang = lang;
        document.documentElement.lang = lang;
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const val = translations[lang]?.[el.getAttribute('data-i18n')];
            if (val === undefined) return;
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') el.placeholder = val;
            else el.textContent = val;
        });
        if (langToggle) langToggle.textContent = translations[lang]?.flag || '';
        resetTypewriter();
    }

    // ─────────────── TYPEWRITER ───────────────
    let typewriterWordIdx = 0, charIdx = 0, isDeleting = false;
    function typeEffect() {
        const words = typeTexts[currentLang] || [];
        if (!words.length || !typewriterEl) return;
        const word = words[typewriterWordIdx];
        typewriterEl.textContent = word.substring(0, isDeleting ? charIdx - 1 : charIdx + 1);
        charIdx += isDeleting ? -1 : 1;
        let speed = isDeleting ? 50 : 100;
        if (!isDeleting && charIdx === word.length) { speed = 2000; isDeleting = true; }
        else if (isDeleting && charIdx === 0) { isDeleting = false; typewriterWordIdx = (typewriterWordIdx + 1) % words.length; speed = 500; }
        typewriterTimeout = setTimeout(typeEffect, speed);
    }
    function resetTypewriter() {
        if (typewriterTimeout) clearTimeout(typewriterTimeout);
        typewriterWordIdx = charIdx = 0; isDeleting = false;
        if (!typewriterEl) return;
        if (prefersReducedMotion) { typewriterEl.textContent = (typeTexts[currentLang] || [])[0] || ''; return; }
        typewriterEl.textContent = '';
        typewriterTimeout = setTimeout(typeEffect, 200);
    }

    // ─────────────── TEMA ───────────────
    const sunIconSVG  = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>`;
    const moonIconSVG = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        if (themeToggle) themeToggle.innerHTML = theme === 'dark' ? sunIconSVG : moonIconSVG;
        try { localStorage.setItem('theme', theme); } catch (e) {}
        const tcDark  = document.getElementById('theme-color-dark');
        const tcLight = document.getElementById('theme-color-light');
        if (tcDark)  tcDark.setAttribute('content',  theme === 'dark'  ? '#0a0a0f' : '#fdfbf7');
        if (tcLight) tcLight.setAttribute('content', theme === 'light' ? '#fdfbf7' : '#0a0a0f');
    }
    function initTheme() {
        let saved = 'dark';
        try { saved = localStorage.getItem('theme') || 'dark'; } catch (e) {}
        setTheme(saved);
        if (themeToggle) themeToggle.addEventListener('click', () =>
            setTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'));
    }

    // ─────────────── NAVEGACIÓN ───────────────
    function initNav() {
        const sections = [];
        document.querySelectorAll('.section[id]').forEach(section => {
            if (document.querySelector(`.nav-links a[href="#${section.id}"]`)) sections.push(section);
        });

        let navClickLock = false, navLockTimer = null;
        function setActiveLink(id) {
            navLinks.forEach(link => {
                const active = link.getAttribute('href') === '#' + id;
                link.classList.toggle('active', active);
                if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
            });
        }
        function lockNavTo(id) {
            setActiveLink(id); navClickLock = true;
            if (navLockTimer) clearTimeout(navLockTimer);
            navLockTimer = setTimeout(() => { navClickLock = false; }, 800);
        }
        navLinks.forEach(link => link.addEventListener('click', e => {
            e.preventDefault();
            const id = link.getAttribute('href').slice(1);
            const target = document.getElementById(id);
            if (target) { lockNavTo(id); target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' }); }
            navLinksContainer.classList.remove('open');
            menuBtn.classList.remove('open');
            menuBtn?.setAttribute('aria-expanded', 'false');
        }));
        window.addEventListener('scrollend', () => { navClickLock = false; });

        if (sections.length) {
            function updateActiveLink() {
                if (navClickLock) return;
                const offset = (navbar?.offsetHeight || 80) + 60;
                let currentId = sections[0].id;
                for (const s of sections) { if (s.getBoundingClientRect().top <= offset) currentId = s.id; }
                if (Math.ceil(window.scrollY + window.innerHeight) >= document.documentElement.scrollHeight - 2)
                    currentId = sections[sections.length - 1].id;
                setActiveLink(currentId);
            }
            window.addEventListener('scroll', updateActiveLink, { passive: true });
            updateActiveLink();
        }
    }

    function initMobileMenu() {
        if (!menuBtn || !navLinksContainer) return;
        menuBtn.addEventListener('click', e => {
            e.stopPropagation();
            const open = navLinksContainer.classList.toggle('open');
            menuBtn.classList.toggle('open', open);
            menuBtn.setAttribute('aria-expanded', String(open));
        });
        document.addEventListener('click', e => {
            if (!navLinksContainer.contains(e.target) && !menuBtn.contains(e.target)) {
                navLinksContainer.classList.remove('open');
                menuBtn.classList.remove('open');
                menuBtn.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // ─────────────── REVEAL ───────────────
    function initRevealObserver() {
        const revealAll = () => document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
        if (prefersReducedMotion) { revealAll(); return; }
        revealObserver = new IntersectionObserver(
            entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); }),
            { threshold: 0, rootMargin: '0px 0px 100px 0px' }
        );
        document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
        // Fallback ampliado: fuerza visible cualquier reveal que ya esté cerca
        setTimeout(() => {
            document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
                if (el.getBoundingClientRect().top < window.innerHeight + 400) el.classList.add('visible');
            });
        }, 800);
    }

    // ─────────────── SCROLL ───────────────
    function updateTimelineOnScroll() {
        if (timeline && timelineLine) {
            const rect = timeline.getBoundingClientRect();
            if (rect.top < window.innerHeight)
                timelineLine.style.height = Math.min(timeline.offsetHeight, window.innerHeight - rect.top) + 'px';
        }
    }
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                navbar?.classList.toggle('scrolled', window.scrollY > 50);
                updateTimelineOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // ─────────────── CURSOR ───────────────
    function initCustomCursor() {
        const cursor = document.getElementById('cursor');
        if (!cursor || !window.matchMedia('(hover: hover) and (pointer: fine)').matches || prefersReducedMotion) return;
        document.body.classList.add('custom-cursor');
        let mx = 0, my = 0;
        document.addEventListener('mousemove', e => {
            mx = e.clientX; my = e.clientY;
            if (!cursorAnimFrame) cursorAnimFrame = requestAnimationFrame(() => {
                cursor.style.transform = `translate3d(${mx}px,${my}px,0) translate(-50%,-50%)`;
                cursorAnimFrame = null;
            });
        });
        document.addEventListener('mousedown', () => cursor.style.transform += ' scale(0.7)');
        document.addEventListener('mouseup',   () => cursor.style.transform = cursor.style.transform.replace(' scale(0.7)', ''));
    }

    // ─────────────── CV ───────────────
    function downloadCV() {
        const a = document.createElement('a');
        a.href = CONFIG.cvFiles[currentLang] || CONFIG.cvFiles.es;
        a.download = (CONFIG.cvFiles[currentLang] || CONFIG.cvFiles.es).split('/').pop();
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
    }

    // ─────────────── FORMULARIO ───────────────
    let hideFeedbackTimeout;
    function showFeedback(el, ok) {
        if (hideFeedbackTimeout) clearTimeout(hideFeedbackTimeout);
        [formSuccess, formError].forEach(f => { f?.classList.remove('success','error'); if (f) f.style.display = 'none'; });
        if (!el) return;
        el.classList.add(ok ? 'success' : 'error'); el.style.display = 'block';
        hideFeedbackTimeout = setTimeout(() => { el.classList.remove('success','error'); el.style.display = 'none'; }, 6000);
    }
    async function handleFormSubmit(e) {
        e.preventDefault();
        const isDemo = !contactForm.action || contactForm.action === '#' || contactForm.action.includes('YOUR_FORMSPREE');
        const orig = formSubmitBtn?.textContent;
        if (formSubmitBtn) { formSubmitBtn.disabled = true; formSubmitBtn.textContent = currentLang === 'es' ? 'Enviando…' : 'Sending…'; }
        try {
            if (isDemo) { await new Promise(r => setTimeout(r, 700)); showFeedback(formSuccess, true); fireConfetti(); contactForm.reset(); }
            else {
                const resp = await fetch(contactForm.action, { method: 'POST', body: new FormData(contactForm), headers: { Accept: 'application/json' } });
                if (resp.ok) { showFeedback(formSuccess, true); fireConfetti(); contactForm.reset(); } else throw new Error();
            }
        } catch { showFeedback(formError, false); }
        finally { if (formSubmitBtn) { formSubmitBtn.disabled = false; formSubmitBtn.textContent = orig; } }
    }
    function fireConfetti() {
        if (prefersReducedMotion) return;
        for (let i = 0; i < 50; i++) {
            const c = document.createElement('div'); c.className = 'confetti';
            c.style.cssText = `left:${Math.random()*100}vw;animation-duration:${Math.random()*2+1}s;background:${Math.random()>.5?'var(--primary)':'var(--secondary)'}`;
            document.body.appendChild(c); setTimeout(() => c.remove(), 3000);
        }
    }

    // ─────────────── SKILLS ───────────────
    function initTechSkills() {
        const skills = CONFIG.techSkills || [];
        const grid   = document.getElementById('techSkillsGrid');
        if (!grid) return;

        const searchInput = document.getElementById('techSkillsSearch');
        const clearBtn    = document.getElementById('clearSearchBtn');
        const resetBtn    = document.getElementById('resetFiltersBtn');
        const countSpan   = document.getElementById('techSkillsCount');
        const totalSpan   = document.getElementById('techSkillsTotal');
        const activeContainer = document.getElementById('activeFiltersContainer');
        const chipsDiv    = document.getElementById('activeFiltersChips');
        const filterPills = document.querySelectorAll('.filter-pill');

        let activeFilters = new Set(), searchTerm = '', debounce;

        const areaLabel = f => ({ automatizacion: translations[currentLang]?.techskills_area_auto, cloud: translations[currentLang]?.techskills_area_cloud, software: translations[currentLang]?.techskills_area_software }[f] || f);

        function createCard(s) {
            const art = document.createElement('article');
            art.className = 'skill-card reveal visible';
            art.dataset.areas      = s.area.join(' ');
            art.dataset.searchable = (s.name + ' ' + (s.desc_en || '') + ' ' + s.desc + ' ' + s.tags.join(' ')).toLowerCase();
            const color = s.color === 'FFFFFF' ? '000000' : s.color;
            const desc  = currentLang === 'en' && s.desc_en ? s.desc_en : s.desc;
            const iconWrap = document.createElement('div'); iconWrap.className = 'skill-icon';
            if (s.iconSvg) { iconWrap.innerHTML = s.iconSvg; }
            else {
                const img = document.createElement('img');
                img.src = `https://cdn.simpleicons.org/${s.icon}/${color}`;
                img.alt = s.name; img.loading = 'lazy'; img.width = 40; img.height = 40;
                img.addEventListener('error', () => {
                    const abbr = s.name.replace(/[^A-Za-z0-9]/g,'').substring(0,2).toUpperCase();
                    iconWrap.innerHTML = `<svg viewBox="0 0 40 40" width="40" height="40" xmlns="http://www.w3.org/2000/svg"><rect width="40" height="40" rx="8" fill="#${color}"/><text x="50%" y="55%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="bold" font-size="14" fill="#fff">${abbr}</text></svg>`;
                });
                iconWrap.appendChild(img);
            }
            const head = document.createElement('div'); head.className = 'skill-head';
            const h3   = document.createElement('h3');  h3.className = 'skill-name'; h3.textContent = s.name;
            head.appendChild(h3);
            if (s.cert) {
                const el = s.certUrl ? document.createElement('a') : document.createElement('span');
                el.className = 'skill-cert' + (s.certUrl ? ' is-link' : '');
                el.textContent = '✔ ' + (s.certUrl ? translations[currentLang]?.cert_view : translations[currentLang]?.cert_label);
                if (s.certUrl) { el.href = s.certUrl; el.target = '_blank'; el.rel = 'noopener noreferrer'; }
                head.appendChild(el);
            }
            const p = document.createElement('p'); p.className = 'skill-desc'; p.textContent = desc;
            const tagsDiv = document.createElement('div'); tagsDiv.className = 'skill-tags';
            tagsDiv.innerHTML = s.tags.map(t => `<span class="skill-tag">${t}</span>`).join('');
            art.append(iconWrap, head, p, tagsDiv);
            return art;
        }

        function applyFilters() {
            const cards = grid.querySelectorAll('.skill-card');
            let vis = 0;
            cards.forEach(c => {
                const areas = c.dataset.areas.split(' ');
                const show  = (activeFilters.size ? areas.some(a => activeFilters.has(a)) : true)
                           && (searchTerm ? c.dataset.searchable.includes(searchTerm.toLowerCase()) : true);
                c.classList.toggle('hidden', !show);
                if (show) vis++;
            });
            if (countSpan) countSpan.textContent = vis;
            if (resetBtn)  resetBtn.style.display = (activeFilters.size || searchTerm) ? 'inline-block' : 'none';
            updateChips(); handleEmpty(vis);
        }
        function handleEmpty(vis) {
            const old = grid.querySelector('.empty-state');
            if (vis === 0) {
                if (!old) {
                    const d = document.createElement('div'); d.className = 'empty-state';
                    d.innerHTML = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg><p>${translations[currentLang]?.techskills_no_results || ''}</p><button class="reset-filters-btn" id="emptyReset">${translations[currentLang]?.techskills_reset || ''}</button>`;
                    grid.appendChild(d);
                    document.getElementById('emptyReset')?.addEventListener('click', resetAll);
                }
            } else old?.remove();
        }
        function updateChips() {
            const chips = [...activeFilters].map(f => ({ type:'filter', value:f, label:areaLabel(f) }));
            if (searchTerm) chips.push({ type:'search', value:searchTerm, label:`"${searchTerm}"` });
            if (chips.length) {
                if (activeContainer) activeContainer.style.display = 'block';
                if (chipsDiv) chipsDiv.innerHTML = chips.map(c => `<span class="filter-chip">${c.label}<button data-remove-type="${c.type}" data-remove-value="${c.value}" aria-label="Quitar filtro">×</button></span>`).join('');
                chipsDiv?.querySelectorAll('button').forEach(b => b.addEventListener('click', () => {
                    if (b.dataset.removeType === 'filter') { activeFilters.delete(b.dataset.removeValue); updatePills(); }
                    else { if (searchInput) searchInput.value = ''; searchTerm = ''; if (clearBtn) clearBtn.style.display = 'none'; }
                    applyFilters();
                }));
            } else {
                if (activeContainer) activeContainer.style.display = 'none';
                if (chipsDiv) chipsDiv.innerHTML = '';
            }
        }
        function updatePills() {
            filterPills.forEach(p => {
                const active = activeFilters.has(p.dataset.filter);
                p.classList.toggle('active', active); p.setAttribute('aria-pressed', String(active));
            });
        }
        function resetAll() {
            activeFilters.clear();
            if (searchInput) searchInput.value = '';
            searchTerm = '';
            if (clearBtn) clearBtn.style.display = 'none';
            updatePills(); applyFilters();
        }

        searchInput?.addEventListener('input', e => {
            if (clearBtn) clearBtn.style.display = e.target.value ? 'flex' : 'none';
            clearTimeout(debounce);
            debounce = setTimeout(() => { searchTerm = e.target.value.trim(); applyFilters(); }, 200);
        });
        clearBtn?.addEventListener('click', () => { if (searchInput) searchInput.value = ''; searchTerm = ''; if (clearBtn) clearBtn.style.display = 'none'; applyFilters(); });
        filterPills.forEach(p => p.addEventListener('click', () => {
            activeFilters.has(p.dataset.filter) ? activeFilters.delete(p.dataset.filter) : activeFilters.add(p.dataset.filter);
            updatePills(); applyFilters();
        }));
        resetBtn?.addEventListener('click', resetAll);

        rerenderSkills = () => {
            grid.innerHTML = '';
            skills.forEach(s => grid.appendChild(createCard(s)));
            if (totalSpan) totalSpan.textContent = skills.length;
            applyFilters();
        };
        rerenderSkills();
    }

    // ─────────────── INIT ───────────────
    async function init() {
        // Cosas que no necesitan datos: tema y skeletons de carga
        initTheme();
        showSkeletons();

        try {
            await loadData();
        } catch (err) {
            console.error('Error cargando datos:', err);
            showLoadError();
            return;
        }

        updateDynamicContent();
        updateLanguage(currentLang);

        if (langToggle) langToggle.addEventListener('click', () => {
            updateLanguage(currentLang === 'es' ? 'en' : 'es');
            updateDynamicContent();
            updateLanguage(currentLang);
            if (rerenderSkills) rerenderSkills();
        });

        if (downloadCvBtn) downloadCvBtn.addEventListener('click', downloadCV);
        if (contactForm)   contactForm.addEventListener('submit', handleFormSubmit);

        initNav();
        initMobileMenu();
        initRevealObserver();
        initCustomCursor();

        const bgGrid = document.querySelector('.bg-grid');
        if (bgGrid && !prefersReducedMotion) {
            document.addEventListener('visibilitychange', () => {
                bgGrid.classList.toggle('is-paused', document.hidden);
            });
        }

        initTechSkills();
        navbar?.classList.toggle('scrolled', window.scrollY > 50);
        updateTimelineOnScroll();
    }

    init();
})();
