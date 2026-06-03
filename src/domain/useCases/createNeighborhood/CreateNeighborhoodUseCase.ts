import { AppError } from '../../errors/AppError.js';
import { CreateNeighborhoodDTO } from '../../dtos/CreateNeighborhoodDTO.js';
import { NeighborhoodResponseDTO } from '../../dtos/NeighborhoodResponseDTO.js';
import { INeighborhoodRepository } from '../../repositories/INeighborhoodRepository.js';

export class CreateNeighborhoodUseCase {
  constructor(private readonly repository: INeighborhoodRepository) {}
  async execute(data: CreateNeighborhoodDTO): Promise<NeighborhoodResponseDTO> {
    const existing = await this.repository.findByNameAndCity(data.name, data.cityId);
    if (existing) throw new AppError('Neighborhood with this name already exists in this city', 409);
    const n = await this.repository.create(data);
    return { id: n.id, name: n.name, cityId: n.cityId };
  }
}
