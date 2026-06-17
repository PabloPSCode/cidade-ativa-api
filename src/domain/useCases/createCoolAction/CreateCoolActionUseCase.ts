import { CreateCoolActionDTO } from '../../dtos/CreateCoolActionDTO.js';
import { CoolActionResponseDTO } from '../../dtos/CoolActionResponseDTO.js';
import { ICoolActionRepository } from '../../repositories/ICoolActionRepository.js';

export class CreateCoolActionUseCase {
  constructor(private readonly repository: ICoolActionRepository) {}

  async execute(data: CreateCoolActionDTO): Promise<CoolActionResponseDTO> {
    const ca = await this.repository.create(data);
    return {
      id: ca.id,
      title: ca.title,
      category: ca.category,
      points: ca.points,
      createdAt: ca.createdAt,
    };
  }
}
