# LP Hub — Portfólio 🚀

Portafolio interno premium de sitios y landing pages del equipo. Una aplicación **Astro 5 SSR** diseñada para ofrecer una experiencia visual cinematográfica y una administración automatizada.

## Quick Start

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar entorno
cp .env.example .env.local

# 3. Arrancar en modo desarrollo
npm run dev
```

## Features

- **Visual Inmersivo:** Cuadrícula de 4 columnas de alta densidad (Bento Grid) optimizada para múltiples resoluciones.
- **Pure UI Architecture:** Componentes completamente representacionales y agnósticos con inyección mediante View Models.
- **Modal Cinematográfico:** Visualización split-screen con efectos de **Glassmorphism** (`backdrop-blur-3xl`) e inmersión visual.
- **Sincronización Automatizada:** Gestión de datos remota vía S3 con fallback a caché local (`projects.json`).
- **Optimización Automática:** Transformación WebP al vuelo de imágenes remotas mediante `astro:assets`.

## Configuration

El proyecto requiere las siguientes variables de entorno para funcionar (`.env.local`):

| Variable | Descripción | Default / Ejemplo |
|----------|-------------|---------|
| `ADMIN_USER` | Usuario único para el acceso. | `admin` |
| `ADMIN_PASS` | Contraseña de acceso. | `123` |
| `AUTH_SECRET` | Clave HMAC para la sesión HTTP. | *Generar con openssl* |
| `SYNC_SECRET` | Token de seguridad (`x-sync-token`). | *Token de sincronización* |
| `PROJECTS_URL` | Endpoint remoto JSON (S3/n8n). | `https://s3.../projects.json` |

## Documentation

- [API Sincronización](./docs/sync-architecture.md)
- [Esquema de Datos](./docs/data-schema.md)
- [ADR-001: Arquitectura Pure UI](./docs/ADR-001-pure-ui.md)

## Contributing
1. Todo cambio estructural debe seguir las directrices documentadas en `llms.txt`.
2. Ejecuta `npx astro check` antes de cualquier PR para asegurar consistencia de tipos.

## License

MIT © LP Hub Team.
