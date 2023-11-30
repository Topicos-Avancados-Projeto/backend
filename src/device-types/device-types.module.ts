import { Module } from '@nestjs/common';
import { DeviceTypesService } from './device-types.service';
import { DeviceTypesController } from './device-types.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceTypeSchema } from './schemas/device-type.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'DeviceType',
        schema: DeviceTypeSchema,
      },
    ]),
  ],
  controllers: [DeviceTypesController],
  providers: [DeviceTypesService],
})
export class DeviceTypesModule {}
