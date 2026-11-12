#!/usr/bin/env node
/**
 * Genera los ficheros binarios del sitio a partir de sus plantillas HTML:
 *   cv/cv-es.html, cv/cv-en.html  →  assets/Ismael_Parras_CV_{ES,EN}.pdf
 *   scripts/og-image.html         →  assets/og-image.png (1200×630)
 *
 * Usa Chrome/Chromium/Edge en modo headless, sin dependencias de npm. Si no lo
 * encuentra, indica la ruta con CHROME_BIN. No forma parte de `npm run build`.
 *
 * Uso:  npm run assets
 */

import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, rmSync, statSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const TIMEOUT_MS = 30_000;

// Binarios "headless shell" instalados por Playwright, si los hay.
function playwrightShells() {
    const base = process.env.PLAYWRIGHT_BROWSERS_PATH;
    if (!base || !existsSync(base)) return [];
    return readdirSync(base)
        .filter(d => d.startsWith('chromium_headless_shell-'))
        .flatMap(d => readdirSync(join(base, d)).map(sub => join(base, d, sub, 'chrome-headless-shell')))
        .filter(existsSync);
}

function availableBrowsers() {
    const candidates = [
        process.env.CHROME_BIN,
        ...playwrightShells(),
        'google-chrome', 'chromium', 'chromium-browser',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
    ].filter(Boolean);
    return candidates.filter(bin => {
        const isPath = bin.includes('/') || bin.includes('\\');
        return isPath ? existsSync(bin) : spawnSync(bin, ['--version'], { timeout: 10_000 }).status === 0;
    });
}

// Devuelve null si todo fue bien, o el motivo del fallo.
function tryRender(browser, source, output, args) {
    const profile = mkdtempSync(join(tmpdir(), 'render-assets-'));
    const startedAt = Date.now() - 1000;
    try {
        const res = spawnSync(browser, [
            '--headless', '--disable-gpu', '--hide-scrollbars',
            ...(process.getuid?.() === 0 ? ['--no-sandbox'] : []),
            `--user-data-dir=${profile}`,
            ...args,
            pathToFileURL(join(ROOT, source)).href,
        ], { encoding: 'utf8', timeout: TIMEOUT_MS, killSignal: 'SIGKILL' });
        if (res.error?.code === 'ETIMEDOUT') return `sin respuesta tras ${TIMEOUT_MS / 1000} s`;
        const out = join(ROOT, output);
        // Un fichero anterior no cuenta: tiene que haberse escrito en esta ejecución.
        const fresh = existsSync(out) && statSync(out).size > 0 && statSync(out).mtimeMs >= startedAt;
        if (res.status !== 0 || !fresh) return (res.stderr || String(res.error || 'no se escribió el fichero')).trim();
        return null;
    } finally {
        // Un navegador detenido por tiempo puede seguir escribiendo en su perfil unos
        // instantes; que no se pueda borrar no debe impedir probar el siguiente.
        try { rmSync(profile, { recursive: true, force: true, maxRetries: 5, retryDelay: 200 }); } catch {}
    }
}

const pdf = out => ['--no-pdf-header-footer', `--print-to-pdf=${join(ROOT, out)}`];
const JOBS = [
    ['cv/cv-es.html', 'assets/Ismael_Parras_CV_ES.pdf', pdf('assets/Ismael_Parras_CV_ES.pdf')],
    ['cv/cv-en.html', 'assets/Ismael_Parras_CV_EN.pdf', pdf('assets/Ismael_Parras_CV_EN.pdf')],
    ['scripts/og-image.html', 'assets/og-image.png', [
        '--window-size=1200,630', '--force-device-scale-factor=1',
        `--screenshot=${join(ROOT, 'assets/og-image.png')}`,
    ]],
];

let browsers = availableBrowsers();
if (!browsers.length) {
    console.error('No se encontró Chrome/Chromium/Edge. Indica su ruta con la variable CHROME_BIN.');
    process.exit(1);
}

for (const [source, output, args] of JOBS) {
    const failures = [];
    let done = false;
    for (const browser of browsers) {
        const failure = tryRender(browser, source, output, args);
        if (!failure) {
            browsers = [browser]; // el que funciona se usa para el resto
            done = true;
            break;
        }
        failures.push(`  ${browser}: ${failure}`);
    }
    if (!done) {
        console.error(`✗ No se pudo generar ${output}:\n${failures.join('\n')}`);
        process.exit(1);
    }
    console.log(`✓ ${output}`);
}
