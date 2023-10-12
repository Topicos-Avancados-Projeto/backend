import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BrokerClientController } from './broker-client.controller';
import { BrokerClientService } from './broker-client.service';
import { BrokerClientSchema } from './schemas/broker-client.schema';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { CustomExceptionFilter } from './filters/custom-exception.filter';
import { LoginModule } from 'src/login/login.module';
import { AppValidationPipe } from 'src/login/pipe/app.validation.pipe';
import { AllExceptionsFilter } from 'src/login/exception/filter/all-exceptions.filter';
import { AppBaseExceptionFilter } from 'src/login/exception/filter/base.exception.filter';

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
  providers: [BrokerClientService],
})
export class BrokerClientModule {}
