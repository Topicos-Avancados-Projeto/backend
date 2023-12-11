import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceGroupSchema } from './schema/device-group.schema';
import { DeviceGroupService } from './device-group.service';
import { DeviceGroupController } from './device-group.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'DeviceGroup', schema: DeviceGroupSchema },
    ]),
  ],
  controllers: [DeviceGroupController],
  providers: [DeviceGroupService],
})
export class DeviceGroupModule {}
