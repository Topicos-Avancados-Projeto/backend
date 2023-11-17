import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device } from './schemas/device.schema';
import { DevicePost } from './dto/device_post_schema.dto';
import { UUID } from 'crypto';

@Injectable()
export class DeviceService {
    constructor(
        @InjectModel('Device')
        private deviceModel: Model<Device>
    ){}

    public async create(devicePost: DevicePost): Promise<{
        name: string,
        description: string,
        id: any
        group: UUID,
        topics: UUID,
        type: UUID
    }>{
        const {name, description, group, topics, type} = devicePost;
        const device = await this.deviceModel.create(devicePost);
        return {name, description, id: device._id, group, topics, type};
    }

    public async findAll(){
        return this.deviceModel.find();
    }
}