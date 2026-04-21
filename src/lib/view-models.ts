import { getImage } from 'astro:assets';
import type { Project, UIProject } from '../types';
import { getBrandColor, getBadgeThemeClasses, descParagraphs } from './projects';

/**
 * Prepara los datos de un proyecto para ser consumidos por la UI.

 */
export async function prepareProjectForUI(p: Project): Promise<UIProject> {
  let optimizedImg = p.image;
  
  if (p.image) {
    try {
      const img = await getImage({
        src: p.image,
        width: 1200,
        height: 675,
        format: 'webp'
      });
      optimizedImg = img.src;
    } catch (e) {
      console.warn(`[View Model] Image optimization failed for ${p.title}:`, e);
    }
  }

  return {
    ...p,
    image: optimizedImg,
    descParagraphs: descParagraphs(p.desc),
    theme: {
      company: getBadgeThemeClasses(getBrandColor(p.company)),
      production: getBadgeThemeClasses(getBrandColor(p.production)),
      status: getBadgeThemeClasses(getBrandColor(p.status)),
      types: (p.type || []).map(t => ({
        label: t,
        classes: getBadgeThemeClasses(getBrandColor(t))
      }))
    }
  };
}

/**
 * Procesa una lista completa de proyectos para la UI.
 */
export async function prepareProjectsForUI(projects: Project[]) {
  return Promise.all(projects.map(prepareProjectForUI));
}

/**
 * Prepara los datos para la barra de filtros.
 */
export function prepareFilterData(projects: Project[]) {
  const companies = Array.from(new Set(projects.map(p => p.company))).sort();
  
  return companies.map(c => ({
    name: c,
    count: projects.filter(p => p.company === c).length
  }));
}
