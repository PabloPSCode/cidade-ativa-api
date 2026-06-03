import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards, UsePipes } from '@nestjs/common';
import type { Request } from 'express';
import { ZodValidationPipe } from '../../middlewares/zodValidationPipe.js';
import { JwtUserGuard } from '../auth/guards/JwtUserGuard.js';
import { buildResponse } from '../helpers/apiResponse.js';
import { createUFSchema, updateUFSchema } from '../validation/schemas/ufSchemas.js';
import { CreateUFUseCase } from '../../domain/useCases/createUF/CreateUFUseCase.js';
import { UpdateUFUseCase } from '../../domain/useCases/updateUF/UpdateUFUseCase.js';
import { DeleteUFUseCase } from '../../domain/useCases/deleteUF/DeleteUFUseCase.js';
import { FindUFByIdUseCase } from '../../domain/useCases/findUFById/FindUFByIdUseCase.js';
import { ListUFsUseCase } from '../../domain/useCases/listUFs/ListUFsUseCase.js';

@Controller('ufs')
@UseGuards(JwtUserGuard)
export class UFController {
  constructor(
    private readonly createUseCase: CreateUFUseCase,
    private readonly updateUseCase: UpdateUFUseCase,
    private readonly deleteUseCase: DeleteUFUseCase,
    private readonly findByIdUseCase: FindUFByIdUseCase,
    private readonly listUseCase: ListUFsUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createUFSchema))
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
  @UsePipes(new ZodValidationPipe(updateUFSchema))
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
