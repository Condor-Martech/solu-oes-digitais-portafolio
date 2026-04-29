import type { ActiveFilter, FilterLink } from '../types';

/**
 * Calcula el delay de animación en cascada para las tarjetas.
 */
export function getCardDelay(index: number): number {
  return (index % 20) * 50;
}


/**
 * Genera la lista de objetos pre-procesados para iterar directamente en el FilterBar.
 */
export function buildFilterLinks(
  companiesData: { name: string, count: number }[], 
  active: ActiveFilter
): { all: FilterLink, companies: FilterLink[] } {
  
  // Link "Tudo"
  const all: FilterLink = {
    label: "Tudo",
    href: "/",
    isActive: active.group === 'all'
  };

  // Links de cada marca
  const companies = companiesData.map(c => {
    const params = new URLSearchParams();
    params.set('company', c.name);
    
    return {
      label: c.name,
      count: c.count,
      href: `/?${params.toString()}`,
      isActive: active.group === 'company' && active.value === c.name
    };
  });

  return { all, companies };
}

/**
 * Normaliza a URL da imagem.
 * Se for um caminho relativo (começa com /), adiciona a URL base do Minio.
 */
export function getImageUrl(imagePath: string | undefined | null): string | undefined {
  if (!imagePath || imagePath.trim() === '') {
    return undefined;
  }

  if (imagePath.startsWith('/_astro/')) {
    return imagePath;
  }

  // Si estamos en modo local (sin URL de Minio), respetamos las rutas que empiezan por /
  const projectsUrl = import.meta.env.PROJECTS_URL;
  const isLocalMode = !projectsUrl || projectsUrl.includes('tu-minio-url.com');
  
  if (isLocalMode && imagePath.startsWith('/')) {
    return imagePath;
  }

  const MINIO_BASE = "https://s3.cndr.me/lp-content";

  if (imagePath.startsWith('http')) {
    return imagePath;
  }

  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  const baseUrl = `${MINIO_BASE}/${encodeURI(cleanPath)}`;
  
  // Cache Buster: Cambia cada minuto para asegurar que las actualizaciones se vean pronto
  // sin saturar el servidor con descargas constantes.
  const version = Math.floor(Date.now() / 60000); 
  return `${baseUrl}?v=${version}`;
}
