import type { Project } from './projects';

let mem: Project[] | null = null;

async function fetchRemote(): Promise<Project[] | null> {
  // En Astro 5 (Vercel), import.meta.env es la forma correcta de acceder a env vars
  const url = import.meta.env.PROJECTS_URL;
  
  if (!url) {
    console.warn('[storage] PROJECTS_URL no configurada. La web aparecerá vacía.');
    return null;
  }

  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as Project[];
  } catch (err) {
    console.error(`[storage] Error cargando datos desde Minio (${url}):`, err);
    return null;
  }
}

/**
 * Carga los proyectos exclusivamente desde Minio.
 */
export async function loadProjects(): Promise<Project[]> {
  if (mem) return mem;
  const remote = await fetchRemote();
  mem = remote || [];
  return mem;
}

/**
 * Los siguientes métodos están ahora desactivados ya que n8n
 * es el único encargado de modificar el JSON en Minio.
 */
export async function upsertProject(_p: Project): Promise<number> {
  console.warn('[storage] upsertProject desactivado en modo Minio-Only.');
  return 0;
}

export async function removeProject(_id: string): Promise<number> {
  console.warn('[storage] removeProject desactivado en modo Minio-Only.');
  return 0;
}

export async function replaceAllProjects(projects: Project[]): Promise<number> {
  mem = projects;
  return projects.length;
}
