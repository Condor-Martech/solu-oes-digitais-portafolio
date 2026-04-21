# Changelog

Todos los cambios notables de este proyecto. Formato: [Keep a Changelog](https://keepachangelog.com/es/1.0.0/).

---

## [0.2.0] — 2026-04-21

### Added
- **Carrusel mobile:** En pantallas < 640px los proyectos se muestran en carrusel horizontal con Scroll Snap y Scroll-Driven Animations (scale + blur al deslizar).
- **`src/components/ui/`:** Librería de primitivos reutilizables: `Badge`, `BaseModal`, `BaseDrawer`, `Icon`.
- **`src/types/index.ts`:** Centralización de todos los tipos e interfaces TypeScript.
- **`src/lib/view-models.ts`:** Capa de transformación `Project → UIProject` con optimización WebP y cálculo de temas.
- **`src/lib/storage.ts`:** Módulo dedicado de fetch remoto sin caché de memoria (datos frescos en cada request SSR).
- **`src/scripts/modal.ts` y `filter.ts`:** Controladores DOM extraídos de los componentes Astro.
- **`src/data/projects.json`:** Snapshot local para desarrollo offline.
- **`llms.txt`:** Mapa de arquitectura para agentes de IA.
- **`docs/ADR-001-pure-ui.md`:** Registro de decisión de arquitectura Pure UI.
- **`CHANGELOG.md`:** Este archivo.

### Changed
- **Arquitectura Pure UI:** Desacoplamiento total de lógica en `FilterBar.astro`, `ProjectCard.astro` y `ProjectModal.astro`. Los componentes son ahora plantillas HTML puras.
- **`storage.ts`:** Eliminado el cache singleton (`mem`) que impedía ver cambios en producción en Lambdas calientes de Vercel.
- **`globals.css`:** Migración de colores a OKLCH (Tailwind v4), nuevos tokens de radio y sombra.
- **`BaseModal.astro`:** Añadido `overflow-hidden` para que la imagen respete los bordes redondeados.
- **`ProjectCard.astro`:** Footer con `line-clamp-2` para altura consistente entre cards, padding reducido.
- **`FilterBar.astro`:** Drawer mobile con `BaseDrawer` en lugar de modal inline.
- **n8n Webhook:** Migración de URL de Test a URL de Producción para activación autónoma.

### Fixed
- **Modal:** Imagen con esquinas rectas que sobresalían del border-radius del contenedor.
- **Carrusel:** Conflicto entre `flex` y `grid` en breakpoint `sm:` (640px) que rompía el layout en tablets.
- **API `/api/projects`:** Faltaba `Externo` en el set de valores permitidos para `production`.
- **API `/api/projects`:** Sin validación para `status` y `type`, permitiendo datos inválidos.
- **Responsividad:** Sin `body { overflow-x: hidden }`, el carrusel causaba scroll horizontal en la página.
- **n8n → Vercel:** Datos no se actualizaban en producción por el cache en memoria de `storage.ts`.

---

## [0.1.0] — 2026-04-15

### Added
- Release inicial del portfolio con cuadrícula de proyectos.
- Sincronización remota vía Minio (S3-compatible).
- Modal de detalle de proyecto con diseño split-screen.
- Filtro por empresa (desktop chips + mobile drawer).
- Deploy en Vercel con adaptador SSR `@astrojs/vercel`.
- Autenticación básica HTTP para panel de gestión.
