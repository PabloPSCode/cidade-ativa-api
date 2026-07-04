import { AppError } from '../../../errors/AppError.js';
import { SignatureResponseDTO } from '../../../dtos/SignatureResponseDTO.js';
import { ISignatureRepository } from '../../../repositories/ISignatureRepository.js';

export class FindSignatureByIdUseCase {
  constructor(private readonly repository: ISignatureRepository) {}

  async execute(id: string): Promise<SignatureResponseDTO> {
    const signature = await this.repository.findById(id);
    if (!signature) throw new AppError('Assinatura não encontrada.', 404);
    return {
      id: signature.id,
      imageUrl: signature.imageUrl,
      userName: signature.userName,
      userId: signature.userId,
      solicitationId: signature.solicitationId,
    };
  }
}
