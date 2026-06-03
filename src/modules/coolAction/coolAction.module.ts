import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CoolActionController } from '../../infra/controllers/CoolActionController.js';
import { PrismaCoolActionRepository } from '../../infra/database/prisma/PrismaCoolActionRepository.js';
import { CreateCoolActionUseCase } from '../../domain/useCases/createCoolAction/CreateCoolActionUseCase.js';
import { UpdateCoolActionUseCase } from '../../domain/useCases/updateCoolAction/UpdateCoolActionUseCase.js';
import { DeleteCoolActionUseCase } from '../../domain/useCases/deleteCoolAction/DeleteCoolActionUseCase.js';
import { FindCoolActionByIdUseCase } from '../../domain/useCases/findCoolActionById/FindCoolActionByIdUseCase.js';
import { ListCoolActionsUseCase } from '../../domain/useCases/listCoolActions/ListCoolActionsUseCase.js';
import { JwtUserStrategy } from '../../infra/auth/strategies/JwtUserStrategy.js';

@Module({
  imports: [PassportModule],
  controllers: [CoolActionController],
  providers: [
    JwtUserStrategy,
    PrismaCoolActionRepository,
    { provide: CreateCoolActionUseCase, useFactory: (r: PrismaCoolActionRepository) => new CreateCoolActionUseCase(r), inject: [PrismaCoolActionRepository] },
    { provide: UpdateCoolActionUseCase, useFactory: (r: PrismaCoolActionRepository) => new UpdateCoolActionUseCase(r), inject: [PrismaCoolActionRepository] },
    { provide: DeleteCoolActionUseCase, useFactory: (r: PrismaCoolActionRepository) => new DeleteCoolActionUseCase(r), inject: [PrismaCoolActionRepository] },
    { provide: FindCoolActionByIdUseCase, useFactory: (r: PrismaCoolActionRepository) => new FindCoolActionByIdUseCase(r), inject: [PrismaCoolActionRepository] },
    { provide: ListCoolActionsUseCase, useFactory: (r: PrismaCoolActionRepository) => new ListCoolActionsUseCase(r), inject: [PrismaCoolActionRepository] },
  ],
})
export class CoolActionModule {}
