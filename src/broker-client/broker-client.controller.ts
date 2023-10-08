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
  Res,
} from '@nestjs/common';
import { BrokerClientService } from './broker-client.service';
import { RegisterDto } from './dtos/register.dto';
import { BrokerClient } from './models/broker-client.model';
import { DtoUpdate } from './dtos/update.dto';
import { Types } from 'mongoose';
import { Response } from 'express';

@Controller('broker_client')
export class BrokerClientController {
  constructor(private readonly clientService: BrokerClientService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async register(
    @Body() registerDto: RegisterDto,
    @Res() response: Response,
  ): Promise<void> {
    const client = await this.clientService.register(registerDto);
    const locationUri = `/Broker_Client/${client.id}`;
    response.setHeader('Location', locationUri);
    response.status(HttpStatus.CREATED).send(client);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async findAll(): Promise<BrokerClient[]> {
    const clients = await this.clientService.findAll();
    return clients;
  }

  @Get(':param')
  async getUser(@Param('param') param: string) {
    const parsedParam = Types.ObjectId.isValid(param) ? param : null;
    const index = !parsedParam ? parseInt(param, 10) : null;

    if (parsedParam) {
      return await this.clientService.findById(parsedParam);
    } else if (!isNaN(index) && index >= 1) {
      return await this.clientService.findByIndex(index);
    } else {
      throw new NotFoundException(
        `Nenhum usuário encontrado para o parâmetro ${param}`,
      );
    }
  }

  @Delete(':param')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('param') param: string): Promise<void> {
    const parsedParam = Types.ObjectId.isValid(param) ? param : null;
    const index = !parsedParam ? parseInt(param, 10) : null;

    if (parsedParam) {
      await this.clientService.deleteById(parsedParam);
    } else if (!isNaN(index) && index >= 1) {
      await this.clientService.deleteByIndex(index);
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
  ): Promise<BrokerClient> {
    const parsedParam = Types.ObjectId.isValid(param) ? param : null;
    const index = !parsedParam ? parseInt(param, 10) : null;

    if (parsedParam) {
      return await this.clientService.updateById(parsedParam, updateDto);
    } else if (!isNaN(index) && index >= 1) {
      return await this.clientService.updateByIndex(index, updateDto);
    } else {
      throw new NotFoundException(
        `Nenhum usuário encontrado para o parâmetro ${param}`,
      );
    }
  }
}
