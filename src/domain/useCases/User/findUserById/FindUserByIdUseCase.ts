import { AppError } from '../../../errors/AppError.js';
import { UserResponseDTO } from '../../../dtos/UserResponseDTO.js';
import { IUserRepository } from '../../../repositories/IUserRepository.js';

export class FindUserByIdUseCase {
  constructor(private readonly repository: IUserRepository) {}

  async execute(id: string): Promise<UserResponseDTO> {
    const user = await this.repository.findById(id);
    if (!user) throw new AppError('Usuário não encontrado.', 404);
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      isCouncilman: user.isCouncilman,
      isAdmin: user.isAdmin,
      address: user.address,
      neighborhood: user.neighborhood,
      city: user.city,
      uf: user.uf,
      createdAt: user.createdAt,
    };
  }
}
