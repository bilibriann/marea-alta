# Marea Alta — Sitio Corporativo

Sitio corporativo estático de Marea Alta Chile SpA. Build 100% estático desplegado en Hostinger vía FTP con GitHub Actions.

## Stack

- Next.js 16 (App Router, `output: 'export'`)
- TypeScript strict
- Tailwind CSS
- ESLint + Prettier
- gray-matter (parseo de frontmatter en archivos .md)

## Estructura

```
src/
├── app/                     # Rutas del sitio
│   ├── layout.tsx           # Layout global (Header + Footer)
│   ├── page.tsx             # /
│   ├── _components/         # Componentes exclusivos del home
│   ├── [servicio]/          # /control-de-calidad, /trazabilidad, etc.
│   ├── servicios/           # /servicios — índice estático
│   ├── productos/           # /productos
│   ├── contacto/            # /contacto
│   ├── sitemap.ts           # Genera /sitemap.xml
│   └── robots.ts            # Genera /robots.txt (excluye /admin)
│
├── components/              # Header, Footer, Button, icons — usan siteConfig
│
├── config.ts                # Fuente única: nav, contacto, redes, metadata base
│
├── content/                 # Archivos que edita el CMS
│   ├── servicios/           # Un .md por servicio (frontmatter YAML)
│   ├── sectores.json
│   ├── testimonios.json
│   ├── clientes.json
│   ├── certificaciones.json
│   └── home.json
│
├── lib/                     # Funciones de acceso al contenido + stub de formularios
│   ├── home.ts              # getHomeContent(), getSectores(), etc.
│   ├── servicios.ts         # getServicio(slug), getAllServicios()
│   ├── productos.ts         # getProductosContent()
│   └── forms.ts             # Stub de envío de formularios
│
└── types/
    └── index.ts             # Tipos compartidos entre módulos
```

Material de referencia de diseño (mockups de Stitch, no se publica): `/design-reference/` en la raíz del repo.

## Por qué `servicios/` tiene precedencia sobre `[servicio]/`

Next.js da prioridad a rutas estáticas sobre dinámicas. La carpeta `servicios/page.tsx` coincide exactamente con `/servicios`, por lo que nunca entra al handler dinámico `[servicio]/page.tsx`. Lo mismo aplica a `/productos` y `/contacto`.

## Flujo de datos (home como ejemplo)

```
src/config.ts                → Header, Footer, metadata base
src/content/home.json        → src/lib/home.ts → getHomeContent()
src/content/sectores.json    → src/lib/home.ts → getSectores()
                                        ↓
                              src/app/page.tsx
                                        ↓
     _components/HeroSection, QuickLinksSection, ConfianzaSection,
                   SectoresSection, ContactoSection
```

## Por qué la capa lib/

Cuando entre el CMS (Sveltia o Decap), los archivos en `src/content/` van a cambiar de formato (TypeScript → Markdown con frontmatter, o JSON con esquema del CMS). Solo cambia la implementación dentro de `src/lib/`. Los componentes reciben los mismos tipos TypeScript y no se tocan.

## Imágenes

Todas las imágenes viven en `public/images/`. No se usa ningún CDN externo.

| Carpeta                          | Contenido                        | Convención de nombre         |
|----------------------------------|----------------------------------|------------------------------|
| `public/images/hero/`            | Fondos y video del hero          | `hero-bg.webp`               |
| `public/images/servicios/`       | Una imagen por servicio          | `{slug}.webp`                |
| `public/images/sectores/`        | Una imagen por sector            | `{slug}.webp`                |
| `public/images/clientes/`        | Logos de clientes                | `logo-{nombre-cliente}.webp` |
| `public/images/certificaciones/` | Logos ISO, AENOR, IQNET          | `iso-9001.webp`, `aenor.webp`|

## Desarrollo

```bash
npm run dev     # servidor de desarrollo
npm run build   # build estático → carpeta out/
npm run lint    # ESLint
```

## Variables de entorno

Ver `.env.example`.
