import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schemas';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { User_post_schema } from './dto/create-user.dto';
import { JwtPayload } from './jwt/jwt-payload.model';
import { Request } from 'express';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User')
    private userModel: Model<User>,
    private jwtService: JwtService,
  ) { }

  private async isCpfUnique(cpf: string): Promise<boolean> {
    const user = await this.userModel.findOne({ cpf }).exec();
    return !user;
  }

  public async create(user_post_schema: User_post_schema): Promise<{ 
    token: string, 
    user: { 
      name: string, 
      email: string, 
      cpf: string, 
      id: any, 
      date_of_birth: string 
    } 
  }> {
    const { name, cpf, email, password, date_of_birth } = user_post_schema;

    if (!name || !cpf || !email || !password || !date_of_birth) {
      throw new BadRequestException('Validation problem')
    }
    if (!(await this.isCpfUnique(cpf))) { throw new BadRequestException('CPF already exists!') }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userModel.create({ name, cpf, email, password: hashedPassword, date_of_birth });
    const token = this.jwtService.sign({ cpf });
    return { token, user: { id: user.id, name, cpf, email, date_of_birth } };
  }

  public async findAll(): Promise<User[]> {
    return this.userModel.find()
  }

  public async findById(id: string): Promise<User> {
    try {
      const document = await this.userModel.findById(id).exec()
      if (!document) { throw new NotFoundException(`Document com ID ${id} não encontrado!`) }
      return document
    }
    catch (error) { throw new NotFoundException(`Document com ID ${id} não encontrado!`) }
  }

  async findByIndex(index: number): Promise<User | null> {
    return this.userModel.findOne().skip(index - 1).exec();
  }

  public async deleteById(id: string): Promise<User> {
    const document = await this.findById(id)
    if (!document) { throw new NotFoundException(`Document com ID ${id} não encontrado!`) }
    const deletedDocument = await this.userModel.findByIdAndRemove(id).exec()
    return deletedDocument;
  }

  public async patchById(id: string, partialUpdate: Partial<User>): Promise<User> {
    const document = await this.findById(id)
    if (!document) { throw new NotFoundException(`Document com ID ${id} não encontrado!`) }
    Object.assign(document, partialUpdate)
    const updatedDocument = await document.save()
    return updatedDocument
  }

  private static jwtExtractor(request: Request): string {
    const authHeader = request.headers.authorization
    if (!authHeader) { throw new BadRequestException('Bad request.') }
    const [, token] = authHeader.split(' ')
    return token
  }

  public returnJwtExtractor(): (request: Request) => string {
    return UserService.jwtExtractor
  }

  public async validateUser(jwtPayload: JwtPayload): Promise<User> {
    const user = await this.userModel.findOne({ _id: jwtPayload.userId })
    if (!user) { throw new UnauthorizedException('User not found.') }
    return user
  }
}
