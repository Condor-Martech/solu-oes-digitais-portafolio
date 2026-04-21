import type { Project } from '../types';
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
    
    // Obtenemos el texto crudo para limpiarlo
    const rawText = await res.text();
    const cleanedText = rawText.trim().replace(/^=/, '');
    
    try {
      const data = JSON.parse(cleanedText);
      return data as Project[];
    } catch (parseErr) {
      throw new Error(`Erro ao processar JSON: ${parseErr instanceof Error ? parseErr.message : 'Formato inválido'}`);
    }
  } catch (err) {
    console.error(`[storage] ❌ Falha no Minio:`, err instanceof Error ? err.message : err);
    return null;
  }
}

/**
 * Carrega os projetos EXCLUSIVAMENTE do Minio.
 * Lança erro fatal se falhar.
 */
export async function loadProjects(): Promise<Project[]> {
  if (mem) return mem;
  
  const remote = await fetchRemote();
  
  if (!remote || remote.length === 0) {
    const msg = !remote 
      ? "Não foi possível conectar ao Minio." 
      : "O arquivo no Minio está vazio [ ].";
    throw new Error(`[storage] CRITICAL: ${msg}`);
  }

  console.log(`[storage] 🚀 Sucesso: ${remote.length} projetos carregados do Minio.`);
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
