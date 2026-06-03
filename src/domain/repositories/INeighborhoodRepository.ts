import { Neighborhood } from '../entities/Neighborhood.js';
import { CreateNeighborhoodDTO } from '../dtos/CreateNeighborhoodDTO.js';
import { UpdateNeighborhoodDTO } from '../dtos/UpdateNeighborhoodDTO.js';
import { PaginationDTO } from '../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../dtos/PaginatedResultDTO.js';

export interface INeighborhoodRepository {
  create(data: CreateNeighborhoodDTO): Promise<Neighborhood>;
  findById(id: string): Promise<Neighborhood | null>;
  findByNameAndCity(name: string, cityId: string): Promise<Neighborhood | null>;
  update(id: string, data: UpdateNeighborhoodDTO): Promise<Neighborhood>;
  delete(id: string): Promise<void>;
  list(pagination: PaginationDTO, cityId?: string): Promise<PaginatedResultDTO<Neighborhood>>;
}
