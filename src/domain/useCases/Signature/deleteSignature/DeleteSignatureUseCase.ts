import { AppError } from '../../../errors/AppError.js';
import { ISignatureRepository } from '../../../repositories/ISignatureRepository.js';

export class DeleteSignatureUseCase {
  constructor(private readonly repository: ISignatureRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('Assinatura não encontrada.', 404);

    await this.repository.delete(id);
  }
}
