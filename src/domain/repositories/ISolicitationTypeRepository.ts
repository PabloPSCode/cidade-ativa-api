import { SolicitationType } from '../entities/SolicitationType.js';
import { CreateSolicitationTypeDTO } from '../dtos/CreateSolicitationTypeDTO.js';
import { UpdateSolicitationTypeDTO } from '../dtos/UpdateSolicitationTypeDTO.js';
import { PaginationDTO } from '../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../dtos/PaginatedResultDTO.js';

export interface ISolicitationTypeRepository {
  create(data: CreateSolicitationTypeDTO): Promise<SolicitationType>;
  findById(id: string): Promise<SolicitationType | null>;
  findByDescription(description: string): Promise<SolicitationType | null>;
  update(id: string, data: UpdateSolicitationTypeDTO): Promise<SolicitationType>;
  delete(id: string): Promise<void>;
  list(pagination: PaginationDTO): Promise<PaginatedResultDTO<SolicitationType>>;
  hasLinkedRecords(id: string): Promise<boolean>;
}
