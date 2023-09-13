import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Model } from 'mongoose';
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
    return client.save();
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

  public async deleteById(_id: string): Promise<void> {
    const result = await this.clientModel.deleteOne({ _id });

    if (result.deletedCount === 0) {
      throw new NotFoundException('Broker client not found.');
    }
  }

  public async updateById(
    _id: string,
    updateDto: DtoUpdate,
  ): Promise<BrokerClient> {
    const client = await this.findById(_id);
    Object.assign(client, updateDto);
    return client.save();
  }
}
