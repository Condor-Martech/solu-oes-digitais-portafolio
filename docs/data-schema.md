# Esquema de Datos (Project Schema)

Este documento detalla la estructura y los tipos de datos utilizados en el LP Hub.

## Fuente de Datos
A partir de la versión v0.1.0 (Opción C), el sistema utiliza una estrategia de **Fetch en Tiempo Real**:
1. **Primaria:** Consume el JSON desde una URL externa en Minio.
2. **Fallback:** En caso de error de red o URL inválida, utiliza el archivo local `data/projects.json`.


## La Interfaz `Project`

Todos los proyectos deben seguir estrictamente esta interfaz definida en TypeScript:

```typescript
interface Project {
  id: string;          // Identificador único (Kebab-case)
  title: string;       // Nombre visible del proyecto
  company: string;     // Marca/Empresa cliente
  link: string;        // URL directa a la producción
  production: string;  // Tipo de gestión (ver valores permitidos)
  status: string;      // Estado actual (No ar / Fora do ar)
  image: string;       // Ruta a la captura (/screenshots/...)
  desc: string;        // Descripción enriquecida (soporta \n)
  type: string[];      // Array de etiquetas de tipo
}
```

## Valores Permitidos

### 1. Production (`production`)
Indica quién o cómo se gestionó el proyecto. Afecta al color del badge superior en la tarjeta.

| Valor | Color UI | Significado |
| :--- | :--- | :--- |
| `Interno` | Verde | Desarrollado totalmente in-house |
| `Externo` | Slate | Gestión externa general |
| `Terceiro` | Naranja | Desarrollado por un tercer proveedor específico |
| `Agência` | Rosa | Proyecto de agencia colaboradora |

### 2. Project Type (`type`)
Categorización técnica del proyecto.

- `Lp`: Landing Pages o páginas promocionales únicas.
- `Software`: Aplicaciones complejas o herramientas interactivas.
- `Site`: Sitios institucionales o blogs.

## Mapeo de Colores por Marca

El sistema asigna automáticamente un color temático basado en el valor del campo `company`. Esto se define en `src/lib/projects.ts` mediante el `brandColorMap`.

- **Condor:** `blue`
- **Gigante:** `amber`
- **Hipermais:** `red`
- **Grupo Zonta:** `slate`
- **Shopping:** `fuchsia`
- **Receitas da Nonna:** `orange`
- **Ourofino:** `green`
- **Kellanova:** `rose`

## Ejemplo de Datos

```json
{
  "id": "mi-proyecto-premium",
  "title": "Mi Proyecto Premium",
  "company": "Condor",
  "link": "https://proyecto.com",
  "production": "Interno",
  "image": "/screenshots/mi-proyecto.png",
  "desc": "Primera línea de descripción.\nSegunda línea de descripción.",
  "type": ["Software", "Site"]
}
```
