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
import { DeletePublicPhoneUseCase } from '../../domain/useCases/deletePublicPhone/DeletePublicPhoneUseCase.js';
import { FindPublicPhoneByIdUseCase } from '../../domain/useCases/findPublicPhoneById/FindPublicPhoneByIdUseCase.js';
import { ListPublicPhonesUseCase } from '../../domain/useCases/listPublicPhones/ListPublicPhonesUseCase.js';
import { CreatePublicPhoneUseCase } from '../../domain/useCases/createPublicPhone/CreatePublicPhoneUseCase.js';
import { UpdatePublicPhoneUseCase } from '../../domain/useCases/updatePublicPhone/UpdatePublicPhoneUseCase.js';
import { ZodValidationPipe } from '../../middlewares/zodValidationPipe.js';
import { JwtUserGuard } from '../auth/guards/JwtUserGuard.js';
import { buildResponse } from '../helpers/apiResponse.js';
import { logger } from '../logger/logger.js';
import {
  createPublicPhoneSchema,
  updatePublicPhoneSchema,
} from '../validation/schemas/publicPhoneSchemas.js';

@Controller('public-phones')
export class PublicPhoneController {
  constructor(
    private readonly createUseCase: CreatePublicPhoneUseCase,
    private readonly updateUseCase: UpdatePublicPhoneUseCase,
    private readonly deleteUseCase: DeletePublicPhoneUseCase,
    private readonly findByIdUseCase: FindPublicPhoneByIdUseCase,
    private readonly listUseCase: ListPublicPhonesUseCase,
  ) {}

  @Post()
  @UseGuards(JwtUserGuard)
  @UsePipes(new ZodValidationPipe(createPublicPhoneSchema))
  async create(@Body() body: any, @Req() req: Request) {
    try {
      const result = await this.createUseCase.execute(body);
      logger.info({
        module: 'PublicPhones',
        action: 'createPublicPhone',
        message: 'Public phone created',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 201,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'PublicPhones',
        action: 'createPublicPhone',
        message: 'Error at creating public phone',
      });
      throw error;
    }
  }

  @Get()
  async list(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
    @Req() req: Request,
  ) {
    try {
      const result = await this.listUseCase.execute({
        page: Number(page) || 1,
        perPage: Number(perPage) || 10,
      });
      logger.info({
        module: 'PublicPhones',
        action: 'listPublicPhones',
        message: 'Public phones listed',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'PublicPhones',
        action: 'listPublicPhones',
        message: 'Error at listing public phones',
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
        module: 'PublicPhones',
        action: 'findPublicPhoneById',
        message: 'Public phone found',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'PublicPhones',
        action: 'findPublicPhoneById',
        message: 'Error at finding public phone',
      });
      throw error;
    }
  }

  @Put(':id')
  @UseGuards(JwtUserGuard)
  @UsePipes(new ZodValidationPipe(updatePublicPhoneSchema))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: Request,
  ) {
    try {
      const result = await this.updateUseCase.execute(id, body);
      logger.info({
        module: 'PublicPhones',
        action: 'updatePublicPhone',
        message: 'Public phone updated',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'PublicPhones',
        action: 'updatePublicPhone',
        message: 'Error at updating public phone',
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
        module: 'PublicPhones',
        action: 'deletePublicPhone',
        message: 'Public phone deleted',
      });
      return buildResponse({
        res: null,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'PublicPhones',
        action: 'deletePublicPhone',
        message: 'Error at deleting public phone',
      });
      throw error;
    }
  }
}
