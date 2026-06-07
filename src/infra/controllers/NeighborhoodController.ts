import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards, UsePipes } from '@nestjs/common';
import type { Request } from 'express';
import { ZodValidationPipe } from '../../middlewares/zodValidationPipe.js';
import { JwtUserGuard } from '../auth/guards/JwtUserGuard.js';
import { buildResponse } from '../helpers/apiResponse.js';
import { createNeighborhoodSchema, updateNeighborhoodSchema } from '../validation/schemas/neighborhoodSchemas.js';
import { CreateNeighborhoodUseCase } from '../../domain/useCases/createNeighborhood/CreateNeighborhoodUseCase.js';
import { UpdateNeighborhoodUseCase } from '../../domain/useCases/updateNeighborhood/UpdateNeighborhoodUseCase.js';
import { DeleteNeighborhoodUseCase } from '../../domain/useCases/deleteNeighborhood/DeleteNeighborhoodUseCase.js';
import { FindNeighborhoodByIdUseCase } from '../../domain/useCases/findNeighborhoodById/FindNeighborhoodByIdUseCase.js';
import { ListNeighborhoodsUseCase } from '../../domain/useCases/listNeighborhoods/ListNeighborhoodsUseCase.js';
import { logger } from '../logger/logger.js';

@Controller('neighborhoods')
@UseGuards(JwtUserGuard)
export class NeighborhoodController {
  constructor(
    private readonly createUseCase: CreateNeighborhoodUseCase,
    private readonly updateUseCase: UpdateNeighborhoodUseCase,
    private readonly deleteUseCase: DeleteNeighborhoodUseCase,
    private readonly findByIdUseCase: FindNeighborhoodByIdUseCase,
    private readonly listUseCase: ListNeighborhoodsUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createNeighborhoodSchema))
  async create(@Body() body: any, @Req() req: Request) {
    try {
      const result = await this.createUseCase.execute(body);
      logger.info({ module: 'Neighborhoods', action: 'createNeighborhood', message: 'Neighborhood created' });
      return buildResponse({ res: result, success: true, status: 201, path: req.path });
    } catch (error) {
      logger.error({ module: 'Neighborhoods', action: 'createNeighborhood', message: 'Error at creating neighborhood' });
      throw error;
    }
  }

  @Get()
  async list(@Query('page') page: string, @Query('perPage') perPage: string, @Query('cityId') cityId: string, @Req() req: Request) {
    try {
      const result = await this.listUseCase.execute({ page: Number(page) || 1, perPage: Number(perPage) || 10 }, cityId);
      logger.info({ module: 'Neighborhoods', action: 'listNeighborhoods', message: 'Neighborhoods listed' });
      return buildResponse({ res: result, success: true, status: 200, path: req.path });
    } catch (error) {
      logger.error({ module: 'Neighborhoods', action: 'listNeighborhoods', message: 'Error at listing neighborhoods' });
      throw error;
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: Request) {
    try {
      const result = await this.findByIdUseCase.execute(id);
      logger.info({ module: 'Neighborhoods', action: 'findNeighborhoodById', message: 'Neighborhood found' });
      return buildResponse({ res: result, success: true, status: 200, path: req.path });
    } catch (error) {
      logger.error({ module: 'Neighborhoods', action: 'findNeighborhoodById', message: 'Error at finding neighborhood' });
      throw error;
    }
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateNeighborhoodSchema))
  async update(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    try {
      const result = await this.updateUseCase.execute(id, body);
      logger.info({ module: 'Neighborhoods', action: 'updateNeighborhood', message: 'Neighborhood updated' });
      return buildResponse({ res: result, success: true, status: 200, path: req.path });
    } catch (error) {
      logger.error({ module: 'Neighborhoods', action: 'updateNeighborhood', message: 'Error at updating neighborhood' });
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    try {
      await this.deleteUseCase.execute(id);
      logger.info({ module: 'Neighborhoods', action: 'deleteNeighborhood', message: 'Neighborhood deleted' });
      return buildResponse({ res: null, success: true, status: 200, path: req.path });
    } catch (error) {
      logger.error({ module: 'Neighborhoods', action: 'deleteNeighborhood', message: 'Error at deleting neighborhood' });
      throw error;
    }
  }
}
