import type { APIRoute } from 'astro';
import type { Project, Production } from '../../lib/projects';
import {
  upsertProject,
  removeProject,
  replaceAllProjects,
} from '../../lib/storage';

export const prerender = false;

const PRODUCTIONS: ReadonlySet<Production> = new Set([
  'Interno',
  'Terceiro',
  'Agência',
]);

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });
}

function isProject(obj: unknown): obj is Project {
  if (!obj || typeof obj !== 'object') return false;
  const o = obj as Record<string, unknown>;
  return (
    typeof o.id === 'string' && o.id.length > 0 &&
    typeof o.title === 'string' && o.title.length > 0 &&
    typeof o.company === 'string' &&
    typeof o.link === 'string' &&
    typeof o.production === 'string' && PRODUCTIONS.has(o.production as Production) &&
    typeof o.image === 'string' &&
    typeof o.desc === 'string'
  );
}

export const POST: APIRoute = async ({ request }) => {
  const expected = process.env.SYNC_SECRET;
  if (!expected) {
    return json({ error: 'SYNC_SECRET not configured' }, 500);
  }

  const token = request.headers.get('x-sync-token');
  if (token !== expected) {
    return json({ error: 'unauthorized' }, 401);
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'invalid json' }, 400);
  }

  if (!body || typeof body !== 'object') {
    return json({ error: 'body must be an object' }, 400);
  }

  const b = body as Record<string, unknown>;
  const op = b.op;

  try {
    if (op === 'upsert') {
      if (!isProject(b.project)) return json({ error: 'invalid project' }, 400);
      const count = await upsertProject(b.project);
      return json({ ok: true, op, count });
    }

    if (op === 'delete') {
      if (typeof b.id !== 'string' || !b.id) {
        return json({ error: 'invalid id' }, 400);
      }
      const count = await removeProject(b.id);
      return json({ ok: true, op, count });
    }

    if (op === 'replace_all') {
      if (!Array.isArray(b.projects)) {
        return json({ error: 'projects must be an array' }, 400);
      }
      for (const p of b.projects) {
        if (!isProject(p)) {
          return json({ error: 'invalid project in array', item: p }, 400);
        }
      }
      const count = await replaceAllProjects(b.projects as Project[]);
      return json({ ok: true, op, count });
    }

    return json({ error: 'unknown op', op }, 400);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'unknown error';
    return json({ error: 'internal', message }, 500);
  }
};
