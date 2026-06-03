import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { CityController } from '../../infra/controllers/CityController.js';
import { PrismaCityRepository } from '../../infra/database/prisma/PrismaCityRepository.js';
import { CreateCityUseCase } from '../../domain/useCases/createCity/CreateCityUseCase.js';
import { UpdateCityUseCase } from '../../domain/useCases/updateCity/UpdateCityUseCase.js';
import { DeleteCityUseCase } from '../../domain/useCases/deleteCity/DeleteCityUseCase.js';
import { FindCityByIdUseCase } from '../../domain/useCases/findCityById/FindCityByIdUseCase.js';
import { ListCitiesUseCase } from '../../domain/useCases/listCities/ListCitiesUseCase.js';
import { JwtUserStrategy } from '../../infra/auth/strategies/JwtUserStrategy.js';

@Module({
  imports: [PassportModule],
  controllers: [CityController],
  providers: [
    JwtUserStrategy,
    PrismaCityRepository,
    { provide: CreateCityUseCase, useFactory: (r: PrismaCityRepository) => new CreateCityUseCase(r), inject: [PrismaCityRepository] },
    { provide: UpdateCityUseCase, useFactory: (r: PrismaCityRepository) => new UpdateCityUseCase(r), inject: [PrismaCityRepository] },
    { provide: DeleteCityUseCase, useFactory: (r: PrismaCityRepository) => new DeleteCityUseCase(r), inject: [PrismaCityRepository] },
    { provide: FindCityByIdUseCase, useFactory: (r: PrismaCityRepository) => new FindCityByIdUseCase(r), inject: [PrismaCityRepository] },
    { provide: ListCitiesUseCase, useFactory: (r: PrismaCityRepository) => new ListCitiesUseCase(r), inject: [PrismaCityRepository] },
  ],
})
export class CityModule {}
