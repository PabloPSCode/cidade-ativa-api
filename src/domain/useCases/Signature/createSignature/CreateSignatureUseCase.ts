import { AppError } from '../../../errors/AppError.js';
import { CreateSignatureDTO } from '../../../dtos/CreateSignatureDTO.js';
import { SignatureResponseDTO } from '../../../dtos/SignatureResponseDTO.js';
import { ISignatureRepository } from '../../../repositories/ISignatureRepository.js';

export class CreateSignatureUseCase {
  constructor(private readonly repository: ISignatureRepository) {}

  async execute(data: CreateSignatureDTO): Promise<SignatureResponseDTO> {
    const existing = await this.repository.findByUserId(data.userId);
    if (existing)
      throw new AppError(
        'Este usuário já possui uma assinatura cadastrada.',
        409,
      );

    const signature = await this.repository.create(data);
    return {
      id: signature.id,
      imageUrl: signature.imageUrl,
      userName: signature.userName,
      userId: signature.userId,
      solicitationId: signature.solicitationId,
    };
  }
}
