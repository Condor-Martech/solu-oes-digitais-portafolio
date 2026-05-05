import { defineMiddleware } from 'astro:middleware';
import { verifyBasicAuth } from './lib/auth';

function isStaticAsset(pathname: string): boolean {
  return (
    pathname.startsWith('/_astro/') ||
    pathname.startsWith('/_image') ||
    pathname.startsWith('/screenshots/') ||
    pathname.startsWith('/logos/') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt'
  );
}

export const onRequest = defineMiddleware(async (context, next) => {
  const { url, request } = context;

  if (isStaticAsset(url.pathname)) {
    return next();
  }

  const authHeader = request.headers.get('Authorization');
  if (verifyBasicAuth(authHeader)) {
    return next();
  }

  return new Response('Unauthorized', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="Soluções Digitais Admin"' },
  });
});
