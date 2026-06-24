import { Module } from '@nestjs/common';
import { NeighborhoodController } from '../../infra/controllers/NeighborhoodController.js';
import { PrismaNeighborhoodRepository } from '../../infra/database/prisma/PrismaNeighborhoodRepository.js';
import { ListNeighborhoodsUseCase } from '../../domain/useCases/Neighborhood/listNeighborhoods/ListNeighborhoodsUseCase.js';

@Module({
  controllers: [NeighborhoodController],
  providers: [
    PrismaNeighborhoodRepository,
    {
      provide: ListNeighborhoodsUseCase,
      useFactory: (r: PrismaNeighborhoodRepository) =>
        new ListNeighborhoodsUseCase(r),
      inject: [PrismaNeighborhoodRepository],
    },
  ],
})
export class NeighborhoodModule {}
