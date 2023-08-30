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

  public async create(user_post_schema: User_post_schema): Promise<{ token: string, name: string, email: string, cpf: string, id: any }> {
    const { name, cpf, email, password, date_of_birth } = user_post_schema
    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await this.userModel.create({ name, cpf, email, password: hashedPassword, date_of_birth })
    const token = this.jwtService.sign({ id: user._id })
    return { id: user.id, name, cpf, email, token }
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
