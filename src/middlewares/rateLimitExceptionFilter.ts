import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ThrottlerException } from '@nestjs/throttler';
import type { Request, Response } from 'express';
import { buildResponse } from '../infra/helpers/apiResponse.js';
import { logger } from '../infra/logger/logger.js';

/**
 * Global filter that turns the throttler's raw 429 into the API's standard
 * response envelope with a friendly, user-facing message (pt-BR).
 *
 * Registered as a global filter alongside AppErrorFilter; because it declares
 * the specific ThrottlerException type, it handles rate-limit errors while the
 * catch-all AppErrorFilter keeps handling everything else.
 */
@Catch(ThrottlerException)
export class RateLimitExceptionFilter implements ExceptionFilter {
  catch(_exception: ThrottlerException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const path = request.path ?? '/';
    const status = 429;

    logger.warn({
      module: 'RateLimit',
      action: request.method,
      message: `Rate limit exceeded for ${path}`,
    });

    response.setHeader('Retry-After', '60');
    response.status(status).json(
      buildResponse({
        res: null,
        success: false,
        status,
        path,
        message: 'Muitas requisições em pouco tempo.',
        error:
          'Você atingiu o limite de requisições. Aguarde alguns instantes e tente novamente.',
      }),
    );
  }
}
