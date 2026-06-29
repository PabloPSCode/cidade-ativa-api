import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Throttler guard that buckets requests by the authenticated user id when
 * available, falling back to the client IP for anonymous traffic.
 *
 * This matters because the citizen platform calls this API through a Next.js
 * reverse proxy, so every citizen shares the proxy's IP. Keying on the user id
 * (attached by cityContextMiddleware from the JWT) limits each person
 * individually instead of throttling all of them as a single aggregate IP.
 */
@Injectable()
export class UserAwareThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, unknown>): Promise<string> {
    const userId = typeof req.userId === 'string' ? req.userId : undefined;
    const ip = typeof req.ip === 'string' ? req.ip : 'unknown';
    return Promise.resolve(userId ?? ip);
  }
}
