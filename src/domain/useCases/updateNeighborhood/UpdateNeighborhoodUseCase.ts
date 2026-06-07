import { AppError } from '../../errors/AppError.js';
import { UpdateNeighborhoodDTO } from '../../dtos/UpdateNeighborhoodDTO.js';
import { NeighborhoodResponseDTO } from '../../dtos/NeighborhoodResponseDTO.js';
import { INeighborhoodRepository } from '../../repositories/INeighborhoodRepository.js';

export class UpdateNeighborhoodUseCase {
  constructor(private readonly repository: INeighborhoodRepository) {}
  async execute(
    id: string,
    data: UpdateNeighborhoodDTO,
  ): Promise<NeighborhoodResponseDTO> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('Neighborhood not found', 404);
    const updated = await this.repository.update(id, data);
    return { id: updated.id, name: updated.name, cityId: updated.cityId };
  }
}
