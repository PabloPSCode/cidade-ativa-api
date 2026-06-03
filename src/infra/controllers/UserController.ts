import {
  Controller, Get, Post, Put, Delete,
  Body, Param, Query, Req, UseGuards, UsePipes,
} from '@nestjs/common';
import type { Request } from 'express';
import { ZodValidationPipe } from '../../middlewares/zodValidationPipe.js';
import { JwtUserGuard } from '../auth/guards/JwtUserGuard.js';
import { buildResponse } from '../helpers/apiResponse.js';
import { createUserSchema, updateUserSchema, authenticateUserSchema } from '../validation/schemas/userSchemas.js';
import { CreateUserUseCase } from '../../domain/useCases/createUser/CreateUserUseCase.js';
import { UpdateUserUseCase } from '../../domain/useCases/updateUser/UpdateUserUseCase.js';
import { DeleteUserUseCase } from '../../domain/useCases/deleteUser/DeleteUserUseCase.js';
import { FindUserByIdUseCase } from '../../domain/useCases/findUserById/FindUserByIdUseCase.js';
import { FindUserByEmailUseCase } from '../../domain/useCases/findUserByEmail/FindUserByEmailUseCase.js';
import { ListUsersUseCase } from '../../domain/useCases/listUsers/ListUsersUseCase.js';
import { AuthenticateUserUseCase } from '../../domain/useCases/authenticateUser/AuthenticateUserUseCase.js';

@Controller()
export class UserController {
  constructor(
    private readonly createUseCase: CreateUserUseCase,
    private readonly updateUseCase: UpdateUserUseCase,
    private readonly deleteUseCase: DeleteUserUseCase,
    private readonly findByIdUseCase: FindUserByIdUseCase,
    private readonly findByEmailUseCase: FindUserByEmailUseCase,
    private readonly listUseCase: ListUsersUseCase,
    private readonly authenticateUseCase: AuthenticateUserUseCase,
  ) {}

  @Post('users')
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(@Body() body: any, @Req() req: Request) {
    const result = await this.createUseCase.execute(body);
    return buildResponse({ res: result, success: true, status: 201, path: req.path });
  }

  @Get('users')
  @UseGuards(JwtUserGuard)
  async list(@Query('page') page: string, @Query('perPage') perPage: string, @Req() req: Request) {
    const result = await this.listUseCase.execute({ page: Number(page) || 1, perPage: Number(perPage) || 10 });
    return buildResponse({ res: result, success: true, status: 200, path: req.path });
  }

  @Get('users/email/:email')
  @UseGuards(JwtUserGuard)
  async findByEmail(@Param('email') email: string, @Req() req: Request) {
    const result = await this.findByEmailUseCase.execute(email);
    return buildResponse({ res: result, success: true, status: 200, path: req.path });
  }

  @Get('users/:id')
  @UseGuards(JwtUserGuard)
  async findById(@Param('id') id: string, @Req() req: Request) {
    const result = await this.findByIdUseCase.execute(id);
    return buildResponse({ res: result, success: true, status: 200, path: req.path });
  }

  @Put('users/:id')
  @UseGuards(JwtUserGuard)
  @UsePipes(new ZodValidationPipe(updateUserSchema))
  async update(@Param('id') id: string, @Body() body: any, @Req() req: Request) {
    const result = await this.updateUseCase.execute(id, body);
    return buildResponse({ res: result, success: true, status: 200, path: req.path });
  }

  @Delete('users/:id')
  @UseGuards(JwtUserGuard)
  async remove(@Param('id') id: string, @Req() req: Request) {
    await this.deleteUseCase.execute(id);
    return buildResponse({ res: null, success: true, status: 200, path: req.path });
  }

  @Post('authenticate')
  @UsePipes(new ZodValidationPipe(authenticateUserSchema))
  async authenticate(@Body() body: any, @Req() req: Request) {
    const result = await this.authenticateUseCase.execute(body);
    return buildResponse({ res: result, success: true, status: 200, path: req.path });
  }
}
