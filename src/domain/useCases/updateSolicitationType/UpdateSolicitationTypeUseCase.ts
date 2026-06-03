import { AppError } from '../../errors/AppError.js';
import { UpdateSolicitationTypeDTO } from '../../dtos/UpdateSolicitationTypeDTO.js';
import { SolicitationTypeResponseDTO } from '../../dtos/SolicitationTypeResponseDTO.js';
import { ISolicitationTypeRepository } from '../../repositories/ISolicitationTypeRepository.js';

export class UpdateSolicitationTypeUseCase {
  constructor(private readonly repository: ISolicitationTypeRepository) {}

  async execute(id: string, data: UpdateSolicitationTypeDTO): Promise<SolicitationTypeResponseDTO> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('Solicitation type not found', 404);

    const updated = await this.repository.update(id, data);
    return { id: updated.id, description: updated.description, points: updated.points };
  }
}
