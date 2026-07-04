import { SolicitationSignature } from '../entities/SolicitationSignature.js';
import { CreateSolicitationSignatureDTO } from '../dtos/CreateSolicitationSignatureDTO.js';

export interface ISolicitationSignatureRepository {
  create(
    data: CreateSolicitationSignatureDTO,
  ): Promise<SolicitationSignature>;
  findByUserAndSolicitation(
    userId: string,
    solicitationId: string,
  ): Promise<SolicitationSignature | null>;
  listBySolicitationId(
    solicitationId: string,
  ): Promise<SolicitationSignature[]>;
}
