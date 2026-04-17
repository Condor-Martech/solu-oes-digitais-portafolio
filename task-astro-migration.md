---
task: astro-migration
classification: COMPLEX CODE
created: 2026-04-17
owner: plataformas.condor@gmail.com
status: planning
---

# Migración a Astro + Tailwind + n8n + Google Sheets

## 1. Contexto

El portfólio actual es HTML/CSS/JS estático con datos hardcoded en [js/data.js](js/data.js).
Se reemplaza por una app Astro SSR cuyo contenido se sincroniza desde una Google Sheet
a través de n8n. El Sheet + n8n funcionan como backoffice — no se construye admin UI.

Este plan **supersede** las siguientes reglas del [CLAUDE.md](CLAUDE.md) actual
(que deberá actualizarse como parte de la tarea):
- "Sem React, sem Next.js, sem TypeScript, sem Tailwind" → ahora: **Astro + TypeScript + Tailwind**.
- "Servir com python3 -m http.server 8765" → ahora: **Node adapter (SSR) con PM2 o Docker**.
- Skills previamente marcadas como no aplicables (`tailwind-patterns`) **sí aplican** ahora.

## 2. Stack definitivo

| Capa | Tecnología |
|---|---|
| Framework | Astro 5 + TypeScript |
| Adapter | `@astrojs/node` (mode: standalone) |
| Styling | Tailwind v4 vía `@tailwindcss/vite` |
| Fuentes | DM Sans + DM Mono (Google Fonts) |
| Runtime | Node 20+ (PM2 o Docker) |
| Datos | `src/data/projects.json` en disco |
| Sync | n8n → webhook → endpoint Astro |
| Auth | Cookie firmada + middleware (HMAC) |

## 3. Contrato Sheet ↔ n8n ↔ Astro

### 3.1 Columnas de la Google Sheet

| Columna | Tipo | Origen |
|---|---|---|
| `id` | fórmula (slug del title) | auto |
| `title` | texto | manual |
| `company` | texto | manual |
| `link` | URL | manual |
| `production` | `Interno \| Terceiro \| Agência` | dropdown |
| `image` | path relativo (ej. `screenshots/foo.png`) | manual |
| `desc` | texto largo | manual |
| `_marked_delete` | checkbox oculto | manual — dispara flujo de aprobación |

### 3.2 Payloads n8n → Astro

Todos los payloads viajan con header `x-sync-token: <SYNC_SECRET>`.

**Upsert (per-row, disparado por onEdit):**
```json
{
  "op": "upsert",
  "project": {
    "id": "condor-em-casa",
    "title": "Condor em Casa",
    "company": "Condor",
    "link": "https://www.condoremcasa.com.br/",
    "production": "Terceiro",
    "image": "screenshots/condor_em_casa_full.png",
    "desc": "..."
  }
}
```

**Delete (solo tras aprobación manual en n8n):**
```json
{ "op": "delete", "id": "condor-em-casa" }
```

**Replace-all (bootstrap y resync completos):**
```json
{ "op": "replace_all", "projects": [ /* array completo */ ] }
```

### 3.3 Flujo de borrado con aprobación

1. Usuario marca checkbox `_marked_delete` en el Sheet → onEdit dispara webhook.
2. n8n NO envía a Astro todavía. Usa nodo **Send and Wait for Response** (email/Slack) al responsable.
3. Aprobado → n8n envía `{ op: "delete", id }` a Astro.
4. Rechazado → n8n limpia el checkbox y no pasa nada. Astro nunca recibe el request.

## 4. Estructura del repo tras la migración

```
lphub/
├── astro.config.mjs
├── tsconfig.json
├── package.json
├── .env                      # SYNC_SECRET, AUTH_SECRET, ADMIN_USER, ADMIN_PASS
├── public/
│   ├── logos/                # movido desde /logos
│   └── screenshots/          # movido desde /screenshots
├── src/
│   ├── data/
│   │   └── projects.json     # estado canónico
│   ├── layouts/
│   │   └── Base.astro
│   ├── components/
│   │   ├── ProjectCard.astro
│   │   ├── ProjectModal.astro
│   │   ├── FilterBar.astro
│   │   └── Header.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── login.astro
│   │   └── api/
│   │       ├── projects.ts   # POST upsert/delete/replace_all
│   │       ├── login.ts      # POST valida y setea cookie
│   │       └── logout.ts
│   ├── lib/
│   │   ├── auth.ts           # firma/verifica cookie HMAC
│   │   ├── storage.ts        # read/write atómicos de projects.json
│   │   └── projects.ts       # upsert/delete/replace en array
│   ├── middleware.ts         # gate de sesión
│   └── styles/
│       └── globals.css       # @import "tailwindcss"; + tokens extra
└── task-astro-migration.md   # este documento
```

Archivos del repo viejo que se archivan (no se borran hasta validar):
`portfolio.html`, `styles.css`, `js/*`, `CLAUDE.md` (se reescribe).

## 5. Design system en Tailwind

Los tokens actuales de [styles.css](styles.css) se modelan como theme extendido de Tailwind v4
(usando `@theme` en CSS):

```css
@import "tailwindcss";

@theme {
  --color-bg: #F7F6F3;
  --color-surface: #FFFFFF;
  --color-ink: #171717;
  --color-ink-muted: #555555;
  --color-border: #E5E3DE;
  --font-sans: "DM Sans", system-ui, sans-serif;
  --font-mono: "DM Mono", ui-monospace, monospace;
  --radius-card: 14px;
}
```

**Reglas fijas del producto que sobreviven**:
- Fundo `bg-bg`, superficies `bg-surface`.
- Bordas 0.5px (`border-[0.5px]`), **sin sombras, sin gradientes**.
- Hover en cards: overlay oscuro + label "Ver detalhes" centralizado.
- Tags: color asignado por hash, paleta portada a `data-tag-color="N"` + clases predefinidas.

## 6. Rutas y páginas

| Ruta | Método | Protegida | Propósito |
|---|---|---|---|
| `/` | GET | sí | Grid de proyectos con filtros por company/production |
| `/login` | GET | no | Form de login (DM Sans, branding Condor) |
| `/api/login` | POST | no | Valida credenciales, setea cookie `lphub_session` |
| `/api/logout` | POST | sí | Limpia cookie |
| `/api/projects` | POST | token (no cookie) | Recibe payloads de n8n |

## 7. Endpoint `/api/projects`

- Verifica `x-sync-token` contra `SYNC_SECRET` (env). Si falla → 401.
- Valida `op ∈ { upsert, delete, replace_all }` y shape del payload (zod o validación manual).
- Adquiere lock (archivo `.lock` o `proper-lockfile`) sobre `src/data/projects.json`.
- Aplica la operación sobre el array en memoria.
- Escribe a `projects.json.tmp` y renombra atómicamente a `projects.json`.
- Responde `200 { ok: true, count: N }`.

## 8. Auth

- Credenciales en `.env`: `ADMIN_USER`, `ADMIN_PASS` (hash bcrypt del password).
- `/api/login`: valida, firma cookie `lphub_session` con HMAC (`AUTH_SECRET`), `httpOnly; secure; sameSite=Lax`.
- `src/middleware.ts`: en cada request bloquea rutas no-públicas si la cookie falta/inválida, excepto `/login`, `/api/login`, `/api/projects` (este último tiene su propia gate por token).
- Sesión con expiración (7 días), renovada en cada request.

## 9. Checklist de implementación

### Fase 0 — Preparación ✅
- [x] Backup del repo actual en branch `archive/pre-astro` (commit `cc37711`).
- [x] Actualizar [CLAUDE.md](CLAUDE.md): nuevo stack, comando dev (`npm run dev`), comando build, vars de entorno.
- [x] Crear `.env.example` con `SYNC_SECRET`, `AUTH_SECRET`, `ADMIN_USER`, `ADMIN_PASS`.

### Fase 1 — Scaffold ✅
- [x] Scaffold manual (dir no vacío, se evitó `npm create astro`).
- [x] Instalar `@astrojs/node`, `tailwindcss`, `@tailwindcss/vite`, `astro`.
- [x] Configurar `astro.config.mjs` con adapter Node (standalone) + vite plugin Tailwind.
- [x] Crear `src/styles/globals.css` con `@import "tailwindcss"` y `@theme`.
- [x] Probar dev server (`npm run dev` — HTTP 200, Tailwind inyectado).
- [x] Probar `npm run build` (output SSR ok).

### Fase 2 — Portar UI ✅
- [x] Mover `screenshots/` y `logos/` a `public/`.
- [x] Crear `Base.astro` con skip-link y carga de fuentes.
- [x] Crear `Header.astro` con contador.
- [x] Crear `ProjectCard.astro` (imagen + título + empresa + production como tags, hover overlay, placeholder para sin captura).
- [x] Crear `ProjectModal.astro` con focus-trap y scroll-lock (script inline con data serializada por Astro).
- [x] Crear `FilterBar.astro` con dos grupos (produção, empresa) derivados del JSON.
- [x] `index.astro`: SSR de filtros via `Astro.url.searchParams`, grid renderizado server-side.
- [x] Seed `src/data/projects.json` con las 28 filas del PDF + descripciones existentes.
- [x] Build + dev OK. Filtros `?company=` y `?production=` funcionando (18 cards para Condor, etc.).

### Fase 3 — Datos
- [ ] Crear `src/data/projects.json` con los 15 proyectos actuales de `data.js` como seed.
- [ ] Crear `src/lib/storage.ts` con read/write atómico.
- [ ] Crear `src/lib/projects.ts` con `upsert(id, project)`, `remove(id)`, `replaceAll(projects)`.
- [ ] Crear `src/pages/api/projects.ts` con validación + lock + aplicación de op.
- [ ] Test manual: `curl -X POST` con cada op.

### Fase 4 — Auth
- [ ] Crear `src/lib/auth.ts` (HMAC sign/verify).
- [ ] Crear `src/pages/login.astro` (form con DM Sans, visual coherente).
- [ ] Crear `src/pages/api/login.ts` y `logout.ts`.
- [ ] Crear `src/middleware.ts`.
- [ ] Probar flujo completo: login → cookie → acceso → logout.

### Fase 5 — Integración n8n
- [ ] Configurar workflow n8n con trigger onEdit en el Sheet.
- [ ] Nodo que mapea fila → payload y hace POST a `/api/projects`.
- [ ] Workflow separado: onEdit de `_marked_delete` → Send and Wait → POST delete.
- [ ] Workflow bootstrap: botón manual en Sheet → lee todo → `replace_all`.
- [ ] Smoke test end-to-end: editar una fila, ver cambio en el navegador tras F5.

### Fase 6 — Deploy (VPS propio)
- [ ] `ecosystem.config.cjs` de PM2 con `npm run start` (output del build).
- [ ] Nginx reverse proxy a `localhost:4321` con TLS (Let's Encrypt).
- [ ] `projects.json` vive en `src/data/` dentro del deploy (sin volumen externo).
- [ ] Validar que el seed quedó correcto tras el primer `replace_all` desde n8n.

### Fase 7 — Cleanup
- [ ] Borrar `portfolio.html`, `styles.css`, `js/` del repo activo (ya están en `archive/pre-astro`).
- [ ] Actualizar `README.md` con nuevo flujo dev + deploy.

## 10. Variables de entorno

```
# Auth
ADMIN_USER=admin
ADMIN_PASS=<bcrypt-hash>
AUTH_SECRET=<32+ bytes random>

# Sync
SYNC_SECRET=<32+ bytes random>

# Opcional
SESSION_MAX_AGE=604800   # 7 días
NODE_ENV=production
```

## 11. Riesgos y mitigaciones

| Riesgo | Mitigación |
|---|---|
| Race condition en escrituras concurrentes al JSON | Lock por archivo (`proper-lockfile`) + write-then-rename |
| n8n pierde conexión y queda delete a medio aprobar | Timeout en nodo de aprobación + limpieza de checkbox |
| Cookie robada | `httpOnly`, `secure`, `sameSite=Lax`, expiración corta |
| Sheet mal formado (campo obligatorio vacío) | Validación estricta en endpoint, response 400 con detalle |
| Imagen referenciada en Sheet no existe en `/public/screenshots` | Placeholder SVG embebido en el card cuando `onerror` |
| Sync token filtrado | Rotación trimestral + solo sobre HTTPS |

## 12. Decisiones de infraestructura (cerradas)

- **Hosting:** VPS propio (Node 20 + PM2 + Nginx delante con TLS).
- **Backup:** no se implementa. `src/data/projects.json` vive en disco; si se pierde, se rehace con `op: replace_all` desde la Sheet (fuente de verdad).
- **Telemetría/logs:** sin stack de logs. Solo output nativo de PM2/Node en consola para debugging puntual.
