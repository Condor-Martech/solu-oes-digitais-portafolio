import type { Project, UIProject } from '../types';
import { getBrandColor, getBadgeThemeClasses, descParagraphs } from './projects';
import { getImageUrl } from './ui-helpers';

/**
 * Prepara los datos de un proyecto para ser consumidos por la UI.

 */
export async function prepareProjectForUI(p: Project): Promise<UIProject> {
  let optimizedImg = p.image;
  
  if (p.image) {
    // Usamos la URL directa de Minio sin pasar por el optimizador de Astro
    // para evitar problemas de red o de caché durante el desarrollo.
    optimizedImg = getImageUrl(p.image);
  }
  
  // Construímos a galeria a partir da imagem principal e dos 3 slides vindos do Excel
  const gallerySources = [p.image, p.slide01, p.slide02, p.slide03].filter(Boolean) as string[];
  const optimizedGallery = gallerySources.map((imgSrc) => getImageUrl(imgSrc));

  return {
    ...p,
    image: optimizedImg,
    gallery: optimizedGallery,
    descParagraphs: descParagraphs(p.desc),
    theme: {
      company: getBadgeThemeClasses(getBrandColor(p.company, p)),
      status: getBadgeThemeClasses(getBrandColor(p.status, p)),
      types: (p.type || []).map(t => ({
        label: t,
        classes: getBadgeThemeClasses(getBrandColor(t, p))
      }))
    }
  };
}

/**
 * Procesa una lista completa de proyectos para la UI.
 */
export async function prepareProjectsForUI(projects: Project[]) {
  // Solo procesamos los proyectos que tengan el checkbox (status) marcado como true
  const activeProjects = projects.filter(p => {
    // Google Sheets puede enviar TRUE, "TRUE", true o 1 para los checkboxes
    return p.status === true || p.status === "TRUE" || p.status === 1;
  });
  return Promise.all(activeProjects.map(prepareProjectForUI));
}

/**
 * Prepara los datos para la barra de filtros.
 */
export function prepareFilterData(projects: Project[]) {
  // Solo contamos proyectos activos para los filtros
  const activeProjects = projects.filter(p => p.status === true || p.status === "TRUE" || p.status === 1);
  
  // Extraemos todos los tipos únicos de todos los proyectos activos
  const allTypes = activeProjects.flatMap(p => p.type || []);
  const uniqueTypes = Array.from(new Set(allTypes)).sort();
  
  return uniqueTypes.map(t => ({
    name: t,
    count: activeProjects.filter(p => (p.type || []).includes(t)).length
  }));
}
