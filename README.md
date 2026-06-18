# Portfolio — Ismael Parras Resino

Portfolio personal de **Ismael Parras Resino**, *RPA & AI Automation Developer*.
Sitio web estático, bilingüe (ES/EN), con tema claro/oscuro, enfocado en
hiperautomatización, IA generativa y agentes conversacionales.

🔗 **En producción:** https://ismaelparras.vercel.app/

## Stack

- **HTML5 + CSS3 + JavaScript vanilla** (ES6+), sin framework ni paso de build.
- Datos externalizados en JSON (`data/`) y cargados con `fetch`.
- **Google Fonts** (Inter, JetBrains Mono, Syne).
- Iconos de skills vía [Simple Icons CDN](https://simpleicons.org/).
- Formulario de contacto con [Formspree](https://formspree.io/).
- Desplegado en **Vercel** (hosting estático + cabeceras de seguridad).

## Estructura

```
portfolio-web/
├── index.html          # Página principal (una sola página, anclas por sección)
├── 404.html            # Página de error personalizada
├── css/styles.css      # Estilos (variables CSS, temas claro/oscuro)
├── js/script.js        # Lógica: i18n, tema, render dinámico, form, filtros
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
- **`projects.json`** — array de proyectos. Cada uno: `id`, `title`, `tags`,
  `descKey` (clave en `i18n.json`), `results` (con `es`/`en`), `ctaKey`, `ctaUrl`.
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

## Despliegue

Push a la rama configurada en Vercel; el despliegue es automático. Las cabeceras
de seguridad se aplican desde `vercel.json`.

> **Nota CSP:** la `Content-Security-Policy` incluye el hash SHA-256 del script
> inline de `404.html`. Si se modifica ese script, hay que recalcular el hash y
> actualizarlo en `vercel.json`.

## Accesibilidad y rendimiento

- Soporte completo de `prefers-reduced-motion`.
- Navegación por teclado, skip-link, `aria-*` y `:focus-visible`.
- Imágenes con dimensiones intrínsecas para evitar CLS.
- Tema claro/oscuro persistido en `localStorage`.
</content>
