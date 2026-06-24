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

@Module({
  imports: [PassportModule],
  controllers: [DoneCoolActionController],
  providers: [
    JwtUserStrategy,
    PrismaDoneCoolActionRepository,
    PrismaUserRepository,
    PrismaCoolActionRepository,
    {
      provide: CreateDoneCoolActionUseCase,
      useFactory: (
        r: PrismaDoneCoolActionRepository,
        u: PrismaUserRepository,
        ca: PrismaCoolActionRepository,
      ) => new CreateDoneCoolActionUseCase(r, u, ca),
      inject: [
        PrismaDoneCoolActionRepository,
        PrismaUserRepository,
        PrismaCoolActionRepository,
      ],
    },
    {
      provide: UpdateDoneCoolActionUseCase,
      useFactory: (r: PrismaDoneCoolActionRepository) =>
        new UpdateDoneCoolActionUseCase(r),
      inject: [PrismaDoneCoolActionRepository],
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
