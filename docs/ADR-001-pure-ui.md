# ADR-001: Arquitectura Pure UI y Desacoplamiento de Lógica

## Status
Accepted

## Context
Los componentes Astro estaban creciendo en complejidad, mezclando lógica de transformación de datos ( View Models), cálculos visuales (UI Helpers) y definiciones de tipos dentro del mismo archivo `.astro`. Esto dificultaba la mantenibilidad, los tests y la reutilización de lógica.

## Decision
Hemos decidido migrar a un patrón de "Pure UI" donde:
1. **Types:** Se centralizan en `src/types/index.ts`.
2. **View Models:** Los datos crudos se preparan antes de llegar al componente en `src/lib/view-models.ts` (ej. optimización de imágenes, formateo de texto).
3. **UI Helpers:** Cálculos de clases CSS, delays de animación y generación de URLs se mueven a `src/lib/ui-helpers.ts`.
4. **Representational Components:** Los archivos `.astro` solo contienen marcado y estilos Tailwind, consumiendo interfaces ya procesadas.

## Consequences
### ✅ Pros
- Código mucho más limpio y legible.
- Lógica de negocio/UI testeable de forma independiente.
- Facilidad para cambiar estilos sin tocar la lógica de datos.
- Desempeño optimizado (SSR carga datos ya listos).

### ❌ Contras
- Incremento inicial en el número de archivos.
- Curva de aprendizaje ligera para entender el flujo de datos.
