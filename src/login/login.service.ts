import { Injectable, Redirect, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from "bcryptjs";
import { login_post_schema } from './dto/login_post_schema.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from 'src/user/schemas/user.schemas';
import { Model } from 'mongoose';
import { Role } from './enum/roles.enum';

@Injectable()
export class LoginService {
    constructor(
        @InjectModel(User.name)
        private userModel: Model<User>,
        private jwtService: JwtService
    ){}

    async validateUser(loginDto: login_post_schema): Promise<{name: string, id: any, email: string, role: Role}>{
        const {cpf, password} = loginDto;
        const login = await this.userModel.findOne({cpf})
        if (password.length < 6 || cpf.length < 14) { 
            throw new UnprocessableEntityException('Validation Problem.') 
        }
        if(!login || !(await bcrypt.compare(password, login.password) )){
            throw new UnauthorizedException('Incorrect CPF or Password!');
        }
        
        return {id: login._id, name: login.name, email: login.email, role: login.role};
    }
    
    generateToken(user: any){
        const token = this.jwtService.sign({sub: user.id, name: user.name, role: user.role});
        return {token}
    }
}