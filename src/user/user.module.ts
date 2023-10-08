import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schemas';
import { UserOwnershipChecker } from './owner/user.ownership.checker';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
  ],
  controllers: [UserController, ],
  providers: [UserService, UserOwnershipChecker],
  exports: [UserService, UserOwnershipChecker],
})
export class UserModule { }
