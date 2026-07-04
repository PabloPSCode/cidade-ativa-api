import { Throttle } from '@nestjs/throttler';

const MINUTE = 60_000;

/**
 * Per-request-type rate limits (window in ms + max requests in that window).
 * Limits are enforced per authenticated user, falling back to client IP for
 * anonymous traffic (see UserAwareThrottlerGuard).
 *
 * - `default`: applied globally to every route (mostly reads / light writes).
 * - `auth`: strict, to blunt credential brute-force and account enumeration.
 * - `upload`: routes that accept base64 images (decode + Firebase upload),
 *   which are the most expensive requests this API serves.
 */
export const RATE_LIMITS = {
  default: { ttl: MINUTE, limit: 100 },
  auth: { ttl: MINUTE, limit: 5 },
  write: { ttl: MINUTE, limit: 20 },
  upload: { ttl: MINUTE, limit: 10 },
} as const;

/** Strict limit for authentication / account-creation endpoints. */
export const AuthThrottle = () => Throttle({ default: RATE_LIMITS.auth });

/** Moderate limit for plain mutations (create/delete) without image payloads. */
export const WriteThrottle = () => Throttle({ default: RATE_LIMITS.write });

/** Tighter limit for endpoints that receive image payloads. */
export const UploadThrottle = () => Throttle({ default: RATE_LIMITS.upload });
