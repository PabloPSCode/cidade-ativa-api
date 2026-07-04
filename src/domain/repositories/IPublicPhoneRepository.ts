import { PublicPhone } from '../entities/PublicPhone.js';
import { CreatePublicPhoneDTO } from '../dtos/CreatePublicPhoneDTO.js';
import { UpdatePublicPhoneDTO } from '../dtos/UpdatePublicPhoneDTO.js';
import { PaginationDTO } from '../dtos/PaginationDTO.js';
import { PaginatedResultDTO } from '../dtos/PaginatedResultDTO.js';

export interface IPublicPhoneRepository {
  create(data: CreatePublicPhoneDTO): Promise<PublicPhone>;
  findById(id: string): Promise<PublicPhone | null>;
  findByPhone(phone: string): Promise<PublicPhone | null>;
  update(id: string, data: UpdatePublicPhoneDTO): Promise<PublicPhone>;
  delete(id: string): Promise<void>;
  list(
    pagination: PaginationDTO,
    cityId?: string,
  ): Promise<PaginatedResultDTO<PublicPhone>>;
}
