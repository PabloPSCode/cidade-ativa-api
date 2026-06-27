import { Module } from '@nestjs/common';
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
  providers: [],
})
export class AppModule {}
