import { Global, Module } from '@nestjs/common';
import { LoginService } from './login.service';
import { LoginController } from './login.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { UserModule } from '../user/user.module';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from 'src/user/schemas/user.schemas';
import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { AppBaseExceptionFilter } from './exception/filter/base.exception.filter';
import { AllExceptionsFilter } from './exception/filter/all-exceptions.filter';
import { AppValidationPipe } from './pipe/app.validation.pipe';

@Global()
@Module({
  imports:[UserModule, PassportModule, 
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRES') },
        };
      },
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])
  ],
  providers: [LoginService, LocalStrategy, JwtStrategy,{
    provide: APP_PIPE,
    useClass: AppValidationPipe,
  },{
    provide: APP_FILTER,
    useClass: AllExceptionsFilter,
  }, {
    provide: APP_FILTER,
    useClass: AppBaseExceptionFilter,
  }],
  controllers: [LoginController],
  exports: [LoginService, LocalStrategy, JwtStrategy]
})
export class LoginModule {}