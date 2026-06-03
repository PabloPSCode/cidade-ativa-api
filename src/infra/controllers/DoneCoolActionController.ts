import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards, UsePipes } from '@nestjs/common';
import type { Request } from 'express';
import { ZodValidationPipe } from '../../middlewares/zodValidationPipe.js';
import { JwtUserGuard } from '../auth/guards/JwtUserGuard.js';
import { buildResponse } from '../helpers/apiResponse.js';
import { createDoneCoolActionSchema, updateDoneCoolActionSchema } from '../validation/schemas/doneCoolActionSchemas.js';
import { CreateDoneCoolActionUseCase } from '../../domain/useCases/createDoneCoolAction/CreateDoneCoolActionUseCase.js';
import { UpdateDoneCoolActionUseCase } from '../../domain/useCases/updateDoneCoolAction/UpdateDoneCoolActionUseCase.js';
import { DeleteDoneCoolActionUseCase } from '../../domain/useCases/deleteDoneCoolAction/DeleteDoneCoolActionUseCase.js';
import { FindDoneCoolActionByIdUseCase } from '../../domain/useCases/findDoneCoolActionById/FindDoneCoolActionByIdUseCase.js';
import { ListDoneCoolActionsUseCase } from '../../domain/useCases/listDoneCoolActions/ListDoneCoolActionsUseCase.js';

@Controller('done-cool-actions')
@UseGuards(JwtUserGuard)
export class DoneCoolActionController {
  constructor(
    private readonly createUseCase: CreateDoneCoolActionUseCase,
    private readonly updateUseCase: UpdateDoneCoolActionUseCase,
    private readonly deleteUseCase: DeleteDoneCoolActionUseCase,
    private readonly findByIdUseCase: FindDoneCoolActionByIdUseCase,
    private readonly listUseCase: ListDoneCoolActionsUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createDoneCoolActionSchema))
  async create(@Body() body: any, @Req() req: Request) {
    const result = await this.createUseCase.execute(body);
    return buildResponse({ res: result, success: true, status: 201, path: req.path });
  }

  @Get()
  async list(@Query('page') page: string, @Query('perPage') perPage: string, @Query('userId') userId: string, @Req() req: Request) {
    const result = await this.listUseCase.execute({ page: Number(page) || 1, perPage: Number(perPage) || 10 }, userId);
    return buildResponse({ res: result, success: true, status: 200, path: req.path });
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: Request) {
    const result = await this.findByIdUseCase.execute(id);
    return buildResponse({ res: result, success: true, status: 200, path: req.path });
  }

  @Put(':id')
  @UsePipes(new ZodValidationPipe(updateDoneCoolActionSchema))
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
