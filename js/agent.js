(function () {
    "use strict";

    // Asistente de IA: botón flotante + panel de chat. Solo aparece si /api/chat está
    // configurado. Todo lo que muestra se inserta como texto, nunca como HTML.
    const ENDPOINT = '/api/chat';
    const MAX_CHARS = 500;
    const MAX_HISTORY = 6;
    const SECTIONS = ['home', 'about', 'tech-skills', 'projects', 'contact'];
    const AREAS = ['', 'automatizacion', 'cloud', 'software'];
    const SUBJECTS = ['opportunity', 'project', 'other'];
    const HOME_ACTIONS = ['goTo', 'filterSkills', 'prefillContact'];   // necesitan la portada
    const PENDING_KEY = 'agent:pending';
    const PENDING_TTL = 30000;

    const history = [];
    let panel, list, input, sendBtn, toggleBtn, busy = false;

    const p = () => window.portfolio;
    const t = key => p()?.t(key) || '';
    const lang = () => (p()?.lang() === 'en' ? 'en' : 'es');

    // ───────── acciones pedidas por el agente (validadas otra vez en el navegador) ─────────
    // Devuelve la acción reducida a sus campos conocidos, o null si no está en las listas cerradas.
    function sanitize(action) {
        if (!action || typeof action !== 'object') return null;
        switch (action.type) {
            case 'goTo': return SECTIONS.includes(action.section) ? { type: 'goTo', section: action.section } : null;
            case 'filterSkills': return AREAS.includes(action.area) ? { type: 'filterSkills', area: action.area, search: String(action.search || '').slice(0, 60) } : null;
            case 'setLang': return action.lang === 'es' || action.lang === 'en' ? { type: 'setLang', lang: action.lang } : null;
            case 'downloadCV': return { type: 'downloadCV' };
            case 'prefillContact': return SUBJECTS.includes(action.subject) ? { type: 'prefillContact', subject: action.subject, message: String(action.message || '').slice(0, 500) } : null;
            default: return null;
        }
    }

    function execute(action) {
        switch (action.type) {
            case 'goTo': p().goTo(action.section); break;
            case 'filterSkills': p().filterSkills?.(action.area, action.search); p().goTo('tech-skills'); break;
            case 'downloadCV': p().downloadCV(); break;
            case 'prefillContact': close(false); p().prefillContact(action.subject, action.message); break;
        }
    }

    const onHome = () => !!document.getElementById('home');
    const homeUrl = l => (l === 'en' ? '/en/' : '/');
    // El selector de idioma apunta siempre a la página equivalente en el otro idioma.
    const otherLangUrl = () => (document.getElementById('langToggle')?.getAttribute('href') || homeUrl(lang() === 'en' ? 'es' : 'en')).split('#')[0];

    // Cambia de página conservando la conversación y las acciones que quedan por hacer.
    function leave(url, actions) {
        try { sessionStorage.setItem(PENDING_KEY, JSON.stringify({ at: Date.now(), actions, history: history.slice(-MAX_HISTORY) })); } catch { /* sin almacenamiento: se navega igual */ }
        location.href = url;
    }

    function runAll(actions) {
        const clean = actions.map(sanitize).filter(Boolean);
        const langChange = clean.find(a => a.type === 'setLang' && a.lang !== lang());
        const needHome = clean.filter(a => HOME_ACTIONS.includes(a.type));
        clean.filter(a => a.type === 'downloadCV').forEach(execute);
        if (langChange) leave(needHome.length ? homeUrl(langChange.lang) : otherLangUrl() + location.hash, needHome);
        else if (needHome.length && !onHome()) leave(homeUrl(lang()), needHome);
        else needHome.forEach(execute);
    }

    // Al llegar de otra página: recupera la conversación y ejecuta lo pendiente, validado de nuevo.
    function resume() {
        let saved;
        try {
            saved = JSON.parse(sessionStorage.getItem(PENDING_KEY) || 'null');
            sessionStorage.removeItem(PENDING_KEY);
        } catch { return; }
        if (!saved || typeof saved !== 'object' || !(Date.now() - saved.at < PENDING_TTL)) return;
        const turns = (Array.isArray(saved.history) ? saved.history : []).slice(-MAX_HISTORY)
            .filter(m => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string')
            .map(m => ({ role: m.role, content: m.content.slice(0, 1200), acts: m.role === 'assistant' ? cleanActions(m.acts) : [], srcs: m.role === 'assistant' ? cleanSources(m.srcs) : [] }));
        turns.forEach(m => { history.push(m); const w = addMessage(m.role === 'user' ? 'user' : 'bot', m.content); addSources(w, m.srcs); addTrace(w, m.acts); });
        const actions = (Array.isArray(saved.actions) ? saved.actions.slice(0, 3) : []).map(sanitize)
            .filter(a => a && HOME_ACTIONS.includes(a.type));
        if (turns.length) open();
        if (onHome()) actions.forEach(execute);
    }

    // ───────── traza: qué acción ha pedido el modelo y se ha ejecutado ─────────
    // Las claves van escritas enteras para que scripts/check.mjs las encuentre.
    const SECTION_KEYS = { home: 'nav_home', about: 'nav_about', 'tech-skills': 'nav_skills', projects: 'nav_projects', contact: 'nav_contact' };
    const AREA_KEYS = { automatizacion: 'techskills_area_auto', cloud: 'techskills_area_cloud', software: 'techskills_area_software' };
    function describe(a) {
        switch (a.type) {
            case 'goTo': return t('agent_act_goto').replace('{x}', t(SECTION_KEYS[a.section]));
            case 'filterSkills': return t('agent_act_filter').replace('{x}', (a.area ? t(AREA_KEYS[a.area]) : t('agent_act_all')) + (a.search ? ` · "${a.search}"` : ''));
            case 'setLang': return t(a.lang === 'en' ? 'agent_act_lang_en' : 'agent_act_lang_es');
            case 'downloadCV': return t('agent_act_cv');
            case 'prefillContact': return t('agent_act_contact');
            default: return '';
        }
    }
    function addTrace(wrap, actions) {
        const items = actions.map(describe).filter(Boolean);
        if (!items.length) return;
        const ul = el('ul', { class: 'agent-trace', 'aria-label': t('agent_trace') });
        items.forEach(text => {
            const li = el('li');
            li.append(el('span', { class: 'agent-trace-tag' }, t('agent_trace')), ' ', el('span', {}, text));
            ul.append(li);
        });
        wrap.append(ul);
        list.scrollTop = list.scrollHeight;
    }
    const cleanActions = v => (Array.isArray(v) ? v.slice(0, 3) : []).map(sanitize).filter(Boolean);

    // ───────── fuentes citadas: de qué parte de la web sale cada respuesta ─────────
    // Mismas ids que SOURCES en api/chat.js; "otros" son datos que Ismael facilita y no están a la vista.
    const SOURCES = {
        perfil: ['agent_src_perfil', 'home'], sobre_mi: ['agent_src_sobre_mi', 'about'], experiencia: ['agent_src_experiencia', 'timeline'],
        formacion: ['agent_src_formacion', 'education'], proyectos: ['agent_src_proyectos', 'projects'], habilidades: ['agent_src_habilidades', 'tech-skills'],
        certificaciones: ['agent_src_certificaciones', 'certifications'], contacto: ['agent_src_contacto', 'contact'], otros: ['agent_src_otros', null],
    };
    const cleanSources = v => [...new Set(Array.isArray(v) ? v : [])].filter(id => Object.hasOwn(SOURCES, id)).slice(0, 3);
    function addSources(wrap, ids) {
        if (!ids.length) return;
        const p = el('div', { class: 'agent-sources' });   // div, no p: no hereda el estilo de burbuja de .agent-msg p
        p.append(el('span', { class: 'agent-sources-label' }, t('agent_sources')));
        ids.forEach(id => {
            const [key, anchor] = SOURCES[id];
            if (!anchor) { p.append(el('span', { class: 'agent-source agent-source--plain' }, t(key))); return; }
            const a = el('a', { class: 'agent-source', href: (onHome() ? '' : homeUrl(lang())) + '#' + anchor }, t(key));
            // En pantallas estrechas el panel tapa la página: se cierra para ver la sección
            a.addEventListener('click', () => { if (onHome() && window.matchMedia('(max-width: 700px)').matches) close(false); });
            p.append(a);
        });
        wrap.append(p);
        list.scrollTop = list.scrollHeight;
    }

    // ───────── interfaz ─────────
    function el(tag, attrs = {}, text) {
        const e = document.createElement(tag);
        for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
        if (text !== undefined) e.textContent = text;
        return e;
    }

    function addMessage(role, text) {
        const wrap = el('div', { class: `agent-msg agent-msg--${role}` });
        wrap.append(el('span', { class: 'agent-msg-who' }, role === 'user' ? t('agent_you') : t('agent_bot')), el('p', {}, text));
        list.append(wrap);
        list.scrollTop = list.scrollHeight;
        return wrap;
    }

    function setBusy(state) {
        busy = state;
        sendBtn.disabled = state;
        input.disabled = state;
        panel.setAttribute('aria-busy', String(state));
    }

    async function send(text) {
        text = String(text || '').trim().slice(0, MAX_CHARS);
        if (!text || busy) return;
        addMessage('user', text);
        input.value = '';
        setBusy(true);
        const pending = addMessage('bot', t('agent_thinking'));
        pending.classList.add('agent-msg--pending');
        try {
            const res = await fetch(ENDPOINT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text, lang: lang(), history: history.slice(-MAX_HISTORY).map(({ role, content }) => ({ role, content })) }),
            });
            const data = await res.json().catch(() => ({}));
            const reply = typeof data.reply === 'string' && data.reply ? data.reply : t('agent_error');
            if (!res.ok) console.warn('Asistente:', res.status, data.error || '', data.detail || '');
            pending.classList.remove('agent-msg--pending');
            pending.querySelector('p').textContent = reply;
            if (res.ok) {
                const acts = cleanActions(data.actions);
                const srcs = cleanSources(data.sources);
                addSources(pending, srcs);
                addTrace(pending, acts);
                history.push({ role: 'user', content: text }, { role: 'assistant', content: reply, acts, srcs });
                runAll(acts);
            }
        } catch {
            pending.classList.remove('agent-msg--pending');
            pending.querySelector('p').textContent = t('agent_error');
        } finally {
            setBusy(false);
            if (!panel.hidden) input.focus({ preventScroll: true });
        }
    }

    function open() {
        panel.hidden = false;
        toggleBtn.setAttribute('aria-expanded', 'true');
        input.focus({ preventScroll: true });
    }
    function close(returnFocus = true) {
        panel.hidden = true;
        toggleBtn.setAttribute('aria-expanded', 'false');
        if (returnFocus) toggleBtn.focus();
    }

    function build() {
        toggleBtn = el('button', { type: 'button', class: 'agent-toggle', 'aria-expanded': 'false', 'aria-controls': 'agentPanel', 'aria-label': t('agent_open') });
        const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        icon.setAttribute('class', 'agent-toggle-icon'); icon.setAttribute('viewBox', '0 0 24 24'); icon.setAttribute('aria-hidden', 'true');
        icon.innerHTML = '<path d="M4 5h16v11H9l-5 4z" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round"/><circle cx="9" cy="10.5" r="1.2" fill="currentColor"/><circle cx="12" cy="10.5" r="1.2" fill="currentColor"/><circle cx="15" cy="10.5" r="1.2" fill="currentColor"/>';
        toggleBtn.append(icon, el('span', { class: 'agent-toggle-text' }, t('agent_open_short')));

        panel = el('section', { id: 'agentPanel', class: 'agent-panel', role: 'dialog', 'aria-label': t('agent_title') });
        panel.hidden = true;

        const head = el('header', { class: 'agent-head' });
        const closeBtn = el('button', { type: 'button', class: 'agent-close', 'aria-label': t('agent_close') }, '×');
        head.append(el('h2', { class: 'agent-title' }, t('agent_title')), closeBtn);

        // tabindex: con el teclado también se puede desplazar la conversación cuando no hay enlaces dentro
        list = el('div', { class: 'agent-list', role: 'log', 'aria-live': 'polite', 'aria-label': t('agent_title'), tabindex: '0' });

        const form = el('form', { class: 'agent-form', autocomplete: 'off' });
        input = el('input', { type: 'text', class: 'agent-input', maxlength: String(MAX_CHARS), placeholder: t('agent_placeholder'), 'aria-label': t('agent_placeholder') });
        sendBtn = el('button', { type: 'submit', class: 'agent-send' }, t('agent_send'));
        form.append(input, sendBtn);

        const sugg = el('div', { class: 'agent-suggestions' });
        ['agent_sug1', 'agent_sug2'].forEach(key => {
            const b = el('button', { type: 'button', class: 'agent-chip' }, t(key));
            b.addEventListener('click', () => send(b.textContent));
            sugg.append(b);
        });
        // La tercera no es una pregunta: lleva a la página que explica cómo está hecho (no gasta cuota)
        const how = el('a', { class: 'agent-chip agent-chip--link', href: t('agent_sug3_href') }, t('agent_sug3'));
        how.append(el('span', { 'aria-hidden': 'true' }, '↗'));
        how.addEventListener('click', e => {
            if (how.pathname === location.pathname) { e.preventDefault(); close(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }
        });
        sugg.append(how);

        const notice = el('p', { class: 'agent-notice' }, t('agent_notice') + ' ');
        const more = el('a', { href: t('agent_privacy_href') }, t('agent_privacy_link'));
        more.addEventListener('click', () => { if (more.pathname === location.pathname) close(false); });
        notice.append(more);

        panel.append(head, list, sugg, form, notice);
        document.body.append(toggleBtn, panel);

        addMessage('bot', t('agent_hello'));

        toggleBtn.addEventListener('click', () => (panel.hidden ? open() : close()));
        closeBtn.addEventListener('click', () => close());
        form.addEventListener('submit', e => { e.preventDefault(); send(input.value); });
        panel.addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopPropagation(); close(); } });

        // Botones de la página que abren el chat ("Probarlo") o le hacen una pregunta de ejemplo
        // (portada): solo se muestran cuando el asistente existe
        document.documentElement.classList.add('agent-on');
        document.addEventListener('click', e => {
            const ask = e.target.closest?.('[data-agent-ask]');
            if (ask) { e.preventDefault(); open(); send(ask.textContent.trim()); return; }
            if (e.target.closest?.('[data-agent-open]')) { e.preventDefault(); open(); }
        });

        resume();
    }

    // ───────── arranque: solo si el servidor está configurado ─────────
    async function start() {
        try {
            const res = await fetch(ENDPOINT, { method: 'GET' });
            if (!res.ok || !(await res.json()).enabled) return;
        } catch { return; }
        if (p()) build();
        else document.addEventListener('portfolio:ready', build, { once: true });
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();
})();
