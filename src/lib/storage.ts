import type { Project } from '../types';
import localData from '../data/projects.json';
import https from 'node:https';

let mem: Project[] | null = null;

/**
 * Agente para ignorar errores de certificado SSL (útil para Minio con certificados auto-firmados)
 */
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

async function fetchRemote(): Promise<Project[] | null> {
  // En Astro 5 (Vercel), import.meta.env es la forma correcta de acceder a env vars
  const url = import.meta.env.PROJECTS_URL;
  
  if (!url || url.includes('tu-minio-url.com')) {
    console.warn('[storage] PROJECTS_URL no configurada o es de ejemplo. Saltando fetch remoto.');
    return null;
  }

  try {
    console.log(`[storage] 📡 Intentando fetch desde: ${url}`);
    
    // @ts-ignore - El agente es necesario para Node.js en SSR para saltar SSL inválido
    const res = await fetch(url, { 
      cache: 'no-store',
      // @ts-ignore
      agent: httpsAgent 
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Formato de datos inválido (no es array)');
    return data as Project[];
  } catch (err) {
    console.error(`[storage] ❌ ERROR CRÍTICO FETCH:`, err);
    return null;
  }
}

/**
 * Carga los proyectos. Intenta fetch remoto y cae a los datos locales bundled si falla.
 */
export async function loadProjects(): Promise<Project[]> {
  if (mem) return mem;
  
  const remote = await fetchRemote();
  
  if (!remote || remote.length === 0) {
    throw new Error('[storage] CRITICAL: Fetch remoto falló y el fallback local está desactivado para pruebas.');
  }

  mem = remote;
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
