import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SolicitationTypeController } from '../../infra/controllers/SolicitationTypeController.js';
import { PrismaSolicitationTypeRepository } from '../../infra/database/prisma/PrismaSolicitationTypeRepository.js';
import { CreateSolicitationTypeUseCase } from '../../domain/useCases/SolicitationType/createSolicitationType/CreateSolicitationTypeUseCase.js';
import { UpdateSolicitationTypeUseCase } from '../../domain/useCases/SolicitationType/updateSolicitationType/UpdateSolicitationTypeUseCase.js';
import { DeleteSolicitationTypeUseCase } from '../../domain/useCases/SolicitationType/deleteSolicitationType/DeleteSolicitationTypeUseCase.js';
import { FindSolicitationTypeByIdUseCase } from '../../domain/useCases/SolicitationType/findSolicitationTypeById/FindSolicitationTypeByIdUseCase.js';
import { ListSolicitationTypesUseCase } from '../../domain/useCases/SolicitationType/listSolicitationTypes/ListSolicitationTypesUseCase.js';
import { JwtUserStrategy } from '../../infra/auth/strategies/JwtUserStrategy.js';

@Module({
  imports: [PassportModule],
  controllers: [SolicitationTypeController],
  providers: [
    JwtUserStrategy,
    PrismaSolicitationTypeRepository,
    {
      provide: CreateSolicitationTypeUseCase,
      useFactory: (r: PrismaSolicitationTypeRepository) =>
        new CreateSolicitationTypeUseCase(r),
      inject: [PrismaSolicitationTypeRepository],
    },
    {
      provide: UpdateSolicitationTypeUseCase,
      useFactory: (r: PrismaSolicitationTypeRepository) =>
        new UpdateSolicitationTypeUseCase(r),
      inject: [PrismaSolicitationTypeRepository],
    },
    {
      provide: DeleteSolicitationTypeUseCase,
      useFactory: (r: PrismaSolicitationTypeRepository) =>
        new DeleteSolicitationTypeUseCase(r),
      inject: [PrismaSolicitationTypeRepository],
    },
    {
      provide: FindSolicitationTypeByIdUseCase,
      useFactory: (r: PrismaSolicitationTypeRepository) =>
        new FindSolicitationTypeByIdUseCase(r),
      inject: [PrismaSolicitationTypeRepository],
    },
    {
      provide: ListSolicitationTypesUseCase,
      useFactory: (r: PrismaSolicitationTypeRepository) =>
        new ListSolicitationTypesUseCase(r),
      inject: [PrismaSolicitationTypeRepository],
    },
  ],
})
export class SolicitationTypeModule {}
