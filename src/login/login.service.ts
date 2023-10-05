import { Injectable, Redirect, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
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

    async validateUser(loginDto: login_post_schema): Promise<{name: string, id: any, email: string}>{
        const {cpf, password} = loginDto;
        const login = await this.userModel.findOne({cpf});

        if(!login || !(await bcrypt.compare(password, login.password) )){
            throw new UnauthorizedException('Incorrect CPF or Password!');
        }
        if (!cpf || !password) { 
            throw new UnprocessableEntityException('Validation Problem') 
        }
        if (password.length < 6 || cpf.length < 11) { 
            throw new UnprocessableEntityException('Malformed request. Check the sent data') 
        }


        return {id: login.id, name: login.name, email: login.email};;
    }

    generateToken(user: any){
        const token = this.jwtService.sign({id: user._id});
        return {token}
    }
}