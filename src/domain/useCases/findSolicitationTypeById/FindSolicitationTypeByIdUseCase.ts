import { AppError } from '../../errors/AppError.js';
import { SolicitationTypeResponseDTO } from '../../dtos/SolicitationTypeResponseDTO.js';
import { ISolicitationTypeRepository } from '../../repositories/ISolicitationTypeRepository.js';

export class FindSolicitationTypeByIdUseCase {
  constructor(private readonly repository: ISolicitationTypeRepository) {}

  async execute(id: string): Promise<SolicitationTypeResponseDTO> {
    const solicitationType = await this.repository.findById(id);
    if (!solicitationType) throw new AppError('Solicitation type not found', 404);
    return { id: solicitationType.id, description: solicitationType.description, points: solicitationType.points };
  }
}
