import { User } from '../entities/User.js';
import { CreateUserDTO } from '../dtos/CreateUserDTO.js';
import { UpdateUserDTO } from '../dtos/UpdateUserDTO.js';
import { PaginationDTO } from '../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../dtos/PaginatedResultDTO.js';

export interface IUserRepository {
  create(data: CreateUserDTO & { passwordHash: string }): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, data: UpdateUserDTO): Promise<User>;
  delete(id: string): Promise<void>;
  list(pagination: PaginationDTO): Promise<PaginatedResultDTO<User>>;
}
