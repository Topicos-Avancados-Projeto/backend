import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpCode } from '@nestjs/common';
import { DeviceGroupService } from './device-group.service';
import { DeviceGroupPostSchema } from './dto/devices_group_post_schema.dto';
import { JwtAuth } from 'src/login/decorator/jwt.auth.decorator';
import { Roles } from 'src/login/decorator/roles.decorator';
import { Role } from 'src/login/enum/roles.enum';

@Controller('device_group')
@JwtAuth()
export class DeviceGroupController {
  constructor(private readonly deviceGroupService: DeviceGroupService) {}

  @Post()
  @Roles(Role.ADMIN, Role.USER)
  @HttpCode(HttpStatus.OK)
  create(@Body() deviceGroupPostDto: DeviceGroupPostSchema) {
    return this.deviceGroupService.create(deviceGroupPostDto);
  }
}
