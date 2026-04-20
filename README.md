# LP Hub — Portfólio 🚀

![Status: Production](https://img.shields.io/badge/Status-Production-green?style=flat-square)
![Stack: Astro 5](https://img.shields.io/badge/Stack-Astro%205-blue?style=flat-square)
![Design: Tailwind v4](https://img.shields.io/badge/Design-Tailwind%20v4-38bdf8?style=flat-square)

Portafolio interno premium de sitios y landing pages del equipo. Una aplicación **Astro 5 SSR** diseñada para ofrecer una experiencia visual cinematográfica y una administración automatizada.

---

## ✨ Features Premium

- **Visual Inmersivo:** Cuadrícula de 4 columnas de alta densidad optimizada para laptops (1366x768).
- **Modal Cinematográfico:** Visualización split-screen con efectos de **Glassmorphism** (`backdrop-blur-3xl`) e inmersión visual.
- **Micro-interacciones:** Animaciones fluidas de entrada y feedback táctil en toda la interfaz.
- **Sincronización Automatizada:** Gestión de datos vía **n8n + Google Sheets** sin necesidad de panel de administración manual.

---

## 🚀 Inicio Rápido (< 2 min)

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar entorno
cp .env.example .env.local

# 3. Arrancar en modo desarrollo
npm run dev
```

---

## 📄 Documentación Técnica

Para detalles más profundos, consulta las guías específicas:

- 🏗️ **[Arquitectura de Sincronización](./docs/sync-architecture.md):** Cómo funciona el flujo GSheets → n8n → Astro.
- 📊 **[Esquema de Datos (Schema)](./docs/data-schema.md):** Guía detallada del objeto JSON y tipos de producción permitidos.
- 🎨 **[Sistema de Diseño](./docs/design-system.md):** (Próximamente) Tokens de Tailwind v4 y guías de estilo.

---

## ⚙️ Configuración (.env)

El proyecto requiere las siguientes variables de entorno para funcionar:

| Variable | Uso |
| :--- | :--- |
| `ADMIN_USER` | Usuario único para el acceso al portafolio. |
| `ADMIN_PASS` | Contraseña de acceso. |
| `AUTH_SECRET` | Clave HMAC para la sesión (generar con `openssl rand -hex 32`). |
| `SYNC_SECRET` | Token de seguridad para la sincronización con n8n (`x-sync-token`). |
| `DATA_FILE` | Ruta al archivo JSON (default: `data/projects.json`). |

---

## 📁 Estructura del Proyecto

```text
├── data/
│   └── projects.json       # FUENTE DE VERDAD (Local runtime state)
├── docs/                   # Guías técnicas y arquitectura
├── src/
│   ├── components/         # UI Components (ProjectCard, ProjectModal, etc.)
│   ├── lib/                # Lógica central (Storage, Auth, Tipos)
│   ├── pages/
│   │   ├── index.astro     # View principal (SSR)
│   │   └── api/            # Endpoints de login y sincronización
│   └── styles/             # Tailwind v4 globals
├── public/                 # Assets (Screenshots y Logos)
└── astro.config.mjs
```

---

## 🛠️ Comandos Disponibles

- `npm run dev`: Inicia el servidor de desarrollo en `localhost:4321`.
- `npm run build`: Genera la build SSR optimizada para producción.
- `npm run start`: Arranca el servidor de producción.

---

## ⚖️ Licencia

MIT © 2024 LP Hub Team.
