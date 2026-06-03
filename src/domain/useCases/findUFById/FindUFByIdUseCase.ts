import { AppError } from '../../errors/AppError.js';
import { UFResponseDTO } from '../../dtos/UFResponseDTO.js';
import { IUFRepository } from '../../repositories/IUFRepository.js';

export class FindUFByIdUseCase {
  constructor(private readonly repository: IUFRepository) {}
  async execute(id: string): Promise<UFResponseDTO> {
    const uf = await this.repository.findById(id);
    if (!uf) throw new AppError('UF not found', 404);
    return { id: uf.id, name: uf.name };
  }
}
