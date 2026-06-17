import { AppError } from '../../errors/AppError.js';
import { IDoneCoolActionRepository } from '../../repositories/IDoneCoolActionRepository.js';

export class DeleteDoneCoolActionUseCase {
  constructor(private readonly repository: IDoneCoolActionRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing)
      throw new AppError('Registro de ação legal não encontrado.', 404);
    await this.repository.delete(id);
  }
}
