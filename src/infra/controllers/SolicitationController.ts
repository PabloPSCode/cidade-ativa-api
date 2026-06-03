import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards, UsePipes } from '@nestjs/common';
import type { Request } from 'express';
import { ZodValidationPipe } from '../../middlewares/zodValidationPipe.js';
import { JwtUserGuard } from '../auth/guards/JwtUserGuard.js';
import { buildResponse } from '../helpers/apiResponse.js';
import { createSolicitationSchema, updateSolicitationSchema } from '../validation/schemas/solicitationSchemas.js';
import { CreateSolicitationUseCase } from '../../domain/useCases/createSolicitation/CreateSolicitationUseCase.js';
import { UpdateSolicitationUseCase } from '../../domain/useCases/updateSolicitation/UpdateSolicitationUseCase.js';
import { DeleteSolicitationUseCase } from '../../domain/useCases/deleteSolicitation/DeleteSolicitationUseCase.js';
import { FindSolicitationByIdUseCase } from '../../domain/useCases/findSolicitationById/FindSolicitationByIdUseCase.js';
import { ListSolicitationsUseCase } from '../../domain/useCases/listSolicitations/ListSolicitationsUseCase.js';

@Controller('solicitations')
@UseGuards(JwtUserGuard)
export class SolicitationController {
  constructor(
    private readonly createUseCase: CreateSolicitationUseCase,
    private readonly updateUseCase: UpdateSolicitationUseCase,
    private readonly deleteUseCase: DeleteSolicitationUseCase,
    private readonly findByIdUseCase: FindSolicitationByIdUseCase,
    private readonly listUseCase: ListSolicitationsUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createSolicitationSchema))
  async create(@Body() body: any, @Req() req: Request) {
    const result = await this.createUseCase.execute(body);
    return buildResponse({ res: result, success: true, status: 201, path: req.path });
  }

  @Get()
  async list(@Query('page') page: string, @Query('perPage') perPage: string, @Query('userId') userId: string, @Query('status') status: string, @Req() req: Request) {
    const result = await this.listUseCase.execute(
      { page: Number(page) || 1, perPage: Number(perPage) || 10 },
      { userId, status },
    );
    return buildResponse({ res: result, success: true, status: 200, path: req.path });
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: Request) {
    const result = await this.findByIdUseCase.execute(id);
    return buildResponse({ res: result, success: true, status: 200, path: req.path });
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateSolicitationSchema))
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
