import {
  Controller,
  Post,
  HttpCode,
  Body,
  HttpStatus,
  Get,
  Param,
  Delete,
  Patch,
  UnauthorizedException,
  ForbiddenException,
  ConflictException,
  UnprocessableEntityException,
  NotFoundException,
} from '@nestjs/common';
import { BrokerClientService } from './broker-client.service';
import { RegisterDto } from './dtos/register.dto';
import { BrokerClient } from './models/broker-client.model';
import { DtoUpdate } from './dtos/update.dto';

@Controller('broker-client')
export class BrokerClientController {
  constructor(private readonly clientService: BrokerClientService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async register(
    @Body() registerDto: RegisterDto,
  ): Promise<BrokerClient | ErrorResponse> {
    try {
      const client = await this.clientService.register(registerDto);
      return client;
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException({
          status: HttpStatus.CONFLICT,
          msg: 'Broker Client already exist!',
        });
      } else if (error instanceof UnprocessableEntityException) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          msg: 'Syntax Error!',
        });
      } else {
        throw error;
      }
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async findAll(): Promise<BrokerClient[] | ErrorResponse> {
    try {
      const clients = await this.clientService.findAll();
      return clients;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException({
          status: HttpStatus.UNAUTHORIZED,
          msg: 'Broker Client is not logged in!',
        });
      } else if (error instanceof ForbiddenException) {
        throw new ForbiddenException({
          status: HttpStatus.FORBIDDEN,
          msg: 'Broker Client do not have permission!',
        });
      } else {
        throw error;
      }
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async findOne(
    @Param('id') _id: string,
  ): Promise<BrokerClient | ErrorResponse> {
    try {
      return await this.clientService.findById(_id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          msg: 'Broker Client not found.',
        });
      } else if (error.name === 'CastError' && error.kind === 'ObjectId') {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          msg: 'Validation Error (id must be a valid ObjectId)',
        });
      } else if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException({
          status: HttpStatus.UNAUTHORIZED,
          msg: 'Broker Client is not logged in!',
        });
      } else if (error instanceof ForbiddenException) {
        throw new ForbiddenException({
          status: HttpStatus.FORBIDDEN,
          msg: 'Broker Client do not have permission!',
        });
      } else {
        throw error;
      }
    }
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id') _id: string): Promise<void> {
    try {
      await this.clientService.deleteById(_id);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          msg: 'Broker Client not found.',
        });
      } else if (error instanceof ForbiddenException) {
        throw new ForbiddenException({
          status: HttpStatus.FORBIDDEN,
          msg: 'Do not have permission to remove!',
        });
      } else {
        throw error;
      }
    }
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  public async update(
    @Param('id') _id: string,
    @Body() updateDto: DtoUpdate,
  ): Promise<BrokerClient | ErrorResponse> {
    try {
      return await this.clientService.updateById(_id, updateDto);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException({
          status: HttpStatus.NOT_FOUND,
          msg: 'Broker Client not found.',
        });
      } else if (error instanceof ForbiddenException) {
        throw new ForbiddenException({
          status: HttpStatus.FORBIDDEN,
          msg: 'Do not have permission to update!',
        });
      } else if (error instanceof ConflictException) {
        throw new ConflictException({
          status: HttpStatus.CONFLICT,
          msg: 'In conflict with another process',
        });
      } else {
        throw error;
      }
    }
  }
}

interface ErrorResponse {
  status: number;
  msg: string;
}
