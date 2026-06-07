import { AppError } from '../../errors/AppError.js';
import { CoolActionResponseDTO } from '../../dtos/CoolActionResponseDTO.js';
import { ICoolActionRepository } from '../../repositories/ICoolActionRepository.js';

export class FindCoolActionByIdUseCase {
  constructor(private readonly repository: ICoolActionRepository) {}

  async execute(id: string): Promise<CoolActionResponseDTO> {
    const ca = await this.repository.findById(id);
    if (!ca) throw new AppError('Cool action not found', 404);
    return {
      id: ca.id,
      solicitationTypeId: ca.solicitationTypeId,
      solicitationId: ca.solicitationId,
      createdAt: ca.createdAt,
    };
  }
}
