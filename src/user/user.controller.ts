import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
  Res,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { User_post_schema } from './dto/create-user.dto';
import { User } from './schemas/user.schemas';
import { Types } from 'mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuth } from 'src/login/decorator/jwt.auth.decorator';
import { Public } from 'src/login/decorator/publid.auth.decorator';
import { Role } from 'src/login/enum/roles.enum';
import { Roles } from 'src/login/decorator/roles.decorator';
import { OwnerChecker } from 'src/login/decorator/ownership.checker.decorator';
import { UserOwnershipChecker } from './owner/user.ownership.checker';

@Controller('user')
@JwtAuth()
@OwnerChecker(UserOwnershipChecker)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  public async create(
    @Body() user_post_schema: User_post_schema,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.userService.create(user_post_schema);
    res.set('Authorization', 'Bearer ' + user.token);
    const { token, ...body } = user;
    return body;
  }

  @Get()
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  public async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.OWNER)
  async getUser(@Param('id') param: string) {
    if (Types.ObjectId.isValid(param)) {
      const user = await this.userService.findById(param);
      if (!user) {
        throw new NotFoundException(`User not found.`);
      }
      return user;
    } else {
      const index = parseInt(param, 10);
      if (isNaN(index) || index < 1) {
        throw new BadRequestException('Invalid index');
      }
      const user = await this.userService.findByIndex(index);
      if (!user) {
        throw new NotFoundException(`User not found.`);
      }
      return user;
    }
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.OWNER)
  public async patch(
    @Param('id') param: string,
    @Body() partialUpdate: Partial<User>,
  ) {
    if (Object.keys(partialUpdate).length === 0) {
      throw new HttpException(
        'No update parameters provided.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    if (Types.ObjectId.isValid(param)) {
      const updatedDocument = await this.userService.patchById(
        param,
        partialUpdate,
      );
      if (!updatedDocument) {
        throw new NotFoundException(`User not found.`);
      }
      return updatedDocument;
    } else {
      const index = parseInt(param, 10);
      if (isNaN(index) || index < 1) {
        throw new BadRequestException('Invalid index');
      }
      const updatedDocument = await this.userService.patchByIndex(
        index,
        partialUpdate,
      );
      if (!updatedDocument) {
        throw new NotFoundException(`User not found.`);
      }
      return updatedDocument;
    }
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.OWNER)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id') param: string) {
    if (Types.ObjectId.isValid(param)) {
      const deletedDocument = await this.userService.deleteById(param);
      if (!deletedDocument) {
        throw new NotFoundException(`User not found.`);
      }
      return deletedDocument;
    } else {
      const index = parseInt(param, 10);
      if (isNaN(index) || index < 1) {
        throw new BadRequestException('Index inválido');
      }
      const deletedDocument = await this.userService.deleteByIndex(index);
      if (!deletedDocument) {
        throw new NotFoundException(`User not found.`);
      }
      return deletedDocument;
    }
  }
}
