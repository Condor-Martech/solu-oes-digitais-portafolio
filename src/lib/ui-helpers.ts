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
