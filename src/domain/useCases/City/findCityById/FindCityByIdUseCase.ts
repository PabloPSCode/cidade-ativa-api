import { AppError } from '../../../errors/AppError.js';
import { CityResponseDTO } from '../../../dtos/CityResponseDTO.js';
import { ICityRepository } from '../../../repositories/ICityRepository.js';

export class FindCityByIdUseCase {
  constructor(private readonly repository: ICityRepository) {}

  async execute(id: string): Promise<CityResponseDTO> {
    const city = await this.repository.findById(id);
    if (!city) throw new AppError('Cidade não encontrada.', 404);
    return {
      id: city.id,
      name: city.name,
      uf: city.uf,
      createdAt: city.createdAt,
    };
  }
}
