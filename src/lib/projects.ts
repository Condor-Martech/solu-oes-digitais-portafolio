import type { Project, ActiveFilter, ThemeColor } from '../types';

export const tagPalette = [
  { bg: '#EDE5DB', fg: '#5A3A1C' },
  { bg: '#E1EAE0', fg: '#2C4F2F' },
  { bg: '#DFE5EE', fg: '#273762' },
  { bg: '#F0E2E2', fg: '#6A2828' },
  { bg: '#ECE4F0', fg: '#472A5E' },
  { bg: '#E2ECEC', fg: '#20494A' },
  { bg: '#EEE7D0', fg: '#57471C' },
  { bg: '#E6E0DA', fg: '#42382D' },
  { bg: '#DAE6ED', fg: '#1C4257' },
  { bg: '#EEE0E8', fg: '#572A43' },
];

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function colorForTag(tag: string) {
  return tagPalette[hash(tag) % tagPalette.length];
}

import { loadProjects } from './storage';

/**
 * Obtiene la lista de proyectos.
 * Delega la lógica de carga (Remote + Fallback Local) a storage.ts
 */
export async function getProjects(): Promise<Project[]> {
  return await loadProjects();
}


export function firstParagraph(desc: string): string {
  return (desc ?? '').split(/\n+/)[0] ?? '';
}

export function descParagraphs(desc: string): string[] {
  return (desc ?? '').split(/\n+/).filter(Boolean);
}



export function parseFilter(searchParams: URLSearchParams): ActiveFilter {
  const company = searchParams.get('company');
  const production = searchParams.get('production');
  if (company) return { group: 'company', value: company };
  if (production) return { group: 'production', value: production };
  return { group: 'all', value: 'Tudo' };
}

export function applyFilter(projects: Project[], filter: ActiveFilter): Project[] {
  if (filter.group === 'all') return projects;
  if (filter.group === 'company') return projects.filter((p) => p.company === filter.value);
  return projects.filter((p) => p.production === filter.value);
}

export function uniqueCompanies(projects: Project[]): string[] {
  return Array.from(new Set(projects.map((p) => p.company))).sort((a, b) => a.localeCompare(b));
}

export function countForCompany(projects: Project[], company: string): number {
  return projects.filter((p) => p.company === company).length;
}



const brandColorMap: Record<string, ThemeColor> = {
  "Condor": "blue",
  "Gigante": "amber",
  "Hipermais": "red",
  "Grupo Zonta": "slate",
  "Shopping": "fuchsia",
  "Hipermais Atacado": "red",
  "Receitas da Nonna": "orange",
  "Pet CãoCurso": "teal",
  "Kellanova": "rose",
  "Condor AutoPosto": "cyan",
  "Ourofino": "green",
  "Interno": "green",
  "Externo": "slate",
  "Lp": "cyan",
  "Software": "fuchsia",
  "Site": "blue",
  "Terceiro": "orange",
  "Agência": "rose",
  "No ar": "green",
  "Fora do ar": "red",
};

const companyLogoMap: Record<string, string> = {
  "Condor": "/logos/Logo-Grande.png",
  "Gigante": "/logos/gigante.png",
  "Hipermais": "/logos/hipermais.png",
  "Grupo Zonta": "/logos/zonta.png",
  "Shopping": "/logos/shopping.png",
  "Hipermais Atacado": "/logos/hipermais.png",
  "Receitas da Nonna": "/logos/receitas-nonna.png",
  "Ourofino": "/logos/ouro-fino-logo-776C6812E5-seeklogo.com.png",
  "Condor AutoPosto": "/logos/Logo-Grande.png",
};

export function getCompanyLogo(company: string): string | null {
  return companyLogoMap[company] || null;
}

export function getBrandColor(company: string): ThemeColor {
  return brandColorMap[company] || 'default';
}

export function getFilterThemeClasses(color: ThemeColor): string {
  const themes: Record<ThemeColor, string> = {
    blue: "border-blue-200 text-blue-700 hover:border-blue-300 hover:bg-blue-50/50 focus-visible:border-blue-500 focus-visible:ring-blue-500 aria-[pressed=true]:bg-blue-600 aria-[pressed=true]:border-blue-600 aria-[pressed=true]:text-white",
    amber: "border-amber-200 text-amber-700 hover:border-amber-300 hover:bg-amber-50/50 focus-visible:border-amber-500 focus-visible:ring-amber-500 aria-[pressed=true]:bg-amber-500 aria-[pressed=true]:border-amber-500 aria-[pressed=true]:text-white",
    red: "border-red-200 text-red-700 hover:border-red-300 hover:bg-red-50/50 focus-visible:border-red-500 focus-visible:ring-red-500 aria-[pressed=true]:bg-red-600 aria-[pressed=true]:border-red-600 aria-[pressed=true]:text-white",
    slate: "border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50/50 focus-visible:border-slate-500 focus-visible:ring-slate-500 aria-[pressed=true]:bg-slate-700 aria-[pressed=true]:border-slate-700 aria-[pressed=true]:text-white",
    fuchsia: "border-fuchsia-200 text-fuchsia-700 hover:border-fuchsia-300 hover:bg-fuchsia-50/50 focus-visible:border-fuchsia-500 focus-visible:ring-fuchsia-500 aria-[pressed=true]:bg-fuchsia-600 aria-[pressed=true]:border-fuchsia-600 aria-[pressed=true]:text-white",
    orange: "border-orange-200 text-orange-700 hover:border-orange-300 hover:bg-orange-50/50 focus-visible:border-orange-500 focus-visible:ring-orange-500 aria-[pressed=true]:bg-orange-600 aria-[pressed=true]:border-orange-600 aria-[pressed=true]:text-white",
    teal: "border-teal-200 text-teal-700 hover:border-teal-300 hover:bg-teal-50/50 focus-visible:border-teal-500 focus-visible:ring-teal-500 aria-[pressed=true]:bg-teal-600 aria-[pressed=true]:border-teal-600 aria-[pressed=true]:text-white",
    rose: "border-rose-200 text-rose-700 hover:border-rose-300 hover:bg-rose-50/50 focus-visible:border-rose-500 focus-visible:ring-rose-500 aria-[pressed=true]:bg-rose-600 aria-[pressed=true]:border-rose-600 aria-[pressed=true]:text-white",
    cyan: "border-cyan-200 text-cyan-700 hover:border-cyan-300 hover:bg-cyan-50/50 focus-visible:border-cyan-500 focus-visible:ring-cyan-500 aria-[pressed=true]:bg-cyan-600 aria-[pressed=true]:border-cyan-600 aria-[pressed=true]:text-white",
    green: "border-green-200 text-green-700 hover:border-green-300 hover:bg-green-50/50 focus-visible:border-green-500 focus-visible:ring-green-500 aria-[pressed=true]:bg-green-600 aria-[pressed=true]:border-green-600 aria-[pressed=true]:text-white",
    default: "border-line text-ink/80 hover:border-line-strong hover:bg-ink/[0.02] focus-visible:border-ink focus-visible:ring-ink aria-[pressed=true]:bg-ink aria-[pressed=true]:border-ink aria-[pressed=true]:text-surface"
  };
  return themes[color] || themes.default;
}

export function getBadgeThemeClasses(color: ThemeColor): string {
  const themes: Record<ThemeColor, string> = {
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-100/60 text-amber-800",
    red: "bg-red-50 text-red-700",
    slate: "bg-slate-100 text-slate-700",
    fuchsia: "bg-fuchsia-50 text-fuchsia-700",
    orange: "bg-orange-50 text-orange-800",
    teal: "bg-teal-50 text-teal-800",
    rose: "bg-rose-50 text-rose-700",
    cyan: "bg-cyan-50 text-cyan-800",
    green: "bg-green-50 text-green-800",
    default: "bg-ink/5 text-ink/80"
  };
  return themes[color] || themes.default;
}
