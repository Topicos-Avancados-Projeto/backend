import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import mongoose, { Model, Types } from 'mongoose';
import { BrokerClient } from './models/broker-client.model';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterDto } from './dtos/register.dto';
import { DtoUpdate } from './dtos/update.dto';

@Injectable()
export class BrokerClientService {
  constructor(
    @InjectModel('BrokerClient')
    private readonly clientModel: Model<BrokerClient>,
  ) {}

  public async register(registerDto: RegisterDto): Promise<BrokerClient> {
    let existingClient;

    try {
      existingClient = await this.clientModel.findOne({
        username: registerDto.username,
      });
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to check for existing client.',
      );
    }

    if (existingClient) {
      throw new ConflictException(
        'Broker client with the same username already exists.',
      );
    }

    const client = new this.clientModel(registerDto);

    try {
      return await client.save();
    } catch (error) {
      throw new UnprocessableEntityException('Failed to register the client.');
    }
  }

  public async findAll(): Promise<BrokerClient[]> {
    try {
      const clients = await this.clientModel.find();

      if (!clients || clients.length === 0) {
        throw new NotFoundException('No Broker Clients found.');
      }

      return clients;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('Broker Client is not logged in!');
      } else if (error instanceof ForbiddenException) {
        throw new ForbiddenException('Broker Client do not have permission!');
      }
    }
  }

  public async findById(_id: string): Promise<BrokerClient> {
    const client = await this.clientModel.findOne({ _id });

    if (!client) {
      throw new NotFoundException(`Usuário com id ${_id} não encontrado`);
    }

    return client;
  }

  public async findByIndex(index: number): Promise<BrokerClient> {
    const client = await this.clientModel
      .findOne()
      .skip(index - 1)
      .exec();

    if (!client) {
      throw new NotFoundException(`Usuário em index ${index} não encontrado`);
    }

    return client;
  }

  public async deleteById(_id: string): Promise<void> {
    const result = await this.clientModel.deleteOne({ _id });

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Broker Client with id ${_id} not found.`);
    }
  }

  public async deleteByIndex(index: number): Promise<void> {
    const clientToDelete = await this.clientModel
      .findOne()
      .skip(index - 1)
      .exec();

    if (!clientToDelete) {
      throw new NotFoundException(`Broker Client at index ${index} not found.`);
    }

    const result = await this.clientModel
      .deleteOne({ _id: clientToDelete._id })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Broker Client at index ${index} not found.`);
    }
  }

  public async updateById(
    _id: string,
    updateDto: DtoUpdate,
  ): Promise<BrokerClient> {
    let existingClient;
    existingClient = await this.clientModel.findOne({
      username: updateDto.username,
    });

    if (existingClient) {
      throw new ConflictException(
        'Broker client with the same username already exists.',
      );
    }

    const client = await this.clientModel.findById(_id);

    if (!client) {
      throw new NotFoundException(`Broker Client with id ${_id} not found.`);
    }

    Object.assign(client, updateDto);
    const updatedClient = await client.save();
    return updatedClient;
  }

  public async updateByIndex(
    index: number,
    updateDto: DtoUpdate,
  ): Promise<BrokerClient> {
    const client = await this.clientModel
      .findOne()
      .skip(index - 1)
      .exec();

    if (!client) {
      throw new NotFoundException(`Broker Client at index ${index} not found.`);
    }

    let existingClient;
    existingClient = await this.clientModel.findOne({
      username: updateDto.username,
    });

    if (existingClient) {
      throw new ConflictException(
        'Broker client with the same username already exists.',
      );
    }

    Object.assign(client, updateDto);
    const updatedClient = await client.save();
    return updatedClient;
  }
}
