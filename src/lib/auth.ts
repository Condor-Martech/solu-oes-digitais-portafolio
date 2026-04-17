import { timingSafeEqual } from 'node:crypto';

const encoder = new TextEncoder();

export function validateCredentials(user: string, pass: string): boolean {
  const expectedUser = import.meta.env.ADMIN_USER;
  const expectedPass = import.meta.env.ADMIN_PASS;
  if (!expectedUser || !expectedPass) {
    throw new Error('ADMIN_USER/ADMIN_PASS not configured');
  }

  const u1 = encoder.encode(user);
  const u2 = encoder.encode(expectedUser);
  const p1 = encoder.encode(pass);
  const p2 = encoder.encode(expectedPass);

  const userMatch = u1.length === u2.length && timingSafeEqual(u1, u2);
  const passMatch = p1.length === p2.length && timingSafeEqual(p1, p2);

  return userMatch && passMatch;
}

export function verifyBasicAuth(header: string | null): boolean {
  if (!header || !header.toLowerCase().startsWith('basic ')) {
    return false;
  }
  
  try {
    const b64 = header.substring(6);
    const decoded = atob(b64);
    const [user, ...passParts] = decoded.split(':');
    const pass = passParts.join(':');
    return validateCredentials(user, pass);
  } catch {
    return false;
  }
}
