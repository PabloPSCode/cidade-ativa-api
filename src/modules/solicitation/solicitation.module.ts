import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SolicitationController } from '../../infra/controllers/SolicitationController.js';
import { PrismaSolicitationRepository } from '../../infra/database/prisma/PrismaSolicitationRepository.js';
import { PrismaUserRepository } from '../../infra/database/prisma/PrismaUserRepository.js';
import { CreateSolicitationUseCase } from '../../domain/useCases/Solicitation/createSolicitation/CreateSolicitationUseCase.js';
import { DeleteSolicitationUseCase } from '../../domain/useCases/Solicitation/deleteSolicitation/DeleteSolicitationUseCase.js';
import { FindSolicitationByIdUseCase } from '../../domain/useCases/Solicitation/findSolicitationById/FindSolicitationByIdUseCase.js';
import { ListSolicitationsUseCase } from '../../domain/useCases/Solicitation/listSolicitations/ListSolicitationsUseCase.js';
import { SolveSolicitationUseCase } from '../../domain/useCases/Solicitation/solveSolicitation/SolveSolicitationUseCase.js';
import { UpdateSolicitationUseCase } from '../../domain/useCases/Solicitation/updateSolicitation/UpdateSolicitationUseCase.js';
import { JwtUserStrategy } from '../../infra/auth/strategies/JwtUserStrategy.js';
import { FirebaseImageStorageService } from '../../infra/integrations/firebase/FirebaseImageStorageService.js';

@Module({
  imports: [PassportModule],
  controllers: [SolicitationController],
  providers: [
    JwtUserStrategy,
    PrismaSolicitationRepository,
    PrismaUserRepository,
    FirebaseImageStorageService,
    {
      provide: CreateSolicitationUseCase,
      useFactory: (
        sr: PrismaSolicitationRepository,
        ur: PrismaUserRepository,
        is: FirebaseImageStorageService,
      ) => new CreateSolicitationUseCase(sr, ur, is),
      inject: [
        PrismaSolicitationRepository,
        PrismaUserRepository,
        FirebaseImageStorageService,
      ],
    },
    {
      provide: DeleteSolicitationUseCase,
      useFactory: (r: PrismaSolicitationRepository) =>
        new DeleteSolicitationUseCase(r),
      inject: [PrismaSolicitationRepository],
    },
    {
      provide: FindSolicitationByIdUseCase,
      useFactory: (r: PrismaSolicitationRepository) =>
        new FindSolicitationByIdUseCase(r),
      inject: [PrismaSolicitationRepository],
    },
    {
      provide: ListSolicitationsUseCase,
      useFactory: (r: PrismaSolicitationRepository) =>
        new ListSolicitationsUseCase(r),
      inject: [PrismaSolicitationRepository],
    },
    {
      provide: SolveSolicitationUseCase,
      useFactory: (
        r: PrismaSolicitationRepository,
        is: FirebaseImageStorageService,
      ) => new SolveSolicitationUseCase(r, is),
      inject: [PrismaSolicitationRepository, FirebaseImageStorageService],
    },
    {
      provide: UpdateSolicitationUseCase,
      useFactory: (
        r: PrismaSolicitationRepository,
        is: FirebaseImageStorageService,
      ) => new UpdateSolicitationUseCase(r, is),
      inject: [PrismaSolicitationRepository, FirebaseImageStorageService],
    },
  ],
})
export class SolicitationModule {}
