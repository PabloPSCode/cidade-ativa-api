import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import { RATE_LIMITS } from './infra/rateLimit/throttleTiers.js';
import { UserAwareThrottlerGuard } from './infra/rateLimit/UserAwareThrottlerGuard.js';
import { CityModule } from './modules/city/city.module.js';
import { CoolActionModule } from './modules/coolAction/coolAction.module.js';
import { DoneCoolActionModule } from './modules/doneCoolAction/doneCoolAction.module.js';
import { LogModule } from './modules/log/log.module.js';
import { NeighborhoodModule } from './modules/neighborhood/neighborhood.module.js';
import { PollModule } from './modules/poll/poll.module.js';
import { PublicPhoneModule } from './modules/publicPhone/publicPhone.module.js';
import { SignatureModule } from './modules/signature/signature.module.js';
import { SolicitationModule } from './modules/solicitation/solicitation.module.js';
import { SolicitationTypeModule } from './modules/solicitationType/solicitationType.module.js';
import { UserModule } from './modules/user/user.module.js';
import { VoteModule } from './modules/vote/vote.module.js';
import { VoteOptionModule } from './modules/voteOption/voteOption.module.js';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      { ttl: RATE_LIMITS.default.ttl, limit: RATE_LIMITS.default.limit },
    ]),
    CityModule,
    CoolActionModule,
    DoneCoolActionModule,
    LogModule,
    NeighborhoodModule,
    PollModule,
    PublicPhoneModule,
    SignatureModule,
    SolicitationModule,
    SolicitationTypeModule,
    UserModule,
    VoteModule,
    VoteOptionModule,
  ],
  controllers: [],
  providers: [{ provide: APP_GUARD, useClass: UserAwareThrottlerGuard }],
})
export class AppModule {}
