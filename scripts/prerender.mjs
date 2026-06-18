#!/usr/bin/env node
/**
 * Prerender de contenido para SEO e indexabilidad (C4).
 *
 * Lee data/{projects,skills,i18n}.json (fuente de verdad) y genera el HTML
 * real de proyectos y skills en español (idioma por defecto del sitio),
 * inyectándolo dentro de los contenedores #projectsGrid y #techSkillsGrid de
 * index.html entre marcadores de comentario.
 *
 * - El crawler/usuario sin JS recibe el contenido real, no skeletons.
 * - El JS de cliente sigue mandando: re-renderiza encima (reemplaza, no
 *   duplica) y aplica idioma/interactividad como mejora progresiva.
 * - Es idempotente: re-ejecutarlo regenera entre marcadores sin duplicar.
 *
 * Uso:  node scripts/prerender.mjs   (o  npm run build)
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const LANG = 'es'; // idioma por defecto (coincide con <html lang="es">)

const readJson = rel => JSON.parse(readFileSync(join(ROOT, rel), 'utf8'));

const escAttr = s => String(s)
    .replace(/&/g, '&amp;').replace(/"/g, '&quot;')
    .replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escText = s => String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escRe = s => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// ─────────────── GENERADORES (espejo del render de script.js) ───────────────
function renderProjects(projects, t) {
    return projects.map(proj => {
        const featured = proj.featured ? ' featured' : '';
        const badge = proj.badgeKey
            ? `<div class="project-badge" data-i18n="${escAttr(proj.badgeKey)}">${escText(t[proj.badgeKey] || '')}</div>`
            : '';
        const desc = proj.descKey
            ? `<p class="project-desc" data-i18n="${escAttr(proj.descKey)}">${escText(t[proj.descKey] || '')}</p>`
            : '';
        const results = (proj.results || [])
            .map(r => `<span class="result-chip">${escText(r[LANG] || r.es)}</span>`).join('');
        const tags = proj.tags.map(tag => `<span>${escText(tag)}</span>`).join('');
        const cta = proj.ctaUrl
            ? `<a href="${escAttr(proj.ctaUrl)}" class="btn btn-primary project-cta" data-i18n="${escAttr(proj.ctaKey)}">${escText(t[proj.ctaKey] || '')}</a>`
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

function renderSkills(skills, t) {
    return skills.map(s => {
        const color = s.color === 'FFFFFF' ? '000000' : s.color;
        const areas = s.area.join(' ');
        const searchable = (s.name + ' ' + (s.desc_en || '') + ' ' + s.desc + ' ' + s.tags.join(' ')).toLowerCase();
        const icon = s.iconSvg
            ? s.iconSvg // SVG propio y confiable: se inserta sin escapar
            : `<img src="https://cdn.simpleicons.org/${escAttr(s.icon)}/${escAttr(color)}" alt="${escAttr(s.name)}" loading="lazy" width="40" height="40">`;
        let cert = '';
        if (s.cert) {
            const label = s.certUrl ? (t.cert_view || '') : (t.cert_label || '');
            cert = s.certUrl
                ? `<a class="skill-cert is-link" href="${escAttr(s.certUrl)}" target="_blank" rel="noopener noreferrer">✔ ${escText(label)}</a>`
                : `<span class="skill-cert">✔ ${escText(label)}</span>`;
        }
        const tags = s.tags.map(tag => `<span class="skill-tag">${escText(tag)}</span>`).join('');
        return `<article class="skill-card reveal visible" data-areas="${escAttr(areas)}" data-searchable="${escAttr(searchable)}">
  <div class="skill-icon">${icon}</div>
  <div class="skill-head"><h3 class="skill-name">${escText(s.name)}</h3>${cert}</div>
  <p class="skill-desc">${escText(s.desc)}</p>
  <div class="skill-tags">${tags}</div>
</article>`;
    }).join('\n');
}

// ─────────────── INYECCIÓN ───────────────
function inject(html, gridId, content) {
    const start = `<!--prerender:${gridId}:start-->`;
    const end = `<!--prerender:${gridId}:end-->`;
    const block = `${start}\n${content}\n${end}`;

    const markerRe = new RegExp(escRe(start) + '[\\s\\S]*?' + escRe(end));
    if (markerRe.test(html)) return html.replace(markerRe, block); // regeneración

    // Primera vez: el contenedor está vacío
    const emptyRe = new RegExp('(<div[^>]*\\bid="' + escRe(gridId) + '"[^>]*>)\\s*(</div>)');
    if (!emptyRe.test(html)) {
        throw new Error(`No se encontró el contenedor vacío #${gridId} en index.html`);
    }
    return html.replace(emptyRe, `$1\n${block}\n$2`);
}

// ─────────────── MAIN ───────────────
const projects = readJson('data/projects.json');
const skills = readJson('data/skills.json');
const i18n = readJson('data/i18n.json');
const t = i18n[LANG];

let html = readFileSync(join(ROOT, 'index.html'), 'utf8');
html = inject(html, 'projectsGrid', renderProjects(projects, t));
html = inject(html, 'techSkillsGrid', renderSkills(skills, t));
writeFileSync(join(ROOT, 'index.html'), html);

console.log(`✓ Prerender completado: ${projects.length} proyectos y ${skills.length} skills inyectados en index.html (${LANG}).`);
