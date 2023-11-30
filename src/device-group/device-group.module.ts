import { Module } from '@nestjs/common';
import { DeviceGroupService } from './device-group.service';
import { DeviceGroupController } from './device-group.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceGroupSchema } from './schema/device-group.schema';
import { DeviceSchema } from 'src/device/schemas/device.schema';
import { DeviceService } from 'src/device/device.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'DeviceGroup', schema: DeviceGroupSchema },
    ]),
    MongooseModule.forFeature([{ name: 'Device', schema: DeviceSchema }]),
  ],
  controllers: [DeviceGroupController],
  providers: [DeviceGroupService, DeviceService],
})
export class DeviceGroupModule {}
