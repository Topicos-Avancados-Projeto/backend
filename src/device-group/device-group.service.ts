import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import mongoose, { Model } from 'mongoose';
import { Device } from 'src/device/schemas/device.schema';
import { DeviceGroup } from './schema/device-group.schema';
import { InjectModel } from '@nestjs/mongoose';
import { DeviceGroupPostSchema } from './dto/devices_group_post_schema.dto';

@Injectable()
export class DeviceGroupService {
  constructor(
    @InjectModel('DeviceGroup')
    private deviceGroupModel: Model<DeviceGroup>,
  ) {}

  public async isIdUnique(id: any): Promise<boolean> {
    const deviceGroup = await this.deviceGroupModel.findById(id).exec();
    return !deviceGroup;
  }

  public async create(deviceGroupDto: DeviceGroupPostSchema): Promise<{
    id: any;
    name: string;
    devices: Device;
    description: string;
    attributes: Map<string, string>;
  }> {
    const { name, devices, description, attributes } = deviceGroupDto;
    if (!name || !devices || !description || !attributes) {
      throw new UnprocessableEntityException('Validation Problem');
    }
    const deviceGroup = await this.deviceGroupModel.create(deviceGroupDto);
    return { id: deviceGroup._id, name, devices, description, attributes };
  }

  public async list(): Promise<DeviceGroup[]> {
    return this.deviceGroupModel
      .find()
      .sort({ createdAt: -1 })
      .limit(10)
      .exec();
  }

  public async findById(id: string): Promise<DeviceGroup> {
    try {
      const document = await this.deviceGroupModel.findById(id).exec();
      if (!document) {
        throw new NotFoundException(`Device Group not found.`);
      }
      return document;
    } catch (error) {
      throw new NotFoundException(`Device Group not found.`);
    }
  }

  async findByIndex(index: number): Promise<DeviceGroup | null> {
    return this.deviceGroupModel
      .findOne()
      .sort({ createdAt: -1 })
      .skip(index - 1)
      .exec();
  }

  public async patchById(
    id: string,
    partialUpdate: Partial<DeviceGroup>,
  ): Promise<DeviceGroup> {
    const document = await this.findById(id);
    if (!document) {
      throw new NotFoundException(`Device Group not found.`);
    }
    Object.assign(document, partialUpdate);
    const updatedDocument = await document.save();
    return updatedDocument;
  }

  async patchByIndex(
    index: number,
    partialUpdate: Partial<DeviceGroup>,
  ): Promise<DeviceGroup | null> {
    const document = await this.deviceGroupModel
      .findOne()
      .sort({ createdAt: -1 })
      .skip(index - 1)
      .exec();
    if (!document) {
      return null;
    }
    Object.assign(document, partialUpdate);
    try {
      await document.save();
    } catch (error) {
      if (error instanceof mongoose.Error.ValidationError) {
        throw new UnprocessableEntityException('Validation Problem.');
      }
      throw error;
    }
    return document;
  }

  public async deleteById(id: string): Promise<DeviceGroup> {
    const document = await this.findById(id);
    if (!document) {
      throw new NotFoundException(`User not found.`);
    }
    const deletedDocument = await this.deviceGroupModel
      .findByIdAndRemove(id)
      .exec();
    return deletedDocument;
  }

  async deleteByIndex(index: number): Promise<DeviceGroup | null> {
    const document = await this.deviceGroupModel
      .findOne()
      .sort({ createdAt: -1 })
      .skip(index - 1)
      .exec();
    if (!document) {
      return null;
    }
    await document.deleteOne();
    return document;
  }
}
