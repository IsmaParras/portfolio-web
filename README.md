# Portfolio — Ismael Parras Resino

Portfolio personal de **Ismael Parras Resino**, *Agentic AI Solution Architect*.
Sitio web estático, bilingüe (ES/EN), con tema claro/oscuro, enfocado en
agentes de IA, automatización e IA generativa.

🔗 **En producción:** https://ismaelparras.vercel.app/

## Stack

- **HTML5 + CSS3 + JavaScript vanilla** (ES6+), sin framework.
- Datos externalizados en JSON (`data/`) y cargados con `fetch`.
- **Prerender estático** (Node, sin dependencias) que genera la página en
  español (`/`) y en inglés (`/en/`) con todo el contenido en el HTML, para SEO
  y funcionamiento sin JS.
- **Google Fonts** (Inter, JetBrains Mono, Syne).
- Iconos de skills incrustados como SVG (de [Simple Icons](https://simpleicons.org/), licencia CC0).
- Formulario de contacto con [Formspree](https://formspree.io/).
- Desplegado en **Vercel** (hosting estático + cabeceras de seguridad).

## Estructura

```
portfolio-web/
├── index.html          # Plantilla y página en español (generada por el build)
├── en/index.html       # Página en inglés (generada por el build)
├── 404.html            # Página de error personalizada
├── css/styles.css      # Estilos (variables CSS, temas claro/oscuro)
├── js/script.js        # Lógica: i18n, tema, render dinámico, form, filtros
├── scripts/
│   ├── prerender.mjs       # Build: genera index.html y en/index.html
│   ├── check.mjs           # Build: comprueba claves i18n y datos
│   ├── build-knowledge.mjs # Build: genera el contexto del agente
│   ├── test-chat.mjs       # Pruebas de api/chat.js (npm test)
│   ├── agent-evals.mjs     # Evaluación del agente real sobre una URL
│   ├── render-assets.mjs   # Genera los CVs en PDF y la og-image (npm run assets)
│   └── og-image.html       # Plantilla de assets/og-image.png
├── api/chat.js         # Función de Vercel del asistente de IA
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
- **`skills.json`** — array de habilidades. Campos: `name`, `iconSvg` (SVG en
  línea), `color` (hex), `area` (`automatizacion` | `cloud` | `software`),
  `core` (las principales, que se ven sin pulsar "Ver todas"), `cert`/`certUrl`,
  `desc`/`desc_en`, `tags`.
- **`i18n.json`** — textos en `es` y `en`, más `typeTexts` del efecto typewriter.

En `index.html`, un elemento con `data-i18n="clave"` recibe su texto de
`i18n.json`, y `data-i18n-attr="atributo:clave;atributo:clave"` hace lo mismo
con atributos (`placeholder`, `aria-label`, `content`…). El build sobrescribe lo
que haya escrito a mano dentro de esos elementos: el texto se cambia siempre en
`i18n.json`.

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

`index.html` es a la vez la plantilla y la página en español. Un script de Node
sin dependencias lee `data/*.json` y:

- rellena todos los textos y atributos traducibles,
- inyecta proyectos y skills entre marcadores `<!--prerender:…-->`,
- genera el bloque SEO de cada idioma (canonical, `hreflang`, Open Graph) y el
  JSON-LD,
- escribe `index.html` (español, `/`) y `en/index.html` (inglés, `/en/`),
- comprueba la coherencia del contenido (`scripts/check.mjs`): mismas claves en
  ambos idiomas, ninguna clave inexistente o sin uso, datos completos.

```bash
npm run build      # prerender + comprobaciones
npm run check      # solo las comprobaciones
```

Así cada idioma tiene su URL indexable y el contenido es visible sin
JavaScript. El idioma lo fija la URL; el botón de idioma es un enlace a la otra
versión. El script es **idempotente**.

> **Importante:** ejecuta `npm run build` **siempre que edites** `data/*.json` o
> `index.html` y commitea `index.html` y `en/index.html`. Si las comprobaciones
> fallan, el despliegue en Vercel también falla.

## Asistente de IA

Botón "Pregúntame" que abre un chat que responde sobre Ismael y puede actuar sobre
la página (ir a una sección, filtrar skills, cambiar de idioma, descargar el CV o
dejar rellenado el formulario de contacto, que **nunca envía**).

```
Navegador (js/agent.js) → /api/chat (api/chat.js) → modelo (Groq por defecto)
                                    └→ Upstash Redis: límites de uso y preguntas anónimas
```

- **Conocimiento:** se genera en el build (`scripts/build-knowledge.mjs` →
  `api/_knowledge.js`) a partir de `data/*.json` y `data/agent-facts.json`, así que
  no puede contradecir la web. Lo que la web no dice (idiomas, política sobre SGS…)
  se edita en `data/agent-facts.json`.
- **Variables de entorno (Vercel):** `LLM_API_KEY` (obligatoria), y las de Upstash
  `UPSTASH_KV_REST_API_URL` / `UPSTASH_KV_REST_API_TOKEN`, que añade la integración.
  Opcionales: `LLM_BASE_URL` (por defecto la API compatible con OpenAI de Groq) y
  `LLM_MODEL` (por defecto `openai/gpt-oss-120b`; si Groq lo retira, basta con poner otro modelo con herramientas en esta variable). Sin ellas, `/api/chat` responde
  503 y el botón no aparece.
- **Seguridad:** el modelo solo ve el documento de datos; la clave nunca llega al
  navegador; las respuestas se muestran como texto plano; las acciones se validan en
  servidor y en navegador contra listas cerradas; hay límite por visitante (6/min,
  30/día) y global (120/día). Esos números salen de la capa gratuita de Groq: cada
  pregunta gasta ≈ 1.500 tokens (una sola llamada al modelo, contexto compacto) y
  `openai/gpt-oss-120b` permite 200.000 al día y 8.000 por minuto (los tokens en caché
  no cuentan). Si cambias de modelo o de plan, ajusta `LIMITS` en `api/chat.js`.
- **Privacidad:** se guarda solo día, idioma, texto de la pregunta y su resultado
  (máximo 2.000). No se guardan IP, navegador ni respuestas; la IP solo se usa, como
  identificador no reversible que cambia cada día, para el límite de uso. Las
  preguntas se leen en el panel de datos de Upstash.
- **Pruebas:** `npm test` (endpoint con modelo y Redis simulados) y
  `node scripts/agent-evals.mjs --url <URL desplegada>` (≈ 24 preguntas contra el
  modelo real; tarda unos 4 minutos por el límite de uso).

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
