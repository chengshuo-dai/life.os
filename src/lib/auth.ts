import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'life-os-development-secret-key-change-in-production'
);

const JWT_EXPIRATION = '7d';

export interface JWTPayload {
  sub: string;
  iat: number;
  exp: number;
}

/**
 * Create a JWT for a given user ID.
 */
export async function createToken(userId: string): Promise<string> {
  const token = await new SignJWT({ sub: userId })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(JWT_EXPIRATION)
    .sign(JWT_SECRET);

  return token;
}

/**
 * Verify a JWT and return the payload.
 * Returns null if invalid or expired.
 */
export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Extract user ID from request headers.
 * Used in API routes after middleware has verified the token.
 */
export function getUserIdFromHeaders(headers: Headers): string | null {
  return headers.get('x-user-id');
}

/**
 * Verify the JWT from the Authorization header and return the user ID.
 * Use this in API route handlers for direct JWT verification.
 * Returns null if the token is missing or invalid.
 */
export async function getUserIdFromRequest(
  request: Request
): Promise<string | null> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.split(' ')[1];
  const payload = await verifyToken(token);

  if (!payload) {
    return null;
  }

  return payload.sub;
}
