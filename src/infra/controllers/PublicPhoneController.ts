import { Controller, Get, Post, Put, Delete, Body, Param, Query, Req, UseGuards, UsePipes } from '@nestjs/common';
import type { Request } from 'express';
import { ZodValidationPipe } from '../../middlewares/zodValidationPipe.js';
import { JwtUserGuard } from '../auth/guards/JwtUserGuard.js';
import { buildResponse } from '../helpers/apiResponse.js';
import { createPublicPhoneSchema, updatePublicPhoneSchema } from '../validation/schemas/publicPhoneSchemas.js';
import { CreatePublicPhoneUseCase } from '../../domain/useCases/createPublicPhone/CreatePublicPhoneUseCase.js';
import { UpdatePublicPhoneUseCase } from '../../domain/useCases/updatePublicPhone/UpdatePublicPhoneUseCase.js';
import { DeletePublicPhoneUseCase } from '../../domain/useCases/deletePublicPhone/DeletePublicPhoneUseCase.js';
import { FindPublicPhoneByIdUseCase } from '../../domain/useCases/findPublicPhoneById/FindPublicPhoneByIdUseCase.js';
import { ListPublicPhonesUseCase } from '../../domain/useCases/listPublicPhones/ListPublicPhonesUseCase.js';

@Controller('public-phones')
@UseGuards(JwtUserGuard)
export class PublicPhoneController {
  constructor(
    private readonly createUseCase: CreatePublicPhoneUseCase,
    private readonly updateUseCase: UpdatePublicPhoneUseCase,
    private readonly deleteUseCase: DeletePublicPhoneUseCase,
    private readonly findByIdUseCase: FindPublicPhoneByIdUseCase,
    private readonly listUseCase: ListPublicPhonesUseCase,
  ) {}

  @Post()
  @UsePipes(new ZodValidationPipe(createPublicPhoneSchema))
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
  @UsePipes(new ZodValidationPipe(updatePublicPhoneSchema))
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
