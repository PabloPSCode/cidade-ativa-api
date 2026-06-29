/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import type { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { env } from '../infra/config/env.js';
import { runWithCityContext } from './cityContextStore.js';

export interface RequestWithCity extends Request {
  cityId?: string;
  userId?: string;
}

/**
 * Reads the authenticated user's tenant (cityId) from the Bearer JWT and
 * attaches it to the request as `req.cityId`.
 *
 * It never blocks the request: when there is no token, the token is invalid,
 * or it carries no cityId, the request simply continues with `req.cityId`
 * undefined. Authentication guards (where applied) remain responsible for
 * rejecting unauthenticated access — this middleware only resolves the tenant.
 */
export function cityContextMiddleware(
  req: RequestWithCity,
  _res: Response,
  next: NextFunction,
): void {
  let cityId: string | undefined;
  let userId: string | undefined;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice('Bearer '.length).trim();
    try {
      const publicKey = Buffer.from(env.jwtPublicKey, 'base64');
      const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
      if (typeof payload === 'object' && payload !== null) {
        const claims = payload as jwt.JwtPayload;
        if (typeof claims.cityId === 'string') cityId = claims.cityId;
        // `sub` is the user id — used to rate-limit each user individually.
        if (typeof claims.sub === 'string') userId = claims.sub;
      }
    } catch {
      // Invalid or expired token — leave the tenant context empty.
    }
  }

  // Expose the tenant both on the request (for the @CurrentCityId decorator on
  // listings) and in the async-local context (for getCurrentCityId on creates).
  req.cityId = cityId;
  // Expose the user id for the rate-limiter's per-user tracking.
  req.userId = userId;
  runWithCityContext(cityId, () => next());
}
