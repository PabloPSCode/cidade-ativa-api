import { AppError } from '../../errors/AppError.js';
import { UpdateCityDTO } from '../../dtos/UpdateCityDTO.js';
import { CityResponseDTO } from '../../dtos/CityResponseDTO.js';
import { ICityRepository } from '../../repositories/ICityRepository.js';

export class UpdateCityUseCase {
  constructor(private readonly repository: ICityRepository) {}
  async execute(id: string, data: UpdateCityDTO): Promise<CityResponseDTO> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('City not found', 404);
    const updated = await this.repository.update(id, data);
    return { id: updated.id, name: updated.name, ufId: updated.ufId };
  }
}
