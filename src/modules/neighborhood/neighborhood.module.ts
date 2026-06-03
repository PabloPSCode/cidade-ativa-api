import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { NeighborhoodController } from '../../infra/controllers/NeighborhoodController.js';
import { PrismaNeighborhoodRepository } from '../../infra/database/prisma/PrismaNeighborhoodRepository.js';
import { CreateNeighborhoodUseCase } from '../../domain/useCases/createNeighborhood/CreateNeighborhoodUseCase.js';
import { UpdateNeighborhoodUseCase } from '../../domain/useCases/updateNeighborhood/UpdateNeighborhoodUseCase.js';
import { DeleteNeighborhoodUseCase } from '../../domain/useCases/deleteNeighborhood/DeleteNeighborhoodUseCase.js';
import { FindNeighborhoodByIdUseCase } from '../../domain/useCases/findNeighborhoodById/FindNeighborhoodByIdUseCase.js';
import { ListNeighborhoodsUseCase } from '../../domain/useCases/listNeighborhoods/ListNeighborhoodsUseCase.js';
import { JwtUserStrategy } from '../../infra/auth/strategies/JwtUserStrategy.js';

@Module({
  imports: [PassportModule],
  controllers: [NeighborhoodController],
  providers: [
    JwtUserStrategy,
    PrismaNeighborhoodRepository,
    { provide: CreateNeighborhoodUseCase, useFactory: (r: PrismaNeighborhoodRepository) => new CreateNeighborhoodUseCase(r), inject: [PrismaNeighborhoodRepository] },
    { provide: UpdateNeighborhoodUseCase, useFactory: (r: PrismaNeighborhoodRepository) => new UpdateNeighborhoodUseCase(r), inject: [PrismaNeighborhoodRepository] },
    { provide: DeleteNeighborhoodUseCase, useFactory: (r: PrismaNeighborhoodRepository) => new DeleteNeighborhoodUseCase(r), inject: [PrismaNeighborhoodRepository] },
    { provide: FindNeighborhoodByIdUseCase, useFactory: (r: PrismaNeighborhoodRepository) => new FindNeighborhoodByIdUseCase(r), inject: [PrismaNeighborhoodRepository] },
    { provide: ListNeighborhoodsUseCase, useFactory: (r: PrismaNeighborhoodRepository) => new ListNeighborhoodsUseCase(r), inject: [PrismaNeighborhoodRepository] },
  ],
})
export class NeighborhoodModule {}
