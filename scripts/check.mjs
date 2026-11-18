#!/usr/bin/env node
/**
 * Comprobaciones de coherencia del contenido. Se ejecuta al final de
 * `npm run build`: si algo falla, el despliegue en Vercel falla en lugar de
 * publicar una página con textos que faltan o sin traducir.
 */

import { existsSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const read = rel => readFileSync(join(ROOT, rel), 'utf8');
const errors = [];
const TEMPLATES = ['index.html', 'agente/index.html'];
const PAGES = [['index.html', 'es'], ['en/index.html', 'en'], ['agente/index.html', 'es'], ['en/agent/index.html', 'en']];
const fail = msg => errors.push(msg);

// 1. JSON válidos
const json = {};
for (const f of ['i18n', 'projects', 'skills', 'profile']) {
    try { json[f] = JSON.parse(read(`data/${f}.json`)); }
    catch (e) { fail(`data/${f}.json no es JSON válido: ${e.message}`); }
}

if (!errors.length) {
    const { es, en } = json.i18n;

    // 2. Mismas claves en ambos idiomas
    for (const k of Object.keys(es)) if (!(k in en)) fail(`i18n: "${k}" falta en inglés`);
    for (const k of Object.keys(en)) if (!(k in es)) fail(`i18n: "${k}" falta en español`);

    // 3. Toda clave usada en las plantillas existe
    const html = TEMPLATES.filter(f => existsSync(join(ROOT, f))).map(read).join('\n');
    for (const f of TEMPLATES) if (!existsSync(join(ROOT, f))) fail(`No existe la plantilla ${f}`);
    const used = new Set();
    for (const m of html.matchAll(/data-i18n="([^"]+)"/g)) used.add(m[1]);
    for (const m of html.matchAll(/data-i18n-attr="([^"]+)"/g)) {
        for (const pair of m[1].split(';')) used.add(pair.split(':')[1]?.trim());
    }
    for (const p of json.projects) {
        for (const k of [p.badgeKey, p.descKey, p.ctaKey, p.agentCta && 'proj_cta_try']) if (k) used.add(k);
        if (p.ctaUrl && typeof p.ctaUrl === 'object' && (!p.ctaUrl.es || !p.ctaUrl.en)) fail(`Proyecto ${p.id}: ctaUrl sin es/en`);
        if (typeof p.title === 'object' && (!p.title.es || !p.title.en)) fail(`Proyecto ${p.id}: título sin es/en`);
    }
    for (const k of used) if (!(k in es)) fail(`La clave "${k}" se usa pero no existe en i18n.json`);

    // 4. Ninguna clave huérfana (las que no están en la plantilla deben usarse desde JS)
    const code = read('js/script.js') + read('js/agent.js') + read('scripts/prerender.mjs');
    for (const k of Object.keys(es)) {
        if (!used.has(k) && !code.includes(k)) fail(`i18n: "${k}" no se usa en ningún sitio`);
    }

    // 5. Datos mínimos de proyectos y skills
    for (const p of json.projects) {
        for (const r of p.results || []) if (!r.es || !r.en) fail(`Proyecto ${p.id}: resultado sin es/en`);
    }
    for (const s of json.skills) {
        if (!s.iconSvg && !s.iconImg) fail(`Skill ${s.name}: falta iconSvg o iconImg`);
        if (s.iconImg && !existsSync(join(ROOT, s.iconImg.replace(/^\//, '')))) fail(`Skill ${s.name}: no existe ${s.iconImg}`);
        if (!s.desc || !s.desc_en) fail(`Skill ${s.name}: falta desc o desc_en`);
        for (const tag of s.tags) if (!json.i18n.skillTags?.en?.[tag]) fail(`Skill ${s.name}: la etiqueta "${tag}" no tiene traducción en i18n.skillTags.en`);
    }
    const allTags = new Set(json.skills.flatMap(s => s.tags));
    for (const tag of Object.keys(json.i18n.skillTags?.en || {})) if (!allTags.has(tag)) fail(`i18n.skillTags.en: "${tag}" no se usa en ninguna skill`);

    // 6. Las páginas generadas existen y están en su idioma
    for (const [file, lang] of PAGES) {
        if (!existsSync(join(ROOT, file))) { fail(`No existe ${file}: ejecuta npm run build`); continue; }
        const page = read(file);
        if (!page.includes(`<html lang="${lang}"`)) fail(`${file} no declara lang="${lang}"`);
        if (/data-i18n="[^"]+"[^>]*><\//.test(page)) fail(`${file} tiene textos sin rellenar`);
    }
}

// 7. Los scripts en línea de la 404 están autorizados en la CSP de vercel.json por su huella
{
    const csp = JSON.parse(read('vercel.json')).headers.flatMap(h => h.headers).find(h => h.key === 'Content-Security-Policy')?.value || '';
    for (const [, body] of read('404.html').matchAll(/<script>([\s\S]*?)<\/script>/g)) {
        const hash = `'sha256-${createHash('sha256').update(body, 'utf8').digest('base64')}'`;
        if (!csp.includes(hash)) fail(`404.html: su script no está autorizado en la CSP de vercel.json; pon ${hash} en script-src`);
    }
}

if (errors.length) {
    console.error(`✗ ${errors.length} problema(s) de contenido:\n` + errors.map(e => `  - ${e}`).join('\n'));
    process.exit(1);
}
console.log('✓ Contenido coherente: claves i18n, datos y páginas generadas.');
