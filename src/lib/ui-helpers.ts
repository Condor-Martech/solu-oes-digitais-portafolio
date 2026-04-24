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

  // Si Astro ya optimizó la imagen (empieza por /_astro/), la devolvemos tal cual
  if (imagePath.startsWith('/_astro/')) {
    return imagePath;
  }

  // URL MAESTRA DE TU MINIO
  const MINIO_BASE = "https://s3.cndr.me/lp-content";

  // Si ya es una URL completa, la respetamos pero le añadimos el cache buster
  if (imagePath.startsWith('http')) {
    const separator = imagePath.includes('?') ? '&' : '?';
    return `${imagePath}${separator}v=${new Date().getTime()}`;
  }

  // Limpiamos el path (quitamos la barra inicial si existe)
  const cleanPath = imagePath.startsWith('/') ? imagePath.substring(1) : imagePath;
  
  // Codificamos el path para manejar espacios y caracteres especiales
  const encodedPath = encodeURI(cleanPath);
  
  // Retornamos la URL con el cache buster basado en milisegundos
  return `${MINIO_BASE}/${encodedPath}?v=${new Date().getTime()}`;
}
