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
import { CreateVoteUseCase } from '../../domain/useCases/createVote/CreateVoteUseCase.js';
import { UpdateVoteUseCase } from '../../domain/useCases/updateVote/UpdateVoteUseCase.js';
import { DeleteVoteUseCase } from '../../domain/useCases/deleteVote/DeleteVoteUseCase.js';
import { FindVoteByIdUseCase } from '../../domain/useCases/findVoteById/FindVoteByIdUseCase.js';
import { ListVotesUseCase } from '../../domain/useCases/listVotes/ListVotesUseCase.js';
import { ZodValidationPipe } from '../../middlewares/zodValidationPipe.js';
import { JwtUserGuard } from '../auth/guards/JwtUserGuard.js';
import { buildResponse } from '../helpers/apiResponse.js';
import { logger } from '../logger/logger.js';
import {
  createVoteSchema,
  updateVoteSchema,
} from '../validation/schemas/voteSchemas.js';

@Controller('votes')
export class VoteController {
  constructor(
    private readonly createUseCase: CreateVoteUseCase,
    private readonly updateUseCase: UpdateVoteUseCase,
    private readonly deleteUseCase: DeleteVoteUseCase,
    private readonly findByIdUseCase: FindVoteByIdUseCase,
    private readonly listUseCase: ListVotesUseCase,
  ) {}

  @Post()
  @UseGuards(JwtUserGuard)
  @UsePipes(new ZodValidationPipe(createVoteSchema))
  async create(@Body() body: any, @Req() req: Request) {
    try {
      const result = await this.createUseCase.execute(body);
      logger.info({
        module: 'Votes',
        action: 'createVote',
        message: 'Vote created',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 201,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Votes',
        action: 'createVote',
        message: 'Error at creating vote',
      });
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtUserGuard)
  async list(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
    @Query('pollId') pollId: string,
    @Query('userId') userId: string,
    @Req() req: Request,
  ) {
    try {
      const result = await this.listUseCase.execute(
        { page: Number(page) || 1, perPage: Number(perPage) || 10 },
        { pollId: pollId || undefined, userId: userId || undefined },
      );
      logger.info({
        module: 'Votes',
        action: 'listVotes',
        message: 'Votes listed',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Votes',
        action: 'listVotes',
        message: 'Error at listing votes',
      });
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(JwtUserGuard)
  async findById(@Param('id') id: string, @Req() req: Request) {
    try {
      const result = await this.findByIdUseCase.execute(id);
      logger.info({
        module: 'Votes',
        action: 'findVoteById',
        message: 'Vote found',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Votes',
        action: 'findVoteById',
        message: 'Error at finding vote',
      });
      throw error;
    }
  }

  @Put(':id')
  @UseGuards(JwtUserGuard)
  @UsePipes(new ZodValidationPipe(updateVoteSchema))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: Request,
  ) {
    try {
      const result = await this.updateUseCase.execute(id, body);
      logger.info({
        module: 'Votes',
        action: 'updateVote',
        message: 'Vote updated',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Votes',
        action: 'updateVote',
        message: 'Error at updating vote',
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
        module: 'Votes',
        action: 'deleteVote',
        message: 'Vote deleted',
      });
      return buildResponse({
        res: null,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Votes',
        action: 'deleteVote',
        message: 'Error at deleting vote',
      });
      throw error;
    }
  }
}
