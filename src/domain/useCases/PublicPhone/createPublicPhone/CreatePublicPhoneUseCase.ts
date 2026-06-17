import { AppError } from '../../../errors/AppError.js';
import { CreatePublicPhoneDTO } from '../../../dtos/CreatePublicPhoneDTO.js';
import { PublicPhoneResponseDTO } from '../../../dtos/PublicPhoneResponseDTO.js';
import { IPublicPhoneRepository } from '../../../repositories/IPublicPhoneRepository.js';

export class CreatePublicPhoneUseCase {
  constructor(private readonly repository: IPublicPhoneRepository) {}

  async execute(data: CreatePublicPhoneDTO): Promise<PublicPhoneResponseDTO> {
    const existing = await this.repository.findByPhone(data.phone);
    if (existing)
      throw new AppError('Este número de telefone já está cadastrado.', 409);
    const phone = await this.repository.create(data);
    return {
      id: phone.id,
      institutionName: phone.institutionName,
      phone: phone.phone,
    };
  }
}
