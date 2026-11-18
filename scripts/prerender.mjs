#!/usr/bin/env node
/**
 * Prerender del sitio (SEO, funcionamiento sin JS e inglés indexable).
 *
 * Cada página tiene una plantilla que es a la vez su versión en español
 * (index.html, agente/index.html). A partir de data/*.json este script:
 *   - rellena todos los textos `data-i18n` y los atributos `data-i18n-attr`,
 *   - resuelve los enlaces a la portada (`data-home-href`) según el idioma,
 *   - inyecta proyectos y skills entre marcadores `<!--prerender:…-->`,
 *   - genera el bloque SEO (canonical, hreflang, Open Graph) y el JSON-LD,
 *   - escribe cada página en español y en inglés (ver PAGES).
 *
 * Los datos son la única fuente de verdad: el texto escrito a mano en una
 * plantilla dentro de un `data-i18n` se sobrescribe. Es idempotente.
 *
 * Uso:  npm run build
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://ismaelparras.vercel.app';
const LANGS = { es: { ogLocale: 'es_ES' }, en: { ogLocale: 'en_US' } };
const DEFAULT_LANG = 'es';

// Cada página: su plantilla, dónde se escribe en cada idioma, su URL y qué bloques genera.
const PAGES = {
    home: {
        template: 'index.html',
        out: { es: 'index.html', en: 'en/index.html' },
        path: { es: '/', en: '/en/' },
        blocks: ['seo', 'jsonld', 'projectsGrid', 'techSkillsGrid'],
    },
    agent: {
        template: 'agente/index.html',
        out: { es: 'agente/index.html', en: 'en/agent/index.html' },
        path: { es: '/agente/', en: '/en/agent/' },
        blocks: ['seo'],
    },
};

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
        const featured = (proj.featured ? ' featured' : '') + (proj.wide ? ' wide' : '');
        const title = typeof proj.title === 'string' ? proj.title : (proj.title[lang] || proj.title.es);
        const url = proj.ctaUrl && (typeof proj.ctaUrl === 'string' ? proj.ctaUrl : (proj.ctaUrl[lang] || proj.ctaUrl.es));
        // Solo se muestra si el asistente está activo (css/agent.css + js/agent.js)
        const tryBtn = proj.agentCta
            ? `<button type="button" class="btn btn-primary project-cta" data-agent-open data-i18n="proj_cta_try">${escText(tr(t, 'proj_cta_try', proj.id))}</button>`
            : '';
        const badge = proj.badgeKey
            ? `<div class="project-badge" data-i18n="${escAttr(proj.badgeKey)}">${escText(tr(t, proj.badgeKey, proj.id))}</div>`
            : '';
        const desc = proj.descKey
            ? `<p class="project-desc" data-i18n="${escAttr(proj.descKey)}">${escText(tr(t, proj.descKey, proj.id))}</p>`
            : '';
        const results = (proj.results || [])
            .map(r => `<span class="result-chip">${escText(r[lang] || r.es)}</span>`).join('');
        const tags = proj.tags.map(tag => `<span>${escText(tag)}</span>`).join('');
        const cta = url
            ? `<a href="${escAttr(url)}" class="btn ${proj.agentCta ? 'btn-secondary' : 'btn-primary'} project-cta" data-i18n="${escAttr(proj.ctaKey)}">${escText(tr(t, proj.ctaKey, proj.id))}</a>`
            : '';
        return `<article class="project-card${featured} reveal visible" id="proj-${escAttr(proj.id)}">
  ${badge}
  <h3 class="project-title">${escText(title)}</h3>
  ${desc}
  <div class="result-chips">${results}</div>
  <div class="project-tags">${tags}</div>
  <div class="project-actions">${tryBtn}${cta}</div>
</article>`;
    }).join('\n');
}

// Etiquetas de las skills: se escriben en español y se traducen con i18n.skillTags (misma lógica en js/script.js)
const tagLabel = (tag, lang, tagMap) => (lang === 'es' ? tag : (tagMap?.[lang]?.[tag] || tag));

function renderSkills(skills, t, lang, tagMap) {
    return skills.map(s => {
        const areas = s.area.join(' ');
        const searchable = (s.name + ' ' + (s.desc_en || '') + ' ' + s.desc + ' ' + s.tags.join(' ') + ' ' + s.tags.map(tag => tagLabel(tag, 'en', tagMap)).join(' ')).toLowerCase();
        const desc = lang === 'en' && s.desc_en ? s.desc_en : s.desc;
        let cert = '';
        if (s.cert) {
            const label = tr(t, s.certUrl ? 'cert_view' : 'cert_label', s.name);
            cert = s.certUrl
                ? `<a class="skill-cert is-link" href="${escAttr(s.certUrl)}" target="_blank" rel="noopener noreferrer">✔ ${escText(label)}</a>`
                : `<span class="skill-cert">✔ ${escText(label)}</span>`;
        }
        const tags = s.tags.map(tag => `<span class="skill-tag">${escText(tagLabel(tag, lang, tagMap))}</span>`).join('');
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

function renderSeo(page, lang) {
    const url = SITE + page.path[lang];
    const alternates = Object.keys(LANGS)
        .map(code => `    <link rel="alternate" hreflang="${code}" href="${SITE}${page.path[code]}">`);
    const ogAlternates = Object.entries(LANGS).filter(([code]) => code !== lang)
        .map(([, l]) => `    <meta property="og:locale:alternate" content="${l.ogLocale}">`);
    return [
        `    <link rel="canonical" href="${url}">`,
        ...alternates,
        `    <link rel="alternate" hreflang="x-default" href="${SITE}${page.path[DEFAULT_LANG]}">`,
        `    <meta property="og:url" content="${url}">`,
        `    <meta property="og:locale" content="${LANGS[lang].ogLocale}">`,
        ...ogAlternates,
    ].join('\n');
}

function renderJsonLd(page, lang, t, profile) {
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
        url: SITE + page.path[lang],
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
    if (!re.test(html)) throw new Error(`Faltan los marcadores ${start} … ${end} en la plantilla`);
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

// <a data-home-href="#about"> → href a la portada del idioma (/#about o /en/#about)
function fillHomeLinks(html, lang) {
    return html.replace(/<[a-zA-Z][^>]*\sdata-home-href="([^"]*)"[^>]*>/g, (tag, suffix) => {
        if (!/\shref="[^"]*"/.test(tag)) throw new Error(`Falta href en: ${tag.slice(0, 80)}`);
        return tag.replace(/(\s)href="[^"]*"/, (_, sp) => `${sp}href="${escAttr(PAGES.home.path[lang] + suffix)}"`);
    });
}

function build(page, template, lang, data) {
    const t = data.i18n[lang];
    const blocks = {
        seo: () => renderSeo(page, lang),
        jsonld: () => renderJsonLd(page, lang, t, data.profile),
        projectsGrid: () => renderProjects(data.projects, t, lang),
        techSkillsGrid: () => renderSkills(data.skills, t, lang, data.i18n.skillTags),
    };
    let html = template.replace(/<html lang="[a-z-]+"/, `<html lang="${lang}"`);
    for (const id of page.blocks) html = inject(html, id, blocks[id]());
    return fillHomeLinks(fillAttrs(fillText(html, t), t), lang);
}

// ─────────────── MAIN ───────────────
const data = {
    projects: readJson('data/projects.json'),
    skills: readJson('data/skills.json'),
    i18n: readJson('data/i18n.json'),
    profile: readJson('data/profile.json'),
};
const written = [];
for (const page of Object.values(PAGES)) {
    const template = readFileSync(join(ROOT, page.template), 'utf8');
    for (const lang of Object.keys(LANGS)) {
        const out = join(ROOT, page.out[lang]);
        mkdirSync(dirname(out), { recursive: true });
        writeFileSync(out, build(page, template, lang, data));
        written.push(page.out[lang]);
    }
}

console.log(`✓ Prerender: ${data.projects.length} proyectos y ${data.skills.length} skills; páginas: ${written.join(', ')}.`);
