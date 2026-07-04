/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
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
import { AuthenticateUserUseCase } from '../../domain/useCases/User/authenticateUser/AuthenticateUserUseCase.js';
import { AuthenticateWithGoogleUseCase } from '../../domain/useCases/User/authenticateWithGoogle/AuthenticateWithGoogleUseCase.js';
import { CreateUserUseCase } from '../../domain/useCases/User/createUser/CreateUserUseCase.js';
import { DeleteUserUseCase } from '../../domain/useCases/User/deleteUser/DeleteUserUseCase.js';
import { FindUserByEmailUseCase } from '../../domain/useCases/User/findUserByEmail/FindUserByEmailUseCase.js';
import { FindUserByIdUseCase } from '../../domain/useCases/User/findUserById/FindUserByIdUseCase.js';
import { ListUsersUseCase } from '../../domain/useCases/User/listUsers/ListUsersUseCase.js';
import { CurrentCityId } from '../auth/decorators/currentCityId.decorator.js';
import { UpdateUserUseCase } from '../../domain/useCases/User/updateUser/UpdateUserUseCase.js';
import { ZodValidationPipe } from '../../middlewares/zodValidationPipe.js';
import { buildResponse } from '../helpers/apiResponse.js';
import { logger } from '../logger/logger.js';
import { AuthThrottle } from '../rateLimit/throttleTiers.js';
import {
  authenticateUserSchema,
  authenticateWithGoogleSchema,
  createUserSchema,
  updateUserSchema,
} from '../validation/schemas/userSchemas.js';

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
    private readonly authenticateWithGoogleUseCase: AuthenticateWithGoogleUseCase,
  ) {}

  @Post('users')
  @AuthThrottle()
  @UsePipes(new ZodValidationPipe(createUserSchema))
  async create(@Body() body: any, @Req() req: Request) {
    try {
      const result = await this.createUseCase.execute(body);
      logger.info({
        module: 'Users',
        action: 'createUser',
        message: 'User created',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 201,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Users',
        action: 'createUser',
        message: 'Error at creating user',
      });
      throw error;
    }
  }

  @Get('users')
  async list(
    @Query('page') page: string,
    @Query('perPage') perPage: string,
    @CurrentCityId() cityId: string | undefined,
    @Req() req: Request,
  ) {
    try {
      const result = await this.listUseCase.execute(
        {
          page: Number(page) || 1,
          perPage: Number(perPage) || 10,
        },
        cityId,
      );
      logger.info({
        module: 'Users',
        action: 'listUsers',
        message: 'Users listed',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Users',
        action: 'listUsers',
        message: 'Error at listing users',
      });
      throw error;
    }
  }

  @Get('users/email/:email')
  async findByEmail(@Param('email') email: string, @Req() req: Request) {
    try {
      const result = await this.findByEmailUseCase.execute(email);
      logger.info({
        module: 'Users',
        action: 'findUserByEmail',
        message: 'User found by email',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Users',
        action: 'findUserByEmail',
        message: 'Error at finding user by email',
      });
      throw error;
    }
  }

  @Get('users/:id')
  async findById(@Param('id') id: string, @Req() req: Request) {
    try {
      const result = await this.findByIdUseCase.execute(id);
      logger.info({
        module: 'Users',
        action: 'findUserById',
        message: 'User found',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Users',
        action: 'findUserById',
        message: 'Error at finding user',
      });
      throw error;
    }
  }

  @Put('users/:id')
  @UsePipes(new ZodValidationPipe(updateUserSchema))
  async update(
    @Param('id') id: string,
    @Body() body: any,
    @Req() req: Request,
  ) {
    try {
      const result = await this.updateUseCase.execute(id, body);
      logger.info({
        module: 'Users',
        action: 'updateUser',
        message: 'User updated',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Users',
        action: 'updateUser',
        message: 'Error at updating user',
      });
      throw error;
    }
  }

  @Delete('users/:id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    try {
      await this.deleteUseCase.execute(id);
      logger.info({
        module: 'Users',
        action: 'deleteUser',
        message: 'User deleted',
      });
      return buildResponse({
        res: null,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Users',
        action: 'deleteUser',
        message: 'Error at deleting user',
      });
      throw error;
    }
  }

  @Post('authenticate-google')
  @AuthThrottle()
  @UsePipes(new ZodValidationPipe(authenticateWithGoogleSchema))
  async authenticateWithGoogle(@Body() body: any, @Req() req: Request) {
    try {
      const result = await this.authenticateWithGoogleUseCase.execute(
        body.email,
      );
      logger.info({
        module: 'Users',
        action: 'authenticateWithGoogle',
        message: 'User authenticated with Google',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Users',
        action: 'authenticateWithGoogle',
        message: 'Error at authenticating user with Google',
      });
      throw error;
    }
  }

  @Post('authenticate')
  @AuthThrottle()
  @UsePipes(new ZodValidationPipe(authenticateUserSchema))
  async authenticate(@Body() body: any, @Req() req: Request) {
    try {
      const result = await this.authenticateUseCase.execute(body);
      logger.info({
        module: 'Users',
        action: 'authenticateUser',
        message: 'User authenticated',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Users',
        action: 'authenticateUser',
        message: 'Error at authenticating user',
      });
      throw error;
    }
  }
}
