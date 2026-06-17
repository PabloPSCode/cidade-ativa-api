import { AppError } from '../../errors/AppError.js';
import { CreateSolicitationTypeDTO } from '../../dtos/CreateSolicitationTypeDTO.js';
import { SolicitationTypeResponseDTO } from '../../dtos/SolicitationTypeResponseDTO.js';
import { ISolicitationTypeRepository } from '../../repositories/ISolicitationTypeRepository.js';

export class CreateSolicitationTypeUseCase {
  constructor(private readonly repository: ISolicitationTypeRepository) {}

  async execute(
    data: CreateSolicitationTypeDTO,
  ): Promise<SolicitationTypeResponseDTO> {
    const existing = await this.repository.findByDescription(data.description);
    if (existing)
      throw new AppError(
        'Já existe um tipo de solicitação com esta descrição.',
        409,
      );

    const solicitationType = await this.repository.create(data);
    return {
      id: solicitationType.id,
      description: solicitationType.description,
    };
  }
}
