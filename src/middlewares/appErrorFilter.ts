import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AppError } from '../domain/errors/AppError.js';
import { buildResponse } from '../infra/helpers/apiResponse.js';

@Catch()
export class AppErrorFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const path = request.path ?? '/';

    if (exception instanceof AppError) {
      response.status(exception.statusCode).json(
        buildResponse({
          res: null,
          success: false,
          status: exception.statusCode,
          path,
          message: 'An error occurred.',
          error: exception.message,
        }),
      );
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      const errorMessage =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : (exceptionResponse as { message?: string }).message ?? exception.message;

      response.status(status).json(
        buildResponse({
          res: null,
          success: false,
          status,
          path,
          message: 'An error occurred.',
          error: errorMessage,
        }),
      );
      return;
    }

    console.error(exception);

    response.status(500).json(
      buildResponse({
        res: null,
        success: false,
        status: 500,
        path,
        message: 'Internal server error.',
      }),
    );
  }
}
