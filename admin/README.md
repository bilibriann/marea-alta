# Marea Alta — Panel de Administración

Proyecto Next.js independiente del sitio público (`../`). Sirve el panel de
Sveltia CMS detrás de una "puerta con llave" (middleware + cookie firmada).

Se despliega en Vercel apuntando el **Root Directory** a esta carpeta
(`admin/`). El sitio público sigue desplegándose sin cambios a Hostinger vía
FTP desde la raíz del repo — ambos proyectos comparten el mismo repositorio
de GitHub pero se construyen y despliegan por separado.

## Por qué está separado del sitio público

El sitio público usa `output: 'export'` (100% estático, sin servidor) para
poder desplegarse en Hostinger. Un `middleware.ts` funcional requiere un
runtime de servidor (Edge/Node), lo que es incompatible con `output: 'export'`
en un mismo build. Por eso el panel vive en su propio proyecto Next.js, con su
propio `next.config.ts` (sin `output: 'export'`), desplegado en Vercel.

## Cómo funciona

- `middleware.ts` protege todo excepto `/login`: si no hay cookie de sesión
  válida, redirige a `/login?from={ruta-original}`.
- `/login` — formulario de contraseña (Server Action). Compara contra
  `ADMIN_PASSWORD_CLIENT` / `ADMIN_PASSWORD_DEV` con `timingSafeEqual`
  (`src/lib/password.ts`, solo corre en runtime Node — nunca se importa desde
  el middleware).
- Al validar, firma un JWT con `jose` (`src/lib/auth.ts`, compatible con Edge
  runtime) con payload `{ role: 'client' | 'dev' }` y lo guarda en una cookie
  `HttpOnly; Secure (en producción); SameSite=Lax`.
- `public/admin/` — el bootstrap de Sveltia CMS (`index.html` + `config.yml`).
  El campo `backend.repo` de `config.yml` apunta al repo de GitHub del sitio
  público (`bilibriann/marea-alta`), que es donde vive el contenido real
  (`src/content/`) — Sveltia edita ese repo aunque su interfaz se sirva desde
  este dominio distinto.

## Variables de entorno

Ver `.env.example`. Configurarlas en el proyecto de Vercel (Settings →
Environment Variables), no en un `.env` committeado.

## Desarrollo local

```bash
npm install
npm run dev
```
