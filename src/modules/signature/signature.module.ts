import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { SignatureController } from '../../infra/controllers/SignatureController.js';
import { PrismaSignatureRepository } from '../../infra/database/prisma/PrismaSignatureRepository.js';
import { PrismaSolicitationSignatureRepository } from '../../infra/database/prisma/PrismaSolicitationSignatureRepository.js';
import { CreateSignatureUseCase } from '../../domain/useCases/Signature/createSignature/CreateSignatureUseCase.js';
import { DeleteSignatureUseCase } from '../../domain/useCases/Signature/deleteSignature/DeleteSignatureUseCase.js';
import { FindSignatureByIdUseCase } from '../../domain/useCases/Signature/findSignatureById/FindSignatureByIdUseCase.js';
import { FindSignatureByUserIdUseCase } from '../../domain/useCases/Signature/findSignatureByUserId/FindSignatureByUserIdUseCase.js';
import { CreateSolicitationSignatureUseCase } from '../../domain/useCases/SolicitationSignature/createSolicitationSignature/CreateSolicitationSignatureUseCase.js';
import { ListSolicitationSignaturesUseCase } from '../../domain/useCases/SolicitationSignature/listSolicitationSignatures/ListSolicitationSignaturesUseCase.js';
import { JwtUserStrategy } from '../../infra/auth/strategies/JwtUserStrategy.js';
import { FirebaseImageStorageService } from '../../infra/integrations/firebase/FirebaseImageStorageService.js';

@Module({
  imports: [PassportModule],
  controllers: [SignatureController],
  providers: [
    JwtUserStrategy,
    PrismaSignatureRepository,
    FirebaseImageStorageService,
    {
      provide: CreateSignatureUseCase,
      useFactory: (
        r: PrismaSignatureRepository,
        is: FirebaseImageStorageService,
      ) => new CreateSignatureUseCase(r, is),
      inject: [PrismaSignatureRepository, FirebaseImageStorageService],
    },
    {
      provide: DeleteSignatureUseCase,
      useFactory: (r: PrismaSignatureRepository) =>
        new DeleteSignatureUseCase(r),
      inject: [PrismaSignatureRepository],
    },
    {
      provide: FindSignatureByIdUseCase,
      useFactory: (r: PrismaSignatureRepository) =>
        new FindSignatureByIdUseCase(r),
      inject: [PrismaSignatureRepository],
    },
    {
      provide: FindSignatureByUserIdUseCase,
      useFactory: (r: PrismaSignatureRepository) =>
        new FindSignatureByUserIdUseCase(r),
      inject: [PrismaSignatureRepository],
    },
    PrismaSolicitationSignatureRepository,
    {
      provide: CreateSolicitationSignatureUseCase,
      useFactory: (
        r: PrismaSolicitationSignatureRepository,
        s: PrismaSignatureRepository,
      ) => new CreateSolicitationSignatureUseCase(r, s),
      inject: [
        PrismaSolicitationSignatureRepository,
        PrismaSignatureRepository,
      ],
    },
    {
      provide: ListSolicitationSignaturesUseCase,
      useFactory: (r: PrismaSolicitationSignatureRepository) =>
        new ListSolicitationSignaturesUseCase(r),
      inject: [PrismaSolicitationSignatureRepository],
    },
  ],
})
export class SignatureModule {}
