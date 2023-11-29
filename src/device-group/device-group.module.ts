import { Module } from '@nestjs/common';
import { DeviceGroupService } from './device-group.service';
import { DeviceGroupController } from './device-group.controller';

@Module({
  controllers: [DeviceGroupController],
  providers: [DeviceGroupService],
})
export class DeviceGroupModule {}
