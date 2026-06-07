import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  HttpCode,
  Inject,
} from '@nestjs/common';
import { CreateLogUseCase } from '../../domain/useCases/createLog/CreateLogUseCase.js';
import { FindLogByIdUseCase } from '../../domain/useCases/findLogById/FindLogByIdUseCase.js';
import { ListLogsUseCase } from '../../domain/useCases/listLogs/ListLogsUseCase.js';
import { UpdateLogUseCase } from '../../domain/useCases/updateLog/UpdateLogUseCase.js';
import { DeleteLogUseCase } from '../../domain/useCases/deleteLog/DeleteLogUseCase.js';
import { ZodValidationPipe } from '../../middlewares/zodValidationPipe.js';
import {
  createLogSchema,
  updateLogSchema,
} from '../validation/schemas/logSchemas.js';
import type { CreateLogInput, UpdateLogInput } from '../validation/schemas/logSchemas.js';
import { logger } from '../logger/logger.js';

@Controller('logs')
export class LogController {
  constructor(
    @Inject('CreateLogUseCase')
    private readonly createLogUseCase: CreateLogUseCase,
    @Inject('FindLogByIdUseCase')
    private readonly findLogByIdUseCase: FindLogByIdUseCase,
    @Inject('ListLogsUseCase')
    private readonly listLogsUseCase: ListLogsUseCase,
    @Inject('UpdateLogUseCase')
    private readonly updateLogUseCase: UpdateLogUseCase,
    @Inject('DeleteLogUseCase')
    private readonly deleteLogUseCase: DeleteLogUseCase,
  ) {}

  @Post()
  async create(
    @Body(new ZodValidationPipe(createLogSchema)) body: CreateLogInput,
  ) {
    try {
      const log = await this.createLogUseCase.execute(body);
      logger.info({ module: 'Logs', action: 'createLog', message: 'Log created' });
      return { data: log };
    } catch (error) {
      logger.error({ module: 'Logs', action: 'createLog', message: 'Error at creating log' });
      throw error;
    }
  }

  @Get()
  async list(
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    try {
      const result = await this.listLogsUseCase.execute({
        page: page ? Number(page) : undefined,
        perPage: perPage ? Number(perPage) : undefined,
      });
      logger.info({ module: 'Logs', action: 'listLogs', message: 'Logs listed' });
      return result;
    } catch (error) {
      logger.error({ module: 'Logs', action: 'listLogs', message: 'Error at listing logs' });
      throw error;
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    try {
      const log = await this.findLogByIdUseCase.execute(id);
      logger.info({ module: 'Logs', action: 'findLogById', message: 'Log found' });
      return { data: log };
    } catch (error) {
      logger.error({ module: 'Logs', action: 'findLogById', message: 'Error at finding log' });
      throw error;
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateLogSchema)) body: UpdateLogInput,
  ) {
    try {
      const log = await this.updateLogUseCase.execute(id, body);
      logger.info({ module: 'Logs', action: 'updateLog', message: 'Log updated' });
      return { data: log };
    } catch (error) {
      logger.error({ module: 'Logs', action: 'updateLog', message: 'Error at updating log' });
      throw error;
    }
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    try {
      await this.deleteLogUseCase.execute(id);
      logger.info({ module: 'Logs', action: 'deleteLog', message: 'Log deleted' });
    } catch (error) {
      logger.error({ module: 'Logs', action: 'deleteLog', message: 'Error at deleting log' });
      throw error;
    }
  }
}
