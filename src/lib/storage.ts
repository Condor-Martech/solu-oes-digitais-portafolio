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
  const url = import.meta.env.PROJECTS_URL;
  
  if (!url || url.includes('tu-minio-url.com')) {
    return null;
  }

  try {
    const isHttps = url.startsWith('https');
    
    // Configuración de fetch compatible con Node.js SSR
    const fetchOptions: any = { 
      cache: 'no-store'
    };

    if (isHttps) {
      fetchOptions.agent = httpsAgent;
    }

    const res = await fetch(url, fetchOptions);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data as Project[];
  } catch (err) {
    console.error(`[storage] ⚠️ Fetch remoto falhou (Minio):`, err instanceof Error ? err.message : err);
    return null;
  }
}

/**
 * Carrega os projetos. Tenta fetch remoto e usa dados locais se falhar.
 */
export async function loadProjects(): Promise<Project[]> {
  if (mem) return mem;
  
  const remote = await fetchRemote();
  
  if (remote && remote.length > 0) {
    console.log(`[storage] ✅ ${remote.length} projetos carregados via Minio.`);
    mem = remote;
  } else {
    console.warn(`[storage] 💡 Usando dados locais (fallback).`);
    mem = localData as Project[];
  }

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
