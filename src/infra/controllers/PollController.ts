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
import { CreatePollUseCase } from '../../domain/useCases/Poll/createPoll/CreatePollUseCase.js';
import { UpdatePollUseCase } from '../../domain/useCases/Poll/updatePoll/UpdatePollUseCase.js';
import { DeletePollUseCase } from '../../domain/useCases/Poll/deletePoll/DeletePollUseCase.js';
import { FindPollByIdUseCase } from '../../domain/useCases/Poll/findPollById/FindPollByIdUseCase.js';
import { ListPollsUseCase } from '../../domain/useCases/Poll/listPolls/ListPollsUseCase.js';
import { ZodValidationPipe } from '../../middlewares/zodValidationPipe.js';
import { JwtUserGuard } from '../auth/guards/JwtUserGuard.js';
import { buildResponse } from '../helpers/apiResponse.js';
import { logger } from '../logger/logger.js';
import {
  createPollSchema,
  updatePollSchema,
} from '../validation/schemas/pollSchemas.js';

@Controller('polls')
export class PollController {
  constructor(
    private readonly createUseCase: CreatePollUseCase,
    private readonly updateUseCase: UpdatePollUseCase,
    private readonly deleteUseCase: DeletePollUseCase,
    private readonly findByIdUseCase: FindPollByIdUseCase,
    private readonly listUseCase: ListPollsUseCase,
  ) {}

  @Post()
  @UseGuards(JwtUserGuard)
  @UsePipes(new ZodValidationPipe(createPollSchema))
  async create(@Body() body: any, @Req() req: Request) {
    try {
      const result = await this.createUseCase.execute(body);
      logger.info({
        module: 'Polls',
        action: 'createPoll',
        message: 'Poll created',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 201,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Polls',
        action: 'createPoll',
        message: 'Error at creating poll',
      });
      throw error;
    }
  }

  @Get()
  async list(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
    @Query('status') status: string,
    @Req() req: Request,
  ) {
    try {
      const result = await this.listUseCase.execute(
        { page: Number(page) || 1, perPage: Number(perPage) || 10 },
        status || undefined,
      );
      logger.info({
        module: 'Polls',
        action: 'listPolls',
        message: 'Polls listed',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Polls',
        action: 'listPolls',
        message: 'Error at listing polls',
      });
      throw error;
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: Request) {
    try {
      const result = await this.findByIdUseCase.execute(id);
      logger.info({
        module: 'Polls',
        action: 'findPollById',
        message: 'Poll found',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Polls',
        action: 'findPollById',
        message: 'Error at finding poll',
      });
      throw error;
    }
  }

  @Put(':id')
  @UseGuards(JwtUserGuard)
  @UsePipes(new ZodValidationPipe(updatePollSchema))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: Request,
  ) {
    try {
      const result = await this.updateUseCase.execute(id, body);
      logger.info({
        module: 'Polls',
        action: 'updatePoll',
        message: 'Poll updated',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Polls',
        action: 'updatePoll',
        message: 'Error at updating poll',
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
        module: 'Polls',
        action: 'deletePoll',
        message: 'Poll deleted',
      });
      return buildResponse({
        res: null,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Polls',
        action: 'deletePoll',
        message: 'Error at deleting poll',
      });
      throw error;
    }
  }
}
