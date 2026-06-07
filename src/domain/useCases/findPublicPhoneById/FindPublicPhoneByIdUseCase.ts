import { AppError } from '../../errors/AppError.js';
import { PublicPhoneResponseDTO } from '../../dtos/PublicPhoneResponseDTO.js';
import { IPublicPhoneRepository } from '../../repositories/IPublicPhoneRepository.js';

export class FindPublicPhoneByIdUseCase {
  constructor(private readonly repository: IPublicPhoneRepository) {}

  async execute(id: string): Promise<PublicPhoneResponseDTO> {
    const phone = await this.repository.findById(id);
    if (!phone) throw new AppError('Public phone not found', 404);
    return {
      id: phone.id,
      institutionName: phone.institutionName,
      phone: phone.phone,
    };
  }
}
