import { AppError } from '../../../errors/AppError.js';
import { UpdateCoolActionDTO } from '../../../dtos/UpdateCoolActionDTO.js';
import { CoolActionResponseDTO } from '../../../dtos/CoolActionResponseDTO.js';
import { ICoolActionRepository } from '../../../repositories/ICoolActionRepository.js';

export class UpdateCoolActionUseCase {
  constructor(private readonly repository: ICoolActionRepository) {}

  async execute(
    id: string,
    data: UpdateCoolActionDTO,
  ): Promise<CoolActionResponseDTO> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('Ação legal não encontrada.', 404);
    const ca = await this.repository.update(id, data);
    return {
      id: ca.id,
      title: ca.title,
      category: ca.category,
      points: ca.points,
      createdAt: ca.createdAt,
    };
  }
}
