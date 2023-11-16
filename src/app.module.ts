import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginModule } from './login/login.module';
import { BrokerClientModule } from './broker-client/broker-client.module';
import { DeviceModule } from './device/device.module';
import { DeviceTypesModule } from './device-types/device-types.module';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRoot(process.env.ATLAS_URI),
    UserModule,
    LoginModule,
    BrokerClientModule,
    DeviceModule,
    DeviceTypesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
