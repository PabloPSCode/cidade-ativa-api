import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PollController } from '../../infra/controllers/PollController.js';
import { PrismaPollRepository } from '../../infra/database/prisma/PrismaPollRepository.js';
import { CreatePollUseCase } from '../../domain/useCases/Poll/createPoll/CreatePollUseCase.js';
import { UpdatePollUseCase } from '../../domain/useCases/Poll/updatePoll/UpdatePollUseCase.js';
import { DeletePollUseCase } from '../../domain/useCases/Poll/deletePoll/DeletePollUseCase.js';
import { FindPollByIdUseCase } from '../../domain/useCases/Poll/findPollById/FindPollByIdUseCase.js';
import { ListPollsUseCase } from '../../domain/useCases/Poll/listPolls/ListPollsUseCase.js';
import { JwtUserStrategy } from '../../infra/auth/strategies/JwtUserStrategy.js';

@Module({
  imports: [PassportModule],
  controllers: [PollController],
  providers: [
    JwtUserStrategy,
    PrismaPollRepository,
    {
      provide: CreatePollUseCase,
      useFactory: (r: PrismaPollRepository) => new CreatePollUseCase(r),
      inject: [PrismaPollRepository],
    },
    {
      provide: UpdatePollUseCase,
      useFactory: (r: PrismaPollRepository) => new UpdatePollUseCase(r),
      inject: [PrismaPollRepository],
    },
    {
      provide: DeletePollUseCase,
      useFactory: (r: PrismaPollRepository) => new DeletePollUseCase(r),
      inject: [PrismaPollRepository],
    },
    {
      provide: FindPollByIdUseCase,
      useFactory: (r: PrismaPollRepository) => new FindPollByIdUseCase(r),
      inject: [PrismaPollRepository],
    },
    {
      provide: ListPollsUseCase,
      useFactory: (r: PrismaPollRepository) => new ListPollsUseCase(r),
      inject: [PrismaPollRepository],
    },
  ],
})
export class PollModule {}
