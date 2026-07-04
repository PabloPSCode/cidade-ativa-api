import { City } from '../entities/City.js';
import { CreateCityDTO } from '../dtos/CreateCityDTO.js';
import { UpdateCityDTO } from '../dtos/UpdateCityDTO.js';
import { PaginationDTO } from '../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../dtos/PaginatedResultDTO.js';

export interface ICityRepository {
  create(data: CreateCityDTO): Promise<City>;
  findById(id: string): Promise<City | null>;
  findByName(name: string): Promise<City | null>;
  update(id: string, data: UpdateCityDTO): Promise<City>;
  delete(id: string): Promise<void>;
  list(pagination: PaginationDTO): Promise<PaginatedResultDTO<City>>;
}
