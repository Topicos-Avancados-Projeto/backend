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
import { Headers } from '@nestjs/common';
import { BrokerClientService } from './broker-client.service';
import { RegisterDto } from './dtos/register.dto';
import { BrokerClient } from './models/broker-client.model';
import { DtoUpdate } from './dtos/update.dto';
import { Types } from 'mongoose';

@Controller('broker_client')
export class BrokerClientController {
  constructor(private readonly clientService: BrokerClientService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async register(
    @Body() registerDto: RegisterDto,
    @Headers('host') host: string[],
  ): Promise<BrokerClient> {
    try {
      const client = await this.clientService.register(registerDto);
      if (host && host.length > 0) {
        const locationUri = `${host[0]}/Broker_Client/${client.id}`;
        return Object.assign(client, { location: locationUri });
      } else {
        return client;
      }
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException({
          status: HttpStatus.CONFLICT,
          msg: 'Broker Client already exists!',
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

  @Get(':param')
  async getUser(@Param('param') param: string) {
    const parsedParam = Types.ObjectId.isValid(param) ? param : null;
    const index = !parsedParam ? parseInt(param, 10) : null;

    let user;

    if (parsedParam) {
      try {
        user = await this.clientService.findById(parsedParam);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new NotFoundException(`Usuário com id ${param} não encontrado`);
        } else {
          throw error;
        }
      }
    } else if (!isNaN(index) && index >= 1) {
      try {
        user = await this.clientService.findByIndex(index);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new NotFoundException(
            `Usuário em index ${index} não encontrado`,
          );
        } else {
          throw error;
        }
      }
    } else {
      throw new NotFoundException(
        `Nenhum usuário encontrado para o parâmetro ${param}`,
      );
    }

    if (!user) {
      throw new NotFoundException(
        `Usuário com id/index ${param} não encontrado`,
      );
    }

    return user;
  }

  @Delete(':param')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('param') param: string): Promise<void> {
    const parsedParam = Types.ObjectId.isValid(param) ? param : null;
    const index = !parsedParam ? parseInt(param, 10) : null;

    if (parsedParam) {
      try {
        await this.clientService.deleteById(parsedParam);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new NotFoundException(`Broker Client not found.`);
        } else if (error instanceof ForbiddenException) {
          throw new ForbiddenException({
            status: HttpStatus.FORBIDDEN,
            msg: 'Do not have permission to remove!',
          });
        } else {
          throw error;
        }
      }
    } else if (!isNaN(index) && index >= 1) {
      try {
        await this.clientService.deleteByIndex(index);
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new NotFoundException(`Broker Client not found.`);
        } else if (error instanceof ForbiddenException) {
          throw new ForbiddenException({
            status: HttpStatus.FORBIDDEN,
            msg: 'Do not have permission to remove!',
          });
        } else {
          throw error;
        }
      }
    } else {
      throw new NotFoundException(
        `Nenhum usuário encontrado para o parâmetro ${param}`,
      );
    }
  }

  @Patch(':param')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async update(
    @Param('param') param: string,
    @Body() updateDto: DtoUpdate,
  ): Promise<BrokerClient | ErrorResponse> {
    const parsedParam = Types.ObjectId.isValid(param) ? param : null;
    const index = !parsedParam ? parseInt(param, 10) : null;

    if (parsedParam) {
      try {
        const updatedClient = await this.clientService.updateById(
          parsedParam,
          updateDto,
        );
        return updatedClient;
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new NotFoundException(`Broker Client not found.`);
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
    } else if (!isNaN(index) && index >= 1) {
      try {
        const updatedClient = await this.clientService.updateByIndex(
          index,
          updateDto,
        );
        return updatedClient;
      } catch (error) {
        if (error instanceof NotFoundException) {
          throw new NotFoundException(`Broker Client not found.`);
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
    } else {
      throw new NotFoundException(
        `Nenhum usuário encontrado para o parâmetro ${param}`,
      );
    }
  }
}

interface ErrorResponse {
  status: number;
  msg: string;
}
