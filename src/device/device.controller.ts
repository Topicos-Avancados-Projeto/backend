import { BadRequestException, Body, Controller, Delete, Get, Header, HttpCode, HttpException, HttpStatus, NotFoundException, Param, Patch, Post, Req, Res } from '@nestjs/common';
import { DeviceService } from './device.service';
import { DevicePost } from './dto/device_post_schema.dto';
import { Roles } from 'src/login/decorator/roles.decorator';
import { Role } from 'src/login/enum/roles.enum';
import { DeviceGet } from './dto/device_get_schema.dto';
import { Types } from 'mongoose';
import { Device } from './schemas/device.schema';
import { JwtAuth } from 'src/login/decorator/jwt.auth.decorator';

@Controller('device')
@JwtAuth()
export class DeviceController {
    constructor(private readonly deviceService: DeviceService){}

    //Falta retornar o token na resposta
    @Post()
    @Roles(Role.OWNER, Role.ADMIN)
    @HttpCode(HttpStatus.CREATED)
    public async create(
        @Body() devicePost: DevicePost,
        @Req() req: Request,
        @Res({ passthrough: true }) res: Response,
    ): Promise<DeviceGet>{
        const device = await this.deviceService.create(devicePost);
        return device;
    }

    @Get()
    @Roles(Role.ADMIN)
    public async findAll(){
        const devices = this.deviceService.findAll();
        return devices;
    }

    @Get(':id')
    @Roles(Role.OWNER, Role.ADMIN)
    async getUser(@Param('id') param: string){
        if(Types.ObjectId.isValid(param)){
            const device = await this.deviceService.findById(param);
            if(!device){
                throw new NotFoundException('Device not found.');
            }
            return device;
        }else{
            const index = parseInt(param, 10);
            if(isNaN(index) || index<1){
                throw new BadRequestException('Invalid index');
            }
            const device = await this.deviceService.findByIndex(index);
            if(!device){
                throw new NotFoundException('Device not found.')
            }
            return device;
        }
    }

    @Delete(':id')
    @Roles(Role.OWNER, Role.ADMIN)
    public async delete(@Param('id') param: string){
        if(Types.ObjectId.isValid(param)){
            const deletedDocument = await this.deviceService.deleteById(param);
            if(!deletedDocument){
                throw new BadRequestException('Device not found.');
            }
            return deletedDocument;
        }else{
            const index = parseInt(param, 10);
            if(isNaN(index) || index<1){
                throw new BadRequestException('Invalid index.');
            }
            const deletedDocument = await this.deviceService.deleteByIndex(index);
            if(!deletedDocument){
                throw new NotFoundException('Device not found.');
            }
            return deletedDocument;
        }
    }

    @Patch(':id')
    @Roles(Role.OWNER, Role.ADMIN)
    public async update(
        @Param('id') param: string,
        @Body() partialUpdate: Partial<Device>
    ){
        if(Object.keys(partialUpdate).length === 0){
            throw new HttpException(
                'No update parameters provided.',
                HttpStatus.UNPROCESSABLE_ENTITY,
            );
        }
        if(Types.ObjectId.isValid(param)){
            const updated = await this.deviceService.patchById(param, partialUpdate);
            if(!updated){
                throw new NotFoundException('Device not found.');
            }
            return updated;
        }else{
            const index = parseInt(param, 10);
            if(isNaN(index) || index<1){
                throw new BadRequestException('Invalid index.');
            }
            const updated = await this.deviceService.patchByIndex(index, partialUpdate);
            if(!updated){
                throw new NotFoundException('Device not found.');
            }
            return updated;
        }
    }
}