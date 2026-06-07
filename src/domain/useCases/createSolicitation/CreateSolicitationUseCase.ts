import { AppError } from '../../errors/AppError.js';
import { CreateSolicitationDTO } from '../../dtos/CreateSolicitationDTO.js';
import { SolicitationResponseDTO } from '../../dtos/SolicitationResponseDTO.js';
import { ISolicitationRepository } from '../../repositories/ISolicitationRepository.js';
import { IUserRepository } from '../../repositories/IUserRepository.js';

export class CreateSolicitationUseCase {
  constructor(
    private readonly solicitationRepository: ISolicitationRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(data: CreateSolicitationDTO): Promise<SolicitationResponseDTO> {
    const user = await this.userRepository.findById(data.requestingUserId);
    if (!user) throw new AppError('Requesting user not found', 404);

    if (!user.isCouncilman && !user.isAdmin) {
      const openCount = await this.solicitationRepository.countOpenByUser(
        data.requestingUserId,
      );
      if (openCount >= 3)
        throw new AppError(
          'Regular users cannot have more than 3 open solicitations',
          422,
        );
    }

    const s = await this.solicitationRepository.create(data);
    return this.toDTO(s);
  }

  private toDTO(s: any): SolicitationResponseDTO {
    return {
      id: s.id,
      protocolNumber: s.protocolNumber,
      title: s.title,
      description: s.description,
      neighborhood: s.neighborhood,
      city: s.city,
      uf: s.uf,
      street: s.street,
      requestingUserId: s.requestingUserId,
      solicitationTypeId: s.solicitationTypeId,
      status: s.status,
      unsolvedImageUrls: s.unsolvedImageUrls,
      solvedImageUrls: s.solvedImageUrls,
      solvedDate: s.solvedDate,
      solvedCommentary: s.solvedCommentary,
      solvedUserId: s.solvedUserId,
      createdAt: s.createdAt,
      updatedAt: s.updatedAt,
    };
  }
}
