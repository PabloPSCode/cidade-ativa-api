import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { VoteController } from '../../infra/controllers/VoteController.js';
import { PrismaVoteRepository } from '../../infra/database/prisma/PrismaVoteRepository.js';
import { PrismaUserRepository } from '../../infra/database/prisma/PrismaUserRepository.js';
import { PrismaPollRepository } from '../../infra/database/prisma/PrismaPollRepository.js';
import { CreateVoteUseCase } from '../../domain/useCases/createVote/CreateVoteUseCase.js';
import { UpdateVoteUseCase } from '../../domain/useCases/updateVote/UpdateVoteUseCase.js';
import { DeleteVoteUseCase } from '../../domain/useCases/deleteVote/DeleteVoteUseCase.js';
import { FindVoteByIdUseCase } from '../../domain/useCases/findVoteById/FindVoteByIdUseCase.js';
import { ListVotesUseCase } from '../../domain/useCases/listVotes/ListVotesUseCase.js';
import { JwtUserStrategy } from '../../infra/auth/strategies/JwtUserStrategy.js';

@Module({
  imports: [PassportModule],
  controllers: [VoteController],
  providers: [
    JwtUserStrategy,
    PrismaVoteRepository,
    PrismaUserRepository,
    PrismaPollRepository,
    {
      provide: CreateVoteUseCase,
      useFactory: (
        r: PrismaVoteRepository,
        u: PrismaUserRepository,
        p: PrismaPollRepository,
      ) => new CreateVoteUseCase(r, u, p),
      inject: [PrismaVoteRepository, PrismaUserRepository, PrismaPollRepository],
    },
    {
      provide: UpdateVoteUseCase,
      useFactory: (r: PrismaVoteRepository) => new UpdateVoteUseCase(r),
      inject: [PrismaVoteRepository],
    },
    {
      provide: DeleteVoteUseCase,
      useFactory: (r: PrismaVoteRepository) => new DeleteVoteUseCase(r),
      inject: [PrismaVoteRepository],
    },
    {
      provide: FindVoteByIdUseCase,
      useFactory: (r: PrismaVoteRepository) => new FindVoteByIdUseCase(r),
      inject: [PrismaVoteRepository],
    },
    {
      provide: ListVotesUseCase,
      useFactory: (r: PrismaVoteRepository, p: PrismaPollRepository) =>
        new ListVotesUseCase(r, p),
      inject: [PrismaVoteRepository, PrismaPollRepository],
    },
  ],
})
export class VoteModule {}
