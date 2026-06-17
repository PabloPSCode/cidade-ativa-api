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
import { CreateDoneCoolActionUseCase } from '../../domain/useCases/createDoneCoolAction/CreateDoneCoolActionUseCase.js';
import { DeleteDoneCoolActionUseCase } from '../../domain/useCases/deleteDoneCoolAction/DeleteDoneCoolActionUseCase.js';
import { FindDoneCoolActionByIdUseCase } from '../../domain/useCases/findDoneCoolActionById/FindDoneCoolActionByIdUseCase.js';
import { ListDoneCoolActionsUseCase } from '../../domain/useCases/listDoneCoolActions/ListDoneCoolActionsUseCase.js';
import { ListDoneCoolActionsRankingUseCase } from '../../domain/useCases/listDoneCoolActionsRanking/ListDoneCoolActionsRankingUseCase.js';
import { UpdateDoneCoolActionUseCase } from '../../domain/useCases/updateDoneCoolAction/UpdateDoneCoolActionUseCase.js';
import { ZodValidationPipe } from '../../middlewares/zodValidationPipe.js';
import { buildResponse } from '../helpers/apiResponse.js';
import { logger } from '../logger/logger.js';
import {
  createDoneCoolActionSchema,
  updateDoneCoolActionSchema,
} from '../validation/schemas/doneCoolActionSchemas.js';

@Controller('done-cool-actions')
export class DoneCoolActionController {
  constructor(
    private readonly createUseCase: CreateDoneCoolActionUseCase,
    private readonly updateUseCase: UpdateDoneCoolActionUseCase,
    private readonly deleteUseCase: DeleteDoneCoolActionUseCase,
    private readonly findByIdUseCase: FindDoneCoolActionByIdUseCase,
    private readonly listUseCase: ListDoneCoolActionsUseCase,
    private readonly rankingUseCase: ListDoneCoolActionsRankingUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createDoneCoolActionSchema))
  async create(@Body() body: any, @Req() req: Request) {
    try {
      const result = await this.createUseCase.execute(body);
      logger.info({
        module: 'DoneCoolActions',
        action: 'createDoneCoolAction',
        message: 'Done cool action created',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 201,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'DoneCoolActions',
        action: 'createDoneCoolAction',
        message: 'Error at creating done cool action',
      });
      throw error;
    }
  }

  @Get()
  async list(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
    @Query('userId') userId: string,
    @Req() req: Request,
  ) {
    try {
      const result = await this.listUseCase.execute(
        { page: Number(page) || 1, perPage: Number(perPage) || 10 },
        userId,
      );
      logger.info({
        module: 'DoneCoolActions',
        action: 'listDoneCoolActions',
        message: 'Done cool actions listed',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'DoneCoolActions',
        action: 'listDoneCoolActions',
        message: 'Error at listing done cool actions',
      });
      throw error;
    }
  }

  @Get('ranking')
  async ranking(@Req() req: Request) {
    try {
      const result = await this.rankingUseCase.execute();
      logger.info({
        module: 'DoneCoolActions',
        action: 'listDoneCoolActionsRanking',
        message: 'Done cool actions ranking listed',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'DoneCoolActions',
        action: 'listDoneCoolActionsRanking',
        message: 'Error at listing done cool actions ranking',
      });
      throw error;
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: Request) {
    try {
      const result = await this.findByIdUseCase.execute(id);
      logger.info({
        module: 'DoneCoolActions',
        action: 'findDoneCoolActionById',
        message: 'Done cool action found',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'DoneCoolActions',
        action: 'findDoneCoolActionById',
        message: 'Error at finding done cool action',
      });
      throw error;
    }
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateDoneCoolActionSchema))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: Request,
  ) {
    try {
      const result = await this.updateUseCase.execute(id, body);
      logger.info({
        module: 'DoneCoolActions',
        action: 'updateDoneCoolAction',
        message: 'Done cool action updated',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'DoneCoolActions',
        action: 'updateDoneCoolAction',
        message: 'Error at updating done cool action',
      });
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    try {
      await this.deleteUseCase.execute(id);
      logger.info({
        module: 'DoneCoolActions',
        action: 'deleteDoneCoolAction',
        message: 'Done cool action deleted',
      });
      return buildResponse({
        res: null,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'DoneCoolActions',
        action: 'deleteDoneCoolAction',
        message: 'Error at deleting done cool action',
      });
      throw error;
    }
  }
}
