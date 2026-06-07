import { AppError } from '../../errors/AppError.js';
import { ISolicitationTypeRepository } from '../../repositories/ISolicitationTypeRepository.js';

export class DeleteSolicitationTypeUseCase {
  constructor(private readonly repository: ISolicitationTypeRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('Solicitation type not found', 404);

    const hasLinked = await this.repository.hasLinkedRecords(id);
    if (hasLinked)
      throw new AppError(
        'Cannot delete a solicitation type linked to existing solicitations or cool actions',
        400,
      );

    await this.repository.delete(id);
  }
}
