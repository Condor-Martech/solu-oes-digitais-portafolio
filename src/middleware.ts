import { defineMiddleware } from 'astro:middleware';
import { COOKIE, verifySession } from './lib/auth';

const PUBLIC_PAGES = new Set<string>(['/login']);
const PUBLIC_APIS = new Set<string>(['/api/login', '/api/projects']);

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith('/_astro/') ||
    pathname.startsWith('/screenshots/') ||
    pathname.startsWith('/logos/') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt'
  );
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, cookies, request } = context;
  const pathname = url.pathname;

  const cookie = cookies.get(COOKIE);
  const session = verifySession(cookie?.value);
  if (session) context.locals.user = session.user;

  if (
    PUBLIC_PAGES.has(pathname) ||
    PUBLIC_APIS.has(pathname) ||
    isStaticAsset(pathname)
  ) {
    return next();
  }

  if (session) return next();

  if (pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  const nextUrl = pathname + url.search;
  const accepts = request.headers.get('accept') ?? '';
  if (!accepts.includes('text/html')) {
    return new Response(null, { status: 401 });
  }
  return context.redirect(`/login?next=${encodeURIComponent(nextUrl)}`);
});
