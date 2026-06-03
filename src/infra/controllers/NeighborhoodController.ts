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
    const result = await this.createUseCase.execute(body);
    return buildResponse({ res: result, success: true, status: 201, path: req.path });
  }

  @Get()
  async list(@Query('page') page: string, @Query('perPage') perPage: string, @Query('cityId') cityId: string, @Req() req: Request) {
    const result = await this.listUseCase.execute({ page: Number(page) || 1, perPage: Number(perPage) || 10 }, cityId);
    return buildResponse({ res: result, success: true, status: 200, path: req.path });
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: Request) {
    const result = await this.findByIdUseCase.execute(id);
    return buildResponse({ res: result, success: true, status: 200, path: req.path });
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateNeighborhoodSchema))
  async update(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    const result = await this.updateUseCase.execute(id, body);
    return buildResponse({ res: result, success: true, status: 200, path: req.path });
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    await this.deleteUseCase.execute(id);
    return buildResponse({ res: null, success: true, status: 200, path: req.path });
  }
}
