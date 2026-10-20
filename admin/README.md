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

## Despliegue actual

- Proyecto de Vercel conectado a `bilibriann/marea-alta`, con **Root
  Directory `admin/`**. Cada push a `main` lo vuelve a desplegar.
- Dominio: `https://marea-alta-admin.vercel.app` (el mismo que figura en
  `backend.base_url` de `public/admin/config.yml`).
- La OAuth App de GitHub tiene como callback
  `https://marea-alta-admin.vercel.app/callback`.

Como Sveltia también commitea a `main`, antes de hacer push desde local
conviene `git fetch` + `git rebase origin/main`.

## Seguridad del panel

- **Acceso:** contraseña por rol (cliente o desarrollador), comparada en
  tiempo constante (hash SHA-256 + `timingSafeEqual`).
- **Sesión:** JWT HS256 firmado con `ADMIN_SESSION_SECRET`, válido 7 días,
  en cookie `HttpOnly; Secure; SameSite=Lax`.
- **Fuerza bruta:** 5 intentos fallidos por IP en 15 minutos bloquean el
  login, y cada fallo espera 1 s. El contador vive en memoria de cada
  instancia de Vercel: es un freno, no un límite global.
- **Redirección segura:** el parámetro `from` solo acepta rutas internas
  (`destinoSeguro`), así el login no se puede usar para mandar a otro sitio.
- **OAuth con GitHub:** token CSRF aleatorio en cookie `HttpOnly` de 10
  minutos, comparado con el `state` que vuelve de GitHub. El token se entrega
  por `postMessage` solo al origin que respondió el handshake, nunca a `*`.
  `ALLOWED_DOMAINS` (opcional) limita qué sitios pueden usar el proxy.
- **Sveltia CMS:** se carga desde unpkg con versión fija en
  `public/admin/index.html`. Para actualizarlo, cambiar el número a mano.
- **Buscadores:** el panel lleva `noindex, nofollow` y el `robots.txt` del
  sitio público excluye `/admin`.

## Cambiar el dominio del panel

Hay que actualizar **tres lugares** a la vez: `backend.base_url` en
`public/admin/config.yml`, y la *Homepage URL* y la *Authorization callback
URL* de la OAuth App en GitHub.

## Desarrollo local

```bash
npm install
npm run dev
```
