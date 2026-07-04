import { AppError } from '../../../errors/AppError.js';
import { ICityRepository } from '../../../repositories/ICityRepository.js';

export class DeleteCityUseCase {
  constructor(private readonly repository: ICityRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('Cidade não encontrada.', 404);

    await this.repository.delete(id);
  }
}
