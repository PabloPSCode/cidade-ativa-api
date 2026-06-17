import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { AppError } from '../../errors/AppError.js';
import { AuthenticateUserDTO } from '../../dtos/AuthenticateUserDTO.js';
import { AuthenticateUserResponseDTO } from '../../dtos/AuthenticateUserResponseDTO.js';
import { IUserRepository } from '../../repositories/IUserRepository.js';

export class AuthenticateUserUseCase {
  constructor(
    private readonly repository: IUserRepository,
    private readonly jwtPrivateKey: string,
  ) {}

  async execute(
    data: AuthenticateUserDTO,
  ): Promise<AuthenticateUserResponseDTO> {
    const user = await this.repository.findByEmail(data.email);
    if (!user)
      throw new AppError('E-mail ou senha incorretos.', 401);

    const passwordMatch = await bcrypt.compare(
      data.password,
      user.passwordHash,
    );
    if (!passwordMatch)
      throw new AppError('E-mail ou senha incorretos.', 401);

    const privateKey = Buffer.from(this.jwtPrivateKey, 'base64');
    const token = jwt.sign(
      { sub: user.id, isAdmin: user.isAdmin },
      privateKey,
      { algorithm: 'RS256', expiresIn: '7d' },
    );

    return { token };
  }
}
