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
import { CreateCityUseCase } from '../../domain/useCases/City/createCity/CreateCityUseCase.js';
import { DeleteCityUseCase } from '../../domain/useCases/City/deleteCity/DeleteCityUseCase.js';
import { FindCityByIdUseCase } from '../../domain/useCases/City/findCityById/FindCityByIdUseCase.js';
import { ListCitiesUseCase } from '../../domain/useCases/City/listCities/ListCitiesUseCase.js';
import { UpdateCityUseCase } from '../../domain/useCases/City/updateCity/UpdateCityUseCase.js';
import { ZodValidationPipe } from '../../middlewares/zodValidationPipe.js';
import { buildResponse } from '../helpers/apiResponse.js';
import { logger } from '../logger/logger.js';
import {
  createCitySchema,
  updateCitySchema,
} from '../validation/schemas/citySchemas.js';

@Controller('cities')
export class CityController {
  constructor(
    private readonly createUseCase: CreateCityUseCase,
    private readonly updateUseCase: UpdateCityUseCase,
    private readonly deleteUseCase: DeleteCityUseCase,
    private readonly findByIdUseCase: FindCityByIdUseCase,
    private readonly listUseCase: ListCitiesUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createCitySchema))
  async create(@Body() body: any, @Req() req: Request) {
    try {
      const result = await this.createUseCase.execute(body);
      logger.info({
        module: 'Cities',
        action: 'createCity',
        message: 'City created',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 201,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Cities',
        action: 'createCity',
        message: 'Error at creating city',
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
        module: 'Cities',
        action: 'listCities',
        message: 'Cities listed',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Cities',
        action: 'listCities',
        message: 'Error at listing cities',
      });
      throw error;
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: Request) {
    try {
      const result = await this.findByIdUseCase.execute(id);
      logger.info({
        module: 'Cities',
        action: 'findCityById',
        message: 'City found',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Cities',
        action: 'findCityById',
        message: 'Error at finding city',
      });
      throw error;
    }
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateCitySchema))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: Request,
  ) {
    try {
      const result = await this.updateUseCase.execute(id, body);
      logger.info({
        module: 'Cities',
        action: 'updateCity',
        message: 'City updated',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Cities',
        action: 'updateCity',
        message: 'Error at updating city',
      });
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    try {
      await this.deleteUseCase.execute(id);
      logger.info({
        module: 'Cities',
        action: 'deleteCity',
        message: 'City deleted',
      });
      return buildResponse({
        res: null,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Cities',
        action: 'deleteCity',
        message: 'Error at deleting city',
      });
      throw error;
    }
  }
}
