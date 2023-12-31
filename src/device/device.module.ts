import { Module } from '@nestjs/common';
import { DeviceController } from './device.controller';
import { DeviceService } from './device.service';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceSchema } from './schemas/device.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Device',
        schema: DeviceSchema
      }
    ])
  ],
  controllers: [DeviceController],
  providers: [DeviceService]
})
export class DeviceModule {}
