import {
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Controller,
  HttpStatus,
  HttpException,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Role } from 'src/login/enum/roles.enum';
import { Types } from 'mongoose';
import { Roles } from 'src/login/decorator/roles.decorator';
import { JwtAuth } from 'src/login/decorator/jwt.auth.decorator';
import { DeviceGroup } from './schema/device-group.schema';
import { DeviceGroupService } from './device-group.service';
import { DeviceGroupPostSchema } from './dto/devices_group_post_schema.dto';

@Controller('device_group')
@JwtAuth()
export class DeviceGroupController {
  constructor(private readonly deviceGroupService: DeviceGroupService) {}

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.CREATED)
  create(@Body() deviceGroupPostDto: DeviceGroupPostSchema) {
    return this.deviceGroupService.create(deviceGroupPostDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.USER)
  public find() {
    return this.deviceGroupService.list();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @Roles(Role.ADMIN, Role.USER)
  async getUser(@Param('id') param: string) {
    if (Types.ObjectId.isValid(param)) {
      const deviceGroup = await this.deviceGroupService.findById(param);
      if (!deviceGroup) {
        throw new NotFoundException(`User not found.`);
      }
      return deviceGroup;
    } else {
      const index = parseInt(param, 10);
      if (isNaN(index) || index < 1) {
        throw new BadRequestException('Invalid index');
      }
      const deviceGroup = await this.deviceGroupService.findByIndex(index);
      if (!deviceGroup) {
        throw new NotFoundException(`User not found.`);
      }
      return deviceGroup;
    }
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.OK)
  public async patch(
    @Param('id') param: string,
    @Body() partialUpdate: Partial<DeviceGroup>,
  ) {
    if (Object.keys(partialUpdate).length === 0) {
      throw new HttpException(
        'No update parameters provided.',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    if (Types.ObjectId.isValid(param)) {
      const updatedDocument = await this.deviceGroupService.patchById(
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
      const updatedDocument = await this.deviceGroupService.patchByIndex(
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
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id') param: string) {
    if (Types.ObjectId.isValid(param)) {
      const deletedDocument = await this.deviceGroupService.deleteById(param);
      if (!deletedDocument) {
        throw new NotFoundException(`User not found.`);
      }
      return deletedDocument;
    } else {
      const index = parseInt(param, 10);
      if (isNaN(index) || index < 1) {
        throw new BadRequestException('Index inválido');
      }
      const deletedDocument = await this.deviceGroupService.deleteByIndex(
        index,
      );
      if (!deletedDocument) {
        throw new NotFoundException(`User not found.`);
      }
      return deletedDocument;
    }
  }
}
