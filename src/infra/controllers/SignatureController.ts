import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UsePipes,
} from '@nestjs/common';
import type { Request } from 'express';
import { CreateSignatureUseCase } from '../../domain/useCases/Signature/createSignature/CreateSignatureUseCase.js';
import { DeleteSignatureUseCase } from '../../domain/useCases/Signature/deleteSignature/DeleteSignatureUseCase.js';
import { FindSignatureByIdUseCase } from '../../domain/useCases/Signature/findSignatureById/FindSignatureByIdUseCase.js';
import { FindSignatureByUserIdUseCase } from '../../domain/useCases/Signature/findSignatureByUserId/FindSignatureByUserIdUseCase.js';
import { CreateSolicitationSignatureUseCase } from '../../domain/useCases/SolicitationSignature/createSolicitationSignature/CreateSolicitationSignatureUseCase.js';
import { ListSolicitationSignaturesUseCase } from '../../domain/useCases/SolicitationSignature/listSolicitationSignatures/ListSolicitationSignaturesUseCase.js';
import { ZodValidationPipe } from '../../middlewares/zodValidationPipe.js';
import { buildResponse } from '../helpers/apiResponse.js';
import { logger } from '../logger/logger.js';
import { UploadThrottle } from '../rateLimit/throttleTiers.js';
import {
  createSignatureSchema,
  createSolicitationSignatureSchema,
} from '../validation/schemas/signatureSchemas.js';

@Controller('signatures')
export class SignatureController {
  constructor(
    private readonly createUseCase: CreateSignatureUseCase,
    private readonly deleteUseCase: DeleteSignatureUseCase,
    private readonly findByIdUseCase: FindSignatureByIdUseCase,
    private readonly findByUserIdUseCase: FindSignatureByUserIdUseCase,
    private readonly createSolicitationSignatureUseCase: CreateSolicitationSignatureUseCase,
    private readonly listSolicitationSignaturesUseCase: ListSolicitationSignaturesUseCase,
  ) {}

  @Post('solicitation')
  @UsePipes(new ZodValidationPipe(createSolicitationSignatureSchema))
  async signSolicitation(@Body() body: any, @Req() req: Request) {
    try {
      const result =
        await this.createSolicitationSignatureUseCase.execute(body);
      logger.info({
        module: 'Signatures',
        action: 'signSolicitation',
        message: 'Solicitation signed',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 201,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Signatures',
        action: 'signSolicitation',
        message: 'Error at signing solicitation',
      });
      throw error;
    }
  }

  @Get('solicitation/:solicitationId')
  async listBySolicitation(
    @Param('solicitationId') solicitationId: string,
    @Req() req: Request,
  ) {
    try {
      const result =
        await this.listSolicitationSignaturesUseCase.execute(solicitationId);
      logger.info({
        module: 'Signatures',
        action: 'listSolicitationSignatures',
        message: 'Solicitation signatures listed',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Signatures',
        action: 'listSolicitationSignatures',
        message: 'Error at listing solicitation signatures',
      });
      throw error;
    }
  }

  @Post()
  @UploadThrottle()
  @UsePipes(new ZodValidationPipe(createSignatureSchema))
  async create(@Body() body: any, @Req() req: Request) {
    try {
      const result = await this.createUseCase.execute(body);
      logger.info({
        module: 'Signatures',
        action: 'createSignature',
        message: 'Signature created',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 201,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Signatures',
        action: 'createSignature',
        message: 'Error at creating signature',
      });
      throw error;
    }
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string, @Req() req: Request) {
    try {
      const result = await this.findByUserIdUseCase.execute(userId);
      logger.info({
        module: 'Signatures',
        action: 'findSignatureByUserId',
        message: 'Signature found by user',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Signatures',
        action: 'findSignatureByUserId',
        message: 'Error at finding signature by user',
      });
      throw error;
    }
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: Request) {
    try {
      const result = await this.findByIdUseCase.execute(id);
      logger.info({
        module: 'Signatures',
        action: 'findSignatureById',
        message: 'Signature found',
      });
      return buildResponse({
        res: result,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Signatures',
        action: 'findSignatureById',
        message: 'Error at finding signature',
      });
      throw error;
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @Req() req: Request) {
    try {
      await this.deleteUseCase.execute(id);
      logger.info({
        module: 'Signatures',
        action: 'deleteSignature',
        message: 'Signature deleted',
      });
      return buildResponse({
        res: null,
        success: true,
        status: 200,
        path: req.path,
      });
    } catch (error) {
      logger.error({
        module: 'Signatures',
        action: 'deleteSignature',
        message: 'Error at deleting signature',
      });
      throw error;
    }
  }
}
