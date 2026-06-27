import type { NextFunction, Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { env } from '../infra/config/env.js';
import { runWithCityContext } from './cityContextStore.js';

export interface RequestWithCity extends Request {
  cityId?: string;
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

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith('Bearer ')) {
    const token = authHeader.slice('Bearer '.length).trim();
    try {
      const publicKey = Buffer.from(env.jwtPublicKey, 'base64');
      const payload = jwt.verify(token, publicKey, { algorithms: ['RS256'] });
      if (
        typeof payload === 'object' &&
        payload !== null &&
        typeof (payload as jwt.JwtPayload).cityId === 'string'
      ) {
        cityId = (payload as jwt.JwtPayload).cityId as string;
      }
    } catch {
      // Invalid or expired token — leave the tenant context empty.
    }
  }

  // Expose the tenant both on the request (for the @CurrentCityId decorator on
  // listings) and in the async-local context (for getCurrentCityId on creates).
  req.cityId = cityId;
  runWithCityContext(cityId, () => next());
}
