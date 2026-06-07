import { PaginationDTO } from '../../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../../dtos/PaginatedResultDTO.js';
import { UserResponseDTO } from '../../dtos/UserResponseDTO.js';
import { IUserRepository } from '../../repositories/IUserRepository.js';

export class ListUsersUseCase {
  constructor(private readonly repository: IUserRepository) {}

  async execute(
    pagination: PaginationDTO,
  ): Promise<PaginatedResultDTO<UserResponseDTO>> {
    const result = await this.repository.list(pagination);
    return {
      data: result.data.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        isCouncilman: u.isCouncilman,
        isAdmin: u.isAdmin,
        address: u.address,
        neighborhood: u.neighborhood,
        city: u.city,
        uf: u.uf,
        createdAt: u.createdAt,
      })),
      meta: result.meta,
    };
  }
}
