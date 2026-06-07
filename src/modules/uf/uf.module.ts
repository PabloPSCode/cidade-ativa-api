import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UFController } from '../../infra/controllers/UFController.js';
import { PrismaUFRepository } from '../../infra/database/prisma/PrismaUFRepository.js';
import { CreateUFUseCase } from '../../domain/useCases/createUF/CreateUFUseCase.js';
import { UpdateUFUseCase } from '../../domain/useCases/updateUF/UpdateUFUseCase.js';
import { DeleteUFUseCase } from '../../domain/useCases/deleteUF/DeleteUFUseCase.js';
import { FindUFByIdUseCase } from '../../domain/useCases/findUFById/FindUFByIdUseCase.js';
import { ListUFsUseCase } from '../../domain/useCases/listUFs/ListUFsUseCase.js';
import { JwtUserStrategy } from '../../infra/auth/strategies/JwtUserStrategy.js';

@Module({
  imports: [PassportModule],
  controllers: [UFController],
  providers: [
    JwtUserStrategy,
    PrismaUFRepository,
    {
      provide: CreateUFUseCase,
      useFactory: (r: PrismaUFRepository) => new CreateUFUseCase(r),
      inject: [PrismaUFRepository],
    },
    {
      provide: UpdateUFUseCase,
      useFactory: (r: PrismaUFRepository) => new UpdateUFUseCase(r),
      inject: [PrismaUFRepository],
    },
    {
      provide: DeleteUFUseCase,
      useFactory: (r: PrismaUFRepository) => new DeleteUFUseCase(r),
      inject: [PrismaUFRepository],
    },
    {
      provide: FindUFByIdUseCase,
      useFactory: (r: PrismaUFRepository) => new FindUFByIdUseCase(r),
      inject: [PrismaUFRepository],
    },
    {
      provide: ListUFsUseCase,
      useFactory: (r: PrismaUFRepository) => new ListUFsUseCase(r),
      inject: [PrismaUFRepository],
    },
  ],
})
export class UFModule {}
