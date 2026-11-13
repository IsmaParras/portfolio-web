#!/usr/bin/env node
/**
 * Prerender del sitio (SEO, funcionamiento sin JS e inglés indexable).
 *
 * index.html es a la vez plantilla y página en español. A partir de
 * data/{projects,skills,i18n}.json este script:
 *   - rellena todos los textos `data-i18n` y los atributos `data-i18n-attr`,
 *   - inyecta proyectos y skills entre marcadores `<!--prerender:…-->`,
 *   - genera el bloque SEO (canonical, hreflang, Open Graph) y el JSON-LD,
 *   - escribe index.html (español) y en/index.html (inglés).
 *
 * Los datos son la única fuente de verdad: el texto escrito a mano en
 * index.html dentro de un `data-i18n` se sobrescribe. Es idempotente.
 *
 * Uso:  npm run build
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://ismaelparras.vercel.app';
const LANGS = {
    es: { path: '/', out: 'index.html', ogLocale: 'es_ES' },
    en: { path: '/en/', out: 'en/index.html', ogLocale: 'en_US' },
};
const DEFAULT_LANG = 'es';

const readJson = rel => JSON.parse(readFileSync(join(ROOT, rel), 'utf8'));

const escAttr = s => String(s)
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escText = s => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function tr(t, key, where) {
    if (t[key] === undefined) throw new Error(`Falta la clave i18n "${key}" (${where})`);
    return t[key];
}

// ─────────────── GENERADORES (espejo del render de js/script.js) ───────────────
function renderProjects(projects, t, lang) {
    return projects.map(proj => {
        const featured = proj.featured ? ' featured' : '';
        const badge = proj.badgeKey
            ? `<div class="project-badge" data-i18n="${escAttr(proj.badgeKey)}">${escText(tr(t, proj.badgeKey, proj.id))}</div>`
            : '';
        const desc = proj.descKey
            ? `<p class="project-desc" data-i18n="${escAttr(proj.descKey)}">${escText(tr(t, proj.descKey, proj.id))}</p>`
            : '';
        const results = (proj.results || [])
            .map(r => `<span class="result-chip">${escText(r[lang] || r.es)}</span>`).join('');
        const tags = proj.tags.map(tag => `<span>${escText(tag)}</span>`).join('');
        const cta = proj.ctaUrl
            ? `<a href="${escAttr(proj.ctaUrl)}" class="btn btn-primary project-cta" data-i18n="${escAttr(proj.ctaKey)}">${escText(tr(t, proj.ctaKey, proj.id))}</a>`
            : '';
        return `<article class="project-card${featured} reveal visible" id="proj-${escAttr(proj.id)}">
  ${badge}
  <h3 class="project-title">${escText(proj.title)}</h3>
  ${desc}
  <div class="result-chips">${results}</div>
  <div class="project-tags">${tags}</div>
  <div class="project-actions">${cta}</div>
</article>`;
    }).join('\n');
}

function renderSkills(skills, t, lang) {
    return skills.map(s => {
        const areas = s.area.join(' ');
        const searchable = (s.name + ' ' + (s.desc_en || '') + ' ' + s.desc + ' ' + s.tags.join(' ')).toLowerCase();
        const desc = lang === 'en' && s.desc_en ? s.desc_en : s.desc;
        let cert = '';
        if (s.cert) {
            const label = tr(t, s.certUrl ? 'cert_view' : 'cert_label', s.name);
            cert = s.certUrl
                ? `<a class="skill-cert is-link" href="${escAttr(s.certUrl)}" target="_blank" rel="noopener noreferrer">✔ ${escText(label)}</a>`
                : `<span class="skill-cert">✔ ${escText(label)}</span>`;
        }
        const tags = s.tags.map(tag => `<span class="skill-tag">${escText(tag)}</span>`).join('');
        const core = s.core ? ' data-core="1"' : '';
        // iconSvg es SVG propio y confiable: se inserta sin escapar
        return `<article class="skill-card reveal visible" data-areas="${escAttr(areas)}"${core} data-searchable="${escAttr(searchable)}">
  <div class="skill-icon">${s.iconImg ? `<img src="${escAttr(s.iconImg)}" alt="" width="40" height="40" loading="lazy">` : (s.iconSvg || '')}</div>
  <div class="skill-head"><h3 class="skill-name">${escText(s.name)}</h3>${cert}</div>
  <p class="skill-desc">${escText(desc)}</p>
  <div class="skill-tags">${tags}</div>
</article>`;
    }).join('\n');
}

function renderSeo(lang) {
    const url = SITE + LANGS[lang].path;
    const alternates = Object.entries(LANGS)
        .map(([code, l]) => `    <link rel="alternate" hreflang="${code}" href="${SITE}${l.path}">`);
    const ogAlternates = Object.entries(LANGS).filter(([code]) => code !== lang)
        .map(([, l]) => `    <meta property="og:locale:alternate" content="${l.ogLocale}">`);
    return [
        `    <link rel="canonical" href="${url}">`,
        ...alternates,
        `    <link rel="alternate" hreflang="x-default" href="${SITE}${LANGS[DEFAULT_LANG].path}">`,
        `    <meta property="og:url" content="${url}">`,
        `    <meta property="og:locale" content="${LANGS[lang].ogLocale}">`,
        ...ogAlternates,
    ].join('\n');
}

function renderJsonLd(lang, t, profile) {
    const knowsAbout = {
        es: ['Agentic AI', 'Hiperautomatización', 'Microsoft Copilot Studio', 'Power Automate', 'RPA', 'UiPath', 'Druid AI', 'LangChain', 'IA Generativa', 'Agentes Conversacionales', 'API REST', 'Python'],
        en: ['Agentic AI', 'Hyperautomation', 'Microsoft Copilot Studio', 'Power Automate', 'RPA', 'UiPath', 'Druid AI', 'LangChain', 'Generative AI', 'Conversational Agents', 'REST APIs', 'Python'],
    };
    const data = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Ismael Parras Resino',
        jobTitle: tr(t, 'footer_tagline', 'JSON-LD'),
        email: `mailto:${profile.email}`,
        url: SITE + LANGS[lang].path,
        image: `${SITE}/assets/img/Imagen_Ismael.jpg`,
        address: { '@type': 'PostalAddress', addressLocality: 'Leganés', addressRegion: 'Madrid', addressCountry: 'ES' },
        worksFor: { '@type': 'Organization', name: 'SGS' },
        alumniOf: { '@type': 'EducationalOrganization', name: 'IES Federica Montseny' },
        knowsAbout: knowsAbout[lang],
        sameAs: [profile.socialLinks.linkedin, profile.socialLinks.github],
    };
    // "<" escapado para que ningún dato pueda cerrar la etiqueta <script>
    const json = JSON.stringify(data, null, 2).replace(/</g, '\\u003c').replace(/^/gm, '    ');
    return `    <script type="application/ld+json">\n${json}\n    </script>`;
}

// ─────────────── SUSTITUCIONES SOBRE LA PLANTILLA ───────────────
function inject(html, id, content) {
    const start = `<!--prerender:${id}:start-->`;
    const end = `<!--prerender:${id}:end-->`;
    const re = new RegExp(escRe(start) + '[\\s\\S]*?' + escRe(end));
    if (!re.test(html)) throw new Error(`Faltan los marcadores ${start} … ${end} en index.html`);
    return html.replace(re, () => `${start}\n${content}\n${end}`);
}

// Elementos cuyo contenido es solo texto: <tag … data-i18n="clave">texto</tag>
function fillText(html, t) {
    return html.replace(
        /(<([a-zA-Z][a-zA-Z0-9]*)\b[^>]*\sdata-i18n="([^"]+)"[^>]*>)([^<]*)(<\/\2>)/g,
        (_, open, _tag, key, _old, close) => open + escText(tr(t, key, 'data-i18n')) + close,
    );
}

// <tag … data-i18n-attr="atributo:clave;atributo:clave">
function fillAttrs(html, t) {
    return html.replace(/<[a-zA-Z][^>]*\sdata-i18n-attr="([^"]+)"[^>]*>/g, (tag, spec) => {
        for (const pair of spec.split(';')) {
            const [attr, key] = pair.split(':').map(s => s.trim());
            if (!attr || !key) throw new Error(`data-i18n-attr mal formado: "${spec}"`);
            const value = `${attr}="${escAttr(tr(t, key, 'data-i18n-attr'))}"`;
            const re = new RegExp(`(\\s)${escRe(attr)}="[^"]*"`);
            if (!re.test(tag)) throw new Error(`El atributo ${attr} no está en la etiqueta: ${tag.slice(0, 80)}`);
            tag = tag.replace(re, (_, sp) => sp + value);
        }
        return tag;
    });
}

function build(template, lang, data) {
    const t = data.i18n[lang];
    let html = template.replace(/<html lang="[a-z-]+"/, `<html lang="${lang}"`);
    html = inject(html, 'seo', renderSeo(lang));
    html = inject(html, 'jsonld', renderJsonLd(lang, t, data.profile));
    html = inject(html, 'projectsGrid', renderProjects(data.projects, t, lang));
    html = inject(html, 'techSkillsGrid', renderSkills(data.skills, t, lang));
    return fillAttrs(fillText(html, t), t);
}

// ─────────────── MAIN ───────────────
const data = {
    projects: readJson('data/projects.json'),
    skills: readJson('data/skills.json'),
    i18n: readJson('data/i18n.json'),
    profile: readJson('data/profile.json'),
};
const template = readFileSync(join(ROOT, 'index.html'), 'utf8');

for (const [lang, cfg] of Object.entries(LANGS)) {
    const out = join(ROOT, cfg.out);
    mkdirSync(dirname(out), { recursive: true });
    writeFileSync(out, build(template, lang, data));
}

console.log(`✓ Prerender: ${data.projects.length} proyectos y ${data.skills.length} skills en ${Object.values(LANGS).map(l => l.out).join(' y ')}.`);
