/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Controller, Get, INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { Throttle, ThrottlerModule } from '@nestjs/throttler';
import request from 'supertest';
import { AppError } from '../../domain/errors/AppError.js';
import { AppErrorFilter } from '../../middlewares/appErrorFilter.js';
import { RateLimitExceptionFilter } from '../../middlewares/rateLimitExceptionFilter.js';
import { UserAwareThrottlerGuard } from './UserAwareThrottlerGuard.js';

@Controller()
class TestController {
  @Get('limited')
  @Throttle({ default: { limit: 2, ttl: 60_000 } })
  limited() {
    return { ok: true };
  }

  @Get('boom')
  boom() {
    throw new AppError('Algo deu errado.', 422);
  }
}

describe('Rate limiting (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }])],
      controllers: [TestController],
      providers: [{ provide: APP_GUARD, useClass: UserAwareThrottlerGuard }],
    }).compile();

    app = moduleRef.createNestApplication();
    // Same registration order as main.ts: catch-all first, specific 429 last.
    app.useGlobalFilters(new AppErrorFilter(), new RateLimitExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('returns the friendly envelope with 429 once the limit is exceeded', async () => {
    const server = app.getHttpServer();

    await request(server).get('/limited').expect(200);
    await request(server).get('/limited').expect(200);

    const blocked = await request(server).get('/limited').expect(429);

    expect(blocked.headers['retry-after']).toBe('60');
    expect(blocked.body.SUCCESS).toBe(false);
    expect(blocked.body.STATUS).toBe(429);
    expect(blocked.body.MSG.message).toBe('Muitas requisições em pouco tempo.');
    expect(blocked.body.MSG.error).toContain('limite de requisições');
  });

  it('still routes non-throttle errors through the catch-all AppErrorFilter', async () => {
    const res = await request(app.getHttpServer()).get('/boom').expect(422);
    expect(res.body.SUCCESS).toBe(false);
    expect(res.body.STATUS).toBe(422);
    expect(res.body.MSG.error).toBe('Algo deu errado.');
  });
});
