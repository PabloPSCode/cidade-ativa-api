import * as bcrypt from 'bcryptjs';
import { AppError } from '../../../errors/AppError.js';
import { CreateUserDTO } from '../../../dtos/CreateUserDTO.js';
import { UserResponseDTO } from '../../../dtos/UserResponseDTO.js';
import { IUserRepository } from '../../../repositories/IUserRepository.js';

export class CreateUserUseCase {
  constructor(private readonly repository: IUserRepository) {}

  async execute(data: CreateUserDTO): Promise<UserResponseDTO> {
    const existing = await this.repository.findByEmail(data.email);
    if (existing)
      throw new AppError(
        'Já existe um usuário cadastrado com este e-mail.',
        409,
      );

    const passwordHash = await bcrypt.hash(data.password, 6);
    const user = await this.repository.create({ ...data, passwordHash });

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
