import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { LoginService } from './login.service';
import { Strategy } from 'passport-local';
import { login_post_schema } from './dto/login_post_schema.dto';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private loginService: LoginService){
        super()
    }

    async validate(loginDto: login_post_schema){
        const user = await this.loginService.validateUser(loginDto);
        if(!user) throw new UnauthorizedException({msg: 'Incorrect CPF or Password!'});
        return user;
    }
}