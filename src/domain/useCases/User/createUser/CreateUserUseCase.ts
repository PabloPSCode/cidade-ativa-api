import * as bcrypt from 'bcryptjs';
import { AppError } from '../../../errors/AppError.js';
import { CreateUserDTO } from '../../../dtos/CreateUserDTO.js';
import { UserResponseDTO } from '../../../dtos/UserResponseDTO.js';
import { IUserRepository } from '../../../repositories/IUserRepository.js';
import { ICityCatalogSeeder } from '../../../services/ICityCatalogSeeder.js';

export class CreateUserUseCase {
  constructor(
    private readonly repository: IUserRepository,
    private readonly cityCatalogSeeder: ICityCatalogSeeder,
  ) {}

  async execute(data: CreateUserDTO): Promise<UserResponseDTO> {
    const existing = await this.repository.findByEmail(data.email);
    if (existing)
      throw new AppError(
        'Já existe um usuário cadastrado com este e-mail.',
        409,
      );

    const passwordHash = await bcrypt.hash(data.password, 6);
    const user = await this.repository.create({ ...data, passwordHash });

    // When a city's admin is created, bootstrap that city's default catalog
    // (cool actions + public phones). Idempotent per table: it skips tables
    // that already have records for the city, so data is never duplicated.
    if (user.isAdmin) {
      await this.cityCatalogSeeder.seedForCity(user.cityId);
    }

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
