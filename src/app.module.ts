import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { LoginModule } from './login/login.module';
import { BrokerClientModule } from './broker-client/broker-client.module';
import { APP_FILTER } from '@nestjs/core';
import { CustomExceptionFilter } from './broker-client/filters/custom-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '.env', isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule,
    LoginModule,
    BrokerClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
