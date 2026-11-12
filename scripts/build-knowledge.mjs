#!/usr/bin/env node
/**
 * Genera api/_knowledge.js: el texto que recibe el agente sobre Ismael, en ES y
 * EN, a partir de los mismos datos que pinta la web (data/*.json) más
 * data/agent-facts.json. Así el agente no puede contradecir lo que se ve.
 * El contexto se mantiene corto porque la capa gratuita limita los tokens.
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const readJson = rel => JSON.parse(readFileSync(join(ROOT, rel), 'utf8'));

const i18n = readJson('data/i18n.json');
const projects = readJson('data/projects.json');
const skills = readJson('data/skills.json');
const profile = readJson('data/profile.json');
const facts = readJson('data/agent-facts.json');

const LABELS = {
    es: { profile: 'PERFIL', about: 'SOBRE ÉL', exp: 'EXPERIENCIA', edu: 'FORMACIÓN', proj: 'PROYECTOS', skills: 'HABILIDADES', certs: 'CERTIFICACIONES', contact: 'CONTACTO', other: 'OTROS DATOS',
        results: 'Resultados', tags: 'Tecnologías', name: 'Nombre', role: 'Cargo actual', place: 'Ubicación', avail: 'Disponibilidad', main: 'Principales', rest: 'Otras',
        areas: { automatizacion: 'Automatización / IA', cloud: 'Cloud y sistemas', software: 'Desarrollo y datos' }, email: 'Email', site: 'Web' },
    en: { profile: 'PROFILE', about: 'ABOUT HIM', exp: 'EXPERIENCE', edu: 'EDUCATION', proj: 'PROJECTS', skills: 'SKILLS', certs: 'CERTIFICATIONS', contact: 'CONTACT', other: 'OTHER FACTS',
        results: 'Results', tags: 'Technologies', name: 'Name', role: 'Current role', place: 'Location', avail: 'Availability', main: 'Main', rest: 'Others',
        areas: { automatizacion: 'Automation / AI', cloud: 'Cloud & systems', software: 'Development & data' }, email: 'Email', site: 'Website' },
};

function build(lang) {
    const t = i18n[lang], f = facts[lang], L = LABELS[lang];
    const out = [];
    out.push(`## ${L.profile}`,
        `${L.name}: Ismael Parras Resino`,
        `${L.role}: ${t.exp_sgs_role} — ${t.exp_sgs_company}`,
        `${L.place}: ${t.hero_location}`,
        `${L.avail}: ${t.hero_availability}`, '');
    out.push(`## ${L.about}`, t.about_p1, t.about_p2, '');
    out.push(`## ${L.exp}`,
        `- ${t.exp_sgs_date} · ${t.exp_sgs_role} · ${t.exp_sgs_company}: ${t.exp_sgs_desc}`,
        `- ${t.exp_sermicro_date} · ${t.exp_sermicro_role} · Sermicro (Madrid): ${t.exp_sermicro_desc}`,
        `- ${t.exp_elecnor_date} · ${t.exp_elecnor_role} · Elecnor Deimos: ${t.exp_elecnor_desc}`, '');
    out.push(`## ${L.edu}`,
        `- ${t.edu1_degree} — ${f.education_places.edu1}`,
        `- ${t.edu2_degree} — ${f.education_places.edu2}`, '');
    out.push(`## ${L.proj}`);
    for (const p of projects) {
        const badge = t[p.badgeKey] ? ` (${t[p.badgeKey]})` : '';
        out.push(`- ${p.title}${badge}: ${t[p.descKey]} ${L.results}: ${(p.results || []).map(r => r[lang] || r.es).join('; ')}. ${L.tags}: ${p.tags.join(', ')}.`);
    }
    out.push('', `## ${L.skills}`);
    const core = skills.filter(s => s.core);
    out.push(`${L.main}: ${core.map(s => s.name).join(', ')}.`);
    for (const [area, label] of Object.entries(L.areas)) {
        const names = skills.filter(s => s.area.includes(area) && !s.core).map(s => s.name);
        if (names.length) out.push(`${label} (${L.rest.toLowerCase()}): ${names.join(', ')}.`);
    }
    out.push('', `## ${L.certs}`, ...skills.filter(s => s.cert).map(s => `- ${s.name}: ${s.desc_en && lang === 'en' ? s.desc_en : s.desc}`), '');
    out.push(`## ${L.contact}`,
        `${L.email}: ${profile.email}`,
        `LinkedIn: ${profile.socialLinks.linkedin}`,
        `GitHub: ${profile.socialLinks.github}`,
        `${L.site}: https://ismaelparras.vercel.app${lang === 'en' ? '/en/' : '/'}`,
        f.contact_how, '');
    out.push(`## ${L.other}`, f.languages, f.interests, f.sgs_policy);
    return out.join('\n');
}

const knowledge = { es: build('es'), en: build('en') };
mkdirSync(join(ROOT, 'api'), { recursive: true });
writeFileSync(join(ROOT, 'api/_knowledge.js'),
    `// Generado por scripts/build-knowledge.mjs. No editar a mano.\nexport const KNOWLEDGE = ${JSON.stringify(knowledge, null, 2)};\n`);
console.log(`✓ Conocimiento del agente: ${knowledge.es.length} caracteres (es) y ${knowledge.en.length} (en).`);
