import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards, UsePipes } from '@nestjs/common';
import type { Request } from 'express';
import { ZodValidationPipe } from '../../middlewares/zodValidationPipe.js';
import { JwtUserGuard } from '../auth/guards/JwtUserGuard.js';
import { buildResponse } from '../helpers/apiResponse.js';
import { createUFSchema, updateUFSchema } from '../validation/schemas/ufSchemas.js';
import { CreateUFUseCase } from '../../domain/useCases/createUF/CreateUFUseCase.js';
import { UpdateUFUseCase } from '../../domain/useCases/updateUF/UpdateUFUseCase.js';
import { DeleteUFUseCase } from '../../domain/useCases/deleteUF/DeleteUFUseCase.js';
import { FindUFByIdUseCase } from '../../domain/useCases/findUFById/FindUFByIdUseCase.js';
import { ListUFsUseCase } from '../../domain/useCases/listUFs/ListUFsUseCase.js';
import { logger } from '../logger/logger.js';

@Controller('ufs')
@UseGuards(JwtUserGuard)
export class UFController {
  constructor(
    private readonly createUseCase: CreateUFUseCase,
    private readonly updateUseCase: UpdateUFUseCase,
    private readonly deleteUseCase: DeleteUFUseCase,
    private readonly findByIdUseCase: FindUFByIdUseCase,
    private readonly listUseCase: ListUFsUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createUFSchema))
  async create(@Body() body: any, @Req() req: Request) {
    try {
      const result = await this.createUseCase.execute(body);
      logger.info({ module: 'UFs', action: 'createUF', message: 'UF created' });
      return buildResponse({ res: result, success: true, status: 201, path: req.path });
    } catch (error) {
      logger.error({ module: 'UFs', action: 'createUF', message: 'Error at creating UF' });
      throw error;
    }
  }

  @Get()
  async list(@Query('page') page: string, @Query('perPage') perPage: string, @Req() req: Request) {
    try {
      const result = await this.listUseCase.execute({ page: Number(page) || 1, perPage: Number(perPage) || 10 });
      logger.info({ module: 'UFs', action: 'listUFs', message: 'UFs listed' });
      return buildResponse({ res: result, success: true, status: 200, path: req.path });
    } catch (error) {
      logger.error({ module: 'UFs', action: 'listUFs', message: 'Error at listing UFs' });
      throw error;
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: Request) {
    try {
      const result = await this.findByIdUseCase.execute(id);
      logger.info({ module: 'UFs', action: 'findUFById', message: 'UF found' });
      return buildResponse({ res: result, success: true, status: 200, path: req.path });
    } catch (error) {
      logger.error({ module: 'UFs', action: 'findUFById', message: 'Error at finding UF' });
      throw error;
    }
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateUFSchema))
  async update(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    try {
      const result = await this.updateUseCase.execute(id, body);
      logger.info({ module: 'UFs', action: 'updateUF', message: 'UF updated' });
      return buildResponse({ res: result, success: true, status: 200, path: req.path });
    } catch (error) {
      logger.error({ module: 'UFs', action: 'updateUF', message: 'Error at updating UF' });
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    try {
      await this.deleteUseCase.execute(id);
      logger.info({ module: 'UFs', action: 'deleteUF', message: 'UF deleted' });
      return buildResponse({ res: null, success: true, status: 200, path: req.path });
    } catch (error) {
      logger.error({ module: 'UFs', action: 'deleteUF', message: 'Error at deleting UF' });
      throw error;
    }
  }
}
