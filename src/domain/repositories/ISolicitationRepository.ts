import { Solicitation } from '../entities/Solicitation.js';
import { CreateSolicitationDTO } from '../dtos/CreateSolicitationDTO.js';
import { UpdateSolicitationDTO } from '../dtos/UpdateSolicitationDTO.js';
import { PaginationDTO } from '../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../dtos/PaginatedResultDTO.js';

export interface ISolicitationRepository {
  create(data: CreateSolicitationDTO): Promise<Solicitation>;
  findById(id: string): Promise<Solicitation | null>;
  update(id: string, data: UpdateSolicitationDTO): Promise<Solicitation>;
  delete(id: string): Promise<void>;
  list(
    pagination: PaginationDTO,
    filters?: { userId?: string; status?: string },
    cityId?: string,
  ): Promise<PaginatedResultDTO<Solicitation>>;
  countOpenByUser(userId: string): Promise<number>;
}
