import type { Project } from '../types';
import https from 'node:https';

/**
 * Agente para ignorar errores de certificado SSL (útil para Minio con certificados auto-firmados)
 */
const httpsAgent = new https.Agent({
  rejectUnauthorized: false
});

async function fetchRemote(): Promise<Project[] | null> {
  const url = import.meta.env.PROJECTS_URL;
  
  if (!url || url.includes('tu-minio-url.com')) {
    console.error('[storage] ❌ PROJECTS_URL no configurada o es la de ejemplo.');
    return null;
  }

  try {
    const isHttps = url.startsWith('https');
    
    // Configuración de fetch compatible con Node.js SSR
    const fetchOptions: any = { 
      cache: 'no-store',
      headers: {
        'Pragma': 'no-cache',
        'Cache-Control': 'no-cache'
      }
    };

    if (isHttps) {
      fetchOptions.agent = httpsAgent;
    }

    const res = await fetch(url, fetchOptions);

    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    
    // Obtenemos el texto crudo para limpiarlo
    const rawText = await res.text();
    
    // Limpieza robusta: n8n o algunos editores pueden prefijar con '=' o '=='
    const cleanedText = rawText.trim().replace(/^=+/, '');
    
    try {
      let data = JSON.parse(cleanedText);
      
      // Normalización de formatos comunes de n8n/API
      if (!Array.isArray(data) && data.projects && Array.isArray(data.projects)) {
        data = data.projects;
      } 
      else if (Array.isArray(data) && data.length === 1 && data[0].projects) {
        data = data[0].projects;
      }

      if (Array.isArray(data)) {
        console.log(`[storage] 🚀 Sucesso: ${data.length} projetos extraídos do Minio.`);
        return data as Project[];
      }
      
      throw new Error("El contenido no es un array de proyectos válido.");
    } catch (parseErr) {
      console.error('[storage] ❌ Error de parseo. El servidor respondió con algo que no es JSON.');
      console.log('--- INICIO RESPUESTA ---');
      console.log(rawText.substring(0, 500));
      console.log('--- FIN RESPUESTA ---');
      throw new Error(`Erro ao processar JSON: ${parseErr instanceof Error ? parseErr.message : 'Formato inválido'}`);
    }
  } catch (err) {
    console.error(`[storage] ❌ Falha no Minio:`, err instanceof Error ? err.message : err);
    return null;
  }
}

/**
 * Carrega os projetos EXCLUSIVAMENTE do Minio.
 * Sin cache en memoria para evitar datos obsoletos en Lambdas calientes de Vercel.
 */
export async function loadProjects(): Promise<Project[]> {
  const remote = await fetchRemote();
  
  if (!remote || remote.length === 0) {
    const msg = !remote 
      ? "Não foi possível conectar ao Minio ou o JSON é inválido." 
      : "O arquivo no Minio está vazio [ ].";
    throw new Error(`[storage] CRITICAL: ${msg}`);
  }

  return remote;
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
  console.warn('[storage] replaceAllProjects no tiene efecto persistente en modo Minio.');
  return projects.length;
}
