import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { PublicPhoneController } from '../../infra/controllers/PublicPhoneController.js';
import { PrismaPublicPhoneRepository } from '../../infra/database/prisma/PrismaPublicPhoneRepository.js';
import { CreatePublicPhoneUseCase } from '../../domain/useCases/createPublicPhone/CreatePublicPhoneUseCase.js';
import { UpdatePublicPhoneUseCase } from '../../domain/useCases/updatePublicPhone/UpdatePublicPhoneUseCase.js';
import { DeletePublicPhoneUseCase } from '../../domain/useCases/deletePublicPhone/DeletePublicPhoneUseCase.js';
import { FindPublicPhoneByIdUseCase } from '../../domain/useCases/findPublicPhoneById/FindPublicPhoneByIdUseCase.js';
import { ListPublicPhonesUseCase } from '../../domain/useCases/listPublicPhones/ListPublicPhonesUseCase.js';
import { JwtUserStrategy } from '../../infra/auth/strategies/JwtUserStrategy.js';

@Module({
  imports: [PassportModule],
  controllers: [PublicPhoneController],
  providers: [
    JwtUserStrategy,
    PrismaPublicPhoneRepository,
    {
      provide: CreatePublicPhoneUseCase,
      useFactory: (r: PrismaPublicPhoneRepository) =>
        new CreatePublicPhoneUseCase(r),
      inject: [PrismaPublicPhoneRepository],
    },
    {
      provide: UpdatePublicPhoneUseCase,
      useFactory: (r: PrismaPublicPhoneRepository) =>
        new UpdatePublicPhoneUseCase(r),
      inject: [PrismaPublicPhoneRepository],
    },
    {
      provide: DeletePublicPhoneUseCase,
      useFactory: (r: PrismaPublicPhoneRepository) =>
        new DeletePublicPhoneUseCase(r),
      inject: [PrismaPublicPhoneRepository],
    },
    {
      provide: FindPublicPhoneByIdUseCase,
      useFactory: (r: PrismaPublicPhoneRepository) =>
        new FindPublicPhoneByIdUseCase(r),
      inject: [PrismaPublicPhoneRepository],
    },
    {
      provide: ListPublicPhonesUseCase,
      useFactory: (r: PrismaPublicPhoneRepository) =>
        new ListPublicPhonesUseCase(r),
      inject: [PrismaPublicPhoneRepository],
    },
  ],
})
export class PublicPhoneModule {}
