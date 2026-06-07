import { CoolAction } from '../entities/CoolAction.js';
import { CreateCoolActionDTO } from '../dtos/CreateCoolActionDTO.js';
import { UpdateCoolActionDTO } from '../dtos/UpdateCoolActionDTO.js';
import { PaginationDTO } from '../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../dtos/PaginatedResultDTO.js';

export interface ICoolActionRepository {
  create(data: CreateCoolActionDTO): Promise<CoolAction>;
  findById(id: string): Promise<CoolAction | null>;
  findBySolicitationTypeId(
    solicitationTypeId: string,
  ): Promise<CoolAction | null>;
  update(id: string, data: UpdateCoolActionDTO): Promise<CoolAction>;
  delete(id: string): Promise<void>;
  list(pagination: PaginationDTO): Promise<PaginatedResultDTO<CoolAction>>;
}
