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
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import type { Request } from 'express';
import { CreateVoteOptionUseCase } from '../../domain/useCases/VoteOption/createVoteOption/CreateVoteOptionUseCase.js';
import { UpdateVoteOptionUseCase } from '../../domain/useCases/VoteOption/updateVoteOption/UpdateVoteOptionUseCase.js';
import { DeleteVoteOptionUseCase } from '../../domain/useCases/VoteOption/deleteVoteOption/DeleteVoteOptionUseCase.js';
import { FindVoteOptionByIdUseCase } from '../../domain/useCases/VoteOption/findVoteOptionById/FindVoteOptionByIdUseCase.js';
import { ListVoteOptionsUseCase } from '../../domain/useCases/VoteOption/listVoteOptions/ListVoteOptionsUseCase.js';
import { ZodValidationPipe } from '../../middlewares/zodValidationPipe.js';
import { CurrentCityId } from '../auth/decorators/currentCityId.decorator.js';
import { JwtUserGuard } from '../auth/guards/JwtUserGuard.js';
import { buildResponse } from '../helpers/apiResponse.js';
import { logger } from '../logger/logger.js';
import {
  createVoteOptionSchema,
  updateVoteOptionSchema,
} from '../validation/schemas/voteOptionSchemas.js';

@Controller('vote-options')
export class VoteOptionController {
  constructor(
    private readonly createUseCase: CreateVoteOptionUseCase,
    private readonly updateUseCase: UpdateVoteOptionUseCase,
    private readonly deleteUseCase: DeleteVoteOptionUseCase,
    private readonly findByIdUseCase: FindVoteOptionByIdUseCase,
    private readonly listUseCase: ListVoteOptionsUseCase,
  ) {}

  @Post()
  @UseGuards(JwtUserGuard)
  @UsePipes(new ZodValidationPipe(createVoteOptionSchema))
  async create(@Body() body: any, @Req() req: Request) {
    try {
      const result = await this.createUseCase.execute(body);
      logger.info({
        module: 'VoteOptions',
        action: 'createVoteOption',
        message: 'Vote option created',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 201,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'VoteOptions',
        action: 'createVoteOption',
        message: 'Error at creating vote option',
      });
      throw error;
    }
  }

  @Get()
  async list(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
    @Query('voteId') voteId: string,
    @CurrentCityId() cityId: string | undefined,
    @Req() req: Request,
  ) {
    try {
      const result = await this.listUseCase.execute(
        { page: Number(page) || 1, perPage: Number(perPage) || 10 },
        voteId || undefined,
        cityId,
      );
      logger.info({
        module: 'VoteOptions',
        action: 'listVoteOptions',
        message: 'Vote options listed',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'VoteOptions',
        action: 'listVoteOptions',
        message: 'Error at listing vote options',
      });
      throw error;
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: Request) {
    try {
      const result = await this.findByIdUseCase.execute(id);
      logger.info({
        module: 'VoteOptions',
        action: 'findVoteOptionById',
        message: 'Vote option found',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'VoteOptions',
        action: 'findVoteOptionById',
        message: 'Error at finding vote option',
      });
      throw error;
    }
  }

  @Put(':id')
  @UseGuards(JwtUserGuard)
  @UsePipes(new ZodValidationPipe(updateVoteOptionSchema))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: Request,
  ) {
    try {
      const result = await this.updateUseCase.execute(id, body);
      logger.info({
        module: 'VoteOptions',
        action: 'updateVoteOption',
        message: 'Vote option updated',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'VoteOptions',
        action: 'updateVoteOption',
        message: 'Error at updating vote option',
      });
      throw error;
    }
  }

  @Delete(':id')
  @UseGuards(JwtUserGuard)
  async remove(@Param('id') id: string, @Req() req: Request) {
    try {
      await this.deleteUseCase.execute(id);
      logger.info({
        module: 'VoteOptions',
        action: 'deleteVoteOption',
        message: 'Vote option deleted',
      });
      return buildResponse({
        res: null,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'VoteOptions',
        action: 'deleteVoteOption',
        message: 'Error at deleting vote option',
      });
      throw error;
    }
  }
}
