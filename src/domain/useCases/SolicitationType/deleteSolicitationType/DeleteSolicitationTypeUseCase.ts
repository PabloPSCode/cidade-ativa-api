import { AppError } from '../../../errors/AppError.js';
import { ISolicitationTypeRepository } from '../../../repositories/ISolicitationTypeRepository.js';

export class DeleteSolicitationTypeUseCase {
  constructor(private readonly repository: ISolicitationTypeRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing)
      throw new AppError('Tipo de solicitação não encontrado.', 404);

    const hasLinked = await this.repository.hasLinkedRecords(id);
    if (hasLinked)
      throw new AppError(
        'Não é possível excluir um tipo de solicitação que possui solicitações ou ações legais vinculadas.',
        409,
      );

    await this.repository.delete(id);
  }
}
