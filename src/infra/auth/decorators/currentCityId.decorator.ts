import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { RequestWithCity } from '../../../middlewares/cityContextMiddleware.js';

/**
 * Injects the tenant `cityId` resolved by `cityContextMiddleware` from the
 * request. Returns `undefined` when the request carries no tenant context, so
 * handlers must treat it as optional.
 */
export const CurrentCityId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): string | undefined => {
    const request = ctx.switchToHttp().getRequest<RequestWithCity>();
    return request.cityId;
  },
);
