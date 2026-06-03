import { AppError } from '../../errors/AppError.js';
import { ISolicitationRepository } from '../../repositories/ISolicitationRepository.js';

export class DeleteSolicitationUseCase {
  constructor(private readonly repository: ISolicitationRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('Solicitation not found', 404);
    await this.repository.delete(id);
  }
}
