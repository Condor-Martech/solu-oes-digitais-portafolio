import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import backupProjects from '../data/projects.json';

const DATA_PATH =
  import.meta.env?.DATA_FILE ??
  join(dirname(fileURLToPath(import.meta.url)), '../../src/data/projects.json');

let mem: Project[] | null = null;
let queue: Promise<unknown> = Promise.resolve();

async function fetchRemote(): Promise<Project[] | null> {
  const url = import.meta.env.PROJECTS_URL;
  if (!url) return null;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()) as Project[];
  } catch (err) {
    console.warn(`[storage] Remote fetch failed:`, err);
    return null;
  }
}

async function ensureLoaded(): Promise<Project[]> {
  if (mem) return mem;

  // 1. Try Remote First (Fetch in Tiempo Real - n8n)
  const remote = await fetchRemote();
  if (remote) {
    mem = remote;
    return mem;
  }

  // 2. Fallback to Bundled Data (Reliable on Vercel)
  try {
    // In dev, we still try to read from disk to support local edits
    if (import.meta.env.DEV) {
      const raw = await readFile(DATA_PATH, 'utf8');
      mem = JSON.parse(raw) as Project[];
    } else {
      mem = backupProjects as Project[];
    }
  } catch (err) {
    // If disk fails or doesn't exist, use the imported backup
    mem = backupProjects as Project[];
  }
  return mem!;
}

async function persist(projects: Project[]): Promise<void> {
  await mkdir(dirname(DATA_PATH), { recursive: true });
  const tmp = `${DATA_PATH}.tmp`;
  await writeFile(tmp, JSON.stringify(projects, null, 2), 'utf8');
  await rename(tmp, DATA_PATH);
}

function serialize<T>(fn: () => Promise<T>): Promise<T> {
  const next = queue.then(fn, fn);
  queue = next.catch(() => {});
  return next;
}

export async function loadProjects(): Promise<Project[]> {
  return ensureLoaded();
}

export async function upsertProject(project: Project): Promise<number> {
  return serialize(async () => {
    const current = await ensureLoaded();
    const idx = current.findIndex((x) => x.id === project.id);
    const next =
      idx === -1
        ? [...current, project]
        : current.map((x, i) => (i === idx ? project : x));
    mem = next;
    await persist(next);
    return next.length;
  });
}

export async function removeProject(id: string): Promise<number> {
  return serialize(async () => {
    const current = await ensureLoaded();
    const next = current.filter((x) => x.id !== id);
    mem = next;
    await persist(next);
    return next.length;
  });
}

export async function replaceAllProjects(projects: Project[]): Promise<number> {
  return serialize(async () => {
    mem = [...projects];
    await persist(mem);
    return mem.length;
  });
}
