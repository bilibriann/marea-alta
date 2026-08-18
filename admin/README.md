# Marea Alta — Panel de Administración

Proyecto Next.js independiente del sitio público (`../`). Es el backend + panel
propio para administrar **Productos** y **Noticias** (Fase 1) — reemplaza el
CMS basado en Git (Sveltia) que se usaba antes, para que el cliente pueda
publicar contenido con un login usuario/contraseña propio, sin necesitar
ninguna cuenta de GitHub.

Se despliega en Vercel (plan Hobby, gratis) apuntando el **Root Directory** a
esta carpeta (`admin/`). El sitio público sigue desplegándose sin cambios a
Hostinger vía FTP desde la raíz del repo — ambos proyectos comparten el mismo
repositorio de GitHub pero se construyen y despliegan por separado.

## Arquitectura

- **Base de datos:** MySQL. En desarrollo, un contenedor local (`docker-compose.yml`
  en la raíz del repo); en producción, MySQL gestionado de Hostinger.
- **ORM:** [Prisma](prisma/schema.prisma) — define el modelo de
  `Usuario`, `Producto`, `ImagenProducto`, `GrupoOpciones` y `Noticia`.
- **Imágenes:** Cloudflare R2 (S3-compatible). En desarrollo, un MinIO local
  que habla el mismo protocolo — ver [src/lib/storage.ts](src/lib/storage.ts).
  Solo cambian variables de entorno entre dev y producción, el código es el
  mismo.
- **Login:** usuario/contraseña propio (bcrypt + JWT firmado con `jose`),
  sesión de 30 días que se renueva mientras haya uso (`src/proxy.ts`,
  `src/lib/auth.ts`, `src/lib/credenciales.ts`). Dos roles: `admin` (cliente y
  su equipo) y `dev` (nosotros) — mismos permisos sobre Productos/Noticias en
  esta fase; la única diferencia práctica hoy es quién gestiona cuentas.
- **Sitio público:** sigue siendo 100% estático (`output: 'export'`,
  `../next.config.ts`). `../src/lib/productos.ts` y `../src/lib/noticias.ts`
  leen de la misma base MySQL **en build time** (con `mysql2`, sin Prisma —
  son solo lecturas de contenido publicado, no justifica un segundo ORM).
  Publicar contenido nuevo requiere un rebuild — ver "Publicar cambios" abajo.

## Desarrollo local

```bash
# 1. Levantar MySQL + MinIO (desde la raíz del repo)
docker compose up -d

# 2. Variables de entorno
cp .env.example .env
# completar ADMIN_SESSION_SECRET (openssl rand -base64 32) — el resto de los
# valores de ejemplo ya apuntan a los contenedores locales

# 3. Instalar dependencias y aplicar el schema
npm install
npx prisma migrate dev

# 4. Crear un usuario para poder loguearte
npm run usuarios -- crear randy "tu-contraseña-local" dev

# 5. Levantar el panel
npm run dev
```

El sitio público (`../`) necesita su propio `DATABASE_URL` en `../.env` (ver
`../.env.example`) para poder leer Productos/Noticias al correr `npm run
build` o `npm run dev` ahí.

## Gestión de usuarios

No hay pantalla de usuarios en el panel — es deliberado (ver historial de
diseño): son 2-4 cuentas que cambian rara vez, así que se gestionan por CLI.

```bash
npm run usuarios -- crear <nombreUsuario> <password> <admin|dev>
npm run usuarios -- listar
npm run usuarios -- desactivar <nombreUsuario>
npm run usuarios -- activar <nombreUsuario>
npm run usuarios -- reset-password <nombreUsuario> <nuevaPassword>
```

Si alguien olvida su contraseña, la resetea quien tenga acceso a correr este
script contra la base correspondiente (no hay recuperación por email en esta
fase).

## Publicar cambios (rebuild del sitio público)

Como el sitio público es estático, un producto o noticia nueva no aparece
sola — hay que reconstruir y volver a desplegar. Hoy ese paso es **manual**:
correr el workflow de GitHub Actions (`Actions` → `Deploy to GitHub Pages` →
`Run workflow`) o hacerlo localmente. Automatizar esto (ej. un botón
"Publicar" en el panel que dispare el rebuild) queda pendiente — ver
checklist abajo.

## Variables de entorno

Ver `.env.example`. Configurarlas en el proyecto de Vercel (Settings →
Environment Variables), no en un `.env` committeado.

| Variable | Qué es |
|---|---|
| `DATABASE_URL` | Conexión a MySQL |
| `ADMIN_SESSION_SECRET` | Firma las cookies de sesión (JWT) |
| `R2_ENDPOINT` | Endpoint S3-compatible (MinIO en dev, R2 en prod) |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | Credenciales del bucket |
| `R2_BUCKET` | Nombre del bucket |
| `R2_PUBLIC_BASE_URL` | URL pública base para armar los links de las imágenes |

## Checklist de migración a producción (Hostinger real)

**Estado actual:** todo el desarrollo se hizo contra MySQL/MinIO locales
(Docker). Falta migrar a credenciales reales — se diseñó así a propósito
(confirmado en el diseño de arquitectura) para no bloquear el desarrollo
mientras se conseguían los accesos. Migrar no debería requerir tocar código,
solo configuración — Prisma versiona el schema como migraciones, así que
"cambiar de base" es correr esas migraciones contra la base nueva.

### 1. MySQL de Hostinger

- [ ] Crear la base de datos MySQL en el panel de Hostinger.
- [ ] Confirmar que acepta conexiones remotas — necesitan alcanzarla tanto
      Vercel (donde corre `admin/`) como los runners de GitHub Actions (donde
      se hace el build del sitio público). Esto último es lo menos habitual:
      los runners de GitHub no tienen IP fija, así que puede requerir
      habilitar acceso amplio en el firewall de Hostinger o buscar una
      alternativa (ej. un proxy/túnel) si Hostinger no lo permite — **validar
      esto antes de asumir que el build en CI va a funcionar**.
- [ ] Aplicar el schema con `npx prisma migrate deploy` (no `migrate dev` —
      ese es para iteración local, no necesita ni debe usarse en producción).
- [ ] Crear las cuentas reales con `npm run usuarios -- crear ...` corriendo
      contra el `DATABASE_URL` de producción (localmente, apuntando
      temporalmente el `.env` a la base real, o desde donde sea más cómodo
      ejecutar el script con esa variable).

### 2. Cloudflare R2

- [ ] Crear cuenta de Cloudflare (si no existe) y un bucket R2 nuevo para
      producción — no reutilizar el bucket/credenciales de desarrollo.
- [ ] Configurar acceso público de lectura (dominio propio tipo
      `images.marea-alta.cl` vía Cloudflare, según se definió en el diseño de
      arquitectura).
- [ ] Generar un API token de R2 con permisos de lectura/escritura sobre ese
      bucket → `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY`.

### 3. Variables de entorno en Vercel (proyecto `admin/`)

- [ ] `DATABASE_URL` → MySQL de Hostinger.
- [ ] `ADMIN_SESSION_SECRET` → generar uno **nuevo** (`openssl rand -base64
      32`), no reusar el de desarrollo.
- [ ] `R2_ENDPOINT`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_BUCKET`,
      `R2_PUBLIC_BASE_URL` → valores del bucket de producción.

### 4. GitHub Actions (build del sitio público)

- [ ] Agregar el secret `DATABASE_URL` en Settings → Secrets and variables →
      Actions, apuntando a la misma base de Hostinger (ver punto 1 sobre
      conectividad desde los runners).
- [ ] Agregar el paso de despliegue real a Hostinger vía FTP a
      [.github/workflows/deploy.yml](../.github/workflows/deploy.yml) — hoy
      el workflow solo publica a GitHub Pages como entorno de prueba; falta
      sumar la subida FTP con las credenciales reales de Hostinger.
- [ ] Decidir y armar el disparador de "publicar" (ver sección arriba): que
      el panel llame a la API de GitHub (`workflow_dispatch`) para
      automatizar el rebuild, o mantenerlo manual por ahora.

### 5. Verificación end-to-end

- [ ] Login en el panel de producción con una cuenta real.
- [ ] Crear un producto/noticia de prueba, publicarlo, correr el rebuild, y
      confirmar que aparece en el sitio real.
- [ ] Confirmar que las imágenes cargan desde el dominio de R2 de producción.
