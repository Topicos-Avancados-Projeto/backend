import { 
    Body,
    Controller,
    Get,
    Post,
    Request,
    UseGuards} from '@nestjs/common';
import { LoginService } from './login.service';
import { login_post_schema } from './dto/login_post_schema.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';

@ApiTags('Login')
@Controller('login')
export class LoginController {
    constructor(private loginService: LoginService){}
   
    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiResponse({status: 401, description: 'Incorrect CPF or Password!'})
    @ApiResponse({status: 400, description: 'Malformed request. Check the sent data.'})
    @ApiResponse({status: 422, description: 'Validation Problem.'})
    async peformLogin(@Body() loginDto: login_post_schema): Promise<{ token: string }>{
        return this.loginService.generateToken(loginDto)
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Get('login')
    @ApiResponse({status: 401, description: 'User not logged in!'})
    @ApiResponse({status: 403, description: 'Access forbidden for this user.'})
    async loggedUser(@Request() req): Promise <any>{
        return req.user;
    }
}