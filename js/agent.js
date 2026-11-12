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

    const history = [];
    let panel, list, input, sendBtn, toggleBtn, busy = false;

    const p = () => window.portfolio;
    const t = key => p()?.t(key) || '';
    const lang = () => (p()?.lang() === 'en' ? 'en' : 'es');

    // ───────── acciones pedidas por el agente (validadas otra vez en el navegador) ─────────
    function run(action) {
        if (!action || typeof action !== 'object') return;
        switch (action.type) {
            case 'goTo':
                if (SECTIONS.includes(action.section)) p().goTo(action.section);
                break;
            case 'filterSkills':
                if (AREAS.includes(action.area)) { p().filterSkills(action.area, String(action.search || '').slice(0, 60)); p().goTo('tech-skills'); }
                break;
            case 'setLang':
                if (action.lang === 'es' || action.lang === 'en') {
                    if (action.lang !== lang()) location.href = (action.lang === 'en' ? '/en/' : '/') + location.hash;
                }
                break;
            case 'downloadCV':
                p().downloadCV();
                break;
            case 'prefillContact':
                if (SUBJECTS.includes(action.subject)) { close(false); p().prefillContact(action.subject, String(action.message || '').slice(0, 500)); }
                break;
        }
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
                body: JSON.stringify({ message: text, lang: lang(), history: history.slice(-MAX_HISTORY) }),
            });
            const data = await res.json().catch(() => ({}));
            const reply = typeof data.reply === 'string' && data.reply ? data.reply : t('agent_error');
            pending.classList.remove('agent-msg--pending');
            pending.querySelector('p').textContent = reply;
            if (res.ok) {
                history.push({ role: 'user', content: text }, { role: 'assistant', content: reply });
                (Array.isArray(data.actions) ? data.actions.slice(0, 3) : []).forEach(run);
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
        toggleBtn.append(el('span', { class: 'agent-toggle-dot', 'aria-hidden': 'true' }), el('span', { class: 'agent-toggle-text' }, t('agent_open_short')));

        panel = el('section', { id: 'agentPanel', class: 'agent-panel', role: 'dialog', 'aria-label': t('agent_title') });
        panel.hidden = true;

        const head = el('header', { class: 'agent-head' });
        const closeBtn = el('button', { type: 'button', class: 'agent-close', 'aria-label': t('agent_close') }, '×');
        head.append(el('h2', { class: 'agent-title' }, t('agent_title')), closeBtn);

        list = el('div', { class: 'agent-list', role: 'log', 'aria-live': 'polite' });

        const form = el('form', { class: 'agent-form', autocomplete: 'off' });
        input = el('input', { type: 'text', class: 'agent-input', maxlength: String(MAX_CHARS), placeholder: t('agent_placeholder'), 'aria-label': t('agent_placeholder') });
        sendBtn = el('button', { type: 'submit', class: 'agent-send' }, t('agent_send'));
        form.append(input, sendBtn);

        const sugg = el('div', { class: 'agent-suggestions' });
        ['agent_sug1', 'agent_sug2', 'agent_sug3'].forEach(key => {
            const b = el('button', { type: 'button', class: 'agent-chip' }, t(key));
            b.addEventListener('click', () => send(b.textContent));
            sugg.append(b);
        });

        panel.append(head, list, sugg, form, el('p', { class: 'agent-notice' }, t('agent_notice')));
        document.body.append(toggleBtn, panel);

        addMessage('bot', t('agent_hello'));

        toggleBtn.addEventListener('click', () => (panel.hidden ? open() : close()));
        closeBtn.addEventListener('click', () => close());
        form.addEventListener('submit', e => { e.preventDefault(); send(input.value); });
        panel.addEventListener('keydown', e => { if (e.key === 'Escape') { e.stopPropagation(); close(); } });
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
