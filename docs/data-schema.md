# Esquema de Datos — LP Hub

Referencia completa de los contratos de datos utilizados en el sistema.

---

## Fuente de Datos

El sistema utiliza una estrategia de **Fetch Remoto en Tiempo Real** sin caché de memoria:

1. **Primaria:** El SSR descarga `projects.json` desde Minio en cada request.
2. **Offline/Dev:** Si `PROJECTS_URL` no está definida, el servidor lanza un error crítico. Para desarrollo sin red, se puede usar `src/data/projects.json` (solo local, no deployable).

El archivo JSON en Minio es la **única fuente de verdad**. Se actualiza automáticamente a través del flujo **Google Sheets → n8n → Minio**.

---

## Interfaz `Project` (Datos crudos)

Definida en `src/types/index.ts`. Es la estructura que vive en Minio y que la API valida.

```typescript
interface Project {
  id: string;          // Identificador único, kebab-case. Ej: "dia-das-maes"
  title: string;       // Nombre visible del proyecto
  company: string;     // Marca/empresa cliente. Ej: "Condor"
  link: string;        // URL completa de producción
  production: Production; // Tipo de gestión (ver tabla abajo)
  status: ProjectStatus;  // Estado actual (ver tabla abajo)
  image: string;       // Ruta pública a la captura: "/screenshots/nombre.png"
  desc: string;        // Descripción. Soporta saltos de línea con \n
  type: ProjectType[]; // Array de categorías. Ej: ["Lp", "Site"]
}
```

---

## Tipos Permitidos

### `Production`

| Valor | Color del Badge | Significado |
|:---|:---|:---|
| `Interno` | Verde | Desarrollado totalmente in-house |
| `Externo` | Slate | Gestión externa general |
| `Terceiro` | Naranja | Desarrollado por un proveedor tercero |
| `Agência` | Rosa | Proyecto de agencia colaboradora |

### `ProjectStatus`

| Valor | Indicador | Significado |
|:---|:---|:---|
| `No ar` | 🟢 Verde pulsante | Sitio activo y accesible |
| `Fora do ar` | 🔴 Rojo | Sitio inactivo o deprecado |

### `ProjectType`

| Valor | Descripción |
|:---|:---|
| `Lp` | Landing page o página promocional única |
| `Software` | Aplicación interactiva o herramienta compleja |
| `Site` | Sitio institucional, blog o portal |

---

## Interfaz `UIProject` (Datos para la UI)

Extendida en `src/types/index.ts`. La genera `view-models.ts` antes de pasar datos a los componentes.

```typescript
interface UIProject extends Project {
  descParagraphs: string[];   // desc dividido por \n en array de párrafos
  theme: {
    company: string;          // Clases CSS de Tailwind para el badge de empresa
    production: string;       // Clases CSS para el badge de producción
    status: string;           // Clases CSS para el indicador de estado
    types: {
      label: string;          // Texto del badge de tipo
      classes: string;        // Clases CSS para ese badge
    }[];
  };
}
```

---

## Mapa de Temas Visuales por Empresa

El sistema asigna automáticamente un color temático basado en `company`. Centralizado en `src/lib/projects.ts`.

| Empresa | Color | Token |
|:---|:---|:---|
| Condor | Azul | `blue` |
| Gigante | Ámbar | `amber` |
| Hipermais | Rojo | `red` |
| Grupo Zonta | Gris | `slate` |
| Shopping | Fucsia | `fuchsia` |
| Receitas da Nonna | Naranja | `orange` |
| Ourofino | Verde | `green` |
| Kellanova | Rosa | `rose` |
| (default) | Azul neutro | `default` |

---

## Ejemplo de Objeto JSON

```json
{
  "id": "mes-da-mulher",
  "title": "Mês da Mulher",
  "company": "Condor",
  "link": "https://campanha.condor.com.br/mes-da-mulher-2025/",
  "production": "Interno",
  "status": "No ar",
  "image": "/screenshots/mesdamulher.png",
  "desc": "Campaña especial del Mes de la Mujer.\nIncluyó sección de sorteo y galería de productos.",
  "type": ["Lp"]
}
```

---

## Validación en la API

El endpoint `src/pages/api/projects.ts` valida estrictamente que `production`, `status` y cada elemento de `type` sean valores del enum correspondiente antes de aceptar un upsert. Cualquier valor fuera del conjunto retorna `400 Bad Request`.
