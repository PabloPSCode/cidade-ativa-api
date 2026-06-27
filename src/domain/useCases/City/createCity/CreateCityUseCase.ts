import { AppError } from '../../../errors/AppError.js';
import { CreateCityDTO } from '../../../dtos/CreateCityDTO.js';
import { CityResponseDTO } from '../../../dtos/CityResponseDTO.js';
import { ICityRepository } from '../../../repositories/ICityRepository.js';
import { INeighborhoodSeeder } from '../../../services/INeighborhoodSeeder.js';

export class CreateCityUseCase {
  constructor(
    private readonly repository: ICityRepository,
    private readonly neighborhoodSeeder: INeighborhoodSeeder,
  ) {}

  async execute(data: CreateCityDTO): Promise<CityResponseDTO> {
    const existing = await this.repository.findByName(data.name);
    if (existing)
      throw new AppError('Já existe uma cidade cadastrada com este nome.', 409);

    const city = await this.repository.create(data);

    // Populate the new city's neighborhoods from its name in the background.
    // The external lookup can be slow, so awaiting it here would block — and
    // time out — the create response. The seeder is idempotent (skips cities
    // that already have neighborhoods) and self-contained (logs failures,
    // never throws), so it is safe to leave running after we respond.
    void this.neighborhoodSeeder.seedForCity({ id: city.id, name: city.name });

    return {
      id: city.id,
      name: city.name,
      uf: city.uf,
      createdAt: city.createdAt,
    };
  }
}
