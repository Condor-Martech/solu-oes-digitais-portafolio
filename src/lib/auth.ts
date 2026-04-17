import { createHmac, timingSafeEqual } from 'node:crypto';

export const COOKIE = 'lphub_session';
const DEFAULT_MAX_AGE = 7 * 24 * 3600;

interface Payload {
  user: string;
  exp: number;
}

function base64url(buf: Buffer): string {
  return buf
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

function base64urlDecode(s: string): Buffer {
  const pad = 4 - (s.length % 4);
  const padded = s + (pad < 4 ? '='.repeat(pad) : '');
  return Buffer.from(padded.replace(/-/g, '+').replace(/_/g, '/'), 'base64');
}

function requireAuthSecret(): string {
  const s = process.env.AUTH_SECRET;
  if (!s || s.length < 16) {
    throw new Error('AUTH_SECRET not configured (min 16 chars)');
  }
  return s;
}

function hmac(value: string, secret: string): string {
  return base64url(createHmac('sha256', secret).update(value).digest());
}

export function sessionMaxAge(): number {
  const v = Number(process.env.SESSION_MAX_AGE);
  return Number.isFinite(v) && v > 0 ? v : DEFAULT_MAX_AGE;
}

export function signSession(user: string, maxAgeSeconds: number): string {
  const secret = requireAuthSecret();
  const payload: Payload = {
    user,
    exp: Math.floor(Date.now() / 1000) + maxAgeSeconds,
  };
  const body = base64url(Buffer.from(JSON.stringify(payload)));
  const sig = hmac(body, secret);
  return `${body}.${sig}`;
}

export function verifySession(token: string | null | undefined): Payload | null {
  if (!token) return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;

  let secret: string;
  try {
    secret = requireAuthSecret();
  } catch {
    return null;
  }

  const expected = Buffer.from(hmac(body, secret));
  const given = Buffer.from(sig);
  if (expected.length !== given.length) return null;
  if (!timingSafeEqual(expected, given)) return null;

  let payload: Payload;
  try {
    payload = JSON.parse(base64urlDecode(body).toString('utf8')) as Payload;
  } catch {
    return null;
  }

  if (typeof payload.user !== 'string' || !payload.user) return null;
  if (typeof payload.exp !== 'number') return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;

  return payload;
}

export function cookieString(value: string, maxAgeSeconds: number): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE}=${value}; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=${maxAgeSeconds}`;
}

export function clearCookieString(): string {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  return `${COOKIE}=; HttpOnly${secure}; SameSite=Lax; Path=/; Max-Age=0`;
}

export function validateCredentials(user: string, pass: string): boolean {
  const expectedUser = process.env.ADMIN_USER;
  const expectedPass = process.env.ADMIN_PASS;
  if (!expectedUser || !expectedPass) {
    throw new Error('ADMIN_USER/ADMIN_PASS not configured');
  }

  const u1 = Buffer.from(user);
  const u2 = Buffer.from(expectedUser);
  const p1 = Buffer.from(pass);
  const p2 = Buffer.from(expectedPass);

  const userMatch =
    u1.length === u2.length && timingSafeEqual(u1, u2);
  const passMatch =
    p1.length === p2.length && timingSafeEqual(p1, p2);

  return userMatch && passMatch;
}
