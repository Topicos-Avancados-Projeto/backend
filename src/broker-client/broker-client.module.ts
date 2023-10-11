import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BrokerClientController } from './broker-client.controller';
import { BrokerClientService } from './broker-client.service';
import { BrokerClientSchema } from './schemas/broker-client.schema';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from './filters/custom-exception.filter';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'BrokerClient',
        schema: BrokerClientSchema,
      },
    ]),
  ],
  controllers: [BrokerClientController],
  providers: [
    BrokerClientService,
    {
      provide: APP_FILTER,
      useClass: CustomExceptionFilter,
    },
  ],
})
export class BrokerClientModule {}
