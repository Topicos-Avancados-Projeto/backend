import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, NotFoundException, UseGuards, BadRequestException, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { User_post_schema } from './dto/create-user.dto'
import { User } from './schemas/user.schemas';
import { AuthGuard } from '@nestjs/passport';
import { Types } from 'mongoose';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('user')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() user_post_schema: User_post_schema, @Res({ passthrough: true }) res: Response) {
    const user = await this.userService.create(user_post_schema)
    res.set('Authorization', user.token)
    const { token, ...body } = user
    return body
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  public async findAll(): Promise<User[]> {
    return this.userService.findAll()
  }

  @Get(':param')
  async getUser(@Param('param') param: string) {
    if (Types.ObjectId.isValid(param)) {
      const user = await this.userService.findById(param)
      if (!user) {
        throw new NotFoundException(`Usuário com id ${param} não encontrado`)
      }
      return user
    } else {
      const index = parseInt(param, 10)
      if (isNaN(index) || index < 1) {
        throw new BadRequestException('Index inválido')
      }
      const user = await this.userService.findByIndex(index)
      if (!user) {
        throw new NotFoundException(`Usuário em index ${index} não encontrado`)
      }
      return user
    }
  }

  @Delete(':id')
  public async deleteById(@Param('id') id: string) {
    try {
      const deletedDocument = await this.userService.deleteById(id)
      return deletedDocument
    }
    catch (error) { throw new NotFoundException(error.message) }
  }

  @Patch(':id')
  public async patchById(@Param('id') id: string, @Body() partialUpdate: Partial<User>) {
    try {
      const updatedDocument = await this.userService.patchById(id, partialUpdate)
      return updatedDocument
    } catch (error) {
      throw new NotFoundException(error.message)
    }
  }
}
