import { AppError } from '../../../errors/AppError.js';
import { SolicitationSignatureResponseDTO } from '../../../dtos/SolicitationSignatureResponseDTO.js';
import { ISolicitationSignatureRepository } from '../../../repositories/ISolicitationSignatureRepository.js';
import { ISignatureRepository } from '../../../repositories/ISignatureRepository.js';

interface CreateSolicitationSignatureInput {
  userId: string;
  solicitationId: string;
}

export class CreateSolicitationSignatureUseCase {
  constructor(
    private readonly repository: ISolicitationSignatureRepository,
    private readonly signatureRepository: ISignatureRepository,
  ) {}

  async execute(
    data: CreateSolicitationSignatureInput,
  ): Promise<SolicitationSignatureResponseDTO> {
    // O usuário precisa ter uma assinatura registrada (no perfil) para assinar.
    const registered = await this.signatureRepository.findByUserId(data.userId);
    if (!registered)
      throw new AppError(
        'Cadastre uma assinatura no seu perfil antes de assinar uma solicitação.',
        400,
      );

    const already = await this.repository.findByUserAndSolicitation(
      data.userId,
      data.solicitationId,
    );
    if (already)
      throw new AppError('Você já assinou esta solicitação.', 409);

    const signature = await this.repository.create({
      userId: data.userId,
      userName: registered.userName,
      imageUrl: registered.imageUrl,
      solicitationId: data.solicitationId,
    });

    return {
      id: signature.id,
      imageUrl: signature.imageUrl,
      userName: signature.userName,
      userId: signature.userId,
      solicitationId: signature.solicitationId,
      createdAt: signature.createdAt,
    };
  }
}
