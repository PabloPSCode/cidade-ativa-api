import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { VoteOptionController } from '../../infra/controllers/VoteOptionController.js';
import { PrismaVoteOptionRepository } from '../../infra/database/prisma/PrismaVoteOptionRepository.js';
import { PrismaVoteRepository } from '../../infra/database/prisma/PrismaVoteRepository.js';
import { CreateVoteOptionUseCase } from '../../domain/useCases/VoteOption/createVoteOption/CreateVoteOptionUseCase.js';
import { UpdateVoteOptionUseCase } from '../../domain/useCases/VoteOption/updateVoteOption/UpdateVoteOptionUseCase.js';
import { DeleteVoteOptionUseCase } from '../../domain/useCases/VoteOption/deleteVoteOption/DeleteVoteOptionUseCase.js';
import { FindVoteOptionByIdUseCase } from '../../domain/useCases/VoteOption/findVoteOptionById/FindVoteOptionByIdUseCase.js';
import { ListVoteOptionsUseCase } from '../../domain/useCases/VoteOption/listVoteOptions/ListVoteOptionsUseCase.js';
import { JwtUserStrategy } from '../../infra/auth/strategies/JwtUserStrategy.js';

@Module({
  imports: [PassportModule],
  controllers: [VoteOptionController],
  providers: [
    JwtUserStrategy,
    PrismaVoteOptionRepository,
    PrismaVoteRepository,
    {
      provide: CreateVoteOptionUseCase,
      useFactory: (
        r: PrismaVoteOptionRepository,
        v: PrismaVoteRepository,
      ) => new CreateVoteOptionUseCase(r, v),
      inject: [PrismaVoteOptionRepository, PrismaVoteRepository],
    },
    {
      provide: UpdateVoteOptionUseCase,
      useFactory: (r: PrismaVoteOptionRepository) =>
        new UpdateVoteOptionUseCase(r),
      inject: [PrismaVoteOptionRepository],
    },
    {
      provide: DeleteVoteOptionUseCase,
      useFactory: (r: PrismaVoteOptionRepository) =>
        new DeleteVoteOptionUseCase(r),
      inject: [PrismaVoteOptionRepository],
    },
    {
      provide: FindVoteOptionByIdUseCase,
      useFactory: (r: PrismaVoteOptionRepository) =>
        new FindVoteOptionByIdUseCase(r),
      inject: [PrismaVoteOptionRepository],
    },
    {
      provide: ListVoteOptionsUseCase,
      useFactory: (
        r: PrismaVoteOptionRepository,
        v: PrismaVoteRepository,
      ) => new ListVoteOptionsUseCase(r, v),
      inject: [PrismaVoteOptionRepository, PrismaVoteRepository],
    },
  ],
})
export class VoteOptionModule {}
