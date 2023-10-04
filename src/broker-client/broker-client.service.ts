import {
  ConflictException,
  Injectable,
  NotFoundException,
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
    const existingClient = await this.clientModel.findOne({
      username: registerDto.username,
    });

    if (existingClient) {
      throw new ConflictException(
        'Broker client with the same username already exists.',
      );
    }

    const client = new this.clientModel(registerDto);
    const savedClient = await client.save();

    const clientOutput = savedClient.toObject();
    clientOutput.id_client = clientOutput._id;
    delete clientOutput._id;

    return clientOutput;
  }

  public async findAll(): Promise<BrokerClient[]> {
    return this.clientModel.find();
  }

  public async findById(_id: string): Promise<BrokerClient> {
    const client = await this.clientModel.findOne({ _id });

    if (!client) {
      throw new NotFoundException('Broker client not found.');
    }

    return client;
  }

  async findByIndex(index: number): Promise<BrokerClient | null> {
    return this.clientModel
      .findOne()
      .skip(index - 1)
      .exec();
  }

  public async deleteById(_id: string): Promise<void> {
    const result = await this.clientModel.deleteOne({ _id });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Broker client not found.');
    }
  }

  public async deleteByIndex(index: number): Promise<void> {
    const clientToDelete = await this.clientModel
      .findOne()
      .skip(index - 1)
      .exec();

    if (!clientToDelete) {
      throw new NotFoundException('Broker client not found.');
    }

    const result = await this.clientModel
      .deleteOne({
        _id: clientToDelete._id,
      })
      .exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException('Broker client not found.');
    }
  }

  public async updateById(
    _id: string,
    updateDto: DtoUpdate,
  ): Promise<BrokerClient> {
    const client = await this.clientModel.findById(_id);

    if (!client) {
      throw new NotFoundException('Broker client not found.');
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
      throw new NotFoundException('Broker client not found.');
    }

    Object.assign(client, updateDto);

    const updatedClient = await client.save();

    return updatedClient;
  }
}
