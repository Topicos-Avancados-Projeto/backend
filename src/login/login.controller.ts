import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { LoginService } from './login.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { JwtAuth } from './decorator/jwt.auth.decorator';
import { Public } from './decorator/public.auth.decorator';
import { Roles } from './decorator/roles.decorator';
import { Role } from './enum/roles.enum';

@ApiTags('Login')
@Controller('login')
@JwtAuth()
export class LoginController {
  constructor(private loginService: LoginService) {}

  @Post()
  @Public()
  async peformLogin(@Req() req, @Res({ passthrough: true }) res: Response) {
    const login = await this.loginService.generateToken(req.user);
    res.set('Authorization', login.token);
    return { id: req.user.id, name: req.user.name, email: req.user.email };
  }

  @Get()
  @Roles(Role.OWNER)
  async getProfile(@Req() req){
    const login = await this.loginService.getingUserById(req.user.id);
    return {id: req.user.id, name: req.user.name, email: login.email};
  }
}
