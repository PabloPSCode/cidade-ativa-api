import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { DoneCoolActionController } from '../../infra/controllers/DoneCoolActionController.js';
import { PrismaDoneCoolActionRepository } from '../../infra/database/prisma/PrismaDoneCoolActionRepository.js';
import { PrismaUserRepository } from '../../infra/database/prisma/PrismaUserRepository.js';
import { PrismaCoolActionRepository } from '../../infra/database/prisma/PrismaCoolActionRepository.js';
import { CreateDoneCoolActionUseCase } from '../../domain/useCases/DoneCoolAction/createDoneCoolAction/CreateDoneCoolActionUseCase.js';
import { UpdateDoneCoolActionUseCase } from '../../domain/useCases/DoneCoolAction/updateDoneCoolAction/UpdateDoneCoolActionUseCase.js';
import { DeleteDoneCoolActionUseCase } from '../../domain/useCases/DoneCoolAction/deleteDoneCoolAction/DeleteDoneCoolActionUseCase.js';
import { FindDoneCoolActionByIdUseCase } from '../../domain/useCases/DoneCoolAction/findDoneCoolActionById/FindDoneCoolActionByIdUseCase.js';
import { ListDoneCoolActionsUseCase } from '../../domain/useCases/DoneCoolAction/listDoneCoolActions/ListDoneCoolActionsUseCase.js';
import { ListDoneCoolActionsRankingUseCase } from '../../domain/useCases/DoneCoolAction/listDoneCoolActionsRanking/ListDoneCoolActionsRankingUseCase.js';
import { JwtUserStrategy } from '../../infra/auth/strategies/JwtUserStrategy.js';
import { FirebaseImageStorageService } from '../../infra/integrations/firebase/FirebaseImageStorageService.js';

@Module({
  imports: [PassportModule],
  controllers: [DoneCoolActionController],
  providers: [
    JwtUserStrategy,
    PrismaDoneCoolActionRepository,
    PrismaUserRepository,
    PrismaCoolActionRepository,
    FirebaseImageStorageService,
    {
      provide: CreateDoneCoolActionUseCase,
      useFactory: (
        r: PrismaDoneCoolActionRepository,
        u: PrismaUserRepository,
        ca: PrismaCoolActionRepository,
        is: FirebaseImageStorageService,
      ) => new CreateDoneCoolActionUseCase(r, u, ca, is),
      inject: [
        PrismaDoneCoolActionRepository,
        PrismaUserRepository,
        PrismaCoolActionRepository,
        FirebaseImageStorageService,
      ],
    },
    {
      provide: UpdateDoneCoolActionUseCase,
      useFactory: (
        r: PrismaDoneCoolActionRepository,
        is: FirebaseImageStorageService,
      ) => new UpdateDoneCoolActionUseCase(r, is),
      inject: [PrismaDoneCoolActionRepository, FirebaseImageStorageService],
    },
    {
      provide: DeleteDoneCoolActionUseCase,
      useFactory: (r: PrismaDoneCoolActionRepository) =>
        new DeleteDoneCoolActionUseCase(r),
      inject: [PrismaDoneCoolActionRepository],
    },
    {
      provide: FindDoneCoolActionByIdUseCase,
      useFactory: (r: PrismaDoneCoolActionRepository) =>
        new FindDoneCoolActionByIdUseCase(r),
      inject: [PrismaDoneCoolActionRepository],
    },
    {
      provide: ListDoneCoolActionsUseCase,
      useFactory: (r: PrismaDoneCoolActionRepository) =>
        new ListDoneCoolActionsUseCase(r),
      inject: [PrismaDoneCoolActionRepository],
    },
    {
      provide: ListDoneCoolActionsRankingUseCase,
      useFactory: (r: PrismaDoneCoolActionRepository) =>
        new ListDoneCoolActionsRankingUseCase(r),
      inject: [PrismaDoneCoolActionRepository],
    },
  ],
})
export class DoneCoolActionModule {}
