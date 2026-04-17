import type { APIRoute } from 'astro';
import {
  validateCredentials,
  signSession,
  cookieString,
  sessionMaxAge,
} from '../../lib/auth';

export const prerender = false;

function safeNext(raw: string): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/';
  return raw;
}

export const POST: APIRoute = async ({ request }) => {
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return new Response('invalid form', { status: 400 });
  }

  const user = String(formData.get('user') ?? '');
  const pass = String(formData.get('pass') ?? '');
  const next = safeNext(String(formData.get('next') ?? '/'));

  let ok = false;
  try {
    ok = validateCredentials(user, pass);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'auth misconfigured';
    return new Response(JSON.stringify({ error: 'config', message }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (!ok) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: `/login?error=1&next=${encodeURIComponent(next)}`,
      },
    });
  }

  const maxAge = sessionMaxAge();
  const token = signSession(user, maxAge);

  return new Response(null, {
    status: 302,
    headers: {
      Location: next,
      'Set-Cookie': cookieString(token, maxAge),
    },
  });
};
