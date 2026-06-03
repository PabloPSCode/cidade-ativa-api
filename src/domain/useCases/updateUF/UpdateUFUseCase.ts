import { AppError } from '../../errors/AppError.js';
import { UpdateUFDTO } from '../../dtos/UpdateUFDTO.js';
import { UFResponseDTO } from '../../dtos/UFResponseDTO.js';
import { IUFRepository } from '../../repositories/IUFRepository.js';

export class UpdateUFUseCase {
  constructor(private readonly repository: IUFRepository) {}
  async execute(id: string, data: UpdateUFDTO): Promise<UFResponseDTO> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('UF not found', 404);
    const updated = await this.repository.update(id, data);
    return { id: updated.id, name: updated.name };
  }
}
