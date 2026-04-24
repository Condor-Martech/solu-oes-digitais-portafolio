export type Production = 'Interno' | 'Externo' | 'Terceiro' | 'Agência';
export type ProjectType = 'Lp' | 'Software' | 'Site';
export type ProjectStatus = 'No ar' | 'Fora do ar';
export type FilterGroup = 'all' | 'company' | 'production';
export type ThemeColor = 'blue' | 'amber' | 'red' | 'slate' | 'fuchsia' | 'orange' | 'teal' | 'rose' | 'cyan' | 'green' | 'default';

export interface Project {
  id: string;
  title: string;
  company: string;
  link: string;
  production: Production;
  status: ProjectStatus;
  image: string;
  slide01?: string;
  slide02?: string;
  slide03?: string;
  gallery?: string[];
  desc: string;
  type: ProjectType[];
  companyLogo?: string;
  brandColor?: ThemeColor;
}

export interface ActiveFilter {
  group: FilterGroup;
  value: string;
}

export interface FilterLink {
  label: string;
  count?: number;
  href: string;
  isActive: boolean;
}

export interface UIProject extends Project {
  descParagraphs: string[];
  theme: {
    company: string;
    production: string;
    status: string;
    types: { label: string; classes: string }[];
  };
}
