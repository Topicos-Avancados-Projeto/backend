import { Controller, Get, Post, Req, Res } from '@nestjs/common';
import { LoginService } from './login.service';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { LoginAuth } from './decorator/login.auth.decorator';
import { JwtAuth } from './decorator/jwt.auth.decorator';
import { Public } from './decorator/publid.auth.decorator';

@ApiTags('Login')
@Controller('login')
@JwtAuth()
export class LoginController {
  constructor(private loginService: LoginService) {}

  @Public()
  @LoginAuth()
  @Post()
  async peformLogin(@Req() req, @Res({ passthrough: true }) res: Response) {
    const login = await this.loginService.generateToken(req.user);
    res.set('Authorization', login.token);
    return req.user;
  }

  @Get()
  getProfile(@Req() req) {
    return req.user;
  }
}