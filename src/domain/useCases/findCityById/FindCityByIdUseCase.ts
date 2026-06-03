import { AppError } from '../../errors/AppError.js';
import { CityResponseDTO } from '../../dtos/CityResponseDTO.js';
import { ICityRepository } from '../../repositories/ICityRepository.js';

export class FindCityByIdUseCase {
  constructor(private readonly repository: ICityRepository) {}
  async execute(id: string): Promise<CityResponseDTO> {
    const city = await this.repository.findById(id);
    if (!city) throw new AppError('City not found', 404);
    return { id: city.id, name: city.name, ufId: city.ufId };
  }
}
