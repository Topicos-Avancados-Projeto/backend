import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DevicePost } from './dto/device_post_schema.dto';
import { Roles } from 'src/login/decorator/roles.decorator';
import { Role } from 'src/login/enum/roles.enum';
import { DeviceGet } from './dto/device_get_schema.dto';

@Controller('device')
export class DeviceController {
    constructor(private readonly deviceService: DeviceService){}

    //Falta retornar o token na resposta e tratamento de exceptions
    @Post()
    @Roles(Role.OWNER, Role.ADMIN)
    @HttpCode(HttpStatus.CREATED)
    public async create(
        @Body() devicePost: DevicePost,
        @Req() req,
        @Res({ passthrough: true }) res,
    ): Promise<DeviceGet>{
        const device = await this.deviceService.create(devicePost);
        return device;
    }

    //Faltam filters, pagination e tratamento de exceptions
    @Get()
    @Roles(Role.ADMIN)
    public async findAll(){
        const devices = this.deviceService.findAll();
        return devices;
    }
}