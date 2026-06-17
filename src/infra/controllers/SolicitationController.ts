import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UsePipes,
} from '@nestjs/common';
import type { Request } from 'express';
import { CreateSolicitationUseCase } from '../../domain/useCases/Solicitation/createSolicitation/CreateSolicitationUseCase.js';
import { DeleteSolicitationUseCase } from '../../domain/useCases/Solicitation/deleteSolicitation/DeleteSolicitationUseCase.js';
import { FindSolicitationByIdUseCase } from '../../domain/useCases/Solicitation/findSolicitationById/FindSolicitationByIdUseCase.js';
import { ListSolicitationsUseCase } from '../../domain/useCases/Solicitation/listSolicitations/ListSolicitationsUseCase.js';
import { SolveSolicitationUseCase } from '../../domain/useCases/Solicitation/solveSolicitation/SolveSolicitationUseCase.js';
import { UpdateSolicitationUseCase } from '../../domain/useCases/Solicitation/updateSolicitation/UpdateSolicitationUseCase.js';
import { ZodValidationPipe } from '../../middlewares/zodValidationPipe.js';
import { buildResponse } from '../helpers/apiResponse.js';
import { logger } from '../logger/logger.js';
import {
  createSolicitationSchema,
  solveSolicitationSchema,
  updateSolicitationSchema,
} from '../validation/schemas/solicitationSchemas.js';

@Controller('solicitations')
export class SolicitationController {
  constructor(
    private readonly createUseCase: CreateSolicitationUseCase,
    private readonly updateUseCase: UpdateSolicitationUseCase,
    private readonly deleteUseCase: DeleteSolicitationUseCase,
    private readonly findByIdUseCase: FindSolicitationByIdUseCase,
    private readonly listUseCase: ListSolicitationsUseCase,
    private readonly solveUseCase: SolveSolicitationUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createSolicitationSchema))
  async create(@Body() body: any, @Req() req: Request) {
    try {
      const result = await this.createUseCase.execute(body);
      logger.info({
        module: 'Solicitations',
        action: 'createSolicitation',
        message: 'Solicitation created',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 201,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Solicitations',
        action: 'createSolicitation',
        message: 'Error at creating solicitation',
      });
      throw error;
    }
  }

  @Get()
  async list(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
    @Query('userId') userId: string,
    @Query('status') status: string,
    @Req() req: Request,
  ) {
    try {
      const result = await this.listUseCase.execute(
        { page: Number(page) || 1, perPage: Number(perPage) || 10 },
        { userId, status },
      );
      logger.info({
        module: 'Solicitations',
        action: 'listSolicitations',
        message: 'Solicitations listed',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Solicitations',
        action: 'listSolicitations',
        message: 'Error at listing solicitations',
      });
      throw error;
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: Request) {
    try {
      const result = await this.findByIdUseCase.execute(id);
      logger.info({
        module: 'Solicitations',
        action: 'findSolicitationById',
        message: 'Solicitation found',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Solicitations',
        action: 'findSolicitationById',
        message: 'Error at finding solicitation',
      });
      throw error;
    }
  }

  @Post(':id/solve')
  @UsePipes(new ZodValidationPipe(solveSolicitationSchema))
  async solve(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: Request,
  ) {
    try {
      const result = await this.solveUseCase.execute(id, body);
      logger.info({
        module: 'Solicitations',
        action: 'solveSolicitation',
        message: 'Solicitation solved',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Solicitations',
        action: 'solveSolicitation',
        message: 'Error at solving solicitation',
      });
      throw error;
    }
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateSolicitationSchema))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: Request,
  ) {
    try {
      const result = await this.updateUseCase.execute(id, body);
      logger.info({
        module: 'Solicitations',
        action: 'updateSolicitation',
        message: 'Solicitation updated',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Solicitations',
        action: 'updateSolicitation',
        message: 'Error at updating solicitation',
      });
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    try {
      await this.deleteUseCase.execute(id);
      logger.info({
        module: 'Solicitations',
        action: 'deleteSolicitation',
        message: 'Solicitation deleted',
      });
      return buildResponse({
        res: null,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Solicitations',
        action: 'deleteSolicitation',
        message: 'Error at deleting solicitation',
      });
      throw error;
    }
  }
}
