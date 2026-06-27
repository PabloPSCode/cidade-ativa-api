import { SolicitationSignatureResponseDTO } from '../../../dtos/SolicitationSignatureResponseDTO.js';
import { ISolicitationSignatureRepository } from '../../../repositories/ISolicitationSignatureRepository.js';

export class ListSolicitationSignaturesUseCase {
  constructor(
    private readonly repository: ISolicitationSignatureRepository,
  ) {}

  async execute(
    solicitationId: string,
  ): Promise<SolicitationSignatureResponseDTO[]> {
    const signatures =
      await this.repository.listBySolicitationId(solicitationId);
    return signatures.map((signature) => ({
      id: signature.id,
      imageUrl: signature.imageUrl,
      userName: signature.userName,
      userId: signature.userId,
      solicitationId: signature.solicitationId,
      createdAt: signature.createdAt,
    }));
  }
}
