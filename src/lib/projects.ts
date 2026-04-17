export type Production = 'Interno' | 'Terceiro' | 'Agência';

export interface Project {
  id: string;
  title: string;
  company: string;
  link: string;
  production: Production;
  image: string;
  desc: string;
}

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

export { loadProjects as getProjects } from './storage';

export function firstParagraph(desc: string): string {
  return (desc ?? '').split(/\n+/)[0] ?? '';
}

export function descParagraphs(desc: string): string[] {
  return (desc ?? '').split(/\n+/).filter(Boolean);
}

export type FilterGroup = 'all' | 'company' | 'production';

export interface ActiveFilter {
  group: FilterGroup;
  value: string;
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

export function uniqueProductions(projects: Project[]): string[] {
  return Array.from(new Set(projects.map((p) => p.production))).sort((a, b) => a.localeCompare(b));
}

export function countForCompany(projects: Project[], company: string): number {
  return projects.filter((p) => p.company === company).length;
}

export function countForProduction(projects: Project[], production: string): number {
  return projects.filter((p) => p.production === production).length;
}
