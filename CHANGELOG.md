# Changelog

## [Unreleased]

### Added
- Nuevo componente maestro `Icon.astro` para centralizar todos los SVGs.
- Archivo `llms.txt` para optimización de agentes de IA.
- Documentación ADR-001 para la arquitectura del sistema.

### Changed
- **Refactorización Pure UI**: Desacoplamiento total de lógica en `FilterBar.astro`, `ProjectCard.astro` y `ProjectModal.astro`.
- **Modularización de Tipos**: Migración de todas las interfaces a `src/types/index.ts`.
- **UI Helpers**: Movida la lógica de Bento Grid y Animation Delays a librerías externas.
- **View Models**: Centralizada la preparación de datos y optimización de imágenes en `view-models.ts`.

### Fixed
- Error de validación en la API de proyectos que rechazaba erróneamente la categoría 'Externo'.
- Falta de validación estricta para campos `status` y `type` en el endpoint de sincronización.
