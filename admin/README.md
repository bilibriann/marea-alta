# Marea Alta — Panel de Administración

Proyecto Next.js independiente del sitio público (`../`). Sirve el panel de
Sveltia CMS detrás de una "puerta con llave" (proxy + cookie firmada).

Se despliega en Vercel apuntando el **Root Directory** a esta carpeta
(`admin/`). El sitio público sigue desplegándose sin cambios a Hostinger vía
FTP desde la raíz del repo — ambos proyectos comparten el mismo repositorio
de GitHub pero se construyen y despliegan por separado.

## Por qué está separado del sitio público

El sitio público usa `output: 'export'` (100% estático, sin servidor) para
poder desplegarse en Hostinger. Un proxy (`middleware`/`proxy.ts`) funcional
requiere un runtime de servidor (Edge/Node), lo que es incompatible con
`output: 'export'` en un mismo build. Por eso el panel vive en su propio
proyecto Next.js, con su propio `next.config.ts` (sin `output: 'export'`),
desplegado en Vercel.

## Cómo funciona

### Puerta con llave (nuestra sesión)

- `src/proxy.ts` protege todo excepto `/login`, `/auth` y `/callback`: si no
  hay cookie de sesión válida, redirige a `/login?from={ruta-original}`.
- `/login` — formulario de contraseña (Server Action). Compara contra
  `ADMIN_PASSWORD_CLIENT` / `ADMIN_PASSWORD_DEV` con `timingSafeEqual`
  (`src/lib/password.ts`, solo corre en runtime Node — nunca se importa desde
  el proxy).
- Al validar, firma un JWT con `jose` (`src/lib/auth.ts`, compatible con Edge
  runtime) con payload `{ role: 'client' | 'dev' }` y lo guarda en una cookie
  `HttpOnly; Secure (en producción); SameSite=Lax`.

### Proxy OAuth de GitHub (sesión de Sveltia, independiente de la nuestra)

Sveltia CMS necesita autenticarse contra GitHub para poder comitear al repo
de contenido — es un login *distinto* al de arriba. Ese intercambio requiere
un servidor (el `client_secret` de la OAuth App no puede vivir en el
navegador), así que lo implementamos nosotros mismos en vez de sumar
`sveltia-cms-auth` como plataforma aparte:

- `src/app/auth/route.ts` — Sveltia abre esto en un popup; redirige a GitHub
  con un token CSRF propio guardado en cookie.
- `src/app/callback/route.ts` — GitHub redirige acá con el `code`; se canjea
  por un access token (usa `GITHUB_CLIENT_ID`/`GITHUB_CLIENT_SECRET`) y se le
  devuelve a Sveltia vía `postMessage` en la ventana del popup.
- `src/lib/oauth.ts` — reimplementación fiel del protocolo de
  [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) (mismo
  handshake de `postMessage`, mismos nombres de cookie/params), portada a
  Route Handlers de Next.js.
- `public/admin/config.yml` → `backend.base_url` apunta a este mismo deploy.
  Si cambia el dominio (ej. al migrar a `admin.marea-alta.com`), hay que
  actualizar **tres lugares**: `base_url` acá, la "Authorization callback
  URL" de la OAuth App en GitHub, y el `Homepage URL` de la misma.
- `public/admin/config.yml` → `backend.repo` apunta al repo real
  (`bilibriann/marea-alta`) donde vive el contenido (`src/content/`) —
  Sveltia edita ese repo aunque su interfaz se sirva desde este dominio
  distinto.

## Variables de entorno

Ver `.env.example`. Configurarlas en el proyecto de Vercel (Settings →
Environment Variables), no en un `.env` committeado.

## Migración al repo real (pendiente)

**Estado actual (2026-08-12):** todo el código apunta a `bilibriann/marea-alta`
(el repo real), pero el único deploy funcionando en Vercel hoy usa el fork de
Randy (`randyman123/marea-alta`) para poder probar el login y el flujo OAuth
sin depender de nadie más. Bloqueado en que bilibriann autorice el acceso de
Vercel al repo real. Cuando lo confirme, seguir esta lista en orden:

### 1. Crear el proyecto de Vercel nuevo (no reusar el del fork)

- Vercel → Add New → Project → importar `bilibriann/marea-alta`.
- **Root Directory: `admin/`** (el mismo ajuste que ya usa el proyecto del
  fork — sin esto, Vercel intenta buildear el sitio público).
- Dejar el proyecto del fork **como está, sin tocar** (ver punto 4) — no
  reconectar su repo ni borrarlo todavía, para no perder el entorno de
  pruebas mientras se termina de configurar el nuevo.
- Anotar el dominio `*.vercel.app` que Vercel asigna al proyecto nuevo — se
  necesita para los dos pasos siguientes.

### 2. Variables de entorno a configurar en el proyecto nuevo

Ninguna se hereda automáticamente del proyecto del fork — hay que cargarlas
todas de nuevo en Settings → Environment Variables:

| Variable | ¿Mismo valor que en el proyecto de pruebas? |
|---|---|
| `ADMIN_PASSWORD_CLIENT` | Recomendado generar una nueva — la de pruebas ya circuló en esta conversación |
| `ADMIN_PASSWORD_DEV` | Recomendado generar una nueva, mismo motivo |
| `ADMIN_SESSION_SECRET` | Generar una nueva (`openssl rand -base64 32`) — que una sesión firmada en el entorno de pruebas nunca sea válida contra producción |
| `GITHUB_CLIENT_ID` | Nueva — ver punto 3, es una OAuth App distinta |
| `GITHUB_CLIENT_SECRET` | Nueva — ver punto 3 |

### 3. OAuth App de GitHub: crear una nueva, no reutilizar la actual

Una OAuth App clásica solo admite **una** Authorization callback URL. Como
el proyecto del fork se mantiene vivo (punto 4) y su OAuth App actual sigue
apuntando a `https://marea-alta-6m7y.vercel.app/callback`, reutilizarla y
cambiarle la callback URL rompería el login GitHub del entorno de pruebas.
Por eso, crear una **OAuth App nueva y separada**:

1. GitHub → Settings → Developer settings → OAuth Apps → New OAuth App.
2. Homepage URL y Authorization callback URL usando el dominio anotado en el
   paso 1, ej.: `https://{dominio-nuevo}.vercel.app/callback`.
3. Generar el Client Secret y cargar ambos valores (punto 2).

Después de esto, actualizar `public/admin/config.yml`:
- `backend.base_url` → reemplazar el placeholder `https://TODO-actualizar-dominio-vercel-repo-real` por `https://{dominio-nuevo}.vercel.app`.

Y hacer commit + push (esto sí dispara el deploy real).

### 4. Qué hacer con el proyecto de Vercel del fork

**Dejarlo activo, no borrarlo.** Sirve como entorno de pruebas permanente y
aislado (nuevas colecciones de Sveltia, cambios al proxy OAuth, etc.) sin
arriesgar el panel real del cliente. Sugerencia: renombrarlo en el dashboard
de Vercel a algo como `marea-alta-admin-testing` para que no se confunda con
el proyecto de producción una vez que ambos convivan.

## Desarrollo local

```bash
npm install
npm run dev
```
