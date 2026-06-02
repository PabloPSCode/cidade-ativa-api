import { Module } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { LogController } from '../../infra/controllers/LogController.js';
import { PrismaLogRepository } from '../../infra/database/prisma/PrismaLogRepository.js';
import { CreateLogUseCase } from '../../domain/useCases/createLog/CreateLogUseCase.js';
import { FindLogByIdUseCase } from '../../domain/useCases/findLogById/FindLogByIdUseCase.js';
import { ListLogsUseCase } from '../../domain/useCases/listLogs/ListLogsUseCase.js';
import { UpdateLogUseCase } from '../../domain/useCases/updateLog/UpdateLogUseCase.js';
import { DeleteLogUseCase } from '../../domain/useCases/deleteLog/DeleteLogUseCase.js';
import { ILogRepository } from '../../domain/repositories/ILogRepository.js';

@Module({
  controllers: [LogController],
  providers: [
    {
      provide: 'PRISMA_CLIENT',
      useFactory: () => {
        const prisma = new PrismaClient();

        return prisma;
      },
    },
    {
      provide: 'ILogRepository',
      useClass: PrismaLogRepository,
    },
    {
      provide: 'CreateLogUseCase',
      useFactory: (logRepository: ILogRepository) =>
        new CreateLogUseCase(logRepository),
      inject: ['ILogRepository'],
    },
    {
      provide: 'FindLogByIdUseCase',
      useFactory: (logRepository: ILogRepository) =>
        new FindLogByIdUseCase(logRepository),
      inject: ['ILogRepository'],
    },
    {
      provide: 'ListLogsUseCase',
      useFactory: (logRepository: ILogRepository) =>
        new ListLogsUseCase(logRepository),
      inject: ['ILogRepository'],
    },
    {
      provide: 'UpdateLogUseCase',
      useFactory: (logRepository: ILogRepository) =>
        new UpdateLogUseCase(logRepository),
      inject: ['ILogRepository'],
    },
    {
      provide: 'DeleteLogUseCase',
      useFactory: (logRepository: ILogRepository) =>
        new DeleteLogUseCase(logRepository),
      inject: ['ILogRepository'],
    },
  ],
})
export class LogModule {}
