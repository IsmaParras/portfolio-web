# Portfolio — Ismael Parras Resino

Portfolio personal de **Ismael Parras Resino**, *RPA & AI Automation Developer*.
Sitio web estático, bilingüe (ES/EN), con tema claro/oscuro, enfocado en
hiperautomatización, IA generativa y agentes conversacionales.

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
│   └── prerender.mjs   # Build: inyecta proyectos/skills en index.html (SEO)
├── package.json        # Define el script `npm run build` (prerender)
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

## Despliegue

Push a la rama configurada en Vercel; el despliegue es automático. Vercel sirve
el `index.html` ya prerenderizado tal cual está en el repo (no ejecuta build).
Las cabeceras de seguridad se aplican desde `vercel.json`.

> **Nota CSP:** la `Content-Security-Policy` incluye el hash SHA-256 del script
> inline de `404.html`. Si se modifica ese script, hay que recalcular el hash y
> actualizarlo en `vercel.json`.

## Accesibilidad y rendimiento

- Soporte completo de `prefers-reduced-motion`.
- Navegación por teclado, skip-link, `aria-*` y `:focus-visible`.
- Imágenes con dimensiones intrínsecas para evitar CLS.
- Tema claro/oscuro persistido en `localStorage`.
</content>
