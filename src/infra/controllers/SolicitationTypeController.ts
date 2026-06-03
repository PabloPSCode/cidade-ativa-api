import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, Req, UseGuards, UsePipes,
} from '@nestjs/common';
import type { Request } from 'express';
import { ZodValidationPipe } from '../../middlewares/zodValidationPipe.js';
import { JwtUserGuard } from '../auth/guards/JwtUserGuard.js';
import { buildResponse } from '../helpers/apiResponse.js';
import { createSolicitationTypeSchema, updateSolicitationTypeSchema } from '../validation/schemas/solicitationTypeSchemas.js';
import { CreateSolicitationTypeUseCase } from '../../domain/useCases/createSolicitationType/CreateSolicitationTypeUseCase.js';
import { UpdateSolicitationTypeUseCase } from '../../domain/useCases/updateSolicitationType/UpdateSolicitationTypeUseCase.js';
import { DeleteSolicitationTypeUseCase } from '../../domain/useCases/deleteSolicitationType/DeleteSolicitationTypeUseCase.js';
import { FindSolicitationTypeByIdUseCase } from '../../domain/useCases/findSolicitationTypeById/FindSolicitationTypeByIdUseCase.js';
import { ListSolicitationTypesUseCase } from '../../domain/useCases/listSolicitationTypes/ListSolicitationTypesUseCase.js';

@Controller('solicitation-types')
@UseGuards(JwtUserGuard)
export class SolicitationTypeController {
  constructor(
    private readonly createUseCase: CreateSolicitationTypeUseCase,
    private readonly updateUseCase: UpdateSolicitationTypeUseCase,
    private readonly deleteUseCase: DeleteSolicitationTypeUseCase,
    private readonly findByIdUseCase: FindSolicitationTypeByIdUseCase,
    private readonly listUseCase: ListSolicitationTypesUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createSolicitationTypeSchema))
  async create(@Body() body: any, @Req() req: Request) {
    const result = await this.createUseCase.execute(body);
    return buildResponse({ res: result, success: true, status: 201, path: req.path });
  }

  @Get()
  async list(@Query('page') page: string, @Query('perPage') perPage: string, @Req() req: Request) {
    const result = await this.listUseCase.execute({ page: Number(page) || 1, perPage: Number(perPage) || 10 });
    return buildResponse({ res: result, success: true, status: 200, path: req.path });
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: Request) {
    const result = await this.findByIdUseCase.execute(id);
    return buildResponse({ res: result, success: true, status: 200, path: req.path });
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateSolicitationTypeSchema))
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
