import { Signature } from '../entities/Signature.js';
import { CreateSignatureDTO } from '../dtos/CreateSignatureDTO.js';

export interface ISignatureRepository {
  create(data: CreateSignatureDTO): Promise<Signature>;
  findById(id: string): Promise<Signature | null>;
  findByUserId(userId: string): Promise<Signature | null>;
  delete(id: string): Promise<void>;
}
