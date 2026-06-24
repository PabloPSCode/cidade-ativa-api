import { AppError } from '../../../errors/AppError.js';
import { UpdatePublicPhoneDTO } from '../../../dtos/UpdatePublicPhoneDTO.js';
import { PublicPhoneResponseDTO } from '../../../dtos/PublicPhoneResponseDTO.js';
import { IPublicPhoneRepository } from '../../../repositories/IPublicPhoneRepository.js';

export class UpdatePublicPhoneUseCase {
  constructor(private readonly repository: IPublicPhoneRepository) {}

  async execute(
    id: string,
    data: UpdatePublicPhoneDTO,
  ): Promise<PublicPhoneResponseDTO> {
    const existing = await this.repository.findById(id);
    if (!existing) throw new AppError('Telefone público não encontrado.', 404);
    const updated = await this.repository.update(id, data);
    return {
      id: updated.id,
      institutionName: updated.institutionName,
      phone: updated.phone,
    };
  }
}
