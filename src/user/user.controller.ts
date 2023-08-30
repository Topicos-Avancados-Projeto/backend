import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { User_post_schema } from './dto/create-user.dto'
import { User } from './schemas/user.schemas';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() User_post_schema: User_post_schema): Promise<{ token: string }> {
    return this.userService.create(User_post_schema)
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  public async findAll(): Promise<User[]> {
    return this.userService.findAll()
  }

  @Get(':id')
  public async findById(@Param('id') id: string) {
    try {
      const document = await this.userService.findById(id)
      return document
    } catch (error) {
      throw new NotFoundException(error.message)
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
