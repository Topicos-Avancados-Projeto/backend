import {
  ConflictException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DeviceGroup } from './schema/device-group.schema';
import { DeviceGroupPostSchema } from './dto/devices_group_post_schema.dto';
import { Device } from 'src/device/schemas/device.schema';

@Injectable()
export class DeviceGroupService {
  constructor(
    @InjectModel('DeviceGroup')
    private deviceGroupModel: Model<DeviceGroup>,
    @InjectModel('Device')
    private deviceModel: Model<Device>,
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
    // if (!(await this.isIdUnique(deviceGroup._id))) {
    //   throw new ConflictException('ID alread exists!');
    // }
    return { id: deviceGroup._id, name, devices, description, attributes };
  }
}
