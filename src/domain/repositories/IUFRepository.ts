import { UF } from '../entities/UF.js';
import { CreateUFDTO } from '../dtos/CreateUFDTO.js';
import { UpdateUFDTO } from '../dtos/UpdateUFDTO.js';
import { PaginationDTO } from '../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../dtos/PaginatedResultDTO.js';

export interface IUFRepository {
  create(data: CreateUFDTO): Promise<UF>;
  findById(id: string): Promise<UF | null>;
  findByName(name: string): Promise<UF | null>;
  update(id: string, data: UpdateUFDTO): Promise<UF>;
  delete(id: string): Promise<void>;
  list(pagination: PaginationDTO): Promise<PaginatedResultDTO<UF>>;
  hasCities(id: string): Promise<boolean>;
}
