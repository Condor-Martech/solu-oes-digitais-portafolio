import { defineMiddleware } from 'astro:middleware';
import { verifyBasicAuth } from './lib/auth';

const PUBLIC_APIS = new Set<string>(['/api/projects']);

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
  const { url, request } = context;
  const pathname = url.pathname;

  if (PUBLIC_APIS.has(pathname) || isStaticAsset(pathname)) {
    return next();
  }

  const authHeader = request.headers.get('Authorization');
  if (verifyBasicAuth(authHeader)) {
    return next();
  }

  if (pathname.startsWith('/api/')) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  // Trigger basic auth prompt
  return new Response('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="LPHub Admin"' }
  });
});
