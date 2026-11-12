# Portfolio — Ismael Parras Resino

Portfolio personal de **Ismael Parras Resino**, *Agentic AI Solution Architect*.
Sitio web estático, bilingüe (ES/EN), con tema claro/oscuro, enfocado en
agentes de IA, automatización e IA generativa.

🔗 **En producción:** https://ismaelparras.vercel.app/

## Stack

- **HTML5 + CSS3 + JavaScript vanilla** (ES6+), sin framework.
- Datos externalizados en JSON (`data/`) y cargados con `fetch`.
- **Prerender estático** (Node, sin dependencias) que inyecta proyectos y
  skills en el HTML para SEO y funcionamiento sin JS.
- **Google Fonts** (Inter, JetBrains Mono, Syne).
- Iconos de skills vía [Simple Icons CDN](https://simpleicons.org/).
- Formulario de contacto con [Formspree](https://formspree.io/).
- Desplegado en **Vercel** (hosting estático + cabeceras de seguridad).

## Estructura

```
portfolio-web/
├── index.html          # Página principal (proyectos/skills prerenderizados)
├── 404.html            # Página de error personalizada
├── css/styles.css      # Estilos (variables CSS, temas claro/oscuro)
├── js/script.js        # Lógica: i18n, tema, render dinámico, form, filtros
├── scripts/
│   ├── prerender.mjs       # Build: inyecta proyectos/skills en index.html (SEO)
│   ├── render-assets.mjs   # Genera los CVs en PDF y la og-image (npm run assets)
│   └── og-image.html       # Plantilla de assets/og-image.png
├── cv/                 # Plantillas HTML de los CVs (cv-es.html, cv-en.html, cv.css)
├── package.json        # Scripts `npm run build` (prerender) y `npm run assets`
├── data/
│   ├── profile.json    # Email, Formspree ID, CVs, redes sociales
│   ├── projects.json   # Proyectos destacados
│   ├── skills.json     # Habilidades técnicas (icono, área, certificación)
│   └── i18n.json       # Traducciones ES/EN + textos del typewriter
├── assets/             # Imágenes, CVs (PDF), diplomas, og-image
├── robots.txt          # SEO
├── sitemap.xml         # SEO
└── vercel.json         # Cabeceras de seguridad (CSP, HSTS, etc.)
```

## Datos (cómo editar el contenido)

Todo el contenido vive en `data/` — no hace falta tocar el HTML para actualizarlo:

- **`profile.json`** — datos de contacto, ID de Formspree y rutas de los CVs.
- **`projects.json`** — array de proyectos. Cada uno: `id`, `title`, `featured`
  (bool, destaca la tarjeta a ancho completo), `badgeKey` y `descKey` (claves en
  `i18n.json`), `tags`, `results` (con `es`/`en`) y, opcionalmente, `ctaKey` +
  `ctaUrl`.
- **`skills.json`** — array de habilidades. Campos: `name`, `icon`
  (slug de Simple Icons) o `iconSvg`, `color` (hex), `area`
  (`automatizacion` | `cloud` | `software`), `cert`/`certUrl`, `desc`/`desc_en`,
  `tags`.
- **`i18n.json`** — textos en `es` y `en`, más `typeTexts` del efecto typewriter.

La trayectoria (`exp_<empresa>_date|role|company|desc` en `i18n.json`) y los
textos de "Sobre mí" también tienen su copia en español dentro de `index.html`,
que es lo que ven los buscadores y quien navega sin JavaScript: al cambiarlos,
actualiza ambos sitios.

## Desarrollo local

No requiere instalación. Al usar `fetch` para cargar los JSON, hay que servirlo
desde un servidor HTTP (no abrir el `index.html` con `file://`):

```bash
# Opción 1: Python
python3 -m http.server 8000

# Opción 2: Node
npx serve .
```

Luego abre http://localhost:8000.

## Build / Prerender (SEO)

Los proyectos y las skills se inyectan en `index.html` en tiempo de build con un
script de Node sin dependencias, leyendo `data/{projects,skills,i18n}.json` como
fuente de verdad. Así el HTML servido ya contiene el contenido real (no
*skeletons*): indexable por buscadores y visible aunque el usuario tenga
JavaScript desactivado. El JS de cliente sigue funcionando como mejora
progresiva (cambio de idioma, filtros de skills, etc.), re-renderizando encima
sin duplicar.

```bash
npm run build      # equivale a: node scripts/prerender.mjs
```

El script es **idempotente** (regenera entre marcadores `<!--prerender:…-->`,
no acumula) y prerenderiza en **español** (idioma por defecto, `<html lang="es">`);
el cambio a inglés ocurre en cliente.

> **Importante:** ejecuta `npm run build` **siempre que edites** cualquier dato
> de proyectos o skills (o sus traducciones) y commitea el `index.html`
> resultante, para que el contenido prerenderizado quede al día.

## CVs e imagen para compartir

Los CVs descargables y la imagen de Open Graph se generan desde plantillas HTML
con Chrome, Chromium o Edge en modo headless (sin dependencias de npm):

| Plantilla | Fichero generado |
|---|---|
| `cv/cv-es.html`, `cv/cv-en.html` (estilos en `cv/cv.css`) | `assets/Ismael_Parras_CV_ES.pdf`, `assets/Ismael_Parras_CV_EN.pdf` |
| `scripts/og-image.html` | `assets/og-image.png` (1200×630) |

```bash
npm run assets     # equivale a: node scripts/render-assets.mjs
```

Edita la plantilla, ejecuta el comando y commitea también el fichero generado.
Si el script no encuentra el navegador, indica su ruta en la variable
`CHROME_BIN`. Comprueba que cada CV sigue ocupando una sola página. Este paso
es manual: no forma parte de `npm run build` ni del despliegue.

## Despliegue

Push a la rama configurada en Vercel; el despliegue es automático. Vercel ejecuta
`npm run build` (regenera el prerender) y sirve la raíz del repositorio.
Las cabeceras de seguridad se aplican desde `vercel.json`.

> **Nota CSP:** la `Content-Security-Policy` incluye el hash SHA-256 del script
> inline de `404.html`. Si se modifica ese script, hay que recalcular el hash y
> actualizarlo en `vercel.json`.

## Accesibilidad y rendimiento

- Soporte completo de `prefers-reduced-motion`.
- Navegación por teclado, skip-link, `aria-*` y `:focus-visible`.
- Imágenes con dimensiones intrínsecas para evitar CLS.
- Tema claro/oscuro persistido en `localStorage`.
