import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { Device } from './schemas/device.schema';
import { DevicePost } from './dto/device_post_schema.dto';
import { UUID } from 'crypto';

@Injectable()
export class DeviceService {
    constructor(
        @InjectModel('Device')
        private deviceModel: Model<Device>
    ){}

    private async isIdUnique(id: any): Promise<boolean>{
        const device = await this.deviceModel.findOne({id}).exec();
        return !device;
    }

    public async create(devicePost: DevicePost): Promise<{
        name: string,
        description: string,
        id: any
        group: UUID,
        topics: UUID,
        type: UUID,
        attributes: Map<string, string>
    }>{
        const {name, description, group, topics, type, attributes} = devicePost;
        if(
            !name||
            !description||
            !group||
            !topics||
            !type||
            !attributes
        ){
            throw new UnprocessableEntityException('Validation Problem');
        }
        const device = await this.deviceModel.create(devicePost);
        if(!(await this.isIdUnique(device.id))){
            throw new ConflictException('ID already exists!');
        }
        return {name, description, id: device._id, group, topics, type, attributes};
    }

    public async findAll(){
        try{
            const devices = await this.deviceModel.find();
            return devices;
        }catch(error){
            if(error instanceof ForbiddenException){
                throw new ForbiddenException('Access forbidden for this device.');
            }
        }
    }

    public async findById(id: string): Promise<Device>{
        try{
            const device = await this.deviceModel.findById(id).exec();
            if(!device){
                throw new NotFoundException('Device not found.');
            }
            return device;
        }catch(error){
            throw new NotFoundException('Device not found.')
        }
    }

    async findByIndex(index: number): Promise<Device | null>{
        return this.deviceModel.findOne().skip(index-1).exec();
    }

    public async deleteById(id: string): Promise<Device>{
        const document = await this.findById(id);
        if(!document){
            throw new NotFoundException('Device not found.');
        }
        const deletedDocument = await this.deviceModel.findByIdAndRemove(id).exec();
        return deletedDocument;
    }

    async deleteByIndex(index: number): Promise<Device | null>{
        const device = await this.deviceModel.findOne().skip(index-1).exec();
        if(!device){
            return null;
        }
        await device.deleteOne();
        return device;
    }

    public async patchById(
        id: string,
        partialUpdate: Partial<Device>
    ): Promise<Device>{
        const document = await this.findById(id);
        if(!document){
            throw new NotFoundException('Device not found.');
        }
        Object.assign(document, partialUpdate);
        const updated = await document.save();
        return updated;
    }

    async patchByIndex(index: number, partialUpdate: Partial<Device>): Promise<Device | null>{
        const device = await this.deviceModel.findOne().skip(index-1).exec();
        if(!device){
            return null;
        }
        Object.assign(device, partialUpdate);
        try{
            await device.save();
        }catch(error){
            if(error instanceof mongoose.Error.ValidationError){
                throw new UnprocessableEntityException('Validation Problem.');
            }
            throw error;
        }
        return device;
    }
}