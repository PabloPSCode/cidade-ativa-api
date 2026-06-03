import { AppError } from '../../errors/AppError.js';
import { NeighborhoodResponseDTO } from '../../dtos/NeighborhoodResponseDTO.js';
import { INeighborhoodRepository } from '../../repositories/INeighborhoodRepository.js';

export class FindNeighborhoodByIdUseCase {
  constructor(private readonly repository: INeighborhoodRepository) {}
  async execute(id: string): Promise<NeighborhoodResponseDTO> {
    const n = await this.repository.findById(id);
    if (!n) throw new AppError('Neighborhood not found', 404);
    return { id: n.id, name: n.name, cityId: n.cityId };
  }
}
