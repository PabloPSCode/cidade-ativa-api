import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards, UsePipes } from '@nestjs/common';
import type { Request } from 'express';
import { ZodValidationPipe } from '../../middlewares/zodValidationPipe.js';
import { JwtUserGuard } from '../auth/guards/JwtUserGuard.js';
import { buildResponse } from '../helpers/apiResponse.js';
import { createCoolActionSchema, updateCoolActionSchema } from '../validation/schemas/coolActionSchemas.js';
import { CreateCoolActionUseCase } from '../../domain/useCases/createCoolAction/CreateCoolActionUseCase.js';
import { UpdateCoolActionUseCase } from '../../domain/useCases/updateCoolAction/UpdateCoolActionUseCase.js';
import { DeleteCoolActionUseCase } from '../../domain/useCases/deleteCoolAction/DeleteCoolActionUseCase.js';
import { FindCoolActionByIdUseCase } from '../../domain/useCases/findCoolActionById/FindCoolActionByIdUseCase.js';
import { ListCoolActionsUseCase } from '../../domain/useCases/listCoolActions/ListCoolActionsUseCase.js';
import { logger } from '../logger/logger.js';

@Controller('cool-actions')
@UseGuards(JwtUserGuard)
export class CoolActionController {
  constructor(
    private readonly createUseCase: CreateCoolActionUseCase,
    private readonly updateUseCase: UpdateCoolActionUseCase,
    private readonly deleteUseCase: DeleteCoolActionUseCase,
    private readonly findByIdUseCase: FindCoolActionByIdUseCase,
    private readonly listUseCase: ListCoolActionsUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createCoolActionSchema))
  async create(@Body() body: any, @Req() req: Request) {
    try {
      const result = await this.createUseCase.execute(body);
      logger.info({ module: 'CoolActions', action: 'createCoolAction', message: 'Cool action created' });
      return buildResponse({ res: result, success: true, status: 201, path: req.path });
    } catch (error) {
      logger.error({ module: 'CoolActions', action: 'createCoolAction', message: 'Error at creating cool action' });
      throw error;
    }
  }

  @Get()
  async list(@Query('page') page: string, @Query('perPage') perPage: string, @Req() req: Request) {
    try {
      const result = await this.listUseCase.execute({ page: Number(page) || 1, perPage: Number(perPage) || 10 });
      logger.info({ module: 'CoolActions', action: 'listCoolActions', message: 'Cool actions listed' });
      return buildResponse({ res: result, success: true, status: 200, path: req.path });
    } catch (error) {
      logger.error({ module: 'CoolActions', action: 'listCoolActions', message: 'Error at listing cool actions' });
      throw error;
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: Request) {
    try {
      const result = await this.findByIdUseCase.execute(id);
      logger.info({ module: 'CoolActions', action: 'findCoolActionById', message: 'Cool action found' });
      return buildResponse({ res: result, success: true, status: 200, path: req.path });
    } catch (error) {
      logger.error({ module: 'CoolActions', action: 'findCoolActionById', message: 'Error at finding cool action' });
      throw error;
    }
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateCoolActionSchema))
  async update(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    try {
      const result = await this.updateUseCase.execute(id, body);
      logger.info({ module: 'CoolActions', action: 'updateCoolAction', message: 'Cool action updated' });
      return buildResponse({ res: result, success: true, status: 200, path: req.path });
    } catch (error) {
      logger.error({ module: 'CoolActions', action: 'updateCoolAction', message: 'Error at updating cool action' });
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    try {
      await this.deleteUseCase.execute(id);
      logger.info({ module: 'CoolActions', action: 'deleteCoolAction', message: 'Cool action deleted' });
      return buildResponse({ res: null, success: true, status: 200, path: req.path });
    } catch (error) {
      logger.error({ module: 'CoolActions', action: 'deleteCoolAction', message: 'Error at deleting cool action' });
      throw error;
    }
  }
}
