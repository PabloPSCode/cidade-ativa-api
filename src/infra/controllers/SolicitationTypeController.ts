import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, Req, UseGuards, UsePipes,
} from '@nestjs/common';
import type { Request } from 'express';
import { ZodValidationPipe } from '../../middlewares/zodValidationPipe.js';
import { JwtUserGuard } from '../auth/guards/JwtUserGuard.js';
import { buildResponse } from '../helpers/apiResponse.js';
import { createSolicitationTypeSchema, updateSolicitationTypeSchema } from '../validation/schemas/solicitationTypeSchemas.js';
import { CreateSolicitationTypeUseCase } from '../../domain/useCases/createSolicitationType/CreateSolicitationTypeUseCase.js';
import { UpdateSolicitationTypeUseCase } from '../../domain/useCases/updateSolicitationType/UpdateSolicitationTypeUseCase.js';
import { DeleteSolicitationTypeUseCase } from '../../domain/useCases/deleteSolicitationType/DeleteSolicitationTypeUseCase.js';
import { FindSolicitationTypeByIdUseCase } from '../../domain/useCases/findSolicitationTypeById/FindSolicitationTypeByIdUseCase.js';
import { ListSolicitationTypesUseCase } from '../../domain/useCases/listSolicitationTypes/ListSolicitationTypesUseCase.js';
import { logger } from '../logger/logger.js';

@Controller('solicitation-types')
@UseGuards(JwtUserGuard)
export class SolicitationTypeController {
  constructor(
    private readonly createUseCase: CreateSolicitationTypeUseCase,
    private readonly updateUseCase: UpdateSolicitationTypeUseCase,
    private readonly deleteUseCase: DeleteSolicitationTypeUseCase,
    private readonly findByIdUseCase: FindSolicitationTypeByIdUseCase,
    private readonly listUseCase: ListSolicitationTypesUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createSolicitationTypeSchema))
  async create(@Body() body: any, @Req() req: Request) {
    try {
      const result = await this.createUseCase.execute(body);
      logger.info({ module: 'SolicitationTypes', action: 'createSolicitationType', message: 'Solicitation type created' });
      return buildResponse({ res: result, success: true, status: 201, path: req.path });
    } catch (error) {
      logger.error({ module: 'SolicitationTypes', action: 'createSolicitationType', message: 'Error at creating solicitation type' });
      throw error;
    }
  }

  @Get()
  async list(@Query('page') page: string, @Query('perPage') perPage: string, @Req() req: Request) {
    try {
      const result = await this.listUseCase.execute({ page: Number(page) || 1, perPage: Number(perPage) || 10 });
      logger.info({ module: 'SolicitationTypes', action: 'listSolicitationTypes', message: 'Solicitation types listed' });
      return buildResponse({ res: result, success: true, status: 200, path: req.path });
    } catch (error) {
      logger.error({ module: 'SolicitationTypes', action: 'listSolicitationTypes', message: 'Error at listing solicitation types' });
      throw error;
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: Request) {
    try {
      const result = await this.findByIdUseCase.execute(id);
      logger.info({ module: 'SolicitationTypes', action: 'findSolicitationTypeById', message: 'Solicitation type found' });
      return buildResponse({ res: result, success: true, status: 200, path: req.path });
    } catch (error) {
      logger.error({ module: 'SolicitationTypes', action: 'findSolicitationTypeById', message: 'Error at finding solicitation type' });
      throw error;
    }
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateSolicitationTypeSchema))
  async update(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    try {
      const result = await this.updateUseCase.execute(id, body);
      logger.info({ module: 'SolicitationTypes', action: 'updateSolicitationType', message: 'Solicitation type updated' });
      return buildResponse({ res: result, success: true, status: 200, path: req.path });
    } catch (error) {
      logger.error({ module: 'SolicitationTypes', action: 'updateSolicitationType', message: 'Error at updating solicitation type' });
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    try {
      await this.deleteUseCase.execute(id);
      logger.info({ module: 'SolicitationTypes', action: 'deleteSolicitationType', message: 'Solicitation type deleted' });
      return buildResponse({ res: null, success: true, status: 200, path: req.path });
    } catch (error) {
      logger.error({ module: 'SolicitationTypes', action: 'deleteSolicitationType', message: 'Error at deleting solicitation type' });
      throw error;
    }
  }
}
