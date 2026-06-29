/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { env } from './infra/config/env.js';
import { AppErrorFilter } from './middlewares/appErrorFilter.js';
import { cityContextMiddleware } from './middlewares/cityContextMiddleware.js';
import { runSeeds } from './infra/seeds/SeedRunner.js';
import { seeds } from './infra/seeds/index.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });

  app.use(require('express').json({ limit: '10mb' }));
  app.use(require('express').urlencoded({ extended: true, limit: '10mb' }));
  app.use(cityContextMiddleware);

  app.useGlobalFilters(new AppErrorFilter());

  // Only the official front-ends may consume this API. Origins can be
  // overridden via the CORS_ORIGINS env var; otherwise these defaults apply.
  const DEFAULT_ALLOWED_ORIGINS = [
    'https://cidadeativaplataforma.plssistemas.com.br',
    'https://cidadeativaadmin.plssistemas.com.br',
  ];
  const allowedOrigins = env.corsOrigins.length
    ? env.corsOrigins
    : DEFAULT_ALLOWED_ORIGINS;
  const isLocalhost = (origin: string): boolean =>
    /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin);

  app.enableCors({
    origin: (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => {
      // No Origin header: non-browser clients (curl, server-to-server,
      // health checks, the Next.js reverse proxy) — always allowed.
      if (!origin) return callback(null, true);

      const normalized = origin.replace(/\/+$/, '');
      const allowed =
        allowedOrigins.includes(normalized) ||
        (env.nodeEnv !== 'production' && isLocalhost(normalized));

      if (allowed) return callback(null, true);
      return callback(new Error(`Origin not allowed by CORS: ${origin}`));
    },
    credentials: true,
  });

  await runSeeds(seeds);

  await app.listen(env.port);

  console.log(`Server running on http://localhost:${env.port}`);
}

bootstrap();
