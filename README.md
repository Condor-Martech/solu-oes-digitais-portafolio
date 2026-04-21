# LP Hub — Portfólio

Portafolio interno de sitios y landing pages del equipo. Aplicación **Astro 5 SSR** deployada en Vercel con datos gestionados remotamente a través de Minio (S3-compatible) y automatización vía n8n.

---

## Quick Start

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar variables de entorno
cp .env.local.example .env.local
# → Editar .env.local con tus credenciales

# 3. Arrancar servidor de desarrollo
npm run dev
# → http://localhost:4321
```

## Variables de Entorno

| Variable | Requerida | Descripción | Ejemplo |
|---|---|---|---|
| `PROJECTS_URL` | ✅ | URL pública del JSON de proyectos en Minio | `https://minio.cndr.me/lp-content/projects.json` |
| `ADMIN_USER` | ✅ | Usuario para acceso al panel | `admin` |
| `ADMIN_PASS` | ✅ | Contraseña de acceso | —  |
| `AUTH_SECRET` | ✅ | Clave HMAC para sesión HTTP | Generar: `openssl rand -hex 32` |
| `SYNC_SECRET` | ✅ | Token enviado en `x-sync-token` por n8n | — |

> **Nota:** Sin `PROJECTS_URL` configurada, el servidor lanzará un error crítico al iniciar. No hay fallback en producción.

## Flujo de Datos

```
Google Sheets → n8n Webhook → MinIO (S3) → Vercel SSR → Usuario
```

1. **Google Sheets** actúa como CMS. Un script de Apps Script llama al Webhook de n8n al editar.
2. **n8n** ejecuta el upsert del proyecto en el JSON y lo sube al bucket `lp-content/projects.json` en Minio.
3. **Vercel (SSR)** descarga el JSON en cada request sin cache de memoria, siempre mostrando datos frescos.

## Comandos

```bash
npm run dev       # Servidor de desarrollo con HMR
npm run build     # Build de producción (Vercel lo ejecuta automáticamente)
npx astro check   # Verificación de tipos TypeScript
```

## Estructura del Proyecto

```
src/
├── types/index.ts        # 📐 Contratos de datos (interfaces TS)
├── lib/
│   ├── storage.ts        # 🗄️  Fetch remoto del JSON (Minio) — sin cache
│   ├── projects.ts       # 🔧 Lógica de filtrado, paleta de colores
│   ├── view-models.ts    # 🎨 Transformación de datos → UI (WebP, temas)
│   └── ui-helpers.ts     # 💅 Clases CSS, delays de animación
├── components/
│   ├── ui/               # Componentes primitivos (Badge, Modal, Drawer, Icon)
│   ├── ProjectCard.astro # Card representacional pura
│   ├── ProjectModal.astro# Modal con datos del proyecto
│   └── FilterBar.astro   # Barra de filtros (desktop + mobile drawer)
├── scripts/
│   ├── modal.ts          # Controlador del modal (DOM)
│   └── filter.ts         # Controlador del drawer de filtros (DOM)
├── pages/
│   ├── index.astro       # Página principal
│   └── api/projects.ts   # Endpoint SSR para sincronización
└── data/projects.json    # ⚠️  Sólo para desarrollo local offline
```

## Arquitectura

El proyecto sigue el patrón **Pure UI**. Los componentes `.astro` son plantillas HTML puras sin lógica de negocio. Ver [ADR-001](./docs/ADR-001-pure-ui.md) para el detalle de la decisión.

## Documentación

- [📋 Resumen de Producto (PO)](./docs/product-overview.md) — Qué es, cómo funciona, para stakeholders
- [Esquema de Datos](./docs/data-schema.md) — Interfaces y valores permitidos
- [ADR-001: Pure UI](./docs/ADR-001-pure-ui.md) — Decisión de arquitectura
- [CHANGELOG](./CHANGELOG.md) — Historial de versiones

## Contributing

1. Todos los tipos van en `src/types/index.ts`.
2. La lógica de transformación va en `src/lib/view-models.ts`.
3. Los componentes `.astro` solo reciben `UIProject` — nunca `Project` crudo (excepto `index.astro` y `FilterBar`).
4. Ejecuta `npx astro check` antes de cualquier PR.

## License

MIT © LP Hub Team
