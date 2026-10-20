# Marea Alta — Sitio Corporativo

Sitio corporativo de Marea Alta Chile SpA (https://mareaalta-latam.com). El repositorio tiene dos aplicaciones:

| Parte | Qué es | Dónde corre |
|---|---|---|
| Sitio público (raíz) | Export 100% estático de Next.js | Hostinger, subido por FTPS con GitHub Actions |
| Panel admin (`admin/`) | Sveltia CMS detrás de un login propio | Vercel (https://marea-alta-admin.vercel.app) — ver `admin/README.md` |

## Stack

- Next.js 16 (App Router, `output: 'export'`) + React 19
- TypeScript strict
- Tailwind CSS 4
- Zod (valida el contenido al construir)
- gray-matter, react-markdown y remark-gfm (contenido en Markdown)
- Web3Forms (formularios)
- ESLint 9 + Prettier 3

## Estructura

```
src/
├── app/                      # Rutas del sitio
│   ├── layout.tsx            # Layout global (Header + Footer)
│   ├── page.tsx              # /  (secciones en _components/)
│   ├── [servicio]/           # /control-de-calidad, /trazabilidad, etc. (7 servicios)
│   ├── productos/            # /productos y /productos/[slug] (ficha + cotización)
│   ├── noticias/             # /noticias y /noticias/[slug]
│   ├── contacto/             # /contacto
│   ├── sitemap.ts            # Genera /sitemap.xml
│   └── robots.ts             # Genera /robots.txt (excluye /admin)
│
├── components/               # Header, Footer, Button, tarjetas, animaciones, icons
├── config.ts                 # Fuente única: nav, contacto, LinkedIn, CONTACT_EMAIL
│
├── content/                  # Todo el contenido editable
│   ├── productos/*.md        # Un .md por producto (lo edita el panel)
│   ├── noticias/*.md         # Un .md por noticia (lo edita el panel)
│   ├── servicios/*.md        # Un .md por servicio
│   └── *.json                # home, sectores, marcas propias, distribución, etc.
│
├── lib/                      # Lectura y validación del contenido + formularios
│   ├── home.ts, productos.ts, servicios.ts, noticias.ts
│   └── forms.ts              # Único camino de envío de formularios (Web3Forms)
│
└── types/index.ts            # Tipos compartidos

public/        # Imágenes .webp, logos, fichas PDF y .htaccess
admin/         # Panel de administración (proyecto Next.js aparte)
scripts/       # check-export.mjs: revisa out/ antes de subirlo
```

Material de referencia de diseño (mockups de Stitch, no se publica): `/design-reference/`. Lineamientos visuales en `DESIGN.md`, contexto de negocio en `PRODUCT.md`.

## Flujo del contenido

```
src/content/*.json, *.md  →  src/lib/*.ts (validación con Zod)  →  páginas en src/app/
```

Si un archivo de contenido está mal formado, el build falla e indica cuál.

## Formularios

Contacto, newsletter y cotización pasan todos por `src/lib/forms.ts` hacia Web3Forms. El correo llega a la dirección asociada a la access key. Antispam: campo trampa (`CampoTrampa.tsx`), 30 s entre envíos y largo máximo por campo.

## Despliegue

Cada push a `main` dispara dos workflows:

- `ci.yml` — lint, tipos, build y `check:export`.
- `deploy-hostinger.yml` — build, `check:export` y subida de `out/` por FTPS.

`check:export` corta la subida si falta el `.htaccess`, si el build trae el basePath de GitHub Pages o si los formularios no quedaron configurados.

## Seguridad

- Sitio estático: no hay servidor ni base de datos propios en Hostinger.
- `public/.htaccess` agrega HSTS, X-Frame-Options, nosniff, Referrer-Policy y Permissions-Policy.
- Los secretos viven en GitHub Secrets (FTP, Web3Forms) y en Vercel (panel), nunca en el repo: `.env*` está en `.gitignore`.
- El panel tiene su propia sesión firmada, freno de intentos y proxy OAuth con CSRF — detalle en `admin/README.md`.

## Imágenes

Todas las imágenes viven en `public/images/`, sin CDN externo. Para reemplazar una foto, usar un nombre de archivo nuevo: el `.htaccess` cachea `.webp` por 1 año.

## Desarrollo

```bash
npm run dev            # servidor de desarrollo
npm run build          # build estático → carpeta out/
npm run lint           # ESLint
npx tsc --noEmit       # revisión de tipos
npm run check:export   # verifica out/ antes de subir
```

## Variables de entorno

Ver `.env.example` (sitio) y `admin/.env.example` (panel).
