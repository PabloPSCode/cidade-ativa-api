import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import type { ZodSchema } from 'zod/v4';

export class ZodValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodSchema) {}

  transform(value: unknown, metadata: ArgumentMetadata) {
    if (metadata.type !== 'body') return value;

    const result = this.schema.safeParse(value);

    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};

      for (const issue of result.error.issues) {
        const path = issue.path.join('.');

        if (!fieldErrors[path]) {
          fieldErrors[path] = [];
        }

        fieldErrors[path].push(issue.message);
      }

      throw new BadRequestException({
        message: 'Validation error',
        errors: { fieldErrors },
      });
    }

    return result.data;
  }
}
