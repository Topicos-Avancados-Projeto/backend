import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { LoginService } from '../login.service';
import { Strategy } from 'passport-local';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private loginService: LoginService) {
    super({
      usernameField: 'cpf',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string) {
    const user = await this.loginService.validateUser({
      cpf: username,
      password,
    });
    if (!user) throw new UnauthorizedException('Incorrect CPF or Password!');
    return user;
  }
}
