import { Controller, Get, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { ListNeighborhoodsUseCase } from '../../domain/useCases/listNeighborhoods/ListNeighborhoodsUseCase.js';
import { buildResponse } from '../helpers/apiResponse.js';
import { logger } from '../logger/logger.js';

@Controller('neighborhoods')
export class NeighborhoodController {
  constructor(private readonly listUseCase: ListNeighborhoodsUseCase) {}

  @Get()
  async list(@Query('cityName') cityName: string, @Req() req: Request) {
    try {
      const result = await this.listUseCase.execute(cityName || undefined);
      logger.info({
        module: 'Neighborhoods',
        action: 'listNeighborhoods',
        message: 'Neighborhoods listed',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Neighborhoods',
        action: 'listNeighborhoods',
        message: 'Error at listing neighborhoods',
      });
      throw error;
    }
  }
}
