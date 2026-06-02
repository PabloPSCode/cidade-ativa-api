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
    const log = await this.createLogUseCase.execute(body);

    return { data: log };
  }

  @Get()
  async list(
    @Query('page') page?: string,
    @Query('perPage') perPage?: string,
  ) {
    const result = await this.listLogsUseCase.execute({
      page: page ? Number(page) : undefined,
      perPage: perPage ? Number(perPage) : undefined,
    });

    return result;
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    const log = await this.findLogByIdUseCase.execute(id);

    return { data: log };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateLogSchema)) body: UpdateLogInput,
  ) {
    const log = await this.updateLogUseCase.execute(id, body);

    return { data: log };
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteLogUseCase.execute(id);
  }
}
