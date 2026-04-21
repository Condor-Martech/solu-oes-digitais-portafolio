# LP Hub — Resumen de Producto

> **Para:** Product Owner, Stakeholders, Equipo No Técnico  
> **Versión:** 2.0 — Abril 2026

---

## ¿Qué es LP Hub?

LP Hub es el **portafolio digital interno del equipo**. Es una página web privada que centraliza y exhibe todos los sitios web y landing pages que el equipo ha producido.

Sirve como:
- **Vitrina interna** para ver de un vistazo todos los proyectos del equipo.
- **Herramienta de consulta** para saber qué está "en el aire" y qué está fuera.
- **Referencia visual** con capturas de pantalla y links directos a cada proyecto.

---

## ¿Cómo se ve?

La pantalla principal muestra las tarjetas de los proyectos en una cuadrícula. Cada tarjeta tiene:

- 📸 **Captura del proyecto**
- 🏷️ **Nombre y empresa cliente**
- 🟢 / 🔴 **Indicador de estado** (En el aire / Fuera del aire)
- 🔖 **Badges de tipo** (LP, Software, Site) y producción (Interno, Externo...)

Al hacer clic en una tarjeta se abre un **panel de detalle** con descripción completa y link directo al proyecto.

En **celulares**, los proyectos se presentan en un **carrusel horizontal** deslizable.

Los proyectos se pueden **filtrar por empresa** (Condor, Gigante, Hipermais, etc.) usando la barra de filtros.

---

## ¿Cómo se actualiza?

> **El equipo técnico NO necesita publicar una nueva versión del sitio para agregar o editar un proyecto.**

El flujo es completamente automático:

```
1. Alguien edita o agrega un proyecto en Google Sheets
           ↓
2. Hace clic en el botón "Sincronizar" de la planilla
           ↓
3. n8n (el automatizador) recibe el cambio
           ↓
4. n8n guarda el proyecto actualizado en el servidor de archivos (Minio)
           ↓
5. El sitio web muestra el cambio de forma inmediata (sin redeploy)
```

**No hace falta tocar código. La planilla de Google Sheets actúa como el CMS.**

---

## ¿Qué información tiene cada proyecto?

| Campo | Qué es | Ejemplo |
|---|---|---|
| **Nombre** | Título visible del proyecto | "Mês da Mulher" |
| **Empresa** | Cliente o marca | "Condor" |
| **Link** | URL del sitio en producción | https://campanha.condor... |
| **Tipo** | Categoría del proyecto | LP, Site, Software |
| **Producción** | Quién lo desarrolló | Interno, Externo, Terceiro |
| **Estado** | Si el sitio sigue activo | No ar / Fora do ar |
| **Descripción** | Texto libre sobre el proyecto | "Campaña de Día de la Mujer..." |
| **Imagen** | Captura de pantalla del sitio | (ruta al archivo) |

---

## ¿Dónde está alojado?

| Componente | Plataforma | Rol |
|---|---|---|
| **Sitio web** | Vercel | Hosting del portafolio. Disponible 24/7. |
| **Datos** | Minio (servidor interno) | Almacena el listado de proyectos en formato JSON. |
| **Automatización** | n8n (servidor interno) | Recibe cambios y actualiza Minio. |
| **Fuente de edición** | Google Sheets | CMS del equipo (donde se editan los proyectos). |

---

## ¿Quién puede hacer qué?

| Rol | Puede |
|---|---|
| **Cualquier persona del equipo** | Ver el portafolio en el navegador |
| **Editor de la planilla** | Agregar, editar o marcar proyectos como "Fora do ar" |
| **Desarrollador** | Modificar el diseño, agregar funcionalidades, gestionar el deploy |

---

## Estado actual (v2.0)

✅ **Funcionando en producción**

| Funcionalidad | Estado |
|---|---|
| Visualización de proyectos | ✅ Activo |
| Filtro por empresa | ✅ Activo |
| Modal de detalle | ✅ Activo |
| Carrusel en celular | ✅ Activo |
| Sincronización automática desde Google Sheets | ✅ Activo |
| Imágenes optimizadas (WebP) | ✅ Activo |
| Diseño responsive (celular, tablet, desktop) | ✅ Activo |

---

## Preguntas frecuentes

**¿Cuándo aparece un proyecto nuevo luego de cargarlo en Sheets?**  
De forma inmediata (en segundos) después de hacer clic en "Sincronizar".

**¿Qué pasa si el sitio de un proyecto se da de baja?**  
Solo hay que cambiar su estado a `Fora do ar` en la planilla y sincronizar. El badge rojo aparecerá automáticamente.

**¿El sitio funciona en celular?**  
Sí. En móvil los proyectos se muestran en un carrusel horizontal. El diseño está optimizado para todos los tamaños de pantalla.

**¿Hay que pedirle a IT para agregar proyectos?**  
No. Cualquier persona con acceso a la planilla de Google Sheets puede hacerlo de forma autónoma.

**¿Dónde están las imágenes de los proyectos?**  
Las capturas de pantalla se almacenan en el servidor de archivos interno (Minio). El equipo de desarrollo es responsable de subir las imágenes nuevas.

---

## Contacto y soporte

Para cambios en el diseño, nuevas funcionalidades o problemas técnicos, contactar al equipo de desarrollo.

Para agregar o editar proyectos, usar la [planilla de Google Sheets](#) directamente.
