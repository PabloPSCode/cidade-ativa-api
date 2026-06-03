import { AppError } from '../../errors/AppError.js';
import { IUFRepository } from '../../repositories/IUFRepository.js';

export class DeleteUFUseCase {
  constructor(private readonly repository: IUFRepository) {}
  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('UF not found', 404);
    const hasCities = await this.repository.hasCities(id);
    if (hasCities) throw new AppError('Cannot delete a UF that has linked cities', 400);
    await this.repository.delete(id);
  }
}
