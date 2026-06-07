import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards, UsePipes } from '@nestjs/common';
import type { Request } from 'express';
import { ZodValidationPipe } from '../../middlewares/zodValidationPipe.js';
import { JwtUserGuard } from '../auth/guards/JwtUserGuard.js';
import { buildResponse } from '../helpers/apiResponse.js';
import { createSolicitationSchema, updateSolicitationSchema } from '../validation/schemas/solicitationSchemas.js';
import { CreateSolicitationUseCase } from '../../domain/useCases/createSolicitation/CreateSolicitationUseCase.js';
import { UpdateSolicitationUseCase } from '../../domain/useCases/updateSolicitation/UpdateSolicitationUseCase.js';
import { DeleteSolicitationUseCase } from '../../domain/useCases/deleteSolicitation/DeleteSolicitationUseCase.js';
import { FindSolicitationByIdUseCase } from '../../domain/useCases/findSolicitationById/FindSolicitationByIdUseCase.js';
import { ListSolicitationsUseCase } from '../../domain/useCases/listSolicitations/ListSolicitationsUseCase.js';
import { logger } from '../logger/logger.js';

@Controller('solicitations')
@UseGuards(JwtUserGuard)
export class SolicitationController {
  constructor(
    private readonly createUseCase: CreateSolicitationUseCase,
    private readonly updateUseCase: UpdateSolicitationUseCase,
    private readonly deleteUseCase: DeleteSolicitationUseCase,
    private readonly findByIdUseCase: FindSolicitationByIdUseCase,
    private readonly listUseCase: ListSolicitationsUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createSolicitationSchema))
  async create(@Body() body: any, @Req() req: Request) {
    try {
      const result = await this.createUseCase.execute(body);
      logger.info({ module: 'Solicitations', action: 'createSolicitation', message: 'Solicitation created' });
      return buildResponse({ res: result, success: true, status: 201, path: req.path });
    } catch (error) {
      logger.error({ module: 'Solicitations', action: 'createSolicitation', message: 'Error at creating solicitation' });
      throw error;
    }
  }

  @Get()
  async list(@Query('page') page: string, @Query('perPage') perPage: string, @Query('userId') userId: string, @Query('status') status: string, @Req() req: Request) {
    try {
      const result = await this.listUseCase.execute(
        { page: Number(page) || 1, perPage: Number(perPage) || 10 },
        { userId, status },
      );
      logger.info({ module: 'Solicitations', action: 'listSolicitations', message: 'Solicitations listed' });
      return buildResponse({ res: result, success: true, status: 200, path: req.path });
    } catch (error) {
      logger.error({ module: 'Solicitations', action: 'listSolicitations', message: 'Error at listing solicitations' });
      throw error;
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: Request) {
    try {
      const result = await this.findByIdUseCase.execute(id);
      logger.info({ module: 'Solicitations', action: 'findSolicitationById', message: 'Solicitation found' });
      return buildResponse({ res: result, success: true, status: 200, path: req.path });
    } catch (error) {
      logger.error({ module: 'Solicitations', action: 'findSolicitationById', message: 'Error at finding solicitation' });
      throw error;
    }
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateSolicitationSchema))
  async update(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    try {
      const result = await this.updateUseCase.execute(id, body);
      logger.info({ module: 'Solicitations', action: 'updateSolicitation', message: 'Solicitation updated' });
      return buildResponse({ res: result, success: true, status: 200, path: req.path });
    } catch (error) {
      logger.error({ module: 'Solicitations', action: 'updateSolicitation', message: 'Error at updating solicitation' });
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    try {
      await this.deleteUseCase.execute(id);
      logger.info({ module: 'Solicitations', action: 'deleteSolicitation', message: 'Solicitation deleted' });
      return buildResponse({ res: null, success: true, status: 200, path: req.path });
    } catch (error) {
      logger.error({ module: 'Solicitations', action: 'deleteSolicitation', message: 'Error at deleting solicitation' });
      throw error;
    }
  }
}
