import { AppError } from '../../errors/AppError.js';
import { IUserRepository } from '../../repositories/IUserRepository.js';

export class DeleteUserUseCase {
  constructor(private readonly repository: IUserRepository) {}

  async execute(id: string): Promise<void> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('Usuário não encontrado.', 404);
    await this.repository.delete(id);
  }
}
