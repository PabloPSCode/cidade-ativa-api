import { AppError } from '../../../errors/AppError.js';
import { UpdateUserDTO } from '../../../dtos/UpdateUserDTO.js';
import { UserResponseDTO } from '../../../dtos/UserResponseDTO.js';
import { IUserRepository } from '../../../repositories/IUserRepository.js';

export class UpdateUserUseCase {
  constructor(private readonly repository: IUserRepository) {}

  async execute(id: string, data: UpdateUserDTO): Promise<UserResponseDTO> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('Usuário não encontrado.', 404);
    const updated = await this.repository.update(id, data);
    return {
      id: updated.id,
      name: updated.name,
      email: updated.email,
      isCouncilman: updated.isCouncilman,
      isAdmin: updated.isAdmin,
      address: updated.address,
      neighborhood: updated.neighborhood,
      city: updated.city,
      uf: updated.uf,
      createdAt: updated.createdAt,
    };
  }
}
