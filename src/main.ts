import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { AppErrorFilter } from './middlewares/appErrorFilter.js';
import { env } from './infra/config/env.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalFilters(new AppErrorFilter());
  app.enableCors();

  await app.listen(env.port);

  console.log(`Server running on http://localhost:${env.port}`);
}

bootstrap();
