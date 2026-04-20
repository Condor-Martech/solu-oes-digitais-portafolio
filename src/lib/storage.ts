import { readFile, writeFile, rename, mkdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Project } from './projects';

const DATA_PATH =
  import.meta.env?.DATA_FILE ??
  join(dirname(fileURLToPath(import.meta.url)), '../../data/projects.json');

let mem: Project[] | null = null; // Forced reload: ${new Date().toISOString()}
let queue: Promise<unknown> = Promise.resolve();

async function ensureLoaded(): Promise<Project[]> {
  if (mem) return mem;
  try {
    const raw = await readFile(DATA_PATH, 'utf8');
    mem = JSON.parse(raw) as Project[];
  } catch (err) {
    const e = err as NodeJS.ErrnoException;
    if (e.code === 'ENOENT') {
      mem = [];
      await persist(mem);
    } else {
      throw err;
    }
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
