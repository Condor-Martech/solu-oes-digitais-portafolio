# ADR-001: Arquitectura Pure UI y Desacoplamiento de Lógica

## Status
`Accepted` — Implementado en v0.2.0

---

## Context

Los componentes `.astro` crecieron en complejidad mezclando responsabilidades: lógica de transformación de datos (view models), cálculos visuales (clases CSS, delays), definiciones de tipos y scripts de cliente en el mismo archivo. Esto dificultaba la mantenibilidad, el testing y la reutilización de lógica entre componentes.

---

## Decision

Migramos a un patrón **Pure UI** con separación estricta de capas:

### Capas del Sistema

```
[Minio / S3]
     ↓  JSON crudo
[src/lib/storage.ts]       → Fetch remoto, sin caché
     ↓  Project[]
[src/lib/projects.ts]      → Filtrado, parsing, paleta de colores
     ↓  Project[]
[src/lib/view-models.ts]   → Transformación → UIProject (WebP, temas, párrafos)
     ↓  UIProject[]
[src/components/*.astro]   → Renderizado HTML puro (SOLO plantillas)
     ↓  HTML
[src/scripts/*.ts]         → Interactividad DOM en cliente (modal, drawer)
```

### Reglas de la Arquitectura

1. **`src/types/index.ts`** — Único lugar para interfaces y tipos TypeScript. Nadie más los define.
2. **`src/lib/view-models.ts`** — Prepara `Project → UIProject`: optimización WebP, cálculo de clases de tema, formateo de texto.
3. **`src/lib/ui-helpers.ts`** — Cálculos CSS puros: delays de animación, generación de hrefs de filtro.
4. **`src/components/*.astro`** — Solo reciben `UIProject` (ya procesado). Cero lógica de negocio.
5. **`src/scripts/*.ts`** — Controladores DOM puros. Gestionan interactividad del modal y el drawer de filtros.
6. **`src/data/projects.json`** — Solo para desarrollo local offline. No se usa en producción.

---

## Consequences

### ✅ Beneficios

- **Componentes predecibles:** Un `.astro` con las mismas props siempre genera el mismo HTML. Fácil de razonar.
- **Lógica testeable:** Las funciones en `view-models.ts` y `ui-helpers.ts` son funciones puras importables con Jest/Vitest.
- **Separación de estilos y datos:** Cambiar el sistema de temas (colores, badges) no requiere tocar componentes.
- **Performance SSR:** Los datos llegan pre-procesados al template; no hay trabajo en el render path.

### ⚠️ Trade-offs

- Más archivos en `src/lib/` para un proyecto que podría ser más simple.
- El flujo de datos es indirecto: `Page → view-model → component` en lugar de `Page → component`. Requiere entender la cadena.

---

## Referencias

- `src/types/index.ts` — Contratos de datos
- `src/lib/view-models.ts` — Transformación de datos
- `src/lib/ui-helpers.ts` — Helpers visuales
- `src/scripts/modal.ts` — Controlador de interactividad
