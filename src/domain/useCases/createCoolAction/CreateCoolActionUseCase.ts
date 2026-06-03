import { AppError } from '../../errors/AppError.js';
import { CreateCoolActionDTO } from '../../dtos/CreateCoolActionDTO.js';
import { CoolActionResponseDTO } from '../../dtos/CoolActionResponseDTO.js';
import { ICoolActionRepository } from '../../repositories/ICoolActionRepository.js';

export class CreateCoolActionUseCase {
  constructor(private readonly repository: ICoolActionRepository) {}

  async execute(data: CreateCoolActionDTO): Promise<CoolActionResponseDTO> {
    const existing = await this.repository.findBySolicitationTypeId(data.solicitationTypeId);
    if (existing) throw new AppError('A cool action for this solicitation type already exists', 409);
    const ca = await this.repository.create(data);
    return { id: ca.id, solicitationTypeId: ca.solicitationTypeId, solicitationId: ca.solicitationId, createdAt: ca.createdAt };
  }
}
