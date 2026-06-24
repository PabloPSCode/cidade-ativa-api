import { NeighborhoodResponseDTO } from '../../../dtos/NeighborhoodResponseDTO.js';
import { INeighborhoodRepository } from '../../../repositories/INeighborhoodRepository.js';

export class ListNeighborhoodsUseCase {
  constructor(private readonly repository: INeighborhoodRepository) {}

  async execute(cityName?: string): Promise<NeighborhoodResponseDTO[]> {
    const neighborhoods = await this.repository.list(cityName);
    return neighborhoods.map((n) => ({
      id: n.id,
      name: n.name,
      cityName: n.cityName,
    }));
  }
}
