import { AppError } from '../../errors/AppError.js';
import { CreateUFDTO } from '../../dtos/CreateUFDTO.js';
import { UFResponseDTO } from '../../dtos/UFResponseDTO.js';
import { IUFRepository } from '../../repositories/IUFRepository.js';

export class CreateUFUseCase {
  constructor(private readonly repository: IUFRepository) {}
  async execute(data: CreateUFDTO): Promise<UFResponseDTO> {
    const existing = await this.repository.findByName(data.name);
    if (existing) throw new AppError('UF with this name already exists', 409);
    const uf = await this.repository.create(data);
    return { id: uf.id, name: uf.name };
  }
}
