import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, NotFoundException, UseGuards, BadRequestException, Res, HttpException } from '@nestjs/common';
import { UserService } from './user.service';
import { User_post_schema } from './dto/create-user.dto'
import { User } from './schemas/user.schemas';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiResponse({ status: 409, description: 'User alread exists' })
  public async create(@Body() user_post_schema: User_post_schema, @Res({ passthrough: true }) res: Response) {
    const user = await this.userService.create(user_post_schema)
    res.set('Authorization', user.token)
    const { token, ...body } = user
    return body
  }

  @Get()
  //@UseGuards(AuthGuard())
  @HttpCode(HttpStatus.OK)
  public async findAll(): Promise<User[]> {
    return this.userService.findAll()
  }

  @Get(':param')
  async getUser(@Param('param') param: string) {
    if (Types.ObjectId.isValid(param)) {
      const user = await this.userService.findById(param)
      if (!user) {
        throw new NotFoundException(`User not found.`)
      }
      return user
    } else {
      const index = parseInt(param, 10)
      if (isNaN(index) || index < 1) {
        throw new BadRequestException('Invalid index')
      }
      const user = await this.userService.findByIndex(index)
      if (!user) {
        throw new NotFoundException(`User not found.`)
      }
      return user
    }
  }

  @Patch(':param')
public async patch(@Param('param') param: string, @Body() partialUpdate: Partial<User>) {
  if (Object.keys(partialUpdate).length === 0) {
    throw new HttpException('No update parameters provided.', HttpStatus.UNPROCESSABLE_ENTITY);
  }

  if (Types.ObjectId.isValid(param)) {
    const updatedDocument = await this.userService.patchById(param, partialUpdate);
    if (!updatedDocument) {
      throw new NotFoundException(`User not found.`);
    }
    return updatedDocument;
  } else {
    const index = parseInt(param, 10);
    if (isNaN(index) || index < 1) {
      throw new BadRequestException('Invalid index');
    }
    const updatedDocument = await this.userService.patchByIndex(index, partialUpdate);
    if (!updatedDocument) {
      throw new NotFoundException(`User not found.`);
    }
    return updatedDocument;
  }
}

  @Delete(':param')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('param') param: string) {
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
