import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateDeviceTypeDto } from './dto/create-device-type.dto';
import { UpdateDeviceTypeDto } from './dto/update-device-type.dto';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceType } from './models/device-type.model';
import { Model } from 'mongoose';

@Injectable()
export class DeviceTypesService {
  constructor(
    @InjectModel('DeviceType')
    private readonly typeModel: Model<DeviceType>,
  ) {}

  public async create(
    createDeviceTypeDto: CreateDeviceTypeDto,
  ): Promise<DeviceType> {
    const type = new this.typeModel(createDeviceTypeDto);

    try {
      await type.save();
      return type;
    } catch (error) {
      throw new UnprocessableEntityException('Failed to register the type.');
    }
  }

  public async findAll(): Promise<DeviceType[]> {
    try {
      const type = await this.typeModel.find();

      if (!type || type.length === 0) {
        throw new NotFoundException('No types found.');
      }

      return type;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw new UnauthorizedException('User is not logged in!');
      } else if (error instanceof ForbiddenException) {
        throw new ForbiddenException('User do not have permission!');
      }
    }
  }

  public async findById(_id: string): Promise<DeviceType> {
    const type = await this.typeModel.findOne({ _id });

    if (!type) {
      throw new NotFoundException(`Type does not exist.`);
    }

    return type;
  }

  public async findByIndex(index: number): Promise<DeviceType> {
    const type = await this.typeModel
      .findOne()
      .skip(index - 1)
      .exec();

    if (!type) {
      throw new NotFoundException(`Type does not exist.`);
    }

    return type;
  }

  public async updateById(
    _id: string,
    updateDeviceTypeDto: UpdateDeviceTypeDto,
  ): Promise<DeviceType> {
    const type = await this.typeModel.findById(_id);

    if (!type) {
      throw new NotFoundException(`Type does not exist.`);
    }

    if (updateDeviceTypeDto.name !== type.name) {
      const existingType = await this.typeModel.findOne({
        name: updateDeviceTypeDto.name,
      });

      if (existingType) {
        throw new ConflictException('Type Already exists!');
      }
    }

    Object.assign(type, updateDeviceTypeDto);
    const updatedType = await type.save();
    return updatedType;
  }

  public async updateByIndex(
    index: number,
    updateDeviceTypeDto: UpdateDeviceTypeDto,
  ): Promise<DeviceType> {
    const type = await this.typeModel
      .findOne()
      .skip(index - 1)
      .exec();

    if (!type) {
      throw new NotFoundException(`Type does not exist.`);
    }

    if (updateDeviceTypeDto.name !== type.name) {
      const existingType = await this.typeModel.findOne({
        name: updateDeviceTypeDto.name,
      });

      if (existingType) {
        throw new ConflictException('Type Already exists!');
      }
    }

    Object.assign(type, updateDeviceTypeDto);
    const updatedType = await type.save();
    return updatedType;
  }

  public async deleteById(_id: string): Promise<void> {
    const result = await this.typeModel.deleteOne({ _id });

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Type does not exist.`);
    }
  }

  public async deleteByIndex(index: number): Promise<void> {
    const type = await this.typeModel
      .findOne()
      .skip(index - 1)
      .exec();

    if (!type) {
      throw new NotFoundException(`Type does not exist.`);
    }

    const result = await this.typeModel.deleteOne({ _id: type._id }).exec();

    if (result.deletedCount === 0) {
      throw new NotFoundException(`Type does not exist.`);
    }
  }
}
