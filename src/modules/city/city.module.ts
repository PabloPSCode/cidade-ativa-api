import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CityController } from '../../infra/controllers/CityController.js';
import { PrismaCityRepository } from '../../infra/database/prisma/PrismaCityRepository.js';
import { CityNeighborhoodsSeeder } from '../../infra/seeds/CityNeighborhoodsSeeder.js';
import { CreateCityUseCase } from '../../domain/useCases/City/createCity/CreateCityUseCase.js';
import { UpdateCityUseCase } from '../../domain/useCases/City/updateCity/UpdateCityUseCase.js';
import { DeleteCityUseCase } from '../../domain/useCases/City/deleteCity/DeleteCityUseCase.js';
import { FindCityByIdUseCase } from '../../domain/useCases/City/findCityById/FindCityByIdUseCase.js';
import { ListCitiesUseCase } from '../../domain/useCases/City/listCities/ListCitiesUseCase.js';
import { JwtUserStrategy } from '../../infra/auth/strategies/JwtUserStrategy.js';

@Module({
  imports: [PassportModule],
  controllers: [CityController],
  providers: [
    JwtUserStrategy,
    PrismaCityRepository,
    CityNeighborhoodsSeeder,
    {
      provide: CreateCityUseCase,
      useFactory: (
        r: PrismaCityRepository,
        seeder: CityNeighborhoodsSeeder,
      ) => new CreateCityUseCase(r, seeder),
      inject: [PrismaCityRepository, CityNeighborhoodsSeeder],
    },
    {
      provide: UpdateCityUseCase,
      useFactory: (r: PrismaCityRepository) => new UpdateCityUseCase(r),
      inject: [PrismaCityRepository],
    },
    {
      provide: DeleteCityUseCase,
      useFactory: (r: PrismaCityRepository) => new DeleteCityUseCase(r),
      inject: [PrismaCityRepository],
    },
    {
      provide: FindCityByIdUseCase,
      useFactory: (r: PrismaCityRepository) => new FindCityByIdUseCase(r),
      inject: [PrismaCityRepository],
    },
    {
      provide: ListCitiesUseCase,
      useFactory: (r: PrismaCityRepository) => new ListCitiesUseCase(r),
      inject: [PrismaCityRepository],
    },
  ],
  exports: [PrismaCityRepository],
})
export class CityModule {}
