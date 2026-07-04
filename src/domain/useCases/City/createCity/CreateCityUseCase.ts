import { AppError } from '../../../errors/AppError.js';
import { CreateCityDTO } from '../../../dtos/CreateCityDTO.js';
import { CityResponseDTO } from '../../../dtos/CityResponseDTO.js';
import { ICityRepository } from '../../../repositories/ICityRepository.js';
import { INeighborhoodSeeder } from '../../../services/INeighborhoodSeeder.js';
import { ICityCatalogSeeder } from '../../../services/ICityCatalogSeeder.js';

export class CreateCityUseCase {
  constructor(
    private readonly repository: ICityRepository,
    private readonly neighborhoodSeeder: INeighborhoodSeeder,
    private readonly cityCatalogSeeder: ICityCatalogSeeder,
  ) {}

  async execute(data: CreateCityDTO): Promise<CityResponseDTO> {
    const existing = await this.repository.findByName(data.name);
    if (existing)
      throw new AppError('Já existe uma cidade cadastrada com este nome.', 409);

    const city = await this.repository.create(data);

    // Bootstrap the new city's default catalog (cool actions + public phones).
    // These are fast, local inserts and the seeder is idempotent (skips tables
    // already populated for the city) and never throws, so we await it to
    // guarantee the data exists by the time we respond.
    await this.cityCatalogSeeder.seedForCity(city.id);

    // Neighborhoods come from a slow external lookup, so they seed in the
    // background to avoid blocking — and timing out — the create response. The
    // seeder is idempotent (skips cities that already have neighborhoods) and
    // self-contained (logs failures, never throws).
    void this.neighborhoodSeeder.seedForCity({ id: city.id, name: city.name });

    return {
      id: city.id,
      name: city.name,
      uf: city.uf,
      createdAt: city.createdAt,
    };
  }
}
