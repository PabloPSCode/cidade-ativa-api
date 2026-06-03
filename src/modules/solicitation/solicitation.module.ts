import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SolicitationController } from '../../infra/controllers/SolicitationController.js';
import { PrismaSolicitationRepository } from '../../infra/database/prisma/PrismaSolicitationRepository.js';
import { PrismaUserRepository } from '../../infra/database/prisma/PrismaUserRepository.js';
import { CreateSolicitationUseCase } from '../../domain/useCases/createSolicitation/CreateSolicitationUseCase.js';
import { UpdateSolicitationUseCase } from '../../domain/useCases/updateSolicitation/UpdateSolicitationUseCase.js';
import { DeleteSolicitationUseCase } from '../../domain/useCases/deleteSolicitation/DeleteSolicitationUseCase.js';
import { FindSolicitationByIdUseCase } from '../../domain/useCases/findSolicitationById/FindSolicitationByIdUseCase.js';
import { ListSolicitationsUseCase } from '../../domain/useCases/listSolicitations/ListSolicitationsUseCase.js';
import { JwtUserStrategy } from '../../infra/auth/strategies/JwtUserStrategy.js';

@Module({
  imports: [PassportModule],
  controllers: [SolicitationController],
  providers: [
    JwtUserStrategy,
    PrismaSolicitationRepository,
    PrismaUserRepository,
    { provide: CreateSolicitationUseCase, useFactory: (sr: PrismaSolicitationRepository, ur: PrismaUserRepository) => new CreateSolicitationUseCase(sr, ur), inject: [PrismaSolicitationRepository, PrismaUserRepository] },
    { provide: UpdateSolicitationUseCase, useFactory: (r: PrismaSolicitationRepository) => new UpdateSolicitationUseCase(r), inject: [PrismaSolicitationRepository] },
    { provide: DeleteSolicitationUseCase, useFactory: (r: PrismaSolicitationRepository) => new DeleteSolicitationUseCase(r), inject: [PrismaSolicitationRepository] },
    { provide: FindSolicitationByIdUseCase, useFactory: (r: PrismaSolicitationRepository) => new FindSolicitationByIdUseCase(r), inject: [PrismaSolicitationRepository] },
    { provide: ListSolicitationsUseCase, useFactory: (r: PrismaSolicitationRepository) => new ListSolicitationsUseCase(r), inject: [PrismaSolicitationRepository] },
  ],
})
export class SolicitationModule {}
