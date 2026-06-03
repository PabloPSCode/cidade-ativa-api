import { Module } from '@nestjs/common';
import { LogModule } from './modules/log/log.module.js';
import { UserModule } from './modules/user/user.module.js';
import { SolicitationTypeModule } from './modules/solicitationType/solicitationType.module.js';
import { PublicPhoneModule } from './modules/publicPhone/publicPhone.module.js';
import { UFModule } from './modules/uf/uf.module.js';
import { CityModule } from './modules/city/city.module.js';
import { NeighborhoodModule } from './modules/neighborhood/neighborhood.module.js';
import { SolicitationModule } from './modules/solicitation/solicitation.module.js';
import { CoolActionModule } from './modules/coolAction/coolAction.module.js';
import { DoneCoolActionModule } from './modules/doneCoolAction/doneCoolAction.module.js';

@Module({
  imports: [
    LogModule,
    UserModule,
    SolicitationTypeModule,
    PublicPhoneModule,
    UFModule,
    CityModule,
    NeighborhoodModule,
    SolicitationModule,
    CoolActionModule,
    DoneCoolActionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
