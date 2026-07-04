import * as jwt from 'jsonwebtoken';
import { AppError } from '../../../errors/AppError.js';
import { IUserRepository } from '../../../repositories/IUserRepository.js';
import { AuthenticateUserResponseDTO } from '../../../dtos/AuthenticateUserResponseDTO.js';

export class AuthenticateWithGoogleUseCase {
  constructor(
    private readonly repository: IUserRepository,
    private readonly jwtPrivateKey: string,
  ) {}

  async execute(email: string): Promise<AuthenticateUserResponseDTO> {
    const user = await this.repository.findByEmail(email);
    if (!user)
      throw new AppError(
        'Usuário não encontrado. Faça o cadastro antes de entrar com o Google.',
        404,
      );

    const privateKey = Buffer.from(this.jwtPrivateKey, 'base64');
    const token = jwt.sign(
      { sub: user.id, isAdmin: user.isAdmin, cityId: user.cityId },
      privateKey,
      { algorithm: 'RS256', expiresIn: '7d' },
    );

    return { token };
  }
}
