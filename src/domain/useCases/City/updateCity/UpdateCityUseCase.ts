import { AppError } from '../../../errors/AppError.js';
import { UpdateCityDTO } from '../../../dtos/UpdateCityDTO.js';
import { CityResponseDTO } from '../../../dtos/CityResponseDTO.js';
import { ICityRepository } from '../../../repositories/ICityRepository.js';

export class UpdateCityUseCase {
  constructor(private readonly repository: ICityRepository) {}

  async execute(id: string, data: UpdateCityDTO): Promise<CityResponseDTO> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('Cidade não encontrada.', 404);

    if (data.name) {
      const duplicate = await this.repository.findByName(data.name);
      if (duplicate && duplicate.id !== id)
        throw new AppError(
          'Já existe uma cidade cadastrada com este nome.',
          409,
        );
    }

    const updated = await this.repository.update(id, data);
    return {
      id: updated.id,
      name: updated.name,
      uf: updated.uf,
      createdAt: updated.createdAt,
    };
  }
}
