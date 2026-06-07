import { AppError } from '../../errors/AppError.js';
import { CreateCityDTO } from '../../dtos/CreateCityDTO.js';
import { CityResponseDTO } from '../../dtos/CityResponseDTO.js';
import { ICityRepository } from '../../repositories/ICityRepository.js';

export class CreateCityUseCase {
  constructor(private readonly repository: ICityRepository) {}
  async execute(data: CreateCityDTO): Promise<CityResponseDTO> {
    const existing = await this.repository.findByNameAndUF(
      data.name,
      data.ufId,
    );
    if (existing)
      throw new AppError('City with this name already exists in this UF', 409);
    const city = await this.repository.create(data);
    return { id: city.id, name: city.name, ufId: city.ufId };
  }
}
