import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UserController } from '../../infra/controllers/UserController.js';
import { PrismaUserRepository } from '../../infra/database/prisma/PrismaUserRepository.js';
import { CreateUserUseCase } from '../../domain/useCases/User/createUser/CreateUserUseCase.js';
import { UpdateUserUseCase } from '../../domain/useCases/User/updateUser/UpdateUserUseCase.js';
import { DeleteUserUseCase } from '../../domain/useCases/User/deleteUser/DeleteUserUseCase.js';
import { FindUserByIdUseCase } from '../../domain/useCases/User/findUserById/FindUserByIdUseCase.js';
import { FindUserByEmailUseCase } from '../../domain/useCases/User/findUserByEmail/FindUserByEmailUseCase.js';
import { ListUsersUseCase } from '../../domain/useCases/User/listUsers/ListUsersUseCase.js';
import { AuthenticateUserUseCase } from '../../domain/useCases/User/authenticateUser/AuthenticateUserUseCase.js';
import { AuthenticateWithGoogleUseCase } from '../../domain/useCases/User/authenticateWithGoogle/AuthenticateWithGoogleUseCase.js';
import { JwtUserStrategy } from '../../infra/auth/strategies/JwtUserStrategy.js';
import { JwtAdminStrategy } from '../../infra/auth/strategies/JwtAdminStrategy.js';
import { env } from '../../infra/config/env.js';

@Module({
  imports: [PassportModule],
  controllers: [UserController],
  providers: [
    JwtUserStrategy,
    JwtAdminStrategy,
    PrismaUserRepository,
    {
      provide: CreateUserUseCase,
      useFactory: (r: PrismaUserRepository) => new CreateUserUseCase(r),
      inject: [PrismaUserRepository],
    },
    {
      provide: UpdateUserUseCase,
      useFactory: (r: PrismaUserRepository) => new UpdateUserUseCase(r),
      inject: [PrismaUserRepository],
    },
    {
      provide: DeleteUserUseCase,
      useFactory: (r: PrismaUserRepository) => new DeleteUserUseCase(r),
      inject: [PrismaUserRepository],
    },
    {
      provide: FindUserByIdUseCase,
      useFactory: (r: PrismaUserRepository) => new FindUserByIdUseCase(r),
      inject: [PrismaUserRepository],
    },
    {
      provide: FindUserByEmailUseCase,
      useFactory: (r: PrismaUserRepository) => new FindUserByEmailUseCase(r),
      inject: [PrismaUserRepository],
    },
    {
      provide: ListUsersUseCase,
      useFactory: (r: PrismaUserRepository) => new ListUsersUseCase(r),
      inject: [PrismaUserRepository],
    },
    {
      provide: AuthenticateUserUseCase,
      useFactory: (r: PrismaUserRepository) =>
        new AuthenticateUserUseCase(r, env.jwtPrivateKey),
      inject: [PrismaUserRepository],
    },
    {
      provide: AuthenticateWithGoogleUseCase,
      useFactory: (r: PrismaUserRepository) =>
        new AuthenticateWithGoogleUseCase(r, env.jwtPrivateKey),
      inject: [PrismaUserRepository],
    },
  ],
  exports: [PrismaUserRepository],
})
export class UserModule {}
