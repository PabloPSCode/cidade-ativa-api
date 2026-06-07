/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { env } from './infra/config/env.js';
import { AppErrorFilter } from './middlewares/appErrorFilter.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  app.use(require('express').json({ limit: '10mb' }));
  app.use(require('express').urlencoded({ extended: true, limit: '10mb' }));

  app.useGlobalFilters(new AppErrorFilter());
  app.enableCors();

  await app.listen(env.port);

  console.log(`Server running on http://localhost:${env.port}`);
}

bootstrap();
