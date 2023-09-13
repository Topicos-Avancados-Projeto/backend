import { Injectable, Redirect, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcryptjs";
import { login_post_schema } from './dto/login_post_schema.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schemas';
import { Model } from 'mongoose';

@Injectable()
export class LoginService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService
    ){}

    async validateUser(loginDto: login_post_schema): Promise<any>{
        const {cpf, password} = loginDto;
        const login = await this.userModel.findOne({cpf});
        if(!login || !(await bcrypt.compare(password, login.password) )){
            throw new UnauthorizedException({msg: 'Incorrect CPF or Password!'});
        }
        return login;
    }

    generateToken(user: any){
        const token = this.jwtService.sign({id: user._id});
        return {token}
    }
}